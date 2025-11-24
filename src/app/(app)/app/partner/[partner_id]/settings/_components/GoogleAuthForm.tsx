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
import { getGoogleAuthSetting } from "@/lib/utils/partner/get-google-auth-setting";
import * as Yup from "yup";

const GoogleAuthForm = () => {
  const { partner_id } = useParams();
  const [initialValues, setInitialValues] = useState({
    client_id: "",
    client_secret: "",
  });

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  const validationSchema = Yup.object().shape({
    client_id: Yup.string().trim().required("Client ID is required"),
    client_secret: Yup.string().trim().required("Client Secret is required"),
  });

  useEffect(() => {
    (async () => {
      const googleAuthSettings = await getGoogleAuthSetting(
        // @ts-ignore
        partner_id
      );

      setInitialValues({
        client_id: googleAuthSettings?.client_id ?? "",
        client_secret: googleAuthSettings?.client_secret ?? "",
      });
    })();
  }, []);

  const trimValues = (values: typeof initialValues) => {
    const trimmed: typeof initialValues = {} as any;
    for (const key in values) {
      const value = values[key as keyof typeof values];
      trimmed[key as keyof typeof values] =
        typeof value === "string" ? value.replace(/\s+/g, "") : value;
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
          const loadingToast = toast.loading(
            "Updating Google Auth settings..."
          );
          try {
            const existingSetting = await getPartnerSettingValue(
              //@ts-ignore
              partner_id,
              "google_auth"
            );

            const payload = {
              partner_id: partner_id,
              settings_key: "google_auth",
              method: existingSetting ? "PUT" : "POST",
              payload: {
                setting_key: "google_auth",
                setting_value: trimmedValues,
                value_type: "object",
                setting_category: "SYSTEM",
                is_private: true,
                is_core_setting: true,
                domain: data?.domain,
                partner_id: partner_id,
              },
            };

            await mutateAsync(
              // @ts-ignore
              payload
            );

            toast.success("Google Auth Settings Updated", { id: loadingToast });
          } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update Google Auth settings", {
              id: loadingToast,
            });
          }
        }}
      >
        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
          return (
            <Form className="space-y-6 px-2" onSubmit={handleSubmit}>
              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="base" className="w-[220px]">
                  Client ID
                </Text>
                <div className="w-full">
                  <Input
                    name="client_id"
                    placeholder="Enter Client Id"
                    onChange={(e) => setFieldValue("client_id", e.target.value)}
                    value={values.client_id}
                    className="w-full"
                  />
                  {errors.client_id && touched.client_id && (
                    <p className="text-red-500 text-sm">{errors.client_id}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center w-full gap-8">
                <Text weight="semibold" size="base" className="w-[220px]">
                  Client Secret
                </Text>
                <div className="w-full">
                  <Input
                    name="client_secret"
                    placeholder="Enter Client Secret"
                    onChange={(e) =>
                      setFieldValue("client_secret", e.target.value)
                    }
                    value={values.client_secret}
                    className="w-full"
                  />
                  {errors.client_secret && touched.client_secret && (
                    <p className="text-red-500 text-sm">
                      {errors.client_secret}
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

export default GoogleAuthForm;
