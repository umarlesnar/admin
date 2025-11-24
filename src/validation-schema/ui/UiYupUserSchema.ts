import * as Yup from "yup";

export const UiYupUserSchema = Yup.object({
  profile: Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().nullable(),
  }),
  email: Yup.object().shape({
    email_id: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
  }),
  phone: Yup.object().shape({
    dial_code: Yup.string().required("Dial code is required"),
    mobile_number: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9]{6,15}$/, "Enter a valid mobile number"),
  }),
  auth_credentials: Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  }),
  status: Yup.string()
    .oneOf(["ACTIVE", "DISABLED"], "Invalid status")
    .required("Status is required"),
});
