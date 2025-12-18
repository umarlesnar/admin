import * as Yup from "yup";

export const uiYupLocationSchema = Yup.object().shape({
  flow_replies: Yup.object().shape({
    data: Yup.string()
      .required("Location request text can not be empty.")
      .min(1, "Too Short!")
      .max(1024, "Too Long!"),
  }),
});
