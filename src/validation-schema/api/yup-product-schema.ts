import * as Yup from "yup";

export const yupProductSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  type: Yup.string(),
  plan_type: Yup.mixed().required("Plan type is required"),
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
      module_id: Yup.string().required(),
      enabled: Yup.boolean(),
      is_visibility: Yup.boolean(),
      config: Yup.mixed(),
    })
  ),
  nodes_access: Yup.mixed(),
});

export const yupProductSortQuery = Yup.object().shape({
  name: Yup.number().oneOf([1, -1]).default(1),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
});

export const yupNodeAccessSchema = Yup.object().shape({
  nodes_access: Yup.mixed(),
  current_plan: Yup.string(),
});
