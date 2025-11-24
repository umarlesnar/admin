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
import {
  yupIntegrationCategorySchema,
  yupIntegrationSortQuery,
} from "@/validation-schema/api/yup-integration-library-schema";
import IntegrationCategorySchema from "@/models/integration-category-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);

    let IntegrationCategoryQueryValidation: any = {};
    try {
      IntegrationCategoryQueryValidation =
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

    if (IntegrationCategoryQueryValidation.q != "") {
      searchQuery = {
        $or: [
          {
            name: {
              $regex: `.*${IntegrationCategoryQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            category: {
              $regex: `.*${IntegrationCategoryQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            industry: {
              $regex: `.*${IntegrationCategoryQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            use_case: {
              $regex: `.*${IntegrationCategoryQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    let filterQuery: any = {};

    if (IntegrationCategoryQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        IntegrationCategoryQueryValidation.filter
      );

      const filteredObject = _omitBy(originalFilterObj, _isEmpty);

      filterQuery = filteredObject;
    }

    let sortQuery: any = {};

    if (IntegrationCategoryQueryValidation.sort != "") {
      const _lstry: any = IntegrationCategoryQueryValidation?.sort;
      const sortObj = getJSONObjectFromString(_lstry);

      try {
        sortQuery = yupIntegrationSortQuery.validateSync(sortObj);
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
      per_page: IntegrationCategoryQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: IntegrationCategoryQueryValidation.page,
    };

    const totalCount = await IntegrationCategorySchema.countDocuments(
      finalFilterQuery
    );
    finalResponse.total_result = totalCount;

    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
    let skip: any =
      IntegrationCategoryQueryValidation.page > 0
        ? (IntegrationCategoryQueryValidation.page - 1) *
          IntegrationCategoryQueryValidation.per_page
        : 0;
    let integrationCategory = await IntegrationCategorySchema.find(
      finalFilterQuery
    )
      .skip(skip)
      .sort(sortQuery)
      .limit(finalResponse.per_page);
    finalResponse.items = integrationCategory;
    return NextResponse.json({
      data: finalResponse,
    });
  })
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const body = await req.json();

    let IntegrationCategoryValidateBody: any = {};

    //step 1
    try {
      IntegrationCategoryValidateBody =
        yupIntegrationCategorySchema.validateSync(body);
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

    //step 2

    try {
      const alreadyExist = await IntegrationCategorySchema.findOne({
        name: IntegrationCategoryValidateBody?.name,
      });

      if (alreadyExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              name: "Integration Category Already Exist",
            },
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      const newintegrationcategory = new IntegrationCategorySchema({
        ...IntegrationCategoryValidateBody,
      });

      await newintegrationcategory.save();

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: newintegrationcategory,
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
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
  });

export default router;
