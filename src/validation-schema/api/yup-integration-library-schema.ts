import * as Yup from "yup";

export const yupIntegrationSortQuery = Yup.object().shape({
  name: Yup.number().oneOf([1, -1]).default(1),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
});

export const yupIntegrationLibrarySchema = Yup.object().shape({
  image_url: Yup.string().required(),
  name: Yup.string()
    .min(2, "Too Short!")
    // .matches(/^[a-z-A-Z-0-9_]+$/, "Invalid Format")
    .required()
    .label("name"),
  description: Yup.string().min(10, "Too Short!").label("description"),
  tutorial_link: Yup.string().label("tutorial"),
  documentation_link: Yup.string().label("tutorial"),
  price: Yup.string().label("price").default("Free"),
  language: Yup.string().required(),
  type: Yup.string().required(),
  category: Yup.string().required(),
  link: Yup.string().required(),
  coming_soon: Yup.boolean().label("Coming Soon").default(false),
  status: Yup.string().oneOf(["ENABLE", "DISABLE"]).required().label("Status"),
});

export const yupIntegrationCategorySchema = Yup.object().shape({
  name: Yup.string().min(2, "Too Short!").required().label("name"),
  status: Yup.string().oneOf(["ENABLE", "DISABLE"]).required().label("Status"),
});
