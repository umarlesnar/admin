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
import apiKeyManagementModelSchema from "@/models/api-key-management-model-schema";
import { yupApiKeyManagementSortQuery } from "@/validation-schema/api/yup-api-key-management-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const query = await getServerSearchParams(req);

      let LegacyApiKeyQueryValidation: any = {};
      try {
        LegacyApiKeyQueryValidation = yupFilterQuerySchema.validateSync(query);
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

      if (LegacyApiKeyQueryValidation.q != "") {
        searchQuery = {
          $or: [
            {
              name: {
                $regex: `.*${LegacyApiKeyQueryValidation.q}.*`,
                $options: "i",
              },
            },
            {
              api_key_type: {
                $regex: `.*${LegacyApiKeyQueryValidation.q}.*`,
                $options: "i",
              },
            },
          ],
        };
      }

      let filterQuery: any = {};

      if (LegacyApiKeyQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
          LegacyApiKeyQueryValidation.filter
        );

        const filteredObject = _omitBy(originalFilterObj, _isEmpty);

        filterQuery = filteredObject;
      }

      let sortQuery: any = {};

      if (LegacyApiKeyQueryValidation.sort != "") {
        const _lstry: any = LegacyApiKeyQueryValidation?.sort;
        const sortObj = getJSONObjectFromString(_lstry);

        try {
          sortQuery = yupApiKeyManagementSortQuery.validateSync(sortObj);
        } catch (error) {
          sortQuery = { created_at: -1 };
        }
      } else {
        sortQuery = { created_at: -1 };
      }

      let finalFilterQuery = {
        api_key_type:"LEGACY",
        ...searchQuery,
        ...filterQuery,
      };

      const finalResponse: any = {
        per_page: LegacyApiKeyQueryValidation.per_page,
        total_page: 0,
        total_result: 0,
        items: [],
        current_page: LegacyApiKeyQueryValidation.page,
      };

      const totalCount = await apiKeyManagementModelSchema.countDocuments(
        finalFilterQuery
      );
      finalResponse.total_result = totalCount;

      finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
      let skip: any =
      LegacyApiKeyQueryValidation.page > 0
          ? (LegacyApiKeyQueryValidation.page - 1) * LegacyApiKeyQueryValidation.per_page
          : 0;
      let AccessManagement = await apiKeyManagementModelSchema
        .find(finalFilterQuery)
        .skip(skip)
        .sort(sortQuery)
        .select("api_key_type name prefix expired_at created_at status user_type rate_limit")
        .limit(finalResponse.per_page);
      finalResponse.items = AccessManagement;

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
