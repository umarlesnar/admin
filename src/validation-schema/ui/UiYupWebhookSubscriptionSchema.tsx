import * as Yup from "yup";
import axios from "axios";

export const UiWebhookSubscriptionSchema = Yup.object().shape({
  name: Yup.string().required(),
  url: Yup.string().required(),
  // url: Yup.string()
  //   .matches(/^https:\/\/.+$/, "URL must start with https://")
  //   .url("Invalid URL format")
  //   .required()
  //   .test("check-dns", "URL is not reachable", async (value) => {
  //     if (!value) return false;

  //     try {
  //       await axios.get(value, { timeout: 5000 });
  //       return true;
  //     } catch (error) {
  //       return false;
  //     }
  //   }),
  token: Yup.string().required(),
  status: Yup.string().required().default("ENABLED"),
});
