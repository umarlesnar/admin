"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Text from "@/components/ui/text";
import {
  getPartnerSettingValue,
  usePartnerMutation,
} from "@/framework/partner/partner-mutation";
import { useParams } from "next/navigation";
import { usePartnerByIdQuery } from "@/framework/partner/get-partner-by-id";
import { getFacebookSetting } from "@/lib/utils/partner/get-facebook-setting";
import * as Yup from "yup";

const FacebookSettingsForm = () => {
  const { partner_id } = useParams();
  const [initialValues, setInitialValues] = useState({
    facebook_app_id: "",
    facebook_business_id: "",
    facebook_client_secret: "",
    facebook_sdk_url: "https://connect.facebook.net/en_US/sdk.js",
    facebook_sdk_version: "v22.0",
  });

  const validationSchema = Yup.object().shape({
    facebook_business_id: Yup.string()
      .trim()
      .required("Facebook Business ID is required"),
    facebook_app_id: Yup.string()
      .trim()
      .required("Facebook App ID is required"),
    facebook_client_secret: Yup.string()
      .trim()
      .required("Facebook Client Secret is required"),
    facebook_sdk_url: Yup.string()
      .trim()
      .required("Facebook SDK Url is required"),
    facebook_sdk_version: Yup.string()
      .trim()
      .required("Facebook SDK Version is required")
      .default("v22.0"),
  });

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  useEffect(() => {
    (async () => {
      const facebookSettings = await getFacebookSetting(
        //@ts-ignore
        partner_id
      );

      setInitialValues({
        facebook_app_id: facebookSettings?.facebook_app_id ?? "",
        facebook_business_id: facebookSettings?.facebook_business_id ?? "",
        facebook_client_secret: facebookSettings?.facebook_client_secret ?? "",
        facebook_sdk_url: "https://connect.facebook.net/en_US/sdk.js",
        facebook_sdk_version: facebookSettings?.facebook_sdk_version ?? "v22.0",
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
          const loadingToast = toast.loading("Updating Facebook settings...");
          try {
            const existingSetting = await getPartnerSettingValue(
              //@ts-ignore
              partner_id,
              "facebook"
            );

            const payload = {
              partner_id,
              settings_key: "facebook",
              method: existingSetting ? "PUT" : "POST",
              payload: {
                setting_key: "facebook",
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

            toast.success("Facebook Settings Updated", { id: loadingToast });
          } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update Facebook settings", {
              id: loadingToast,
            });
          }
        }}
      >
        {({ values, setFieldValue, handleSubmit, errors, touched }) => (
          <Form className="space-y-6 px-2" onSubmit={handleSubmit}>
            <div className="flex items-center gap-4 w-full">
              <Text weight="semibold" size="base" className="w-[250px]">
                Facebook Business ID
              </Text>
              <div className="w-full">
                <Input
                  name="facebook_business_id"
                  placeholder="Facebook Business ID"
                  onChange={(e) =>
                    setFieldValue("facebook_business_id", e.target.value)
                  }
                  value={values.facebook_business_id}
                  className="w-full"
                />
                {errors.facebook_business_id &&
                  touched.facebook_business_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.facebook_business_id}
                    </p>
                  )}
              </div>
            </div>
            <div className="flex items-center gap-4 w-full">
              <Text weight="semibold" size="base" className="w-[250px]">
                Facebook App ID
              </Text>
              <div className="w-full">
                <Input
                  name="facebook_app_id"
                  placeholder="Facebook App ID"
                  onChange={(e) =>
                    setFieldValue("facebook_app_id", e.target.value)
                  }
                  value={values.facebook_app_id}
                  className="w-full"
                />
                {errors.facebook_app_id && touched.facebook_app_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.facebook_app_id}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 w-full">
              <Text weight="semibold" size="base" className="w-[250px]">
                Facebook Client Secret
              </Text>
              <div className="w-full">
                <Input
                  name="facebook_client_secret"
                  placeholder="Facebook Client Secret"
                  onChange={(e) =>
                    setFieldValue("facebook_client_secret", e.target.value)
                  }
                  value={values.facebook_client_secret}
                  className="w-full"
                />
                {errors.facebook_client_secret &&
                  touched.facebook_client_secret && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.facebook_client_secret}
                    </p>
                  )}
              </div>
            </div>
            <div className="gap-4 w-full hidden">
              <Text weight="semibold" size="base" className="w-[250px]">
                Facebook SDK Url
              </Text>
              <div className="w-full">
                <Input
                  name="facebook_sdk_url"
                  placeholder="Facebook SDK Url"
                  onChange={(e) =>
                    setFieldValue("facebook_sdk_url", e.target.value)
                  }
                  value={"https://connect.facebook.net/en_US/sdk.js"}
                  className="w-full"
                />
                {errors.facebook_sdk_url && touched.facebook_sdk_url && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.facebook_sdk_url}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 w-full">
              <Text weight="semibold" size="base" className="w-[250px]">
                Facebook SDK Version
              </Text>
              <div className="w-full">
                <Input
                  name="facebook_sdk_version"
                  placeholder="Facebook SDK Version"
                  onChange={(e) =>
                    setFieldValue("facebook_sdk_version", e.target.value)
                  }
                  value={values.facebook_sdk_version}
                  className="w-full"
                />
                {errors.facebook_sdk_version &&
                  touched.facebook_sdk_version && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.facebook_sdk_version}
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
        )}
      </Formik>
    </div>
  );
};

export default FacebookSettingsForm;
