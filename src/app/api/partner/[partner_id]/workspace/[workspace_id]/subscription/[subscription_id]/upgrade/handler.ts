// umarlesnar/admin/admin-22ca4604ffd5c1d8201aa2b1aaab3cbb1f9de055/src/app/api/partner/[partner_id]/workspace/[workspace_id]/subscription/[subscription_id]/upgrade/handler.ts

import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import subscriptionSchema from "@/models/subscription-schema";
import productItemModelSchema from "@/models/product-item-model-schema";
import paymentInvoiceSchema from "@/models/payment-invoice-schema";
import workspaceModelSchema from "@/models/workspace-model-schema";
import moment from "moment";

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(apiMiddlerware)
  .post(async (req: AppNextApiRequest, ctx: any) => {
    const workspace_id = ctx.params?.workspace_id;
    const subscription_id = ctx.params?.subscription_id;
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

      // Prevent upgrading the same plan
      if (currentSubscription.plan_id?.toString() === new_plan_id) {
        return NextResponse.json(
          { status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE, message: "Cannot upgrade to the same plan" },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      // Logic: Immediate vs Scheduled
      const currentPrice = currentSubscription.total_amount || 0;
      const newPrice = newPlan.price || 0;
      const isUpgrade = newPrice > currentPrice;
      
      const now = moment();
      const currentEnd = moment.unix(currentSubscription.r_current_end_at || now.unix());
      const isExpired = currentEnd.isBefore(now);

      // Determine Start Date & Status
      let start_at_unix: number;
      let newSubscriptionStatus: string;

      if (isUpgrade || isExpired) {
        // Immediate start for upgrades or if current is expired
        start_at_unix = now.unix();
        newSubscriptionStatus = "active";
      } else {
        // Scheduled start for downgrades (after current ends)
        start_at_unix = currentEnd.unix();
        newSubscriptionStatus = "scheduled"; 
      }

      // Determine End Date
      let end_at_unix = end_at;
      if (typeof end_at_unix !== 'number' || end_at_unix <= start_at_unix) {
         end_at_unix = moment.unix(start_at_unix).add(1, 'month').unix();
      }

      // --- 1. Handle Old Subscription ---
      if (isUpgrade || isExpired) {
        // Cancel the old subscription immediately for upgrades
        await subscriptionSchema.updateOne(
          { _id: subscription_id },
          { 
            status: "cancelled",
            r_current_end_at: now.unix()
          }
        );
      }
      // For downgrades: leave current subscription active until it expires naturally

      // --- 2. Create New Subscription Document ---
      const newSubscription = new subscriptionSchema({
        workspace_id: workspace_id,
        user_id: currentSubscription.user_id,
        policy_id: newPlan.policy_id,
        plan_id: newPlan._id,
        plan_name: newPlan.name,
        plan_type: newPlan.plan_type || newPlan.type, 
        total_amount: newPlan.price,
        status: newSubscriptionStatus,
        r_current_start_at: start_at_unix,
        r_current_end_at: end_at_unix,
        payment_gateway: "manual",
        auto_renew: false,
      });

      await newSubscription.save();

      // --- 3. Generate Invoice ---
      const invoiceData = {
        workspace_id: workspace_id,
        plan: newPlan.name,
        type: isUpgrade ? "upgrade" : "downgrade_scheduled",
        payment_method: "manual",
        currency: newPlan.currency_code || "INR",
        total_price: newPlan.price,
        status: payment_status || "paid",
        user_id: currentSubscription.user_id,
        created_at: new Date(),
        start_from: start_at_unix,
        end_to: end_at_unix,
        subscription_id: newSubscription._id,
        paid_at: payment_status === "paid" ? Math.floor(Date.now() / 1000) : null
      };

      try {
        await paymentInvoiceSchema.create(invoiceData);
      } catch (invoiceError) {
        console.error("Invoice creation failed", invoiceError);
        // Rollback: Delete the subscription if invoice creation fails
        await subscriptionSchema.deleteOne({ _id: newSubscription._id });
        return NextResponse.json(
          { status_code: SERVER_STATUS_CODE.SERVER_ERROR, message: "Failed to create invoice" },
          { status: SERVER_STATUS_CODE.SERVER_ERROR }
        );
      }

      // --- 4. Update Workspace (Only if immediate) ---
      if (isUpgrade || isExpired) {
        await workspaceModelSchema.updateOne(
          { _id: workspace_id },
          {
            subscription_id: newSubscription._id,
            policy_id: newPlan.policy_id,
            type: newPlan.plan_type || newPlan.type,
          }
        );
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: isUpgrade 
            ? "Plan upgraded immediately (New Subscription Created)" 
            : "Plan downgrade scheduled (New Subscription Created)",
          data: newSubscription,
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