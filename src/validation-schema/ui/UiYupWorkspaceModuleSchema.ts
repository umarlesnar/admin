import * as Yup from "yup";

export const UiyupWorkspaceModuleSchema = Yup.object().shape({
module_id: Yup.string().required('module name is required'),
  enabled: Yup.boolean().default(true),
  source: Yup.string().required('source is required'),
  config: Yup.mixed(),
  expired_at: Yup.date(),
});

