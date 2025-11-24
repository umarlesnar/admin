import * as Yup from "yup";

const buttonSchema = Yup.object()
  .shape({
    type: Yup.string()
      .oneOf([
        "QUICK_REPLY",
        "URL",
        "PHONE_NUMBER",
        "OTP",
        "COPY_CODE",
        "FLOW",
        "ORDER_DETAILS",
      ])
      .required("Type is required"),

    text: Yup.string()
      .required("Button text is required")
      .max(25, "Text is too long (max 25 characters)"),

    url: Yup.string().max(200, "URL is too long (max 200 characters)"),

    phone_number: Yup.string()
      .max(20, "Phone number is too long (max 20 characters)")
      .matches(/^[0-9+]*$/, "Invalid phone number format"),

    otp_type: Yup.string().optional(),

    example: Yup.mixed(),

    flow_id: Yup.string(),

    navigate_screen: Yup.string(),
  })
  .test("conditional-validation", "Invalid button schema", function (value) {
    const { type, url, phone_number, example, flow_id, navigate_screen } =
      value;

    // Create an errors object to hold any errors found
    const errors: any = {};

    // Conditional validation for url
    if (type === "URL") {
      if (!url) {
        errors.url = "Website URL is required.";
      } else if (!url.startsWith("https")) {
        errors.url = "Invalid URL. Must start with https.";
      }
    }

    // If the type is not "URL", the url field is not required
    if (type !== "URL" && url) {
      errors.url = "URL should not be provided for this type.";
    }

    // Conditional validation for phone_number
    if (type === "PHONE_NUMBER" && !phone_number) {
      errors.phone_number = "Phone number is required.";
    }

    // Conditional validation for example
    if (type === "COPY_CODE") {
      if (typeof example !== "string") {
        errors.example = "Example is required.";
      } else if (example.length > 15) {
        errors.example = "Example must be at most 15 characters.";
      }
    }
    if (type === "FLOW") {
      if (!flow_id) {
        errors.flow_id = "Flow ID is required.";
      } else if (!navigate_screen) {
        errors.navigate_screen = "Screen ID is required";
      }
    }

    // If errors exist, throw a validation error
    if (Object.keys(errors).length > 0) {
      return this.createError({ path: this.path, message: errors });
    }

    return true; // If all conditions pass
  });

// Header Schema
const headerSchema = Yup.object().shape({
  type: Yup.string().oneOf(["HEADER"]).required("Component type is required"),
  format: Yup.string()
    .oneOf(["TEXT", "IMAGE", "VIDEO", "DOCUMENT", "NONE"])
    .required("Format is required"),
  text: Yup.string()
    .max(60, "Header must be max 60 characters")
    .test(
      "text-validation",
      "Header is required and must be between 5 and 60 characters",
      function (value) {
        const { format } = this.parent; // Access the parent object
        // Validate only if format is 'TEXT'
        if (format === "TEXT") {
          // Check if value is not provided or doesn't meet length requirements
          if (!value || value.length < 5 || value.length > 60) {
            return this.createError({
              message:
                "Header is required and must be between 5 to 60 characters",
            });
          }
        }
        return true; // If format is not 'TEXT', pass the validation
      }
    ),
});

// Body Schema
const bodySchema = Yup.object().shape({
  type: Yup.string().oneOf(["BODY"]).required("Component type is required"),
  text: Yup.string()
    .required("Body is required")
    .max(1024, "Body must be max 1024 characters"),
});

// Footer Schema
const footerSchema = Yup.object().shape({
  type: Yup.string().oneOf(["FOOTER"]).required("Component type is required"),
  text: Yup.string().max(60, "Footer must be max 60 characters"),
});

// Buttons Schema
const buttonsSchema = Yup.object().shape({
  type: Yup.string().oneOf(["BUTTONS"]).required("Component type is required"),
  buttons: Yup.array().of(buttonSchema),
});

// Main Template Schema
export const uiTemplateSchema = Yup.object().shape({
  sms: Yup.object().shape({
    template_id: Yup.string(),
    body: Yup.string().max(1024, "To Long"),
  }),
  category: Yup.string()
    .oneOf(["TRANSACTIONAL", "MARKETING", "OTP", "AUTHENTICATION", "UTILITY"])
    .required("Category is required"),
  language: Yup.string().required("Language is required"),
  name: Yup.string()
    .min(2, "Name is too short (min 2 characters)")
    .max(512, "Name is too long (max 512 characters)")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Name can only contain alphanumeric characters and underscores"
    )
    .required("Name is required"),
  components: Yup.array()
    .of(
      Yup.lazy((value) => {
        // Use the type to determine which schema to use
        switch (value.type) {
          case "HEADER":
            return headerSchema;
          case "BODY":
            return bodySchema;
          case "FOOTER":
            return footerSchema;
          case "BUTTONS":
            return buttonsSchema;
          default:
            return Yup.object().notRequired(); // Or throw an error
        }
      })
    )
    .min(1, "At least one component is required")
    .required(),
});

export const uiTemplateSmsSchema = Yup.object().shape({
  template_id: Yup.string().required(),
  body: Yup.string().max(1024, "To Long").required(),
});

export const uiTemplateCreateSchema = Yup.object().shape({
  category: Yup.string()
    .oneOf(["TRANSACTIONAL", "MARKETING", "OTP", "AUTHENTICATION", "UTILITY"])
    .required("Category is required"),
  language: Yup.string().required("Language is required"),
  industry_id: Yup.string().required("Industry is required"),
  use_case_id: Yup.string().required("Use case is required"),
  name: Yup.string()
    .min(2, "Name is too short (min 2 characters)")
    .max(512, "Name is too long (max 512 characters)")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Name can only contain alphanumeric characters and underscores"
    )
    .required("Name is required"),
});
