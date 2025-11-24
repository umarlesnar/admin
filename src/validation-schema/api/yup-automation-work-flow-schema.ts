import * as Yup from "yup";

export const yupAutomateWorkFlowSchema = Yup.object().shape({
  name: Yup.string().required(),
  type: Yup.string().nullable(),
  tags: Yup.array().of(Yup.string()),
  platform: Yup.string(),
  description: Yup.string(),
  template_id: Yup.string().nullable(),
  secret_key: Yup.string().nullable(),
  status: Yup.string().oneOf(["ACTIVE", "DISABLE"]),
  start_node_id: Yup.string().nullable(),
  nodes: Yup.array().of(Yup.mixed()),
  edges: Yup.array().of(Yup.mixed()),
});

export const yupAutomationWorkflowSortQuery = Yup.object().shape({
  name: Yup.number().oneOf([1, -1]),
  created_at: Yup.number().oneOf([1, -1]),
});
