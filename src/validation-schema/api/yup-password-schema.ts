import * as Yup from "yup";


export const yupPasswordResetSchema = Yup.object().shape({
    new_password: Yup.string()
      .min(6, "Sorry, your password must be more than 6 characters long!")
      .max(30, "Sorry, your password must not be more than 30 characters long!")
      .required(),
    confirm_password: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("new_password")], "Passwords must match"),
  });