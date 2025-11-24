import * as Yup from "yup";

export const yupSettingsSchema = Yup.object().shape({
  setting_category: Yup.string().default("SYSTEM"),
  setting_key: Yup.string().required(),
  setting_value: Yup.mixed().required(),
  value_type: Yup.mixed().required(),
  is_private: Yup.boolean().default(true),
  is_core_setting: Yup.boolean().default(true),
});
export const yupSettingsSchemaUpdate = Yup.object().shape({
  domain: Yup.string().required(),
  partner_id: Yup.string().required(),
  setting_value: Yup.mixed().required(),
  value_type: Yup.mixed().required(),
  is_private: Yup.boolean().default(true),
  is_core_setting: Yup.boolean().default(true),
});

// const yupSettingsSchema = yup.object().shape({
//     setting_category: yup.string().required(),
//     setting_key: yup.string().required(),
//     setting_value: yup.lazy((_, { parent }) => {
//       switch (parent.value_type) {
//         case "boolean":
//           return yup.boolean();
//         case "string":
//           return yup.string();
//         case "number":
//           return yup.number();
//         case "object":
//           return yup.object();
//         case "array":
//           return yup.array();
//         default:
//           return yup.mixed().nullable();
//       }
//     }),
//     value_type: yup
//       .mixed()
//       .oneOf(["boolean", "string", "number", "object", "array"])
//       .required(),
//     is_private: yup.boolean().required(),
//     is_core_setting: yup.boolean().required(),
//   });

//   export default yupSettingsSchema;

// {
//     "setting_category":"SYSTEM",
//     "setting_key":"google_captcha",
//     "setting_value":"",
//     "value_type":"boolen | string | number | object | array",
//     "is_private":true,
//     "is_core_setting":true
// }
