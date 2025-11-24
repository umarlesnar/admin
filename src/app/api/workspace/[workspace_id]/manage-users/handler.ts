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
import workspaceUserModelSchema from "@/models/workspace-user-model-schema";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(apiMiddlerware)

  .get(async (req: AppNextApiRequest, { params }: any) => {
      const query = await getServerSearchParams(req);
      let WorkspaceUserQueryValidation: any = {};
      try {
        WorkspaceUserQueryValidation = yupFilterQuerySchema.validateSync(query);
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
  
        if (WorkspaceUserQueryValidation.q != "") {
          searchQuery = {
            $or: [
              {
                first_name: {
                  $regex: `.*${WorkspaceUserQueryValidation.q}.*`,
                  $options: "i",
                },
              },
            ],
          };
        }
  
        let filterQuery: any = {};
  
        if (WorkspaceUserQueryValidation.filter !== "") {
          const originalFilterObj = getJSONObjectFromString(
            WorkspaceUserQueryValidation.filter
          );
  
          const filteredObject = _omitBy(originalFilterObj, _isEmpty);
  
          filterQuery = filteredObject;
        }
  
        let sortQuery: any = { r_end_at: -1 };
  
        let finalFilterQuery = {
          workspace_id: params.workspace_id,
          ...searchQuery,
          ...filterQuery,
        };
  
        const finalResponse: any = {
          per_page: WorkspaceUserQueryValidation.per_page,
          total_page: 0,
          total_result: 0,
          items: [],
          current_page: WorkspaceUserQueryValidation.page,
        };
  
        const totalCount = await workspaceUserModelSchema.countDocuments(
          finalFilterQuery
        );
        finalResponse.total_result = totalCount;
  
        finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
        let skip: any =
        WorkspaceUserQueryValidation.page > 0
            ? (WorkspaceUserQueryValidation.page - 1) *
            WorkspaceUserQueryValidation.per_page
            : 0;
        let subscriptions = await workspaceUserModelSchema
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

export default router;


