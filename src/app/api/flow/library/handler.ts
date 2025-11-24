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
import botFlowLibrarySchema from "@/models/bot-flow-library-schema";
import {
  yupBotFlowLibrarySchema,
  yupBotFlowSortQuery,
} from "@/validation-schema/api/yup-bot-flow-library";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);

    let flowLibraryQueryValidation: any = {};
    try {
      flowLibraryQueryValidation = yupFilterQuerySchema.validateSync(query);
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

    if (flowLibraryQueryValidation.q != "") {
      searchQuery = {
        $or: [
          {
            name: {
              $regex: `.*${flowLibraryQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            category: {
              $regex: `.*${flowLibraryQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            industry: {
              $regex: `.*${flowLibraryQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            use_case: {
              $regex: `.*${flowLibraryQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    let filterQuery: any = {};

    if (flowLibraryQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        flowLibraryQueryValidation.filter
      );

      const filteredObject = _omitBy(originalFilterObj, _isEmpty);

      filterQuery = filteredObject;
    }

    let sortQuery: any = {};

    if (flowLibraryQueryValidation.sort != "") {
      const _lstry: any = flowLibraryQueryValidation?.sort;
      const sortObj = getJSONObjectFromString(_lstry);

      try {
        sortQuery = yupBotFlowSortQuery.validateSync(sortObj);
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
      per_page: flowLibraryQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: flowLibraryQueryValidation.page,
    };

    const totalCount = await botFlowLibrarySchema.countDocuments(
      finalFilterQuery
    );
    finalResponse.total_result = totalCount;

    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
    let skip: any =
      flowLibraryQueryValidation.page > 0
        ? (flowLibraryQueryValidation.page - 1) *
          flowLibraryQueryValidation.per_page
        : 0;
    let templates = await botFlowLibrarySchema
      .find(finalFilterQuery)
      .skip(skip)
      .sort(sortQuery)
      .limit(finalResponse.per_page);
    finalResponse.items = templates;

    return NextResponse.json({
      data: finalResponse,
    });
  })
  .post(async (req: AppNextApiRequest, { params }: any) => {
    const body = await req.json();

    let BotFlowLibraryValidateBody: any = {};

    //step 1
    try {
      BotFlowLibraryValidateBody = yupBotFlowLibrarySchema.validateSync(body);
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
      const alreadyExist = await botFlowLibrarySchema.findOne({
        name: BotFlowLibraryValidateBody?.name,
      });

      if (alreadyExist) {
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "Validation Error",
            data: {
              name: "Bot Flow Already Exist",
            },
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }

      const newbotflow = new botFlowLibrarySchema({
        ...BotFlowLibraryValidateBody,
      });

      await newbotflow.save();

      return NextResponse.json(
        {
          status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
          message: "Success",
          data: newbotflow,
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
