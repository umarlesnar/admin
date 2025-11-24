import * as Yup from "yup";

export const UiyupAlertMessageSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  body: Yup.string().required("Body is required"),
  background_color: Yup.string().required("Background color is required"),
  ios_link: Yup.string().url("Must be a valid URL"),
  android_link: Yup.string().url("Must be a valid URL"),
  text_color: Yup.string().required("Text color is required"),
  status:Yup.string().required().default("ENABLED") 
});
