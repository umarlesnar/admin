"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Text from "@/components/ui/text";
import { useParams } from "next/navigation";
import { usePartnerByIdQuery } from "@/framework/partner/get-partner-by-id";
import {
  getPartnerSettingValue,
  usePartnerMutation,
} from "@/framework/partner/partner-mutation";
import { getPartnerWhatsappSetting } from "@/lib/utils/partner/get-whatsapp-setting";
import * as Yup from "yup";

const WhatsappSettingsForm = () => {
  const { partner_id } = useParams();
  const [initialValues, setInitialValues] = useState({
    token: "",
    url: "",
    config_id: "",
  });

  const validationSchema = Yup.object().shape({
    config_id: Yup.string().trim().required("Configuration ID is required"),
    url: Yup.string()
      .trim()
      .required("Webhook URL is required")
      .matches(/^https:\/\//, "URL must start with https://"),
    token: Yup.string().trim().required("Secret Token is required"),
  });

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  useEffect(() => {
    (async () => {
      const brandSettings = await getPartnerWhatsappSetting(
        //@ts-ignore
        partner_id
      );

      setInitialValues({
        token: brandSettings?.token ?? "",
        url: brandSettings?.url ?? "",
        config_id: brandSettings?.config_id ?? "",
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
          const loadingToast = toast.loading("Updating Whatsapp settings...");
          try {
            const existingSetting = await getPartnerSettingValue(
              //@ts-ignore
              partner_id,
              "whatsapp"
            );

            const payload = {
              partner_id,
              settings_key: "whatsapp",
              method: existingSetting ? "PUT" : "POST",
              payload: {
                setting_key: "whatsapp",
                setting_value: trimmedValues,
                value_type: "object",
                setting_category: "SYSTEM",
                is_private: true,
                is_core_setting: true,
                domain: data?.domain,
                partner_id,
              },
            };

            await mutateAsync(
              // @ts-ignore
              payload
            );

            toast.success("Whatsapp Settings Updated", { id: loadingToast });
          } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update Whatsapp settings", {
              id: loadingToast,
            });
          }
        }}
        // onSubmit={(values)=> console.log(values)}
      >
        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
          return (
            <Form className="space-y-6 px-2" onSubmit={handleSubmit}>
              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="lg" className="w-[220px]">
                  Configuration Id
                </Text>
                <div className="w-full">
                  <Input
                    name="config_id"
                    placeholder="Enter configuration id"
                    onChange={(e) => setFieldValue("config_id", e.target.value)}
                    value={values.config_id}
                    className="w-full"
                  />
                  {errors.config_id && touched.config_id && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.config_id}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="lg" className="w-[220px]">
                  Webhook URL
                </Text>
                <div className="w-full">
                  <Input
                    name="url"
                    placeholder="Enter webhook url"
                    onChange={(e) => setFieldValue("url", e.target.value)}
                    value={values.url}
                    className="w-full"
                  />
                  {errors.url && touched.url && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.url}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="lg" className="w-[220px]">
                  Secret Token
                </Text>
                <div className="w-full">
                  <Input
                    name="token"
                    placeholder="Enter secret token"
                    onChange={(e) => setFieldValue("token", e.target.value)}
                    value={values.token}
                    className="w-full"
                  />
                  {errors.token && touched.token && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.token}
                    </div>
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

export default WhatsappSettingsForm;
