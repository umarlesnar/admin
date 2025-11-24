import * as Yup from "yup";

export const UiYupPoliciesSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too Short!").required().label("policy name"),
  description: Yup.string().min(10, "Too Short!").label("description"),
  type: Yup.string().required(),
  status: Yup.string().oneOf(["ACTIVE", "DISABLED"]).required().label("Status"),
  limits: Yup.array()
    .of(
      Yup.object().shape({
        key: Yup.string().required("Key is required").label("Key"),
        value: Yup.string().required("Value is required").label("Value"),
      })
    )
    .min(1, "At least one limit is required"),
});
