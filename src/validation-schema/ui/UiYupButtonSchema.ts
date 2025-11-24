import * as Yup from "yup";

export const uiYupButtonSchema = Yup.object().shape({
  flow_replies: Yup.object().shape({
    data: Yup.string()
      .required("Body text can not be empty.")
      .min(1, "Too Short!")
      .max(1024, "Too Long!"),
  }),
  expected_answers: Yup.array().of(
    Yup.object().shape({
      expected_input: Yup.string()
        .required("Button text can not be empty.")
        .min(1, "Too Short!")
        .max(20, "Too Long!"),
    })
  ),
});
