// src/schemas/workspaceAddonValidation.ts
import * as yup from "yup";
import { Types } from "mongoose";

// Helper function to validate MongoDB ObjectIDs
const isValidObjectId = (value: any) => {
  return Types.ObjectId.isValid(value);
};

export const yupWorkspaceAddonSchema = yup.object({
  workspace_id: yup
    .string()
    .required("Workspace ID is required")
    .test("is-valid-objectid", "Invalid workspace ID format", isValidObjectId),

  addon_id: yup
    .string()
    .required("Addon ID is required")
    .test("is-valid-objectid", "Invalid addon ID format", isValidObjectId),

  enabled: yup.boolean().default(true),

  activated_at: yup.date().default(() => new Date()),

  usage: yup
    .object({
      units_used: yup.number().default(0),
      limitOverride: yup.number().nullable(),
    })
    .nullable()
    .default(() => ({ units_used: 0 })),

  custom_pricing: yup
    .object({
      price_per_month: yup.number().nullable(),
      price_per_unit: yup.number().nullable(),
    })
    .nullable()
    .default(null),
});


export const yupWorkspaceAddonValidationSchema = yup.object().shape({
  workspace_id: yup.string().required("Workspace ID is required"),
  addon_id: yup.string().required("Addon ID is required"),
  enabled: yup.boolean(),
  config: yup.object(), // or define a shape for this if needed
});
