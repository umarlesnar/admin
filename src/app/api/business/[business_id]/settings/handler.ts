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
import { yupTemplateLibrarySchema } from "@/validation-schema/api/yup-template-library-schema";
import businessTemplateModelSchema from "@/models/business-template-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);

    let BusinessTemplateQueryValidation: any = {};
    try {
      BusinessTemplateQueryValidation =
        yupFilterQuerySchema.validateSync(query);
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

    if (BusinessTemplateQueryValidation.q != "") {
      searchQuery.$or = [
        {
          name: {
            $regex: `.*${BusinessTemplateQueryValidation.q}.*`,
            $options: "i",
          },
        },
        {
          category: {
            $regex: `.*${BusinessTemplateQueryValidation.q}.*`,
            $options: "i",
          },
        },
        {
          industry: {
            $regex: `.*${BusinessTemplateQueryValidation.q}.*`,
            $options: "i",
          },
        },
        {
          use_case: {
            $regex: `.*${BusinessTemplateQueryValidation.q}.*`,
            $options: "i",
          },
        },
      ];
    }

    let filterQuery: any = {};

    if (BusinessTemplateQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        BusinessTemplateQueryValidation.filter
      );

      const filteredObject = _omitBy(originalFilterObj, _isEmpty);

      filterQuery = filteredObject;
    }

    let sortQuery: any = {};

    if (BusinessTemplateQueryValidation.sort != "") {
      const _lstry: any = BusinessTemplateQueryValidation?.sort;
      const sortObj = getJSONObjectFromString(_lstry);

      try {
        sortQuery = yupTemplateLibrarySchema.validateSync(sortObj);
      } catch (error) {
        sortQuery = { created_at: -1 };
      }
    } else {
      sortQuery = { created_at: -1 };
    }

    let finalFilterQuery = {
      business_id: { $eq: params.business_id },
      ...searchQuery,
      ...filterQuery,
    };

    const finalResponse: any = {
      per_page: BusinessTemplateQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: BusinessTemplateQueryValidation.page,
    };

    const totalCount = await businessTemplateModelSchema.countDocuments(
      finalFilterQuery
    );
    finalResponse.total_result = totalCount;

    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
    let skip: any =
      BusinessTemplateQueryValidation.page > 0
        ? (BusinessTemplateQueryValidation.page - 1) *
          BusinessTemplateQueryValidation.per_page
        : 0;
    let templates = await businessTemplateModelSchema
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
