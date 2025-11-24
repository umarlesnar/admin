import * as Yup from "yup";

export const yupWebhookEndpointsSchema = Yup.object().shape({
  name: Yup.string().required(),
  url: Yup.string().required(),
  token: Yup.string(),
  events: Yup.array().required(),
  status: Yup.string().required().default("ENABLED"),
});

export const yupWebhookEndpointsSortQuery = Yup.object().shape({
  name: Yup.number().oneOf([1, -1]).default(1),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
});
