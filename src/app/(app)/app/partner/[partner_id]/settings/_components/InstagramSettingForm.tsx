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
import * as Yup from "yup";
import { getInstagramSetting } from "@/lib/utils/partner/get-instagram-setting";

const InstagramSettingsForm = () => {
  const { partner_id } = useParams();
  const [initialValues, setInitialValues] = useState({
    instagram_app_id: "",
    instagram_client_secret: "",
  });

  const validationSchema = Yup.object().shape({
    instagram_app_id: Yup.string().trim().required("Instagram app ID is required"),
    instagram_client_secret: Yup.string().trim().required("Instagram client Secret is required"),
  });

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  useEffect(() => {
    (async () => {
      const brandSettings = await getInstagramSetting(
        //@ts-ignore
        partner_id
      );

      setInitialValues({
        instagram_app_id: brandSettings?.instagram_app_id ?? "",
        instagram_client_secret: brandSettings?.instagram_client_secret ?? "",
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
          const loadingToast = toast.loading("Updating instagram settings...");
          try {
            const existingSetting = await getPartnerSettingValue(
              //@ts-ignore
              partner_id,
              "instagram"
            );

            const payload = {
              partner_id,
              settings_key: "instagram",
              method: existingSetting ? "PUT" : "POST",
              payload: {
                setting_key: "instagram",
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

            toast.success("Instagram Settings Updated", { id: loadingToast });
          } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update Instagram settings", {
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
                  Instagram App Id
                </Text>
                <div className="w-full">
                  <Input
                    name="instagram_app_id"
                    placeholder="Enter instagram app id"
                    onChange={(e) => setFieldValue("instagram_app_id", e.target.value)}
                    value={values.instagram_app_id}
                    className="w-full"
                  />
                  {errors.instagram_app_id && touched.instagram_app_id && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.instagram_app_id}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="lg" className="w-[220px]">
                  Instagram Client Secret
                </Text>
                <div className="w-full">
                  <Input
                    name="instagram_client_secret"
                    placeholder="Enter instagram client secret"
                    onChange={(e) => setFieldValue("instagram_client_secret", e.target.value)}
                    value={values.instagram_client_secret}
                    className="w-full"
                  />
                  {errors.instagram_client_secret && touched.instagram_client_secret && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.instagram_client_secret}
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

export default InstagramSettingsForm;
