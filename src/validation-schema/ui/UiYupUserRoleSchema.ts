import * as Yup from "yup";

export const UiyupUserRoleSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  is_visible: Yup.boolean().default(true),
  permissions: Yup.mixed(),
});
