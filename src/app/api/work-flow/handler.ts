import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import { AppNextApiRequest } from "@/types/interface";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import { yupAutomateWorkFlowSchema, yupAutomationWorkflowSortQuery } from "@/validation-schema/api/yup-automation-work-flow-schema";
import workflowLibraryModelSchema from "@/models/workflow-library-model-schema";
import workspaceUserModelSchema from "@/models/workspace-user-model-schema";
import userAccountModelSchema from "@/models/user-account-model-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);
    let automateWorkflowFlowQueryValidation: any = query;

    try {
      automateWorkflowFlowQueryValidation =
        yupFilterQuerySchema.validateSync(query);
    } catch (error) {
      const automateErrorFormObject = yupToFormErrorsServer(error);

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          data: automateErrorFormObject,
          message: "Validation Error",
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }
    let filterQuery: any = {};

    if (automateWorkflowFlowQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        automateWorkflowFlowQueryValidation.filter
      );

      const filteredObject = _omitBy(originalFilterObj, _isEmpty);

      filterQuery = filteredObject;
    }

    let search = {};
    if (automateWorkflowFlowQueryValidation.q != "") {
      search = {
        $or: [
          {
            name: {
              $regex: `.*${automateWorkflowFlowQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    const finalFilterQuery = {
      ...search,
      ...filterQuery,
    };

    //sort

    let filterSortQuery: any = {};

    if (automateWorkflowFlowQueryValidation.q !== "") {
      filterSortQuery = {
        $or: [
          {
            name: {
              $regex: `.*${automateWorkflowFlowQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    let sortQuery: any = {};

    if (
      automateWorkflowFlowQueryValidation.sort &&
      automateWorkflowFlowQueryValidation.sort !== ""
    ) {
      const sortObj = getJSONObjectFromString(
        automateWorkflowFlowQueryValidation.sort
      );

      if (Object.keys(sortObj).length === 0) {
        sortQuery = { created_at: -1 };
      } else {
        try {
          sortQuery = yupAutomationWorkflowSortQuery.validateSync(sortObj);
        } catch (error) {
          sortQuery = { created_at: -1 };
        }
      }
    } else {
      sortQuery = { created_at: -1 };
    }

    //final response to server
    const finalResponse: any = {
      per_page: automateWorkflowFlowQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: automateWorkflowFlowQueryValidation.page,
    };

    let skip: any =
      automateWorkflowFlowQueryValidation.page > 0
        ? (automateWorkflowFlowQueryValidation.page - 1) *
          automateWorkflowFlowQueryValidation.per_page
        : 0;

    //total page count
    const totalCount =
      await workflowLibraryModelSchema.countDocuments(finalFilterQuery);
    finalResponse.total_result = totalCount;
    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);

    let workFlow = await workflowLibraryModelSchema
      .find(finalFilterQuery)
      .select("name tags industry use_case description created_at status")
      .skip(skip)
      .sort(sortQuery)
      .limit(finalResponse.per_page);
    finalResponse.items = workFlow;
    return NextResponse.json(finalResponse, {
      status: SERVER_STATUS_CODE.SUCCESS_CODE,
    });
  })

  .post(async (req: AppNextApiRequest, { params }: any) => {
    const { user, business } = req;
    const query = await getServerSearchParams(req);
    const body = await req.json();
  
    let filterPayload: any = body;
  
    // Add validation try-catch
    try {
      filterPayload = await yupAutomateWorkFlowSchema.validate(body);
    } catch (error) {
      const errorObj = yupToFormErrorsServer(error);
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          message: "Validation Error",
          data: errorObj,
        },
        {
          status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
        }
      );
    }
  
    try {
      // Find bot with proper error handling
      const workspace_bot = await workspaceUserModelSchema.findOne({
        is_bot: true,
      });
  
      if (!workspace_bot) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "Workspace bot not found",
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }
  
      const bot = await userAccountModelSchema.findOne({
        _id: workspace_bot.user_account_id,
        is_bot: true,
      });
  
      if (!bot) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "Bot account not found",
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }
  
      // JWT creation
      const jwtClaims = {
        sub: bot._id.toString(),
        name: bot.profile.first_name,
        role: bot.role,
        display_profile: {
          _id: bot._id.toString(),
          profile: {
            first_name: bot.profile.first_name,
          },
          is_bot: bot.is_bot,
        },
        user_id: bot._id.toString(),
      };
  
      const encodedToken = jwt.sign(jwtClaims, process.env.NEXTAUTH_SECRET!, {
        algorithm: "HS256",
      });
  
      // Create workflow with proper error handling
      let newAutomateWorkFlow = new workflowLibraryModelSchema({
        ...filterPayload,
        access_token: encodedToken,
        created_by: user.user_id,
        created_at: new Date(),
        updated_at: new Date(),
      });
  
      await newAutomateWorkFlow.save();
  
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: newAutomateWorkFlow,
          message: "New Work Flow created",
        },
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
        }
      );
    } catch (error) {
      console.error("Server Error:", error);
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR, // Use SERVER_ERROR instead of VALIDATION_ERROR_CODE
          data: null,
          message: "Server Error",
        },
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
        }
      );
    }
  });
export default router;
