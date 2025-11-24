import * as Yup from "yup";

export const yupMasterModuleSchema = Yup.object().shape({
  module_id: Yup.string().required("Module Name is required"),
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  category: Yup.string(),
  sort_order: Yup.number().default(0),
  default_permission: Yup.mixed(),
  config: Yup.mixed(),
  is_active: Yup.boolean().default(true),
});

export const yupMasterModuleSortQuery = Yup.object().shape({
  name: Yup.number().oneOf([1, -1]),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
});
