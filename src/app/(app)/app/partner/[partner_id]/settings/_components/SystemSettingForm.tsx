"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Text from "@/components/ui/text";
import { usePartnerMutation } from "@/framework/partner/partner-mutation";
import { useParams } from "next/navigation";
import { usePartnerByIdQuery } from "@/framework/partner/get-partner-by-id";
import { getPartnerSystemSetting } from "@/lib/utils/partner/get-system-setting-";

const settings_key = "system_token";

const SystemSettingsForm = () => {
  const { partner_id } = useParams() as { partner_id: string };
  const { data: partner } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  const [initialValues, setInitialValues] = useState({ system_token: "" });
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchSetting = async () => {
      const setting = await getPartnerSystemSetting(partner_id);
      if (setting?.system_token) {
        setInitialValues({ system_token: setting.system_token });
        setIsEditable(false);
      } else {
        setIsEditable(true); // if no token, allow editing immediately
      }
    };
    fetchSetting();
  }, [partner_id]);

  const handleSubmit = async (values: { system_token: string }) => {
    const toastId = toast.loading("Updating settings...");
    if (!values.system_token) {
      toast.error("System Token is empty", { id: toastId });
      return;
    }

    try {
      const existingSetting = await getPartnerSystemSetting(partner_id);

      const payload = existingSetting
        ? {
            partner_id,
            settings_key,
            method: "PUT" as const,
            payload: {
              setting_value: values.system_token,
              value_type: "object",
              domain: partner?.domain,
              partner_id,
            },
          }
        : {
            method: "POST" as const,
            payload: {
              setting_category: "SYSTEM",
              settings_key,
              setting_value: values.system_token,
              value_type: "object",
              is_private: true,
              is_core_setting: true,
              domain: partner?.domain,
              partner_id,
            },
          };

      await mutateAsync(payload);
      setIsEditable(false);
      toast.success("Settings Updated Successfully", { id: toastId });
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update settings", { id: toastId });
    }
  };

  return (
    <div className="space-y-6 px-2">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-8 w-full relative">
          <Text weight="semibold" size="base" className="w-[220px]">
            System Token
          </Text>
          <div className="w-full">
            {isEditable ? (
              <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, handleSubmit }) => (
                  <Form
                    onSubmit={handleSubmit}
                    className="flex gap-3 items-center"
                  >
                    <div className="flex-1">
                      <Input
                        name="system_token"
                        placeholder="System Token"
                        type="password"
                        value={values.system_token}
                        onChange={(e) =>
                          setFieldValue("system_token", e.target.value)
                        }
                      />
                    </div>
                    <Button type="submit" size="default" className="px-6 py-5">
                      Update
                    </Button>
                  </Form>
                )}
              </Formik>
            ) : (
              <div className="flex gap-3 items-center justify-between">
                <Text>••••••••••••••••••••</Text>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditable(true)}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsForm;
