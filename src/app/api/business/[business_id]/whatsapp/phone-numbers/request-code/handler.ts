import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import dbMiddleware from "@/middleware/dbMiddleware";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import axios from "axios";

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(dbMiddleware)
  .put(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const wba = await businessAccountModelSchema.findOne({
        _id: params.business_id,
      });
      if (!wba) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "Account Not found!",
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      const fb_url = `${process.env.FACEBOOK_API_URL}/${wba.phone_number_id}/request_code`;

      const response = await axios.post(
        fb_url,
        {
          code_method: "SMS",
          locale: "en_US",
          language: "en_US",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${wba.access_token.trim()}`,
          },
        }
      );

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: null,
          message: "Verification Code Sent Successfully",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error: any) {
      console.log("error", error?.response?.data);
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: null,
          message: "Verification Code Sent failed",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }
  });

export default router;
