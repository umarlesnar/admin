import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import axios from "axios";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(apiMiddlerware)
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

      const fb_url = `${process.env.FACEBOOK_API_URL}/${wba.phone_number_id}/register`;

      const response = await axios.post(
        fb_url,
        {
          messaging_product: "whatsapp",
          pin: "654321",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${wba.access_token}`,
          },
        }
      );

      // const newupdated = await businessAccountModelSchema.findOneAndUpdate(
      //   { _id: params.business_id },
      //   { new: true }
      // );

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: null,
          message: "Business Registered Successfully",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error) {
      console.log("error", error);
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: null,
          message: "Register failed",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }
  });

export default router;
