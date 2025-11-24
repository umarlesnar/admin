"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Text from "@/components/ui/text";
import { Switch } from "@/components/ui/switch";
import { usePartnerMutation } from "@/framework/partner/partner-mutation";
import { useParams } from "next/navigation";
import { usePartnerByIdQuery } from "@/framework/partner/get-partner-by-id";
import { getPartnerPayAsYouGoSetting } from "@/lib/utils/partner/get-pay-as-you-go-setting";

const PayAsYouGoSettingsForm = () => {
  const { partner_id } = useParams() as { partner_id: string };
  const [initialValues, setInitialValues] = useState({
    pay_as_you_go: {
      is_enable: false,
      amount: 0,
      tax_percentage: 1,
    },
  });
  const settings_key = "pay_as_you_go";

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  useEffect(() => {
    (async () => {
      const PayAsYouGoSettings = await getPartnerPayAsYouGoSetting(
        //@ts-ignore
        partner_id
      );
      if (PayAsYouGoSettings) {
        setInitialValues({
          pay_as_you_go: PayAsYouGoSettings.pay_as_you_go || {
            is_enable: false,
            amount: 0,
            tax_percentage: 1,
          },
        });
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
            const existingSetting = await getPartnerPayAsYouGoSetting(
              partner_id as string
            ); // Check if setting exists

            const payload = existingSetting
              ? {
                  partner_id: partner_id,
                  settings_key: settings_key,
                  method: "PUT" as const,
                  payload: {
                    setting_value: {
                      is_enable: values?.pay_as_you_go?.is_enable,
                      amount: values?.pay_as_you_go?.amount,
                      tax_percentage: values?.pay_as_you_go?.tax_percentage,
                    },
                    value_type: "object",
                    domain: data?.domain,
                    partner_id: partner_id,
                  },
                }
              : {
                  method: "POST" as const,
                  payload: {
                    setting_category: "SYSTEM",
                    setting_key: "pay_as_you_go",
                    setting_value: {
                      is_enable: values?.pay_as_you_go?.is_enable,
                      amount: values?.pay_as_you_go?.amount,
                      tax_percentage: values?.pay_as_you_go?.tax_percentage,
                    },
                    value_type: "object",
                    is_private: true,
                    is_core_setting: true,
                    domain: data?.domain,
                    partner_id: partner_id,
                  },
                };

            await mutateAsync(payload);

            toast.success("Settings Updated Successfully", {
              id: loadingToast,
            });
          } catch (error: any) {
            console.error("Update failed", error);
            toast.error("Failed to update settings", { id: loadingToast });
          }
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => {
          return (
            <Form className="space-y-6 px-2" onSubmit={handleSubmit}>
              <div className="flex items-center gap-8">
                <Text weight="semibold" size="lg" className="w-[220px]">
                  Is Enable
                </Text>
                <div className="w-full">
                  <Switch
                    checked={values.pay_as_you_go?.is_enable}
                    onCheckedChange={(checked) =>
                      setFieldValue("pay_as_you_go.is_enable", checked)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-8 w-full">
                <Text weight="semibold" size="lg" className="w-[220px]">
                  Amount
                </Text>
                <div className="w-full">
                  <Input
                    name="pay_as_you_go.amount"
                    placeholder="Enter Amount"
                    type="number"
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue(
                        "pay_as_you_go.amount",
                        value === "" ? "" : Number(value)
                      );
                    }}
                    value={values.pay_as_you_go?.amount}
                  />
                </div>
              </div>

              <div className="flex items-center w-full gap-8">
                <Text weight="semibold" size="lg" className="w-[220px]">
                  Tax Percentage
                </Text>
                <div className="w-full">
                  <Input
                    name="pay_as_you_go.tax_percentage"
                    placeholder="Enter Tax Percentage"
                    type="number"
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue(
                        "pay_as_you_go.tax_percentage",
                        value === "" ? "" : Number(value)
                      );
                    }}
                    value={values.pay_as_you_go?.tax_percentage}
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

export default PayAsYouGoSettingsForm;
