import * as yup from "yup";

export const yupVerifyCodeSchema = yup.object({
  code: yup.string().required("code is required"),
});
