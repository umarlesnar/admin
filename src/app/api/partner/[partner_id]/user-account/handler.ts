import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import userAccountModelSchema from "@/models/user-account-model-schema";
import { yupUserSortSchema } from "@/validation-schema/api/yup-user-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import partnersModelSchema from "@/models/partners-model-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {

     const { partner_id } = params;
    
        // Step 1: Fetch partner by ID to get domain
        const partner = await partnersModelSchema.findById(partner_id);
        if (!partner) {
          return NextResponse.json(
            {
              status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
              message: "Invalid partner ID",
              data: {},
            },
            {
              status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            }
          );
        }
    const query = await getServerSearchParams(req);

    let UserAccountQueryValidation: any = {};
    try {
      UserAccountQueryValidation = yupFilterQuerySchema.validateSync(query);
    } catch (error) {
      let ErrorFormObject = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: ErrorFormObject,
          message: " ",
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    let searchQuery: any = {};

    if (UserAccountQueryValidation.q != "") {
      searchQuery = {
        $or: [
          {
            "profile.first_name": {
              $regex: `.*${UserAccountQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            "profile.last_name": {
              $regex: `.*${UserAccountQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            "phone.mobile_number": {
              $regex: `.*${UserAccountQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    let filterQuery: any = {};

    if (UserAccountQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        UserAccountQueryValidation.filter
      );

      const filteredObject = _omitBy(originalFilterObj, _isEmpty);

      filterQuery = filteredObject;
    }

    let sortQuery: any = {};

    if (UserAccountQueryValidation.sort != "") {
      const _lstry: any = UserAccountQueryValidation?.sort;
      const sortObj = getJSONObjectFromString(_lstry);

      try {
        sortQuery = yupUserSortSchema.validateSync(sortObj);
      } catch (error) {
        sortQuery = { created_at: -1 };
      }
    } else {
      sortQuery = { created_at: -1 };
    }

    let finalFilterQuery = {
      domain: partner.domain,
      business_id: { $exists: false },
      is_bot: false,
      ...searchQuery,
      ...filterQuery,
    };

    const finalResponse: any = {
      per_page: UserAccountQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: UserAccountQueryValidation.page,
    };

    const totalCount = await userAccountModelSchema.countDocuments(
      finalFilterQuery
    );
    finalResponse.total_result = totalCount;

    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
    let skip: any =
      UserAccountQueryValidation.page > 0
        ? (UserAccountQueryValidation.page - 1) *
          UserAccountQueryValidation.per_page
        : 0;
    let UserAccount = await userAccountModelSchema
      .find(finalFilterQuery)
      .skip(skip)
      .sort(sortQuery)
      .limit(finalResponse.per_page);
    finalResponse.items = UserAccount;
    return NextResponse.json(
      {
        data: finalResponse,
      },
      { status: SERVER_STATUS_CODE.SUCCESS_CODE }
    );
  });

export default router;
