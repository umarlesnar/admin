import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import subscriptionSchema from "@/models/subscription-schema";
import productItemModelSchema from "@/models/product-item-model-schema";
import paymentInvoiceSchema from "@/models/payment-invoice-schema";
import moment from "moment";

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(apiMiddlerware)
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const workspace_id = params?.workspace_id;
    const subscription_id = params?.subscription_id;
    const body = await req.json();
    const { new_plan_id, payment_status, end_at } = body;

    // Validate required fields
    if (!new_plan_id || !payment_status || !end_at) {
      return NextResponse.json(
        { status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE, message: "Missing required fields: new_plan_id, payment_status, end_at" },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }

    try {
      const currentSubscription = await subscriptionSchema.findOne({
        _id: subscription_id,
        workspace_id: workspace_id,
      });

      if (!currentSubscription) {
        return NextResponse.json(
          { status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND, message: "Subscription not found" },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      const newPlan = await productItemModelSchema.findById(new_plan_id);
      if (!newPlan) {
        return NextResponse.json(
          { status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND, message: "New plan not found" },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      // Logic: Immediate vs Scheduled
      const currentPrice = currentSubscription.total_amount || 0;
      const newPrice = newPlan.price || 0;
      const isImmediateUpgrade = newPrice > currentPrice;
      
      const now = moment();
      const currentEnd = moment.unix(currentSubscription.r_current_end_at || now.unix());
      const isExpired = currentEnd.isBefore(now);

      // Determine Start Date
      let start_at_unix: number;
      if (isImmediateUpgrade || isExpired) {
        start_at_unix = now.unix();
      } else {
        start_at_unix = currentEnd.unix(); // Start when current ends
      }

      // Determine End Date
      let end_at_unix = end_at;
      if (typeof end_at_unix !== 'number' || end_at_unix <= start_at_unix) {
         end_at_unix = moment.unix(start_at_unix).add(1, 'month').unix();
      }

      // Store original state before updates for rollback
      const originalSubscription = currentSubscription.toObject();
      let updatedSubscription;

      if (isImmediateUpgrade || isExpired) {
        // --- SCENARIO 1: IMMEDIATE UPDATE ---
        // Overwrite active plan details immediately
        updatedSubscription = await subscriptionSchema.findOneAndUpdate(
          { _id: subscription_id },
          {
            plan_id: newPlan._id,
            plan_name: newPlan.name,
            plan_type: newPlan.type,
            total_amount: newPlan.price,
            status: "active",
            r_current_start_at: start_at_unix,
            r_current_end_at: end_at_unix,
            upcoming_plan: null, // Clear any previous pending updates
          },
          { new: true }
        );
      } else {
        // --- SCENARIO 2: SCHEDULED UPDATE ---
        // Do NOT change active plan_id. Save to upcoming_plan.
        updatedSubscription = await subscriptionSchema.findOneAndUpdate(
          { _id: subscription_id },
          {
            upcoming_plan: {
                plan_id: newPlan._id,
                plan_name: newPlan.name,
                plan_type: newPlan.type,
                price: newPlan.price,
                start_at: start_at_unix,
                end_at: end_at_unix,
                payment_status: payment_status || "paid"
            }
          },
          { new: true }
        );
      }

      // Generate Invoice (We generate it now regardless, as they are committing to pay/paying now)
      const invoiceData = {
        workspace_id: workspace_id,
        plan: newPlan.name,
        type: isImmediateUpgrade ? "upgrade" : "subscription_change_scheduled",
        payment_method: "manual",
        currency: newPlan.currency_code || "INR",
        total_price: newPlan.price,
        status: payment_status || "paid",
        user_id: currentSubscription.user_id,
        created_at: new Date(),
        start_from: start_at_unix,
        end_to: end_at_unix,
        paid_at: payment_status === "paid" ? Math.floor(Date.now() / 1000) : null
      };

      try {
        await paymentInvoiceSchema.create(invoiceData);
      } catch (invoiceError) {
        console.error("Invoice creation failed", invoiceError);
        // Rollback subscription update if invoice creation fails
        await subscriptionSchema.findOneAndUpdate(
          { _id: subscription_id },
          { $set: originalSubscription }
        );
        return NextResponse.json(
          { status_code: SERVER_STATUS_CODE.SERVER_ERROR, message: "Failed to create invoice" },
          { status: SERVER_STATUS_CODE.SERVER_ERROR }
        );
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: isImmediateUpgrade 
            ? "Plan upgraded immediately" 
            : "Plan change scheduled for next billing cycle",
          data: updatedSubscription,
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );

    } catch (error) {
      console.error("Upgrade Error", error);
      return NextResponse.json(
        { status_code: SERVER_STATUS_CODE.SERVER_ERROR, message: "Server Error" },
        { status: SERVER_STATUS_CODE.SERVER_ERROR }
      );
    }
  });

export default router;