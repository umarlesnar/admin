import * as Yup from "yup";

export const UiYupIntegrationSchema = Yup.object().shape({
  image_url: Yup.string().required("logo is a required field"),
  name: Yup.string()
    .min(2, "Too Short!")
    // .matches(/^[a-z-A-Z-0-9_]+$/, "Invalid Format")
    .required()
    .label("name"),
  description: Yup.string().min(10, "Too Short!").label("description"),
  type: Yup.string().required(),
  tutorial_link: Yup.string().label("tutorial"),
  documentation_link: Yup.string().label("tutorial"),
  price: Yup.string().label("price").default("Free"),
  language: Yup.string().required(),
  category: Yup.string().required(),
  link: Yup.string().required(),
  coming_soon: Yup.boolean().label("Coming Soon").default(false),
  status: Yup.string().oneOf(["ENABLE", "DISABLE"]).required().label("Status"),
});
