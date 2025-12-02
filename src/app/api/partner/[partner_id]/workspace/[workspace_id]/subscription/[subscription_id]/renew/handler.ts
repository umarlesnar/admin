import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import subscriptionSchema from "@/models/subscription-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const workspace_id = params?.workspace_id;
    const subscription_id = params?.subscription_id;
    const body = await req.json();

    try {
      const subscription = await subscriptionSchema.findOne({
        _id: subscription_id,
        workspace_id: workspace_id,
      });

      if (!subscription) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            message: "Subscription not found",
            data: null,
          },
          {
            status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
          }
        );
      }

      const updatedSubscription = await subscriptionSchema.findOneAndUpdate(
        {
          _id: subscription_id,
          workspace_id: workspace_id,
        },
        {
          status: "active",
          r_current_start_at: Math.floor(Date.now() / 1000),
          r_current_end_at: body.end_at,
        },
        { new: true }
      );

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Subscription Renewed Successfully",
          data: {
            subscription_id: updatedSubscription._id,
          },
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    } catch (error) {
      console.log("Error", error);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          message: "Server Error",
          data: error,
        },
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
        }
      );
    }
  });

export default router;
