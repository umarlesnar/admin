import * as Yup from "yup";

export const yupPoliciesSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      // .matches(/^[a-z-A-Z-0-9_]+$/, "Invalid Format")
      .required()
      .label("name"),
    description: Yup.string().min(10, "Too Short!").label("description"),
    type: Yup.string().required(),
    status: Yup.string().oneOf(["ACTIVE", "DISABLED"]).required().label("Status"),
    limits:Yup.mixed(),
  });
  export const yupPoliciesSortQuery = Yup.object().shape({
    name: Yup.number().oneOf([1, -1]).default(1),
    created_at: Yup.number().oneOf([1, -1]),
    updated_at: Yup.number().oneOf([1, -1]),
  });