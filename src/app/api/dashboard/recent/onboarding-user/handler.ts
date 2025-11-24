import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import userAccountModelSchema from "@/models/user-account-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);

    let OnboardingUserQueryValidation: any = {};
    try {
      OnboardingUserQueryValidation = yupFilterQuerySchema.validateSync(query);
    } catch (error) {
      let ErrorFormObject = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: ErrorFormObject,
          message: " ",
        },
        { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
      );
    }

    let filterQuery: any = {};
    if (OnboardingUserQueryValidation.filter) {
      const originalFilterObj = getJSONObjectFromString(
        OnboardingUserQueryValidation.filter
      );
      filterQuery = _omitBy(originalFilterObj, _isEmpty);
    }

    let userLoginActivity = await userAccountModelSchema
      .find({ is_bot: false, business_id: { $exists: false } })
      .sort({ created_at: -1 })
      .limit(5);

    return NextResponse.json({ data: userLoginActivity });
  });

export default router;
