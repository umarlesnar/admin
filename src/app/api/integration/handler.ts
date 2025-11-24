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
  yupIntegrationLibrarySchema,
  yupIntegrationSortQuery,
} from "@/validation-schema/api/yup-integration-library-schema";
import integrationModelSchema from "@/models/integration-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);

    let IntegrationLQueryValidation: any = {};
    try {
      IntegrationLQueryValidation = yupFilterQuerySchema.validateSync(query);
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

    if (IntegrationLQueryValidation.q != "") {
      searchQuery = {
        $or: [
          {
            name: {
              $regex: `.*${IntegrationLQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            category: {
              $regex: `.*${IntegrationLQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            industry: {
              $regex: `.*${IntegrationLQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            use_case: {
              $regex: `.*${IntegrationLQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    let filterQuery: any = {};

    if (IntegrationLQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        IntegrationLQueryValidation.filter
      );

      const filteredObject = _omitBy(originalFilterObj, _isEmpty);

      filterQuery = filteredObject;
    }

    let sortQuery: any = {};

    if (IntegrationLQueryValidation.sort != "") {
      const _lstry: any = IntegrationLQueryValidation?.sort;
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
      per_page: IntegrationLQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: IntegrationLQueryValidation.page,
    };

    const totalCount = await integrationModelSchema.countDocuments(
      finalFilterQuery
    );
    finalResponse.total_result = totalCount;

    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
    let skip: any =
      IntegrationLQueryValidation.page > 0
        ? (IntegrationLQueryValidation.page - 1) *
          IntegrationLQueryValidation.per_page
        : 0;
    let templates = await integrationModelSchema
      .find(finalFilterQuery)
      .skip(skip)
      .sort(sortQuery)
      .limit(finalResponse.per_page);

    const updatedIntegration: any = [];

    for (let i = 0; i < templates.length; i++) {
      let element = { ...templates[i]._doc };

      if (!element.image_url.startsWith("http")) {
        element.image_url =
          process.env.STATIC_IMAGE_ENDPOINT + element.image_url;
      }
      updatedIntegration.push(element);
    }

    finalResponse.items = updatedIntegration;
    return NextResponse.json({
      data: finalResponse,
    });
  })
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const body = await req.json();

    let IntegrationValidateBody: any = {};

    //step 1
    try {
      IntegrationValidateBody = yupIntegrationLibrarySchema.validateSync(body);
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
      const alreadyExist = await integrationModelSchema.findOne({
        name: IntegrationValidateBody?.name,
      });

      if (alreadyExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              name: "Integration Already Exist",
            },
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      const newintegration = new integrationModelSchema({
        ...IntegrationValidateBody,
      });

      await newintegration.save();

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: newintegration,
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
