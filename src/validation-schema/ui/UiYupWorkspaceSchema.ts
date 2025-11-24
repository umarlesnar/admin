import * as Yup from "yup";

export const UiyupWorkspaceSchema = Yup.object().shape({
  name: Yup.string().trim().required("Workspace name is required"),
  plan_name: Yup.string().trim().required("Plan name is required"),
  country: Yup.string().required("Country is required"),
  user_id: Yup.string().required("User is required"),
  status: Yup.string()
    .oneOf(["ACTIVE", "DISABLED"], "Invalid status")
    .required("Status is required"),

  billing_address: Yup.object().shape({
    email_id: Yup.string()
      .trim()
      .email("Invalid email address")
      .required("Email address is required"),
    billing_country: Yup.string().required("Billing country is required"),
    company_name: Yup.string().trim().nullable(), // optional
    address_1: Yup.string()
      .trim()
      .required("Billing address line 1 is required"),
    address_2: Yup.string().trim().nullable(), // optional
    city: Yup.string().trim().required("City is required"),
    state: Yup.string().trim().required("State is required"),
    zip_code: Yup.string().trim().required("Zip code is required"),
  }),
});
