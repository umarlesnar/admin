import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { AppNextApiRequest } from "@/types/interface";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import partnersModelSchema from "@/models/partners-model-schema";
import { apiMiddlerware } from "@/middleware/apiMiddleware";
import paymentInvoiceSchema from "@/models/payment-invoice-schema";

const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

const router = createEdgeRouter<NextRequest, RequestContext>();
router
  .use(apiMiddlerware)
  .post(async (req: AppNextApiRequest, { params }: any) => {
    try {
      const partner_id = params?.partner_id;

      if (!partner_id || !isValidObjectId(partner_id)) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "Invalid partner ID",
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      const partner = await partnersModelSchema.findById(partner_id);

      if (!partner) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND,
            data: null,
            message: "Partner Not Found",
          },
          { status: SERVER_STATUS_CODE.RESOURCE_NOT_FOUND }
        );
      }

      const body = await req.json();

      const {
        workspace_id,
        plan,
        type = "subscription",
        payment_method = "online",
        currency = "USD",
        total_price,
        total_tax = 0,
        status = "not paid",
        quantity = 1,
        base_price,
        discount = 0,
        invoice_number,
        paid_at,
      } = body;

      // Validate required fields
      if (!workspace_id || !plan || total_price === undefined || base_price === undefined) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "Missing required fields: workspace_id, plan, total_price, base_price",
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      if (!isValidObjectId(workspace_id)) {
        return NextResponse.json(
          {
            status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE,
            data: null,
            message: "Invalid workspace ID",
          },
          { status: SERVER_STATUS_CODE.VALIDATION_ERROR_CODE }
        );
      }

      // Create new invoice
      const invoiceData: any = {
        workspace_id: new Types.ObjectId(workspace_id),
        plan,
        type,
        payment_method,
        currency,
        total_price: Number(total_price),
        total_tax: Number(total_tax),
        status,
        quantity: Number(quantity),
        base_price: Number(base_price),
        discount: Number(discount),
        created_at: new Date(),
        invoice_number
      };

      if (invoice_number) {
        invoiceData.invoice_number = invoice_number;
      }

      if (status === "paid" && paid_at) {
        invoiceData.paid_at = Math.floor(Number(paid_at) / 1000);
      }

      const newInvoice = new paymentInvoiceSchema(invoiceData);
      const savedInvoice = await newInvoice.save();

      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SUCCESS_CODE,
          data: savedInvoice,
          message: "Invoice created successfully",
        },
        { status: SERVER_STATUS_CODE.SUCCESS_CODE }
      );
    } catch (error) {
      console.error("SERVER_ERROR", error);
      return NextResponse.json(
        {
          status: SERVER_STATUS_CODE.SERVER_ERROR,
          data: null,
          message: "Server Error",
        },
        { status: SERVER_STATUS_CODE.SERVER_ERROR }
      );
    }
  });

export default router;
