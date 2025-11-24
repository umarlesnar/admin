import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _pick from "lodash/pick";
import userAccountModelSchema from "@/models/user-account-model-schema";
import { generatePasswordHash } from "@/lib/utils/generate-password-hash";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { yupPasswordResetSchema } from "@/validation-schema/api/yup-password-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router.use(apiMiddlerware);
router.put(async (req: AppNextApiRequest, { params }: any) => {
  const body = await req.json();
  let agentValidateBody: any = {};
  const user_id = params?.user_id;
  const filterPayload = _pick(body, ["new_password", "confirm_password"]);

  try {
    agentValidateBody = yupPasswordResetSchema.validateSync(body);
  } catch (error) {
    const errorObj = yupToFormErrorsServer(error);

    return NextResponse.json(
      {
        status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        message: "Body Validation Error",
        data: errorObj,
      },
      {
        status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
      }
    );
  }

  const existingUser = await userAccountModelSchema.findById(user_id);

  if (!existingUser) {
    console.error("User not found for ID:", user_id);
    return NextResponse.json(
      {
        status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        message: "Invalid Operator Id",
      },
      { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
    );
  }

  try {
    await userAccountModelSchema.findOneAndUpdate(
      { _id: user_id },
      {
        "auth_credentials.password": generatePasswordHash(
          filterPayload.new_password
        ),
        "auth_credentials.last_updated_at": new Date(),
      },
      { new: true }
    );

    return NextResponse.json(
      {
        status: SERVER_STATUS_CODE.SUCCESS_CODE,
        message: "Password Updated Successfully",
      },
      { status: SERVER_STATUS_CODE.SUCCESS_CODE }
    );
  } catch (error) {
    console.error("Database Update Error:", error);
    return NextResponse.json(
      {
        status: SERVER_STATUS_CODE.SERVER_ERROR,
        message: "Failed to update password",
      },
      { status: SERVER_STATUS_CODE.SERVER_ERROR }
    );
  }
});

export default router;
