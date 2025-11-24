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

const FacebookClientSettingsForm = () => {
  const { partner_id } = useParams();
  const [initialValues, setInitialValues] = useState({
    facebook_client_id: "",
  });

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  useEffect(() => {
    (async () => {
      try {
        const setting = await getPartnerSettingValue(
          partner_id as string,
          "facebook_client_id"
        );
        if (setting) {
          setInitialValues({
            facebook_client_id: setting.setting_value || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch setting:", error);
      }
    })();
  }, [partner_id]);

  return (
    <div>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={async (values) => {
          const loadingToast = toast.loading("Updating settings...");
          try {
            const payloadArray = await Promise.all(
              Object.entries(values).map(async ([key, value]) => {
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
                      setting_key: key,
                      setting_value: value,
                      value_type:
                        typeof value === "boolean"
                          ? "boolean"
                          : typeof value === "string"
                          ? "string"
                          : "number",
                      domain: data?.domain,
                      partner_id,
                      setting_category: "SYSTEM",
                      is_private: true,
                      is_core_setting: true,
                    },
                  };
                } catch (error: any) {
                  if (error.response?.status === 404) {
                    return {
                      partner_id,
                      settings_key: key,
                      method: "POST",
                      payload: {
                        setting_key: key,
                        setting_value: value,
                        value_type:
                          typeof value === "boolean"
                            ? "boolean"
                            : typeof value === "string"
                            ? "string"
                            : "number",
                        setting_category: "SYSTEM",
                        is_private: true,
                        is_core_setting: true,
                        domain: data?.domain,
                        partner_id,
                      },
                    };
                  }
                  throw error;
                }
              })
            );

            await Promise.all(payloadArray.map((p: any) => mutateAsync(p)));

            toast.success("Settings Updated Successfully", {
              id: loadingToast,
            });
          } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update settings", { id: loadingToast });
          }
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <Form className="space-y-6 px-2" onSubmit={handleSubmit}>
            <div className="flex items-center gap-4 w-full">
              <Text weight="semibold" size="lg" className="w-[250px]">
                Facebook Client ID
              </Text>
              <div className="w-full">
                <Input
                  name="facebook_client_id"
                  placeholder="Facebook Client ID"
                  onChange={(e) =>
                    setFieldValue("facebook_client_id", e.target.value)
                  }
                  value={values.facebook_client_id}
                  className="w-full"
                />
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

export default FacebookClientSettingsForm;
