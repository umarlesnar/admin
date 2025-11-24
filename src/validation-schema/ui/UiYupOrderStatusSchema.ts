import * as Yup from "yup";

export const UiYupOrderStatusSchema = Yup.object().shape({
  wa_id: Yup.string().required("Number is a required field"),
  body: Yup.string().required("Body is a required field"),
  status: Yup.string().required("Status is a required field"),
  reference_id: Yup.string().required("Reference Id is a required field"),
});
