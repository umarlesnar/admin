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
import transactionModleSchema from "@/models/transaction-modle-schema";
import { TransactionSortQuery } from "@/validation-schema/api/yup-wallet-schema";

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(apiMiddlerware)

  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);
    let TransactionQueryValidation: any = {};
    try {
      TransactionQueryValidation = yupFilterQuerySchema.validateSync(query);
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
      let filterQuery: any = {};

      if (TransactionQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
          TransactionQueryValidation.filter
        );

        const filteredObject = _omitBy(originalFilterObj, _isEmpty);

        filterQuery = filteredObject;
      }
      let sortQuery: any = { created_at: -1 }; // default
      if (TransactionQueryValidation.sort !== "") {
        const sortObj = getJSONObjectFromString(
          TransactionQueryValidation.sort
        );

        // Ensure sort values are numbers
        if (sortObj && typeof sortObj === "object") {
          for (const key in sortObj) {
            sortObj[key] = Number(sortObj[key]);
          }
        }

        try {
          sortQuery = TransactionSortQuery.validateSync(sortObj);
        } catch (error) {
          console.warn("Sort validation failed. Using default sort.");
          sortQuery = { created_at: -1 };
        }
      }

      let finalFilterQuery = {
        workspace_id: params.workspace_id,
        ...filterQuery,
      };

      const finalResponse: any = {
        per_page: TransactionQueryValidation.per_page,
        total_page: 0,
        total_result: 0,
        items: [],
        current_page: TransactionQueryValidation.page,
      };

      const totalCount = await transactionModleSchema.countDocuments(
        finalFilterQuery
      );
      finalResponse.total_result = totalCount;

      finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
      let skip: any =
        TransactionQueryValidation.page > 0
          ? (TransactionQueryValidation.page - 1) *
            TransactionQueryValidation.per_page
          : 0;
      let transaction = await transactionModleSchema
        .find(finalFilterQuery)
        .skip(skip)
        .sort(sortQuery)
        .limit(finalResponse.per_page);

      finalResponse.items = transaction;

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
  });

export default router;
