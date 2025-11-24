import * as Yup from "yup";

export const yupWorkspaceModuleSchema = Yup.object().shape({
  enabled: Yup.boolean().default(true),
  is_visibility: Yup.boolean().default(false),
});

