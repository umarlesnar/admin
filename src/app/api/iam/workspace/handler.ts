import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import _omit from "lodash/omit";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import partnersModelSchema from "@/models/partners-model-schema";
import workspaceUserModelSchema from "@/models/workspace-user-model-schema";
import { yupWorkspaceUserSortSchema } from "@/validation-schema/api/yup-workspace-user-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const query = await getServerSearchParams(req);

      let WorkspaceQueryValidation: any = {};
      try {
        WorkspaceQueryValidation = yupFilterQuerySchema.validateSync(query);
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

      if (WorkspaceQueryValidation.q != "") {
        searchQuery = {
          $or: [
            {
              "first_name": {
                $regex: `.*${WorkspaceQueryValidation.q}.*`,
                $options: "i",
              },
            },
            {
              "last_name": {
                $regex: `.*${WorkspaceQueryValidation.q}.*`,
                $options: "i",
              },
            },
            {
              "role": {
                $regex: `.*${WorkspaceQueryValidation.q}.*`,
                $options: "i",
              },
            },
          ],
        };
      }

      let filterQuery: any = {};

      if (WorkspaceQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
          WorkspaceQueryValidation.filter
        );
        let filteredObject = _omitBy(originalFilterObj, _isEmpty);

        if (filteredObject?.partner_id) {
          const patner = await partnersModelSchema.findOne({
            _id: filteredObject?.partner_id,
          });

          if (patner) {
            filteredObject.domain = patner.domain;
            filteredObject = _omit(filteredObject, ["partner_id"]);
          }
        }

        filterQuery = filteredObject;
      }

      let sortQuery: any = {};

      if (WorkspaceQueryValidation.sort != "") {
        const _lstry: any = WorkspaceQueryValidation?.sort;
        const sortObj = getJSONObjectFromString(_lstry);

        try {
          sortQuery = yupWorkspaceUserSortSchema.validateSync(sortObj);
        } catch (error) {
          sortQuery = { created_at: -1 };
        }
      } else {
        sortQuery = { created_at: -1 };
      }

      let finalFilterQuery = {
        workspace_id: null,
        ...searchQuery,
        ...filterQuery,
      };

      const finalResponse: any = {
        per_page: WorkspaceQueryValidation.per_page,
        total_page: 0,
        total_result: 0,
        items: [],
        current_page: WorkspaceQueryValidation.page,
      };

      const totalCount = await workspaceUserModelSchema.countDocuments(
        finalFilterQuery
      );
      finalResponse.total_result = totalCount;

      finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
      let skip: any =
        WorkspaceQueryValidation.page > 0
          ? (WorkspaceQueryValidation.page - 1) *
            WorkspaceQueryValidation.per_page
          : 0;
      let Workspaceuser = await workspaceUserModelSchema
        .find(finalFilterQuery)
        .skip(skip)
        .sort(sortQuery)
        .limit(finalResponse.per_page);
      finalResponse.items = Workspaceuser;

      return NextResponse.json(
        {
          data: finalResponse,
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
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
