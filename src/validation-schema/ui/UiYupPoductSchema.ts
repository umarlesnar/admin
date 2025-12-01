import * as Yup from "yup";

export const UiYupProductSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  type: Yup.string().required("Type is required"),
  plan_type: Yup.mixed().required("Plan type is required"),
  discount_type: Yup.string().label("Discount Type is required"),
  discount_value: Yup.string().label("Discount Value is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required"),
  is_recommeded: Yup.boolean().default(false),
  feature: Yup.mixed().required("Feature is required"),
  status: Yup.string().required("Status is required"),
  currency_code: Yup.string().required("Currency code is required"),
  r_plan_id: Yup.string(),
  included_modules: Yup.array().of(
    Yup.object().shape({
      module_id: Yup.string().required("Module ID is required"),
      enabled: Yup.boolean().default(true),
      is_visibility: Yup.boolean().default(true),
      config: Yup.object().nullable(),
    })
  ),
  nodes_access: Yup.mixed(),
});

export const UiYupPaugSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  plan_type: Yup.mixed().required("Plan type is required"),
  discount_type: Yup.string().label("Discount Type is required"),
  discount_value: Yup.string().label("Discount Value is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required"),
  feature: Yup.mixed().required("Feature is required"),
  status: Yup.string().required("Status is required"),
  currency_code: Yup.string().required("Currency code is required"),
  included_modules: Yup.array().of(
    Yup.object().shape({
      module_id: Yup.string().required("Module ID is required"),
      enabled: Yup.boolean().default(true),
      is_visibility: Yup.boolean().default(true),
      config: Yup.object().nullable(),
    })
  ),
});