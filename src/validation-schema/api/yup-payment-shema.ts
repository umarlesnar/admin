import { create } from "lodash";
import * as Yup from "yup";

export const yupPaymentInvoiceSchema = Yup.object().shape({
  business_id: Yup.string().required("Business ID is required"),
  plan: Yup.string().required("Plan is required"),
  type: Yup.string().default("subscription"),
  subscription_type: Yup.string().required("Subscription type is required"),
  payment_method: Yup.string().default("online"),
  currency: Yup.string().required("Currency is required"),
  total_price: Yup.number().required("Total price is required").positive("Total price must be positive"),
  total_tax: Yup.number().required("Total tax is required").min(0, "Total tax cannot be negative"),
  user_id: Yup.string().required("User ID is required"),
  order_id: Yup.mixed().required("Order ID is required"),
  reference_id: Yup.mixed().required("Reference ID is required"),
  status: Yup.mixed().required("Status is required"),
  created_at: Yup.date().default(() => new Date()),
  quantity: Yup.number().default(1).min(1, "Quantity must be at least 1"),
  start_from: Yup.number().required("Start from is required"),
  end_to: Yup.number().required("End to is required"),
  paid_at: Yup.number().required("Paid at is required"),
  discount: Yup.number().default(0).min(0, "Discount cannot be negative"),
  base_price: Yup.number().required("Base price is required").positive("Base price must be positive"),
});

export const yupPaymentInvoiceSortQuery = Yup.object().shape({
  created_at: Yup.number().oneOf([1, -1]),
})