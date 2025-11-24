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
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import userRolesModelSchema from "@/models/user-roles-model-schema";
import { yupUserRoleSortQuery } from "@/validation-schema/api/yup-user-roles-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const query = await getServerSearchParams(req);

      let RolesQueryValidation: any = {};
      try {
        RolesQueryValidation = yupFilterQuerySchema.validateSync(query);
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

      if (RolesQueryValidation.q != "") {
        searchQuery = {
          $or: [
            {
              name: {
                $regex: `.*${RolesQueryValidation.q}.*`,
                $options: "i",
              },
            },
          ],
        };
      }

      let filterQuery: any = {};

      if (RolesQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
            RolesQueryValidation.filter
        );

        const filteredObject = _omitBy(originalFilterObj, _isEmpty);

        filterQuery = filteredObject;
      }

      let sortQuery: any = {};

      if (RolesQueryValidation.sort != "") {
        const _lstry: any = RolesQueryValidation?.sort;
        const sortObj = getJSONObjectFromString(_lstry);

        try {
          sortQuery = yupUserRoleSortQuery.validateSync(sortObj);
        } catch (error) {
          sortQuery = { created_at: -1 };
        }
      } else {
        sortQuery = { created_at: -1 };
      }

      let finalFilterQuery = {
        workspace_id:{ $exists: true },
        is_system: false,
        ...searchQuery,
        ...filterQuery,
      };

      const finalResponse: any = {
        per_page: RolesQueryValidation.per_page,
        total_page: 0,
        total_result: 0,
        items: [],
        current_page: RolesQueryValidation.page,
      };

      const totalCount = await userRolesModelSchema.countDocuments(
        finalFilterQuery
      );
      finalResponse.total_result = totalCount;

      finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
      let skip: any =
      RolesQueryValidation.page > 0
          ? (RolesQueryValidation.page - 1) * RolesQueryValidation.per_page
          : 0;
      let Roles = await userRolesModelSchema
        .find(finalFilterQuery)
        .skip(skip)
        .sort(sortQuery)
        .limit(finalResponse.per_page);
      finalResponse.items = Roles;

      return NextResponse.json({
        data: finalResponse,
      });
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
