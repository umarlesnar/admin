import * as Yup from "yup";

export const UiyupWalletSchema = Yup.object().shape({
    credit_balance: Yup.string().required("Credit balance is required"),
    wallet_type: Yup
    .string()
    .oneOf(["CREDIT", "DEBIT"], "Invalid wallet type")
    .required("Wallet type is required"),
  });