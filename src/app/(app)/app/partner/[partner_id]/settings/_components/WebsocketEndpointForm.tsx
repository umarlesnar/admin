"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Text from "@/components/ui/text";
import { useParams } from "next/navigation";
import {
  getPartnerSettingValue,
  usePartnerMutation,
} from "@/framework/partner/partner-mutation";
import { usePartnerByIdQuery } from "@/framework/partner/get-partner-by-id";
import { getPartnerWebsocketEnpointId } from "@/lib/utils/partner/get-websocket-endpoint";

const WebsocketEndpointForm = () => {
  const { partner_id, settings_key } = useParams();
  const [initialValues, setInitialValues] = useState({
    websocket_endpoint: "",
  });

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  useEffect(() => {
    (async () => {
      const existingSettings = await getPartnerWebsocketEnpointId(partner_id);
      if (existingSettings) {
        setInitialValues(existingSettings);
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
                const settingPayload = {
                  setting_category: "SYSTEM",
                  settings_key: key,
                  setting_value: value,
                  value_type:
                    typeof value === "boolean"
                      ? "boolean"
                      : typeof value === "string"
                      ? "string"
                      : "number",
                  is_private: true,
                  is_core_setting: true,
                  domain: data?.domain,
                  partner_id: partner_id,
                };

                try {
                  await getPartnerSettingValue(partner_id as string, key);
                  return {
                    partner_id,
                    settings_key: key,
                    method: "PUT",
                    payload: settingPayload,
                  };
                } catch (error: any) {
                  if (error.response?.status === 404) {
                    return {
                      partner_id,
                      settings_key: key,
                      method: "POST",
                      payload: settingPayload,
                    };
                  }
                  throw error;
                }
              })
            );

            await Promise.all(
              payloadArray.map((entry: any) => mutateAsync(entry))
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
        {({ values, setFieldValue, handleSubmit }) => (
          <Form className="space-y-6 px-2" onSubmit={handleSubmit}>
            <div className="flex items-center gap-4 w-full">
              <Text weight="semibold" size="lg" className="w-[250px]">
                Websocket Endpoint
              </Text>
              <div className="w-full">
                <Input
                  name="websocket_endpoint"
                  placeholder="Websocket Endpoint"
                  onChange={(e) =>
                    setFieldValue("websocket_endpoint", e.target.value)
                  }
                  value={values.websocket_endpoint}
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

export default WebsocketEndpointForm;
