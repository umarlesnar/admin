import * as Yup from "yup";

export const yupUserRoleSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  is_default: Yup.boolean().default(false),
  is_system: Yup.boolean().default(false),
  is_visible: Yup.boolean().default(true),
  permissions: Yup.mixed(),
});

export const yupUserRoleSortQuery = Yup.object().shape({
  name: Yup.number().oneOf([1, -1]),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
});
