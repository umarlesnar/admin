export const SERVER_STATUS_CODE = {
  SUCCESS_CODE: 200,
  VALIDATION_ERROR_CODE: 422,
  PERMISSION_ERROR_CODE: 403,
  SERVER_ERROR: 500,
  RESOURCE_NOT_FOUND: 404,
  CONTENT_NOT_FOUND: 204,
  UNAUTHORIZED_ACCESS_CODE: 401,
};

export const FB_ALLOWED_FILE_FORMAT = [
  "audio/aac",
  "audio/mp4",
  "audio/mpeg",
  "audio/amr",
  "audio/ogg",
  "text/plain",
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "video/mp4",
  "video/3gp",
  "image/webp",
  "application/json",
];

export const chatgptModels = [
  { name: "GPT-3.5", value: "gpt-3.5-turbo-0125" },
  { name: "GPT-4", value: "gpt-4" },
  { name: "GPT-4 Turbo", value: "gpt-4-turbo" },
];

export const FB_AUDIO_EXT = [
  "audio/aac",
  "audio/mp4",
  "audio/mpeg",
  "audio/amr",
  "audio/ogg",
];

export const variableOptions = [
  {
    label: "Recipient",
    variables: [
      { name: "Name", value: "@SYSTEM_PROFILE_NAME" },
      { name: "Phone Number", value: "@wa_id" },
      { name: "User Input", value: "@USER_MESSAGE_INPUT" },
    ],
  },
  {
    label: "AI Context",
    variables: [{ name: "ChatGPT Response", value: "@CHATGPT_RESPONSE" }],
  },
];

export const FB_DOCUMENT_EXT = [
  "text/plain",
  "image/svg+xml",
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
export const FB_IMAGE_EXT = ["image/jpeg", "image/png"];
export const FB_VIDEO_EXT = ["video/mp4", "video/3gp"];
export const FB_STICKER_EXT = ["image/webp"];

export const OPERATOR_ROLES = [
  { id: "ADMINISTRATOR", name: "Administrator" },
  { id: "TEMPLATE_MANAGER", name: "Template manager" },
  { id: "BORADCAST_MANAGER", name: "Broadcast manager" },
  { id: "CONTACT_MANAGER", name: "Contact Manager" },
  { id: "OPERATOR", name: "Operator" },
  { id: "AUTOMATION_MANAGER", name: "Automation Manager" },
];

export const PLATFORM = {
  MOBILE: "MOBILE",
  DESKTOP: "DESKTOP",
};

export const TICKET_STATUS_CODE = {
  OPEN: "open",
  PENDING: "pending",
  SOLVED: "solved",
  UNREAD: "unread",
  UNASSIGNED: "unassigned",
  BROADCAST: "broadcast",
};
export const ACTION_NAME_FROM_KEY = {
  1: "Text",
  2: "Flow",
};

//rejected
export const TEMPLATE_STATUS = {
  REJECTED: "REJECTED",
  PENDING: "PENDING",
  DRAFT: "DRAFT",
  APPROVED: "APPROVED",
};

export const TEMPLATE_CATEGORY = [
  { value: "AUTHENTICATION", name: "AUTHENTICATION" },
  { value: "MARKETING", name: "MARKETING" },
  { value: "UTILITY", name: "UTILITY" },
];

export const TEMPLATE_LANGUAGES = [
  { value: "bn", name: "BENGALI" },
  { value: "en_US", name: "ENGLISH US" },
  { value: "en", name: "ENGLISH" },
  { value: "gu", name: "GUJARATI" },
  { value: "hi", name: "HINDI" },
  { value: "kn", name: "KANNADA" },
  { value: "ml", name: "MALAYALAM" },
  { value: "mr", name: "MARATHI" },
  { value: "pa", name: "PUNJABI" },
  { value: "ta", name: "TAMIL" },
  { value: "te", name: "TELUGU" },
];

export const options = [
  {
    name: "automotive",
    value: "AUTOMOTIVE",
  },
  {
    name: "Beauty,spa and salon",
    value: "BEAUTY, SPA AND SALON",
  },
  {
    name: "Clothing",
    value: "CLOTHING",
  },
  {
    name: "Education",
    value: "EDUCATION",
  },
  {
    name: "Entertaiment",
    value: "ENTERTAIMENT",
  },
  {
    name: "Event planning and service",
    value: "EVENT PLANNING AND SERVICE",
  },
  {
    name: "Finance and banking",
    value: "FINANCE AND BANKING",
  },

  {
    name: "Food and groceries",
    value: "FOOD AND GROCERIES",
  },
  {
    name: "Public service",
    value: "PUBLIC SERVICE",
  },
  {
    name: "Hodel and lodging",
    value: "HOTEL AND LODGING",
  },
  {
    name: "Medical and health",
    value: "MEDICAL AND HEALTH",
  },
  {
    name: "Charity",
    value: "CHARITY",
  },
  {
    name: "Professional services",
    value: "PROF_SERVICES",
  },
  {
    name: "Shopping and retail",
    value: "SHOPPING AND RETAIL",
  },
  {
    name: "Travel and transportation",
    value: "TRAVEL AND TRANSPORTATION",
  },
  {
    name: "Restaurant",
    value: "RESTAURANT",
  },
  {
    name: "other",
    value: "OTHER",
  },
];

export const defaultSettingsTemplate = [
  {
    setting_category: "SYSTEM",
    setting_key: "razorpay_secret_key",
    setting_value: "",
    value_type: "string",
    is_private: true,
    is_core_setting: true,
  },
  {
    setting_category: "SYSTEM",
    setting_key: "razorpay_endpoint_key",
    setting_value: "",
    value_type: "string",
    is_private: true,
    is_core_setting: true,
  },
  {
    setting_category: "SYSTEM",
    setting_key: "razorpay_key_id",
    setting_value: "",
    value_type: "string",
    is_private: true,
    is_core_setting: true,
  },
  {
    setting_category: "SYSTEM",
    setting_key: "facebook_app_id",
    setting_value: "",
    value_type: "string",
    is_private: true,
    is_core_setting: true,
  },
  {
    setting_category: "SYSTEM",
    setting_key: "new_registration_subscription",
    setting_value: false,
    value_type: "boolean",
    is_private: true,
    is_core_setting: true,
  },
  {
    setting_category: "SYSTEM",
    setting_key: "discount_percentage_",
    setting_value: 0,
    value_type: "number",
    is_private: true,
    is_core_setting: true,
  },
  {
    setting_category: "SYSTEM",
    setting_key: "google_captcha",
    setting_value: false,
    value_type: "boolean",
    is_private: true,
    is_core_setting: true,
  },
  {
    setting_category: "SYSTEM",
    setting_key: "google_site_key",
    setting_value: "",
    value_type: "string",
    is_private: true,
    is_core_setting: true,
  },
  {
    setting_category: "SYSTEM",
    setting_key: "google_site_secret",
    setting_value: "",
    value_type: "string",
    is_private: true,
    is_core_setting: true,
  },
  {
    setting_category: "SYSTEM",
    setting_key: "system_token",
    setting_value: {
      token_data: "",
      iv: "",
    },
    value_type: "object",
    is_private: true,
    is_core_setting: true,
  },
  {
    setting_category: "SYSTEM",
    setting_key: "websocket_endpoint",
    setting_value: "",
    value_type: "string",
    is_private: true,
    is_core_setting: true,
  },
  {
    setting_category: "SYSTEM",
    setting_key: "pay_as_you_go",
    setting_value: {
      is_enable: true,
      amount: 0,
      tax_percentage: 0,
    },
    value_type: "object",
    is_private: true,
    is_core_setting: true,
  },
  {
    setting_category: "SYSTEM",
    setting_key: "brand",
    setting_value: {
      name: "",
      logo_with_name: "",
      logo: "",
    },
    value_type: "object",
    is_private: true,
    is_core_setting: true,
  },
  {
    setting_category: "SYSTEM",
    setting_key: "google_auth",
    setting_value: {
      is_enable: false,
    },
    value_type: "object",
    is_private: true,
    is_core_setting: true,
  },
];
