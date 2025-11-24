import * as Yup from "yup";

export const UiYupModuleSchema = Yup.object().shape({
    module_id: Yup.string().required("module name is required"),
    name: Yup.string().required("name is required"),
    description: Yup.string(),
    category: Yup.string(),
    sort_order: Yup.number().default(0),
    default_permission: Yup.mixed(),
    config: Yup.mixed(),
    is_active: Yup.boolean().default(true),
});
