import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import { yupBusinessBroadcastLimitSchema } from "@/validation-schema/api/yup-business-update-schema";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const business_id = params?.business_id;

      const business = await businessAccountModelSchema.findOne({
        _id: business_id,
      });

      if (!business) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Business Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: business,
          message: "Success",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
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
  })
  .put(async (req: AppNextApiRequest, { params }: any) => {
    const body = await req.json();

    let filterPayload: any = {};

    try {
      filterPayload = yupBusinessBroadcastLimitSchema.validateSync(body);
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
          message: "Broadcast Limit Updated Successfully",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );

    // try {
    //   let per_day_limit = await businessAccountModelSchema.findOne({
    //     _id: params.business_id,
    //   });

    //   if (!per_day_limit) {
    //     return NextResponse.json(
    //       {
    //         status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
    //         data: null,
    //         message: "Account Not found!",
    //       },
    //       { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
    //     );
    //   }

    //   let newUpdate = await businessAccountModelSchema.findOneAndUpdate(
    //     {
    //       _id: params.business_id,
    //     },
    //     filterPayload,
    //     { new: true }
    //   );

    //   return NextResponse.json(
    //     {
    //       status: SERVER_STATUS_CODE.SUCCESS_CODE,
    //       data: newUpdate,
    //       message: "Broadcast Limit Updated Successfully",
    //     },
    //     { status: SERVER_STATUS_CODE.SUCCESS_CODE }
    //   );
    // } catch (error) {
    //   console.log("error", error);

    //   return NextResponse.json(
    //     {
    //       status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
    //       data: null,
    //       message: "Cloud Provider already exist!",
    //     },
    //     { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
    //   );
    // }
  });

export default router;
