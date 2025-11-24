import * as Yup from "yup";

export const uiYupCatalogueSchema = Yup.object().shape({
  body: Yup.string().required().label("Body"),
  footer: Yup.string().label("Footer"),
});
