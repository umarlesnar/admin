import * as Yup from "yup";

export const yupUserAccountSchema = Yup.object().shape({
  check_in: Yup.object().shape({
    payment_status: Yup.boolean(),
    wba_embedded_sign_up: Yup.boolean().default(false),
    account_activation_status: Yup.boolean().default(false),
  }),
});
