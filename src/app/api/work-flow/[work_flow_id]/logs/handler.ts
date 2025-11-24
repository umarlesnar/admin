import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import businessIdVerifyMiddleware from "@/middleware/businessIdVerifyMiddleware";
import { AppNextApiRequest } from "@/types/interface";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import workflowLogSchema from "@/models/workflow-log-schema";
import { yupAutomationWorkflowSortQuery } from "@/validation-schema/api/yup-automation-work-flow-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);

    let automateWorkflowLogsQueryValidation: any = query;

    try {
      automateWorkflowLogsQueryValidation =
        yupFilterQuerySchema.validateSync(query);
    } catch (error) {
      const errorObj = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: errorObj,
          message: "Validation Error",
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }
    let filterQuery: any = {};

    if (automateWorkflowLogsQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        automateWorkflowLogsQueryValidation.filter
      );

      const filteredObject = _omitBy(originalFilterObj, _isEmpty);

      filterQuery = filteredObject;
    }

    let search = {};
    if (automateWorkflowLogsQueryValidation.q != "") {
      search = {
        $or: [
          {
            name: {
              $regex: `.*${automateWorkflowLogsQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    const finalFilterQuery = {
      workflow_id: params.work_flow_id,
      ...search,
      ...filterQuery,
    };

    let sortQuery: any = {};

    if (automateWorkflowLogsQueryValidation.sort != "") {
      const _lstry: any = automateWorkflowLogsQueryValidation?.sort;
      const sortObj = getJSONObjectFromString(_lstry);

      try {
        sortQuery = yupAutomationWorkflowSortQuery.validateSync(sortObj);
      } catch (error) {
        sortQuery = { _id: 1 };
      }
    } else {
      sortQuery = { _id: 1 };
    }

    //final response to server
    const finalResponse: any = {
      per_page: automateWorkflowLogsQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: automateWorkflowLogsQueryValidation.page,
    };

    let skip: any =
      automateWorkflowLogsQueryValidation.page > 0
        ? (automateWorkflowLogsQueryValidation.page - 1) *
          automateWorkflowLogsQueryValidation.per_page
        : 0;

    //total page count
    const totalCount = await workflowLogSchema.countDocuments(finalFilterQuery);

    finalResponse.total_result = totalCount;
    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);

    let automateFlow = await workflowLogSchema
      .find(finalFilterQuery)
      .skip(skip)
      .sort(sortQuery)
      .limit(finalResponse.per_page);
    finalResponse.items = automateFlow;
    return NextResponse.json(finalResponse, {
      status: SERVER_STATUS_CODE.SUCCESS_CODE,
    });
  });

export default router;
