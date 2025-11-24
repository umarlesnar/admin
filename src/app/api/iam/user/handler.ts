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
import userAccountModelSchema from "@/models/user-account-model-schema";
import { yupUserSortSchema } from "@/validation-schema/api/yup-user-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import partnersModelSchema from "@/models/partners-model-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const query = await getServerSearchParams(req);

      let SystemUserQueryValidation: any = {};
      try {
        SystemUserQueryValidation = yupFilterQuerySchema.validateSync(query);
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

      if (SystemUserQueryValidation.q != "") {
        searchQuery = {
          $or: [
            {
              "profile.first_name": {
                $regex: `.*${SystemUserQueryValidation.q}.*`,
                $options: "i",
              },
            },
            {
              "profile.last_name": {
                $regex: `.*${SystemUserQueryValidation.q}.*`,
                $options: "i",
              },
            },
            {
              "phone.mobile_number": {
                $regex: `.*${SystemUserQueryValidation.q}.*`,
                $options: "i",
              },
            },
          ],
        };
      }

      let filterQuery: any = {};

      if (SystemUserQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
          SystemUserQueryValidation.filter
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

      if (SystemUserQueryValidation.sort != "") {
        const _lstry: any = SystemUserQueryValidation?.sort;
        const sortObj = getJSONObjectFromString(_lstry);

        try {
          sortQuery = yupUserSortSchema.validateSync(sortObj);
        } catch (error) {
          sortQuery = { created_at: -1 };
        }
      } else {
        sortQuery = { created_at: -1 };
      }

      let finalFilterQuery = {
        auth_type: { $eq: 0 },
        ...searchQuery,
        ...filterQuery,
      };

      const finalResponse: any = {
        per_page: SystemUserQueryValidation.per_page,
        total_page: 0,
        total_result: 0,
        items: [],
        current_page: SystemUserQueryValidation.page,
      };

      const totalCount = await userAccountModelSchema.countDocuments(
        finalFilterQuery
      );
      finalResponse.total_result = totalCount;

      finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
      let skip: any =
        SystemUserQueryValidation.page > 0
          ? (SystemUserQueryValidation.page - 1) *
            SystemUserQueryValidation.per_page
          : 0;
      let SystemUser = await userAccountModelSchema
        .find(finalFilterQuery)
        .skip(skip)
        .sort(sortQuery)
        .limit(finalResponse.per_page);
      finalResponse.items = SystemUser;

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
