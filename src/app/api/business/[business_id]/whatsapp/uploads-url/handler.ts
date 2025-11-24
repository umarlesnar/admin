import { SERVER_STATUS_CODE, TEMPLATE_STATUS } from "@/lib/utils/common";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import businessIdVerifyMiddleware from "@/middleware/businessIdVerifyMiddleware";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import { AppNextApiRequest } from "@/types/interface";
import axios from "axios";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import get from "lodash/get";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .use(businessIdVerifyMiddleware)
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const query = params;
    const app_id = get(query, "business_id", null);
    const body = await req.json();

    try {
      const BusinessAccount = await businessAccountModelSchema.findOne({
        _id: app_id,
        // user_id: user.user_id,
      });

      if (BusinessAccount) {
        const fb_url = `${process.env.FACEBOOK_API_URL}/app/uploads/`;
        const response = await axios.post(
          fb_url,
          {},
          {
            params: {
              file_length: "",
              file_type: "",
              file_name: "",
              ...body,
            },
            headers: {
              Authorization: "OAuth " + BusinessAccount.access_token,
              // "content-type": "multipart/form-data",
            },
          }
        );

        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
            data: response.data,
            message: "Success",
          },
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
          }
        );
      } else {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "Something went wrong",
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }
    } catch (error) {
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
