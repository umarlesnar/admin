import * as Yup from "yup";

export const UiYupPartnerSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  domain: Yup.string().trim().required("Domain is required"),
  first_name: Yup.string().trim().required("First name is required"), // fixed typo: 'fist_name' -> 'first_name'
  last_name: Yup.string().trim(),

  email: Yup.object({
    email_id: Yup.string()
      .trim()
      .email("Invalid email format")
      .required("Email is a required field"),
  }),

  phone: Yup.object({
    dial_code: Yup.string().trim().required("Country code is a required field"), // fixed typo: 'dail_code' -> 'dial_code'
    mobile_number: Yup.string()
      .trim()
      .required("Mobile number is a required field"),
  }),

  password: Yup.string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .required("Password is a required field"),
});
