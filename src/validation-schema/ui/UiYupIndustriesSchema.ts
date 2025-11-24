import * as Yup from "yup";

export const UiYupIndustriesSchema = Yup.object().shape({
  name: Yup.string().required(),
  status: Yup.string().oneOf(["ENABLE", "DISABLE"]).required().label("Status"),
});
export const UiYupUsecaseSchema = Yup.object().shape({
  name: Yup.string().required(),
  status: Yup.string().oneOf(["ENABLE", "DISABLE"]).required().label("Status"),
});
