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
import {
  yupUseCaseSchema,
  yupUseCaseSortQuery,
} from "@/validation-schema/api/yup-usecase-schema";
import useCaseModelSchema from "@/models/use-case-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);

    let usecaseQueryValidation: any = {};
    try {
      usecaseQueryValidation = yupFilterQuerySchema.validateSync(query);
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

    if (usecaseQueryValidation.q != "") {
      searchQuery = {
        $or: [
          {
            name: {
              $regex: `.*${usecaseQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            category: {
              $regex: `.*${usecaseQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            industry: {
              $regex: `.*${usecaseQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            use_case: {
              $regex: `.*${usecaseQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    let filterQuery: any = {};

    if (usecaseQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        usecaseQueryValidation.filter
      );

      const filteredObject = _omitBy(originalFilterObj, _isEmpty);

      filterQuery = filteredObject;
    }

    // if (usecaseQueryValidation.industries_id) {
    //   filterQuery.industry_id = usecaseQueryValidation.industries_id;
    // }

    let sortQuery: any = {};

    if (usecaseQueryValidation.sort != "") {
      const _lstry: any = usecaseQueryValidation?.sort;
      const sortObj = getJSONObjectFromString(_lstry);

      try {
        sortQuery = yupUseCaseSortQuery.validateSync(sortObj);
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
      per_page: usecaseQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: usecaseQueryValidation.page,
    };

    const totalCount = await useCaseModelSchema.countDocuments(
      finalFilterQuery
    );
    finalResponse.total_result = totalCount;

    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
    let skip: any =
      usecaseQueryValidation.page > 0
        ? (usecaseQueryValidation.page - 1) * usecaseQueryValidation.per_page
        : 0;
    let usecase = await useCaseModelSchema
      .find(finalFilterQuery)
      .skip(skip)
      .sort(sortQuery)
      .limit(finalResponse.per_page);
    finalResponse.items = usecase;

    return NextResponse.json({
      data: finalResponse,
    });
  })
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const body = await req.json();

    let usecaseValidateBody: any = {};

    // Step 1: Validate the request body
    try {
      usecaseValidateBody = yupUseCaseSchema.validateSync(body);
    } catch (error) {
      const errorObj = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "UseCase Validation Error",
          data: errorObj,
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }

    // Step 2: Check if the name already exists under the same industry_id
    try {
      const alreadyUsecaseExist = await useCaseModelSchema.findOne({
        name: usecaseValidateBody?.name,
        industry_id: usecaseValidateBody?.industry_id,
      });

      if (alreadyUsecaseExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              name: "UseCase already exists for this industry.",
            },
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      // Step 3: Save the new use case
      const newusecase = new useCaseModelSchema({
        ...usecaseValidateBody,
      });

      await newusecase.save();

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: newusecase,
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
