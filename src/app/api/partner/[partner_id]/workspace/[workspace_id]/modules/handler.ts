import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import workspaceModulesModelSchema from "@/models/workspace-modules-model-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
      const query = await getServerSearchParams(req);
      let WorkspaceModuleQueryValidation: any = {};
      try {
        WorkspaceModuleQueryValidation = yupFilterQuerySchema.validateSync(query);
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
  
      try {
        let searchQuery: any = {};
  
        if (WorkspaceModuleQueryValidation.q != "") {
          searchQuery = {
            $or: [
              {
                module_id: {
                  $regex: `.*${WorkspaceModuleQueryValidation.q}.*`,
                  $options: "i",
                },
              },
            ],
          };
        }
  
        let filterQuery: any = {};
  
        if (WorkspaceModuleQueryValidation.filter !== "") {
          const originalFilterObj = getJSONObjectFromString(
            WorkspaceModuleQueryValidation.filter
          );
  
          const filteredObject = _omitBy(originalFilterObj, _isEmpty);
  
          filterQuery = filteredObject;
        }
  
        let sortQuery: any = { _id: -1 };
      
        let finalFilterQuery = {
          workspace_id: params.workspace_id,
          ...searchQuery,
          ...filterQuery,
        };
  
        const finalResponse: any = {
          per_page: WorkspaceModuleQueryValidation.per_page,
          total_page: 0,
          total_result: 0,
          items: [],
          current_page: WorkspaceModuleQueryValidation.page,
        };
  
        const totalCount = await workspaceModulesModelSchema.countDocuments(
          finalFilterQuery
        );
        finalResponse.total_result = totalCount;
  
        finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
        let skip: any =
        WorkspaceModuleQueryValidation.page > 0
            ? (WorkspaceModuleQueryValidation.page - 1) *
            WorkspaceModuleQueryValidation.per_page
            : 0;
        let subscriptions = await workspaceModulesModelSchema
          .find(finalFilterQuery)
          .skip(skip)
          .sort(sortQuery)
          .limit(finalResponse.per_page);
  
        finalResponse.items = subscriptions;
  
        return NextResponse.json({
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: finalResponse,
          message: "Success",
        });
      } catch (error) {
        console.log("SERVER_ERROR", error);
  
        return NextResponse.json({
          status: SERVER_STATUS_CODE.SERVER_ERROR,
          data: null,
          message: "Server Error",
        });
      }
    })

    .post(async (req: AppNextApiRequest, { params }: any) => {
      const body = await req.json();
      const workspace_id = params?.workspace_id;
      let WorkspaceModulesvalidatedBody: any = {};
    
      try {
        WorkspaceModulesvalidatedBody = body;
      } catch (error) {
        const errorObj = yupToFormErrorsServer(error);
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            message: "body validation error",
            data: errorObj,
          },
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
          }
        );
      }
    
      try {
        const workspaceModuleExist = await workspaceModulesModelSchema.findOne({
          workspace_id: workspace_id,
          module_id: WorkspaceModulesvalidatedBody.module_id,
        });
    
        if (workspaceModuleExist) {
          return NextResponse.json(
            {
              status_code: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
              message: "Module already exist",
              data: {
                module_id: "Module already exist",
              },
            },
            {
              status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            }
          );
        }
    
        const newWorkspaceModule = new workspaceModulesModelSchema({
          workspace_id: workspace_id,
          module_id: WorkspaceModulesvalidatedBody.module_id,
          enabled: true,
          is_visibility: WorkspaceModulesvalidatedBody.is_visibility,
          source: WorkspaceModulesvalidatedBody.source,
          config: WorkspaceModulesvalidatedBody.config,
          expired_at: WorkspaceModulesvalidatedBody.expired_at ? new Date(WorkspaceModulesvalidatedBody.expired_at) : null,
        });
    
        const workspaceModule = await newWorkspaceModule.save();
    
        return NextResponse.json(
          {
            status_code: SERVER_STATUS_CODE.SUCCESS_CODE,
            message: "Workspace Module Created Successfully",
            data: workspaceModule,
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


