import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import businessIdVerifyMiddleware from "@/middleware/businessIdVerifyMiddleware";
import businessConversationSessionModelSchema from "@/models/business-conversation-session-model-schema";
import commerceCartModelSchema from "@/models/commerce-cart-model-schema";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .use(businessIdVerifyMiddleware)
  .delete(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const cartExist = await commerceCartModelSchema.findOne({
        business_id: params.business_id,
        wa_id: params?.wa_id,
      });

      if (!cartExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "Cart Not Found",
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      const deleteCart = await commerceCartModelSchema.deleteMany({
        business_id: params.business_id,
        wa_id: params?.wa_id,
      });

      const removeCartSession =
        await businessConversationSessionModelSchema.findOneAndUpdate(
          {
            wa_id: params?.wa_id,
            business_id: params.business_id,
          },
          { $unset: { cart_session_id: "" } }
        );

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: null,
          message: "Cart Deleted Successfully",
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    } catch (error: any) {
      console.error("Error", error);
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SERVER_ERROR,
          data: error,
          message: "Server Error",
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    }
  });
export default router;
