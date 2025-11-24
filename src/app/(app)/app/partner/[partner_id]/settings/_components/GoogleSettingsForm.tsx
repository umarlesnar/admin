"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Text from "@/components/ui/text";
import { useParams } from "next/navigation";
import { usePartnerByIdQuery } from "@/framework/partner/get-partner-by-id";
import {
  getPartnerSettingValue,
  usePartnerMutation,
} from "@/framework/partner/partner-mutation";
import { getGoogleCaptchas } from "@/lib/utils/partner/get-google-captcha";
import * as Yup from "yup";

type GoogleSettingsFormValues = {
  google_captcha: boolean;
  google_site_secret: string;
  google_site_key: string;
};

const GoogleSettingsForm = () => {
  const { partner_id } = useParams();
  const [initialValues, setInitialValues] = useState<GoogleSettingsFormValues>({
    google_captcha: false,
    google_site_secret: "",
    google_site_key: "",
  });

  const validationSchema = Yup.object().shape({
    google_captcha: Yup.boolean().required("Google Captcha is required"),
    google_site_secret: Yup.string()
      .trim()
      .required("Google Site Secret is required"),
    google_site_key: Yup.string()
      .trim()
      .required("Google Site Key is required"),
  });

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  useEffect(() => {
    (async () => {
      const googleCaptchaSettings = await getGoogleCaptchas(partner_id);

      setInitialValues({
        google_captcha: googleCaptchaSettings?.google_captcha ?? false,
        google_site_secret: googleCaptchaSettings?.google_site_secret ?? "",
        google_site_key: googleCaptchaSettings?.google_site_key ?? "",
      });
    })();
  }, []);

  const trimValues = (
    values: GoogleSettingsFormValues
  ): GoogleSettingsFormValues => {
    const trimmed = {} as GoogleSettingsFormValues;
    for (const key in values) {
      const value = values[key as keyof GoogleSettingsFormValues];
      if (typeof value === "string") {
        //@ts-ignore
        trimmed[key as keyof GoogleSettingsFormValues] = value.replace(
          /\s+/g,
          ""
        ) as any;
      } else {
        //@ts-ignore
        trimmed[key as keyof GoogleSettingsFormValues] = value as any;
      }
    }
    return trimmed;
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          const trimmedValues = trimValues(values);
          const loadingToast = toast.loading("Updating settings...");
          try {
            const payloadArray = await Promise.all(
              Object.entries(trimmedValues).map(async ([key, value]) => {
                try {
                  const existingSetting = await getPartnerSettingValue(
                    partner_id as string,
                    key
                  );

                  return {
                    partner_id,
                    settings_key: key,
                    method: existingSetting ? "PUT" : "POST",
                    payload: {
                      setting_value: value,
                      value_type:
                        typeof value === "boolean"
                          ? "boolean"
                          : typeof value === "string"
                          ? "string"
                          : "object",
                      domain: data?.domain,
                      partner_id: partner_id,
                    },
                  };
                } catch (error: any) {
                  if (error.response?.status === 404) {
                    return {
                      partner_id,
                      settings_key: key,
                      method: "POST",
                      payload: {
                        setting_category: "SYSTEM",
                        setting_key: key,
                        setting_value: value,
                        value_type:
                          typeof value === "boolean"
                            ? "boolean"
                            : typeof value === "string"
                            ? "string"
                            : "object",
                        is_private: true,
                        is_core_setting: true,
                        domain: data?.domain,
                        partner_id: partner_id,
                      },
                    };
                  }
                  throw error;
                }
              })
            );

            await Promise.all(
              payloadArray.map((data: any) => mutateAsync(data))
            );

            toast.success("Settings Updated Successfully", {
              id: loadingToast,
            });
          } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update settings", { id: loadingToast });
          }
        }}
      >
        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
          return (
            <Form className="space-y-6 px-2" onSubmit={handleSubmit}>
              <div className="flex items-center gap-8">
                <Text weight="semibold" size="base" className="w-[220px]">
                  Google Captcha
                </Text>
                <div className="w-full">
                  <Switch
                    checked={values.google_captcha}
                    onCheckedChange={(checked) =>
                      setFieldValue("google_captcha", checked)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="base" className="w-[220px]">
                  Google Site Secret
                </Text>
                <div className="w-full">
                  <Input
                    name="google_site_secret"
                    placeholder="Enter Google Site Secret"
                    onChange={(e) =>
                      setFieldValue("google_site_secret", e.target.value)
                    }
                    value={values.google_site_secret}
                    className="w-full"
                  />
                  {errors.google_site_secret && touched.google_site_secret && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.google_site_secret}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center w-full gap-8">
                <Text weight="semibold" size="base" className="w-[220px]">
                  Google Site Key
                </Text>
                <div className="w-full">
                  <Input
                    name="google_site_key"
                    placeholder="Enter Google Site Key"
                    onChange={(e) =>
                      setFieldValue("google_site_key", e.target.value)
                    }
                    value={values.google_site_key}
                    className="w-full"
                  />
                  {errors.google_site_key && touched.google_site_key && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.google_site_key}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="default" className="px-6 py-5">
                  Update
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default GoogleSettingsForm;
