import * as Yup from "yup";

export const UiYupAddonSchema = Yup.object().shape({
  name: Yup.string()
    .required("Addon name is required")
    .max(100, "Maximum 100 characters allowed"),

  code: Yup.string()
    .required("Code is required")
    .max(50, "Maximum 50 characters allowed"),

  description: Yup.string()
    .required("Description is required")
    .max(300, "Maximum 300 characters allowed"),

  category: Yup.string().nullable(),

  billing_type: Yup.string()
    .required("Billing type is required")
    .max(50, "Maximum 50 characters allowed"),

  price_per_month: Yup.number()
    .typeError("Price must be a number")
    .required("Price per month is required")
    .min(0, "Price must be at least 0"),

  default_limit: Yup.number()
    .typeError("Default limit must be a number")
    .required("Default limit is required")
    .min(0, "Default limit must be at least 0"),

  // config: Yup.object().shape({
  //   models: Yup.array()
  //     .of(
  //       Yup.string()
  //         .required("Model name cannot be empty")
  //         .max(100, "Model name too long")
  //     )
  //     .min(1, "At least one model is required"),

  //   features: Yup.object().shape({
  //     code_assistance: Yup.boolean().required(),
  //     image_generation: Yup.boolean().required(),
  //     audio_transcription: Yup.boolean().required(),
  //   }),

  //   max_input_tokens: Yup.number()
  //     .typeError("Must be a number")
  //     .nullable()
  //     .min(0, "Must be >= 0"),

  //   max_output_tokens: Yup.number()
  //     .typeError("Must be a number")
  //     .nullable()
  //     .min(0, "Must be >= 0"),
  // }),

  is_public: Yup.boolean().required(),
});
