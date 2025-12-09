import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import _omit from "lodash/omit";
import paymentInvoiceSchema from "@/models/payment-invoice-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import { yupFilterQuerySchema } from "@/validation-schema/api/yup-common-schema";
import { getServerSearchParams } from "@/lib/utils/get-server-search-params";
import { yupToFormErrorsServer } from "@/lib/utils/formik/yup-to-form-errors";
import { getJSONObjectFromString } from "@/lib/utils/get-json-object-from-string";
import _omitBy from "lodash/omitBy";
import _isEmpty from "lodash/isEmpty";

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .get(async (req: AppNextApiRequest, { params }: any) => {
    // ... (Existing GET Logic kept as is) ...
    const query = await getServerSearchParams(req);
    let paymentInvoiceQueryValidation: any = {};
    try {
      paymentInvoiceQueryValidation = yupFilterQuerySchema.validateSync(query);
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

      if (paymentInvoiceQueryValidation.q !== "") {
        searchQuery = {
          $or: [
            {
              plan: {
                $regex: `.*${paymentInvoiceQueryValidation.q}.*`,
                $options: "i",
              },
            },
            {
              type: {
                $regex: `.*${paymentInvoiceQueryValidation.q}.*`,
                $options: "i",
              },
            },
          ],
        };
      }

      let filterQuery: any = {};

      if (paymentInvoiceQueryValidation.filter !== "") {
        const originalFilterObj = getJSONObjectFromString(
          paymentInvoiceQueryValidation.filter
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
        per_page: paymentInvoiceQueryValidation.per_page,
        total_page: 0,
        total_result: 0,
        items: [],
        current_page: paymentInvoiceQueryValidation.page,
      };

      const totalCount = await paymentInvoiceSchema.countDocuments(
        finalFilterQuery
      );
      finalResponse.total_result = totalCount;

      finalResponse.total_page = Math.ceil(totalCount / finalResponse.per_page);
      let skip: any =
        paymentInvoiceQueryValidation.page > 0
          ? (paymentInvoiceQueryValidation.page - 1) *
            paymentInvoiceQueryValidation.per_page
          : 0;
      let paymentInvoice = await paymentInvoiceSchema
        .find(finalFilterQuery)
        .skip(skip)
        .sort(sortQuery)
        .limit(finalResponse.per_page);

      finalResponse.items = paymentInvoice;

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
  .put(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const body = await req.json();
      const { invoice_id, payment_method, reference_id, paid_at } = body;

      if (!invoice_id || typeof invoice_id !== "string") {
        return NextResponse.json(
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE, message: "Invoice ID is required" },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      const updatedInvoice = await paymentInvoiceSchema.findOneAndUpdate(
        { _id: invoice_id, workspace_id: params.workspace_id },
        {
          status: "paid",
          payment_method,
          reference_id,
          paid_at,
        },
        { new: true }
      );

      if (!updatedInvoice) {
        return NextResponse.json(
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND, message: "Invoice not found" },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      return NextResponse.json({
        status: SERVER_STATUS_CODE.SUCCESS_CODE,
        data: updatedInvoice,
        message: "Invoice marked as paid successfully",
      });
    } catch (error) {
      console.error("Invoice update error:", error);
      return NextResponse.json({
        status: SERVER_STATUS_CODE.SERVER_ERROR,
        message: "Server Error",
      });
    }
  });

export default router;