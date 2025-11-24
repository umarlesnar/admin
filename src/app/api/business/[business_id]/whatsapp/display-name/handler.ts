import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { yupDisplayNameUpdateSchema } from "@/validation-schema/api/yup-business-update-schema";
import axios from "axios";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .put(async (req: AppNextApiRequest, { params }: any) => {
    // const { user } = req;
    const body = await req.json();

    let filterPayload: any = {};

    try {
      filterPayload = yupDisplayNameUpdateSchema.validateSync(body);
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
      let wba = await businessAccountModelSchema.findOne({
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

      const fb_url_deregister = `${process.env.FACEBOOK_API_URL}/${wba.phone_number_id}/deregister`;

      const de_response = await axios.post(
        fb_url_deregister,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${wba.access_token}`,
          },
        }
      );

      if (de_response.data) {
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

        let newUpdate = await businessAccountModelSchema.findOneAndUpdate(
          {
            _id: params.business_id,
          },
          filterPayload,
          { new: true }
        );
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.SUCCESS_CODE,
            data: newUpdate,
            message: "Business Updated Successfully",
          },
          { status: SERVER_STATUS_CODE.SUCCESS_CODE }
        );
      } else {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.PERMISSION_ERROR_CODE,
            data: "",
            message: "Unable to de Register Phone number",
          },
          { status: SERVER_STATUS_CODE.SUCCESS_CODE }
        );
      }
    } catch (error) {
      console.log("error", error);

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: null,
          message: "WBA id already exist!",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }
  });

export default router;
