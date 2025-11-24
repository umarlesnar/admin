import * as Yup from "yup";

export const UiYupConditionSchema = Yup.object().shape({
  flow_node_conditions: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required("ID is required"),
      flow_condition_type: Yup.number().required(
        "Flow condition type is required"
      ),
      variable: Yup.string()
        .required("Variable is required")
        .matches(/^@/, "Variable must start with @"),
      value: Yup.string().required("Value is required"),
    })
  ),
});
