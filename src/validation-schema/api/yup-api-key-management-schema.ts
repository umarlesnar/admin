import * as Yup from "yup";

export const yupApiKeyManagementSchema = Yup.object().shape({
  user_id: Yup.string().required("User ID is required"),
  business_id: Yup.string(),
  workspace_id: Yup.string(),
  user_type: Yup.string().required("User type is required"),
  expired_date: Yup.date(),
  hashed_token: Yup.string().required("Hashed token is required"),
  name: Yup.string().required("Name is required"),
  prefix: Yup.string(),
  rate_limit: Yup.mixed(),
  scope: Yup.mixed(),
  signature_token: Yup.string().required("Signature token is required"),
  status: Yup.string(),
  usage_count: Yup.number().default(0),
  created_by: Yup.string(),
});

export const yupApiKeyManagementSortQuery = Yup.object().shape({
  name: Yup.number().oneOf([1, -1]),
  created_at: Yup.number().oneOf([1, -1]),
});
