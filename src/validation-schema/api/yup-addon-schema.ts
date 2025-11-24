import * as yup from "yup";

export const yupAddonSchema = yup.object({
  code: yup.string().required("Code is required"),
  name: yup.string().required("Name is required"),
  description: yup.string(),
  category: yup
    .string()
    .oneOf(["AI", "Storage", "Integration", "User"], "Invalid category")
    .required("Category is required"),
  billing_type: yup
    .string()
    .oneOf(["flat", "usage", "free"], "Invalid billing type")
    .required("Billing type is required"),
  price_per_month: yup.number().when("billing_type", {
    is: "flat",
    then: (schema) =>
      schema.required("Price per month is required for flat billing"),
  }),
  // price_per_unit: yup.number().when("billing_type", {
  //   is: "usage",
  //   then: (schema) =>
  //     schema.required("Price per unit is required for usage billing"),
  // }),
  // unit_name: yup.string().when("billing_type", {
  //   is: "usage",
  //   then: (schema) =>
  //     schema.required("Unit name is required for usage billing"),
  // }),
  default_limit: yup.number(),
  config: yup.mixed(),
  is_public: yup.boolean().default(true),
});
