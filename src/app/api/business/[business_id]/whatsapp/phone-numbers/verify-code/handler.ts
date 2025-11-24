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
      const body = await req.json();
      const { code } = body;

      if (!code) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "OTP code is required",
            data: null,
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

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

      // Step 1: Verify OTP
      const verify_url = `${process.env.FACEBOOK_API_URL}/${wba.phone_number_id}/verify_code`;

      const verifyResponse = await axios.post(
        verify_url,
        { code: code },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${wba.access_token.trim()}`,
          },
        }
      );

      if (verifyResponse?.data?.success) {
        // Step 2: Register if OTP verification succeeded
        const register_url = `${process.env.FACEBOOK_API_URL}/${wba.phone_number_id}/register`;

        await axios.post(
          register_url,
          {
            messaging_product: "whatsapp",
            pin: "654321",
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
            message: "Verification and Registration Successful",
          },
          { status: SERVER_STATUS_CODE.SUCCESS_CODE }
        );
      } else {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "OTP verification failed",
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }
    } catch (error) {
      console.log("error", (error as any)?.response?.data || error);
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: null,
          message: "Verification or Registration failed",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }
  });

export default router;
