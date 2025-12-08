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
          {
            status: SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE,
            data: null,
            message: "Unauthorized Access",
          },
          {
            status: SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE,
          }
        );
      }

      const startOfSeventhDay = moment().add(6, "days").startOf("day").unix();
      const endOfSeventhDay = moment().add(6, "days").endOf("day").unix();
      const subscriptions = await subscriptionSchema
        .find({
          r_current_end_at: { $gte: startOfSeventhDay, $lte: endOfSeventhDay },
          status: "active",
        })
        .sort({ r_current_end_at: -1 });

      for (let i = 0; i < subscriptions.length; i++) {
        const element = { ...subscriptions[i]._doc };

        const workspace = await workspaceModelSchema.findOne({
          _id: element?.workspace_id,
          status: "ACTIVE",
        });

        if (workspace) {
          const setting = await settingsModelSchema.findOne({
            domain: workspace?.domain,
            setting_key: "kwic",
          });

          const settings_value = setting?.setting_value;

          if (settings_value?.workflow_url) {
            const plan = await productItemModelSchema.findOne({
              _id: element?.plan_id,
            });

            const final_payload = {
              type: "subscription_expiring_in_7_days",
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

            const pushDataToKwic = await axios.post(
              settings_value?.workflow_url,
              final_payload
            );
          }
        }
      }

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: null,
          message: "Success",
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    } catch (error) {
      console.log("Server Error", error);
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
          data: null,
          message: "Server Error",
        },
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
        }
      );
    }
  });

export default router;
