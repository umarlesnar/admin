import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import businessIdVerifyMiddleware from "@/middleware/businessIdVerifyMiddleware";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import { AppNextApiRequest } from "@/types/interface";
import axios from "axios";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import get from "lodash/get";

async function convertStreamToBuffer(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .use(businessIdVerifyMiddleware)
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const { user } = req;
    const query = params;
    const formData = await req.formData();
    const app_id = get(query, "business_id", null);
    const file: any = formData.getAll("file")[0];
    const url = formData.get("url");

    try {
      const BusinessAccount = await businessAccountModelSchema.findOne({
        _id: app_id,
        // user_id: user.user_id,
      });

      if (BusinessAccount) {
        let fb_url = `${process.env.FACEBOOK_API_URL}/`;
        const fileBuffer = await convertStreamToBuffer(file.stream());
        const response = await axios.post(fb_url + url, fileBuffer, {
          headers: {
            Authorization: "OAuth " + BusinessAccount.access_token,
            "content-type": file.type,
          },
        });
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
            data: response.data,
            message: "Upload Success",
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
