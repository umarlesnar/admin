import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import businessIdVerifyMiddleware from "@/middleware/businessIdVerifyMiddleware";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import { AppNextApiRequest } from "@/types/interface";
import axios from "axios";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import get from "lodash/get";
import { yupWhatsappWebhookSubscriptionSchema } from "@/validation-schema/api/yup-whatsapp-webhook-subscription-schema";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .use(businessIdVerifyMiddleware)
  .put(async (req: AppNextApiRequest, { params }: any) => {
    const query = params;
    const business_id = get(query, "business_id", null);
    const body = await req.json();

    let validatedBody: any = {};

    try {
      validatedBody = yupWhatsappWebhookSubscriptionSchema.validateSync(body);
    } catch (error) {
      const err_output = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: err_output,
          message: "Validation Error",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }

    try {
      const BusinessAccount = await businessAccountModelSchema.findOne({
        _id: business_id,
      });

      if (!BusinessAccount) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "Business account not found",
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      const fb_url = `${process.env.FACEBOOK_API_URL}/${BusinessAccount.wba_id}/subscribed_apps`;
      const response = await axios.post(
        fb_url,
        { ...validatedBody },
        {
          headers: {
            Authorization: "Bearer " + BusinessAccount.access_token,
          },
        }
      );

      const updateWebhook = await businessAccountModelSchema.findOneAndUpdate(
        {
          _id: business_id,
        },
        {
          override_callback_uri: body.override_callback_uri,
          verify_token: body.verify_token,
        },
        {
          new: true,
        }
      );

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: updateWebhook,
          message: "webhook endpoint overrides successfully",
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    } catch (error) {
      console.log("error", error);

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
          data: null,
          message: "server error",
        },
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
        }
      );
    }
  });

export default router;
