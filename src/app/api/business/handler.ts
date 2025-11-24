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
import businessAccountModelSchema from "@/models/business-account-model-schema";
import { yupBusinessSortQuery } from "@/validation-schema/api/yup-business-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);

    let BusinessQueryValidation: any = {};
    try {
      BusinessQueryValidation = yupFilterQuerySchema.validateSync(query);
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

    if (BusinessQueryValidation.q != "") {
      searchQuery = {
        $or: [
          {
            name: {
              $regex: `.*${BusinessQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            category: {
              $regex: `.*${BusinessQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            industry: {
              $regex: `.*${BusinessQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            use_case: {
              $regex: `.*${BusinessQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    let filterQuery: any = {};

    if (BusinessQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        BusinessQueryValidation.filter
      );

      const filteredObject = _omitBy(originalFilterObj, _isEmpty);

      filterQuery = filteredObject;
    }

    let sortQuery: any = {};

    if (BusinessQueryValidation.sort != "") {
      const _lstry: any = BusinessQueryValidation?.sort;
      const sortObj = getJSONObjectFromString(_lstry);

      try {
        sortQuery = yupBusinessSortQuery.validateSync(sortObj);
      } catch (error) {
        sortQuery = { created_at: -1 };
      }
    } else {
      sortQuery = { created_at: -1 };
    }

    let finalFilterQuery = {
      ...searchQuery,
      ...filterQuery,
    };

    const finalResponse: any = {
      per_page: BusinessQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: BusinessQueryValidation.page,
    };

    const totalCount = await businessAccountModelSchema.countDocuments(
      finalFilterQuery
    );
    finalResponse.total_result = totalCount;

    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
    let skip: any =
      BusinessQueryValidation.page > 0
        ? (BusinessQueryValidation.page - 1) * BusinessQueryValidation.per_page
        : 0;
    let templates = await businessAccountModelSchema
      .find(finalFilterQuery)
      .skip(skip)
      .sort(sortQuery)
      .limit(finalResponse.per_page);
    finalResponse.items = templates;
    return NextResponse.json({
      data: finalResponse,
    });
  });

export default router;
