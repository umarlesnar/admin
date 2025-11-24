import * as Yup from "yup";

export const yupPartnersSchema = Yup.object().shape({
  name: Yup.string().required(),
  domain: Yup.string().required(),
  first_name: Yup.string().required(),
  last_name: Yup.string(),
  email: Yup.object().shape({
    email_id: Yup.string().required(),
  }),
  phone: Yup.object().shape({
    dial_code: Yup.string().required(),
    mobile_number: Yup.string().required(),
  }),
  password: Yup.string().required(),
});
