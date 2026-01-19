import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import dbMiddleware from "@/middleware/dbMiddleware";
import moment from "moment";
import subscriptionSchema from "@/models/subscription-schema";
import workspaceModelSchema from "@/models/workspace-model-schema";
import productItemModelSchema from "@/models/product-item-model-schema";
import axios from "axios";
import settingsModelSchema from "@/models/settings-model-schema";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(dbMiddleware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const query = await getServerSearchParams(req);

      if (query?.accessToken !== process.env.CRON_AUTH_TOKEN) {
        return NextResponse.json(
          { status: SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE, data: null, message: "Unauthorized Access" },
          { status: SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE }
        );
      }

      const nowUnix = moment().unix();
      const startOfToday = moment().startOf("day").unix();

      // PART 1: ACTIVATE SCHEDULED SUBSCRIPTIONS
      // Find subscriptions that are 'scheduled' and start time has passed (or is today)
      const scheduledSubscriptions = await subscriptionSchema.find({
        status: "scheduled",
        r_current_start_at: { $lte: nowUnix }
      });

      for (const sub of scheduledSubscriptions) {
        console.log(`Activating scheduled subscription: ${sub._id}`);
        await subscriptionSchema.updateOne(
            { _id: sub._id },
            { status: "active" }
        );
        
        const element = { ...sub._doc };
        const workspace = await workspaceModelSchema.findOne({
          _id: element?.workspace_id,
          status: "ACTIVE",
        });

        if (workspace) {
          // Update workspace with new plan's nodes_available
          const plan = await productItemModelSchema.findOne({ _id: element?.plan_id });
          if (plan?.nodes_access) {
            await workspaceModelSchema.updateOne(
              { _id: element?.workspace_id },
              { nodes_available: plan.nodes_access }
            );
          }

          const setting = await settingsModelSchema.findOne({
            domain: workspace?.domain,
            setting_key: "kwic",
          });

          if (setting?.setting_value?.workflow_url) {
            const final_payload = {
              type: "subscription_started",
              workspace_name: workspace?.name || "",
              phone: workspace?.notification?.phone_number || "",
              email_id: workspace?.notification?.email_id || "",
              plan_name: plan?.name || "",
              billing_cycle: plan?.type || "",
              plan_type: plan?.plan_type || "",
              amount: plan?.price || 0,
              tax_percentage: plan?.tax_percentage || 0,
              tax_amount: plan?.tax || 0,
              total_amount: plan?.total_price || 0,
              currency_code: plan?.currency_code || "INR",
              start_at: element?.r_start_at,
              end_at: element?.r_end_at,
              current_end_at: element?.r_current_end_at,
              current_start_at: element?.r_current_start_at,
            };

            try {
                await axios.post(setting.setting_value.workflow_url, final_payload);
            } catch (err) {
                console.error("Webhook failed", err);
            }
          }
        }
      }

      // PART 2: EXPIRE OLD SUBSCRIPTIONS
      // Find active subscriptions that have expired
      const expiredSubscriptions = await subscriptionSchema
        .find({
          r_current_end_at: { $lte: nowUnix }, 
          status: { $in: ["active"] }, // Only check active ones
        })
        .sort({ r_current_end_at: -1 });

      for (const sub of expiredSubscriptions) {
        const element = { ...sub._doc };

        // Send Expiry Notification Webhook
        const workspace = await workspaceModelSchema.findOne({
          _id: element?.workspace_id,
          status: "ACTIVE",
        });

        if (workspace) {
          const setting = await settingsModelSchema.findOne({
            domain: workspace?.domain,
            setting_key: "kwic",
          });

          if (setting?.setting_value?.workflow_url) {
            const plan = await productItemModelSchema.findOne({ _id: element?.plan_id });

            const final_payload = {
              type: "subscription_expired",
              workspace_name: workspace?.name || "",
              phone: workspace?.notification?.phone_number || "",
              email_id: workspace?.notification?.email_id || "",
              plan_name: plan?.name || "",
              billing_cycle: plan?.type || "",
              plan_type: plan?.plan_type || "",
              amount: plan?.price || 0,
              tax_percentage: plan?.tax_percentage || 0,
              tax_amount: plan?.tax || 0,
              total_amount: plan?.total_price || 0,
              currency_code: plan?.currency_code || "INR",
              start_at: element?.r_start_at,
              end_at: element?.r_end_at,
              current_end_at: element?.r_current_end_at,
              current_start_at: element?.r_current_start_at,
            };

            try {
                await axios.post(setting.setting_value.workflow_url, final_payload);
            } catch (err) {
                console.error("Webhook failed", err);
            }
          }
        }

        // Check if there's a scheduled subscription to activate
        if (element?.upcoming_plan?.plan_id) {
          const newPlan = await productItemModelSchema.findOne({ _id: element.upcoming_plan.plan_id });
          if (newPlan?.nodes_access) {
            await workspaceModelSchema.updateOne(
              { _id: element?.workspace_id },
              { nodes_available: newPlan.nodes_access }
            );
          }
        }

        // Mark as completed
        await subscriptionSchema.updateOne(
            { _id: sub._id },
            { status: "completed" }
        );
      }

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: {
             activated_count: scheduledSubscriptions.length,
             expired_count: expiredSubscriptions.length
          },
          message: "Cron job executed successfully",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error) {
      console.log("Server Error", error);
      return NextResponse.json(
        { status: SERVER_STATUS_CODE.SERVER_ERROR, data: null, message: "Server Error" },
        { status: SERVER_STATUS_CODE.SERVER_ERROR }
      );
    }
  });

export default router;