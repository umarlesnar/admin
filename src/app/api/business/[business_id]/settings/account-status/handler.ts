import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import { yupBusinessAccountStatusSchema } from "@/validation-schema/api/yup-business-update-schema";
import userAccountModelSchema from "@/models/user-account-model-schema";
import mongoose from "mongoose";
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
      filterPayload = yupBusinessAccountStatusSchema.validateSync(body);
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

    if (filterPayload?.status === "ACTIVE") {
      const updatedAccounts = await userAccountModelSchema.updateMany(
        {
          business_id: new mongoose.Types.ObjectId(params.business_id),
          status: { $eq: "SUSPENDED" },
        },
        { status: "ACTIVE" }
      );
      const updateBusinessAccount = await businessAccountModelSchema.updateMany(
        {
          _id: new mongoose.Types.ObjectId(params.business_id),
        },
        { status: "ACTIVE" }
      );

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: updatedAccounts,
          message: "Updated successfully",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } else if (filterPayload?.status === "DISABLE") {
      const updatedAccounts = await userAccountModelSchema.updateMany(
        {
          business_id: new mongoose.Types.ObjectId(params.business_id),
          status: { $ne: "DELETED" },
          user_type: { $ne: "BOT" },
        },
        { status: "SUSPENDED" }
      );
      const updateBusinessAccount = await businessAccountModelSchema.updateMany(
        {
          _id: new mongoose.Types.ObjectId(params.business_id),
        },
        { status: "DISABLE" }
      );

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: updatedAccounts,
          message: "Updated successfully",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } else if (filterPayload?.status === "DELETE") {
      const updatedAccounts = await userAccountModelSchema.updateMany(
        {
          business_id: new mongoose.Types.ObjectId(params.business_id),
          status: { $ne: "DELETED" },
          user_type: { $ne: "BOT" },
        },
        { status: "SUSPENDED" }
      );
      const updateBusinessAccount = await businessAccountModelSchema.updateMany(
        {
          _id: new mongoose.Types.ObjectId(params.business_id),
        },
        { status: "DELETE" }
      );

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: updatedAccounts,
          message: "Updated successfully",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } else {
      console.log("Operation failed");
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: null,
          message: "Operation failed",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }
  });

export default router;
