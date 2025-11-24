import { Types } from "mongoose";
import * as Yup from "yup";

export const YupWorkspaceSortQuery = Yup.object().shape({
  name: Yup.number().oneOf([1, -1]).default(1),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
});

export const YupworkspaceSchema = Yup.object().shape({
  name: Yup.string().required(),
  status: Yup.string().required().default("ACTIVE"),
  // type: Yup.string().required("Type is required"),
  // country_code: Yup.string().default("91").matches(/^\d+$/, "Invalid country code"),
  country: Yup.string().default("IN"),
  // default_home_url: Yup.string(),
  // img_repo_id: Yup.string().required("Image Repo ID is required"),
  // owner_account_id: Yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId").required("Owner account ID is required"),
  // bot_user_id: Yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId").required("Bot user ID is required"),
  // policy_id: Yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId").required("Policy ID is required"),
  billing_address: Yup.object().shape({
    email_id: Yup.string().required("Email is required"),
    billing_country: Yup.string().required("Country is required"),
    address_1: Yup.string().required("Address is required"),
    address_2: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zip_code: Yup.string().required("Zip is required"),
  }),
});

export const YupworkspaceOverviewSchema = Yup.object().shape({
  billing_address: Yup.object().shape({
    email_id: Yup.string()
      .email("Enter a valid email address")
      .required("Email is required"),

    phone_number: Yup.string()
      .matches(
        /^(\+?[0-9]{1,3}[-\s]?)?([0-9]{3,15})$/,
        "Enter a valid phone number"
      )
      .required("Phone number is required"),
    billing_country: Yup.string().required("Country is required"),
    address_1: Yup.string().required("Address is required"),
    address_2: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zip_code: Yup.string().required("Zip is required"),
  }),
});
export const YupWorkspaceNotificationInfoSchema = Yup.object().shape({
  email_id: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),

  phone_number: Yup.string()
    .matches(
      /^(\+?[0-9]{1,3}[-\s]?)?([0-9]{3,15})$/,
      "Enter a valid phone number"
    )
    .required("Phone number is required"),
});

// Updated validation schema WITHOUT status
export const WorkspaceUpdateSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .matches(/^[a-zA-Z0-9\s\-_]+$/, "Name contains invalid characters")
    .required("Name is required"),

  industry: Yup.string()
    .oneOf(
      [
        "BEAUTY",
        "APPAREL",
        "EDU",
        "ENTERTAIN",
        "EVENT_PLAN",
        "FINANCE",
        "GROCERY",
        "GOVT",
        "HOTEL",
        "HEALTH",
        "NONPROFIT",
        "PROF_SERVICES",
        "RETAIL",
        "TRAVEL",
        "RESTAURANT",
        "NOT_A_BIZ",
        "OTHER",
      ],
      "Invalid industry"
    ),

  country: Yup.string()
    .length(2, "Country code must be 2 characters")
    .matches(/^[A-Z]{2}$/, "Invalid country code format"),
  phone_code: Yup.string()
    .matches(/^\d{1,4}$/, "Invalid phone code"),
  currency: Yup.string()
    .length(3, "Currency code must be 3 characters")
    .matches(/^[A-Z]{3}$/, "Invalid currency code"),
  country_state: Yup.string().max(50, "State must not exceed 50 characters"),
  timezone: Yup.string()
    .matches(/^[A-Za-z_\/]+$/, "Invalid timezone format"),
  // Marketing fields
  acquisition_source: Yup.string().oneOf(
    [
      "ORGANIC_SEARCH",
      "PAID_SEARCH",
      "SOCIAL_MEDIA",
      "EMAIL_MARKETING",
      "REFERRAL",
      "DIRECT",
      "AFFILIATE",
      "CONTENT_MARKETING",
      "WEBINAR",
      "TRADE_SHOW",
      "COLD_OUTREACH",
      "PARTNER",
      "OTHER",
    ],
    "Invalid acquisition source"
  ),

  utm_campaign: Yup.string()
    .max(100, "Campaign name too long")
    .matches(/^[a-zA-Z0-9\s\-_]*$/, "Invalid campaign name"),

  referral_code: Yup.string()
    .max(50, "Referral code too long")
    .matches(/^[a-zA-Z0-9\-_]*$/, "Invalid referral code"),

  // Customer management fields
  customer_tier: Yup.string().oneOf(
    ["ENTERPRISE", "PREMIUM", "STANDARD", "BASIC"],
    "Invalid customer tier"
  ),

  support_level: Yup.string().oneOf(
    ["DEDICATED_RM", "SHARED_RM", "CUSTOMER_SUCCESS", "STANDARD_SUPPORT"],
    "Invalid support level"
  ),

  relationship_manager_id: Yup.string()
    .nullable()
    .when("support_level", {
      is: (val: string) => val === "DEDICATED_RM" || val === "SHARED_RM",
      then: (schema) =>
        schema.required(
          "Relationship manager is required for this support level"
        ),
      otherwise: (schema) => schema.nullable(),
    })
    .test("is-objectid", "Invalid relationship manager ID", (value) => {
      return !value || Types.ObjectId.isValid(value);
    }),

  support_channels: Yup.object().shape({
    email: Yup.boolean(),
    phone: Yup.boolean(),
    whatsapp: Yup.boolean(),
    chat: Yup.boolean(),
  }),

  response_sla_hours: Yup.number()
    .min(1, "SLA must be at least 1 hour")
    .max(168, "SLA cannot exceed 168 hours"),

  priority_level: Yup.string().oneOf(
    ["LOW", "NORMAL", "HIGH", "CRITICAL"],
    "Invalid priority level"
  ),
  notification: Yup.object().shape({
    email_id: Yup.string().email("Enter a valid email address"),
    phone_number: Yup.string()
    .nullable()
    .transform((value, originalValue) => 
      originalValue === '' ? null : value
    )
  }),
});