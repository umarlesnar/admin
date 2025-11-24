import * as Yup from "yup";

export const UiYupSwitchConditionSchema = Yup.object().shape({
  input_variable: Yup.string()
    .required()
    .matches(/^@/, "Variable must start with @")
    .label("variable"),
  switch_conditions: Yup.array().of(
    Yup.object().shape({
      text: Yup.string().required().label("value"),
    })
  ),
});
