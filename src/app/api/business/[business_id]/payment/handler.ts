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
import paymentInvoiceSchema from "@/models/payment-invoice-schema";
import { yupPaymentInvoiceSortQuery } from "@/validation-schema/api/yup-payment-shema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    const query = await getServerSearchParams(req);

    let BusinessPaymentQueryValidation: any = {};
    try {
      BusinessPaymentQueryValidation = yupFilterQuerySchema.validateSync(query);
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

    if (BusinessPaymentQueryValidation.q != "") {
      searchQuery = {
        $or: [
          {
            plan: {
              $regex: `.*${BusinessPaymentQueryValidation.q}.*`,
              $options: "i",
            },
          },
          {
            type: {
              $regex: `.*${BusinessPaymentQueryValidation.q}.*`,
              $options: "i",
            },
          },
        ],
      };
    }

    let filterQuery: any = {};

    if (BusinessPaymentQueryValidation.filter !== "") {
      const originalFilterObj = getJSONObjectFromString(
        BusinessPaymentQueryValidation.filter
      );

      const filteredObject = _omitBy(originalFilterObj, _isEmpty);

      filterQuery = filteredObject;
    }

    let sortQuery: any = {};

    if (BusinessPaymentQueryValidation.sort != "") {
      const _lstry: any = BusinessPaymentQueryValidation?.sort;
      const sortObj = getJSONObjectFromString(_lstry);

      try {
        sortQuery = yupPaymentInvoiceSortQuery.validateSync(sortObj);
      } catch (error) {
        sortQuery = { created_at: -1 };
      }
    } else {
      sortQuery = { created_at: -1 };
    }

    let finalFilterQuery = {
      business_id: params.business_id,
      ...searchQuery,
      ...filterQuery,
    };

    const finalResponse: any = {
      per_page: BusinessPaymentQueryValidation.per_page,
      total_page: 0,
      total_result: 0,
      items: [],
      current_page: BusinessPaymentQueryValidation.page,
    };

    const totalCount = await paymentInvoiceSchema.countDocuments(
      finalFilterQuery
    );
    finalResponse.total_result = totalCount;

    finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
    let skip: any =
      BusinessPaymentQueryValidation.page > 0
        ? (BusinessPaymentQueryValidation.page - 1) *
          BusinessPaymentQueryValidation.per_page
        : 0;
    let paymentinvoice = await paymentInvoiceSchema
      .find(finalFilterQuery)
      .skip(skip)
      .sort(sortQuery)
      .limit(finalResponse.per_page);
    finalResponse.items = paymentinvoice;
    return NextResponse.json({
      data: finalResponse,
    });
  });

export default router;
