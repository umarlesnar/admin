import * as Yup from "yup";

export const UiYupRenewSubscriptionSchema = Yup.object().shape({
  end_at: Yup.date()
    .required("End date is required")
    .min(new Date(), "Date must be in the future")
    .typeError("Invalid date selected"),
});