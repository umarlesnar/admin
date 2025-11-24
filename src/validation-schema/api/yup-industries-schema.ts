import * as Yup from "yup";

export const yupIndustriesSchema = Yup.object().shape({
  name: Yup.string().required(),
   status:Yup.string().required().default("ENABLED")
});

export const yupIndustriesSortQuery = Yup.object().shape({
  name: Yup.number().oneOf([1, -1]).default(1),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
});
