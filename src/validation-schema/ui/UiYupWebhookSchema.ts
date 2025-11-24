import * as Yup from "yup";

export const UiYupWebhookSchema = Yup.object().shape({
  url: Yup.string().required().label("Url"),
  response_variable: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().matches(
        /^[a-zA-Z0-9-@]+$/,
        "* This field cannot contain white space and special character"
      ),
    })
  ),
  test_variable: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().matches(
        /^[a-zA-Z0-9-@]+$/,
        "* This field cannot contain white space and special character"
      ),
    })
  ),
  headers: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().matches(
        /^[a-zA-Z0-9-@]+$/,
        "* This field cannot contain white space and special character"
      ),
    })
  ),
});

export const UiYupWebhooksSchema = Yup.object().shape({
  // token: Yup.string().required(),
  name: Yup.string().required(),
  events: Yup.array().of(Yup.string()).min(1, "At least one event is required"),
  url :Yup.string().required("Enter the Valid Url"),
  status: Yup.string().required(),
})
