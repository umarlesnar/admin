import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import businessAccountModelSchema from "@/models/business-account-model-schema";
import userAccountModelSchema from "@/models/user-account-model-schema";
import { NextResponse } from "next/server";
export default async (req: any, { params }: any, next: () => any) => {
  try {
    const businessCount = await businessAccountModelSchema.countDocuments({
      _id: params.business_id,
    });

    if (businessCount == 0) {
      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: null,
          message: "Business Id Not found!",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    } else {
      return await next();
    }
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      {
        status_code: SERVER_STATUS_CODE.SERVER_ERROR,
        data: null,
        message: "Business Id Not found",
      },
      { status: SERVER_STATUS_CODE.SERVER_ERROR }
    );
  }
};
