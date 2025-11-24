"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Text from "@/components/ui/text";
import {
  getPartnerSettingValue,
  usePartnerMutation,
} from "@/framework/partner/partner-mutation";
import { useParams } from "next/navigation";
import { usePartnerByIdQuery } from "@/framework/partner/get-partner-by-id";
import { getPartnerPaymentSetting } from "@/lib/utils/partner/get-payment-setting";

const PaymentSettingsForm = () => {
  const { partner_id } = useParams();
  const [initialValues, setInitialValues] = useState({
    new_registration_subscription: false,
    discount_percentage_yearly: 0,
  });

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  useEffect(() => {
    (async () => {
      const paymentSettingSettings = await getPartnerPaymentSetting(partner_id);
      if (paymentSettingSettings) {
        setInitialValues(paymentSettingSettings);
      }
    })();
  }, []);

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
                      setting_value: value,
                      value_type:
                        typeof value === "boolean"
                          ? "boolean"
                          : typeof value === "number"
                          ? "number"
                          : "string",
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
                            : typeof value === "number"
                            ? "number"
                            : "string",
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
        {({ values, setFieldValue, handleSubmit }) => {
          return (
            <Form className="space-y-6 px-2" onSubmit={handleSubmit}>
              <div className="flex items-center gap-12">
                <Text weight="semibold" size="lg" className="w-[350px]">
                  New Registration Subscription
                </Text>
                <div className="w-full">
                  <Switch
                    checked={values.new_registration_subscription}
                    onCheckedChange={(checked) =>
                      setFieldValue("new_registration_subscription", checked)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-12 w-full">
                <Text weight="semibold" size="lg" className="w-[350px]">
                  Discount Percentage Yearly
                </Text>
                <div className="w-full">
                  <Input
                    type="number"
                    name="discount_percentage_yearly"
                    placeholder="Discount Percentage Yearly"
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue(
                        "discount_percentage_yearly",
                        value === "" ? "" : Number(value)
                      );
                    }}
                    value={values.discount_percentage_yearly}
                  />
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

export default PaymentSettingsForm;
