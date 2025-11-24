import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import userAccountModelSchema from "@/models/user-account-model-schema";
import { yupUserSortSchema } from "@/validation-schema/api/yup-user-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);

    let BusinessUsersQueryValidation: any = {};
    try {
      BusinessUsersQueryValidation = yupFilterQuerySchema.validateSync(query);
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

    if (BusinessUsersQueryValidation.q != "") {
      searchQuery = {
        $or: [
          {
            "profile.first_name": {
              $regex: `.*${BusinessUsersQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            "profile.last_name": {
              $regex: `.*${BusinessUsersQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            "phone.mobile_number": {
              $regex: `.*${BusinessUsersQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    let filterQuery: any = {};

    if (BusinessUsersQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        BusinessUsersQueryValidation.filter
      );

      const filteredObject = _omitBy(originalFilterObj, _isEmpty);

      filterQuery = filteredObject;
    }

    let sortQuery: any = {};

    if (BusinessUsersQueryValidation.sort != "") {
      const _lstry: any = BusinessUsersQueryValidation?.sort;
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
      business_id: params.business_id,
      is_bot: false,
      ...searchQuery,
      ...filterQuery,
    };

    const finalResponse: any = {
      per_page: BusinessUsersQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: BusinessUsersQueryValidation.page,
    };

    const totalCount = await userAccountModelSchema.countDocuments(
      finalFilterQuery
    );
    finalResponse.total_result = totalCount;

    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
    let skip: any =
      BusinessUsersQueryValidation.page > 0
        ? (BusinessUsersQueryValidation.page - 1) *
          BusinessUsersQueryValidation.per_page
        : 0;
    let businessusers = await userAccountModelSchema
      .find(finalFilterQuery)
      .skip(skip)
      .sort(sortQuery)
      .limit(finalResponse.per_page);
    finalResponse.items = businessusers;
    return NextResponse.json({
      data: finalResponse,
    });
  });

export default router;
