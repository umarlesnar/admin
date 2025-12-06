import * as Yup from "yup";

export const yupFilterQuerySchema = Yup.object().shape({
  q: Yup.string().max(100).default(""),
  page: Yup.number().positive().default(1),
  per_page: Yup.number().positive().default(200),
  sort: Yup.string().default("{}"),
  filter: Yup.string().default("{}"),
});

export const yupSortQuery = Yup.object().shape({
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
});

export const yupMultipleActionSchema = Yup.object().shape({
  ids: Yup.array().of(Yup.string().max(25)).required(),
  actions: Yup.string().max(20), // Eg : UPDATE_STATUS
  payload: Yup.mixed(), //Eg : DISABLED / ENABLED / DELETE
});

export const yupSearchQuerySchema = Yup.object().shape({
  q: Yup.string().max(20).default(""),
});

export const yupBroadcastContectFilterQuerySchema = Yup.object().shape({
  q: Yup.string().max(20).default(""),
  page: Yup.number().positive().default(1),
  per_page: Yup.number().positive().default(20),
  sort: Yup.string().default("{}"),
  filter: Yup.string().default("{}"),
  type: Yup.number().default(0),
});
