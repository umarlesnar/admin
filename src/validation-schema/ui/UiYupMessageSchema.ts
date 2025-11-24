import * as Yup from "yup";

export const uiYupMessageFlowTypeSchema = Yup.object().shape({
  data: Yup.string().required().label("message"),
});
