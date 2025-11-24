import * as Yup from "yup";
const contact_customParamsSchema = Yup.object().shape({
  key: Yup.string(),
  value: Yup.string(),
});
const contact_profileSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
});
export const YupContactAddSchema = Yup.object().shape({
  wa_id: Yup.string().required(),
  profile: contact_profileSchema,
  source: Yup.string().default("SYSTEM"),
  status: Yup.string(),
  custom_params: Yup.array().of(contact_customParamsSchema),
  tags: Yup.array().of(Yup.string()),
  notes: Yup.array().of(Yup.string()),
  enable_broadcast: Yup.boolean().default(false),
  enable_sms: Yup.boolean().default(false),
});
export const yupContactMuplitpleAction = Yup.object().shape({
  ids: Yup.array().of(Yup.string().required()).min(1).required(),
  action: Yup.string().oneOf(["DELETE"]),
});
export const yupContactSortQuery = Yup.object().shape({
  "profile.name": Yup.number().oneOf([1, -1]),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
});

export const yupContactFilterQuerySchema = Yup.object().shape({
  q: Yup.string().max(20).default(""),
  page: Yup.number().positive().default(1),
  per_page: Yup.number().positive().default(50),
  sort: Yup.string().default("{}"),
  filter: Yup.string().default("{}"),
  tag: Yup.string().default(""),
  isIn: Yup.string().oneOf(["in", "not_in"]).default("in"),
  sms: Yup.number().oneOf([0, 1, 2]).default(0),
  broadcast: Yup.number().oneOf([0, 1, 2]).default(0),
});
