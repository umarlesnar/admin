import * as Yup from "yup";

export const yupTemplateLibrarySchema = Yup.object().shape({
  name: Yup.string().required(),
  language: Yup.string().required(),
  category: Yup.string().required(),
  components: Yup.mixed().required(),
  industry_id: Yup.string(),
  use_case_id: Yup.string(),
});


export const yupTemplateSortQuery = Yup.object().shape({
  name: Yup.number().oneOf([1, -1]).default(1),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
});


// ---------------- BUTTON SCHEMA ----------------
const buttonSchema = Yup.object()
  .shape({
    type: Yup.string()
      .oneOf([
        "QUICK_REPLY",
        "quick_reply",
        "URL",
        "url",
        "PHONE_NUMBER",
        "phone_number",
        "OTP",
        "otp",
        "COPY_CODE",
        "copy_code",
        "FLOW",
        "flow",
        "ORDER_DETAILS",
        "order_details",
      ])
      .required("Type is required"),

    text: Yup.string()
      .max(25, "Text is too long (max 25 characters)")
      .test("text-required", "Button text is required", function (value) {
        const { type } = this.parent;
        if (type?.toLowerCase() === "otp") {
          return true; // text is optional for OTP buttons
        }
        return !!value; // text is required for all other button types
      }),

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

    const errors: any = {};

    if (type === "URL") {
      if (!url) {
        errors.url = "Website URL is required.";
      } else if (!url.startsWith("https")) {
        errors.url = "Invalid URL. Must start with https.";
      }
    }
    if (type.toLowerCase() !== "url" && url) {
      errors.url = "URL should not be provided for this type.";
    }
    if (type === "PHONE_NUMBER" && !phone_number) {
      errors.phone_number = "Phone number is required.";
    }
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

    if (Object.keys(errors).length > 0) {
      return this.createError({ path: this.path, message: errors });
    }
    return true;
  });

// ---------------- COMPONENT SCHEMAS ----------------
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
        const { format } = this.parent;
        if (format === "TEXT") {
          if (!value || value.length < 5 || value.length > 60) {
            return this.createError({
              message:
                "Header is required and must be between 5 to 60 characters",
            });
          }
        }
        return true;
      }
    ),
  example: Yup.object().shape({
    header_text: Yup.array()
      .of(Yup.string().trim().required("Header sample content is required"))
      .nullable(),
  }),
});

const bodySchema = Yup.object().shape({
  type: Yup.string().oneOf(["BODY"]).required("Component type is required"),
  text: Yup.string()
    .required("Body is required")
    .max(1024, "Body must be max 1024 characters"),
  example: Yup.object().shape({
    body_text: Yup.array()
      .of(Yup.string().trim().required("Body sample content is required"))
      .nullable(),
  }),
});

const footerSchema = Yup.object().shape({
  type: Yup.string().oneOf(["FOOTER"]).required("Component type is required"),
  text: Yup.string().max(60, "Footer must be max 60 characters"),
});

const buttonsSchema = Yup.object().shape({
  type: Yup.string().oneOf(["BUTTONS"]).required("Component type is required"),
  buttons: Yup.array().of(buttonSchema),
});

// ---------------- CAROUSEL SCHEMAS ----------------
const carouselHeaderSchema = Yup.object().shape({
  type: Yup.string().oneOf(["header"]).required("Header type is required"),
  format: Yup.string()
    .oneOf(["image", "video"]),
  example: Yup.object().shape({
    header_handle: Yup.array()
      .of(Yup.string().required("Header handle is required"))
      .min(1, "At least one header handle is required")
      .required(),
  }),
  example1: Yup.object().shape({
    header_handle: Yup.array().of(Yup.string().url("Must be a valid URL")),
  }),
});

const carouselBodySchema = Yup.object().shape({
  type: Yup.string().oneOf(["body"]).required("Body type is required"),
  text: Yup.string()
    .required("Body text is required")
    .max(160, "Body must be max 160 characters"),
});

const carouselButtonsSchema = Yup.object().shape({
  type: Yup.string().oneOf(["buttons"]).required("Buttons type is required"),
  buttons: Yup.array()
    .of(buttonSchema)
    .max(2, "Maximum 2 buttons allowed")
    .required("At least one button is required"),
});

const carouselCardSchema = Yup.object().shape({
  components: Yup.array()
    .of(
      Yup.lazy((component) => {
        switch (component.type) {
          case "header":
            return carouselHeaderSchema;
          case "body":
            return carouselBodySchema;
          case "buttons":
            return carouselButtonsSchema;
          default:
            return Yup.object().notRequired();
        }
      })
    )
    .min(1, "Each card must have at least one component")
    .required(),
});

const carouselSchema = Yup.object().shape({
  type: Yup.string().oneOf(["carousel"]).required("Carousel type is required"),
  cards: Yup.array()
    .of(carouselCardSchema)
    .max(10, "Maximum 10 cards allowed")
    .min(1, "At least one card is required")
    .required(),
});

// ---------------- MAIN TEMPLATE SCHEMAS ----------------
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
        switch (value.type) {
          case "HEADER":
            return headerSchema;
          case "BODY":
            return bodySchema;
          case "FOOTER":
            return footerSchema;
          case "BUTTONS":
            return buttonsSchema;
          case "carousel":
            return carouselSchema;
          default:
            return Yup.object().notRequired();
        }
      })
    )
    .min(1, "At least one component is required")
    .required(),
});

// ---------------- OTHER TEMPLATES ----------------
export const uiTemplateSmsSchema = Yup.object().shape({
  template_id: Yup.string().required(),
  body: Yup.string().max(1024, "To Long").required(),
});

export const uiTemplateCreateSchema = Yup.object().shape({
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
  components: Yup.array().of(
    Yup.lazy((component) => {
      if (component?.type === "HEADER") {
        return headerSchema;
      }
      if (component?.type === "BODY") {
        return bodySchema;
      }
      if (component?.type === "FOOTER") {
        return footerSchema;
      }
      if (component?.type === "BUTTONS") {
        return buttonsSchema;
      }
      if (component?.type === "carousel") {
        return carouselSchema;
      }
      return Yup.object().shape({
        type: Yup.string().required(),
        text: Yup.string().nullable(),
      });
    })
  ),
});

export const variablesSchema = Yup.object().shape({
  name: Yup.string().required(),
  value: Yup.string().required(),
});

export const uiChatTemplateSchema = Yup.object().shape({
  template_name: Yup.string().required(),
  variables: Yup.array(variablesSchema),
});
