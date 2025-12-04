import * as Yup from "yup";

export const UiYupRenewSubscriptionSchema = Yup.object().shape({
  start_at: Yup.date()
    .required("Start date is required")
    .typeError("Invalid date selected"),
  end_at: Yup.date()
    .required("End date is required")
    .min(Yup.ref('start_at'), "End date must be after start date")
    .typeError("Invalid date selected"),
  payment_status: Yup.string()
    .required("Payment status is required")
    .oneOf(["paid", "pending"], "Invalid status"),
});