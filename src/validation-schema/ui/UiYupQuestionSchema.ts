import * as Yup from "yup";

export const uiYupQuestionSchema = Yup.object().shape({
  flow_replies: Yup.object().shape({
    data: Yup.string()
      .required("Question text can not be empty.")
      .min(1, "Too Short!")
      .max(1024, "Too Long!"),
  }),
});
