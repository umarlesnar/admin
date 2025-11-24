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
import { getBrandSetting } from "@/lib/utils/partner/get-brand-setting";
import { getPartnerWhatsappSetting } from "@/lib/utils/partner/get-whatsapp-setting";
import * as Yup from "yup";
import { getPartnerEmailSetting } from "@/lib/utils/partner/get-email-setting";
import { PasswordInput } from "@/components/ui/passwordInput";

const EmailSettingsForm = () => {
  const { partner_id } = useParams();
  const [initialValues, setInitialValues] = useState({
    smtp_username: "",
    smtp_password: "",
    smtp_host: "",
    smtp_port: "",
    smtp_from: "",
    smtp_secure: "",
    smtp_ignore_tls: "",
    smtp_auth_disabled: "",
  });

  const validationSchema = Yup.object().shape({
    smtp_username: Yup.string().trim().required("SMTP Username is required"),
    smtp_password: Yup.string().trim().required("SMTP Password is required"),
    smtp_host: Yup.string().trim().required("SMTP Host is required"),
    smtp_port: Yup.string().trim().required("SMTP Port is required"),
    smtp_from: Yup.string().trim().required("SMTP From is required"),
    smtp_secure: Yup.string().trim().required("SMTP Secure is required"),
    smtp_ignore_tls: Yup.string()
      .trim()
      .required("SMTP Ignore TLS is required"),
    smtp_auth_disabled: Yup.string()
      .trim()
      .required("SMTP Auth Disabled is required"),
  });

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  useEffect(() => {
    (async () => {
      const brandSettings = await getPartnerEmailSetting(
        //@ts-ignore
        partner_id
      );

      setInitialValues({
        smtp_username: brandSettings?.smtp_username ?? "",
        smtp_password: brandSettings?.smtp_password ?? "",
        smtp_host: brandSettings?.smtp_host ?? "",
        smtp_port: brandSettings?.smtp_port ?? "",
        smtp_from: brandSettings?.smtp_from ?? "",
        smtp_secure: brandSettings?.smtp_secure ?? "",
        smtp_ignore_tls: brandSettings?.smtp_ignore_tls ?? "",
        smtp_auth_disabled: brandSettings?.smtp_auth_disabled ?? "",
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
          const loadingToast = toast.loading("Updating Email settings...");
          try {
            const existingSetting = await getPartnerSettingValue(
              //@ts-ignore
              partner_id,
              "smtp_config"
            );

            const payload = {
              partner_id,
              settings_key: "smtp_config",
              method: existingSetting ? "PUT" : "POST",
              payload: {
                setting_key: "smtp_config",
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

            toast.success("Email Settings Updated", { id: loadingToast });
          } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update Email settings", {
              id: loadingToast,
            });
          }
        }}
        // onSubmit={(values)=> console.log(values)}
      >
        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
          return (
            <Form className="space-y-6 px-2" onSubmit={handleSubmit}>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="base" className="w-[220px]">
                  SMTP Username
                </Text>
                <div className="w-full">
                  <Input
                    name="smtp_username"
                    placeholder="Enter SMTP username"
                    onChange={(e) =>
                      setFieldValue("smtp_username", e.target.value)
                    }
                    value={values.smtp_username}
                    className="w-full"
                  />
                  {errors.smtp_username && touched.smtp_username && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.smtp_username}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="base" className="w-[220px]">
                  SMTP Password
                </Text>
                <div className="w-full">
                  <PasswordInput
                    name="smtp_password"
                    placeholder="Enter SMTP password"
                    onChange={(e) =>
                      setFieldValue("smtp_password", e.target.value)
                    }
                    value={values.smtp_password}
                    className="w-full"
                  />
                  {errors.smtp_password && touched.smtp_password && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.smtp_password}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="base" className="w-[220px]">
                  SMTP Host
                </Text>
                <div className="w-full">
                  <Input
                    name="smtp_host"
                    placeholder="Enter SMTP host"
                    onChange={(e) => setFieldValue("smtp_host", e.target.value)}
                    value={values.smtp_host}
                    className="w-full"
                  />
                  {errors.smtp_host && touched.smtp_host && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.smtp_host}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="base" className="w-[220px]">
                  SMTP Port
                </Text>
                <div className="w-full">
                  <Input
                    name="smtp_port"
                    placeholder="Enter SMTP port"
                    onChange={(e) => setFieldValue("smtp_port", e.target.value)}
                    value={values.smtp_port}
                    className="w-full"
                  />
                  {errors.smtp_port && touched.smtp_port && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.smtp_port}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="base" className="w-[220px]">
                  SMTP From
                </Text>
                <div className="w-full">
                  <Input
                    name="smtp_from"
                    placeholder="Enter SMTP from"
                    onChange={(e) => setFieldValue("smtp_from", e.target.value)}
                    value={values.smtp_from}
                    className="w-full"
                  />
                  {errors.smtp_from && touched.smtp_from && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.smtp_from}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="base" className="w-[220px]">
                  SMTP Secure
                </Text>
                <div className="w-full">
                  <Input
                    name="smtp_secure"
                    placeholder="Enter SMTP secure"
                    onChange={(e) =>
                      setFieldValue("smtp_secure", e.target.value)
                    }
                    value={values.smtp_secure}
                    className="w-full"
                  />
                  {errors.smtp_secure && touched.smtp_secure && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.smtp_secure}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="base" className="w-[220px]">
                  SMTP Ignore TLS
                </Text>
                <div className="w-full">
                  <Input
                    name="smtp_ignore_tls"
                    placeholder="Enter SMTP ignore tls"
                    onChange={(e) =>
                      setFieldValue("smtp_ignore_tls", e.target.value)
                    }
                    value={values.smtp_ignore_tls}
                    className="w-full"
                  />
                  {errors.smtp_ignore_tls && touched.smtp_ignore_tls && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.smtp_ignore_tls}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="base" className="w-[220px]">
                  SMTP Auth Disabled
                </Text>
                <div className="w-full">
                  <Input
                    name="smtp_auth_disabled"
                    placeholder="Enter SMTP auth disabled"
                    onChange={(e) =>
                      setFieldValue("smtp_auth_disabled", e.target.value)
                    }
                    value={values.smtp_auth_disabled}
                    className="w-full"
                  />
                  {errors.smtp_auth_disabled && touched.smtp_auth_disabled && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.smtp_auth_disabled}
                    </div>
                  )}
                </div>
              </div>

              {/* <div className="flex items-center gap-8 mt-1 w-full">
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
              </div> */}

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

export default EmailSettingsForm;
