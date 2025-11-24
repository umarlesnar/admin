import * as Yup from "yup";

export const yupBotFlowLibrarySchema = Yup.object().shape({
   name: Yup.string().required(),
   nodes: Yup.mixed().required(),
   edges: Yup.mixed().required(),
   description: Yup.string(),
   industry: Yup.string().required(),
   use_case: Yup.string().required(),
   status:Yup.string().required().default("ENABLED")
  });

export const yupBotFlowSortQuery = Yup.object().shape({
  name: Yup.number().oneOf([1, -1]).default(1),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
});
