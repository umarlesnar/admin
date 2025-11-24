import * as Yup from "yup";

export const yupWalletSchema = Yup.object().shape({
    credit_balance: Yup.string().required("Credit balance is required"),
  });

  export const TransactionSortQuery = Yup.object().shape({
    name: Yup.number().oneOf([1, -1]).default(1),
    created_at: Yup.number().oneOf([1, -1]).default(1),
  });