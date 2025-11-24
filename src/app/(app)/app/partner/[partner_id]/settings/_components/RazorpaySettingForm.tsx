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
import { getPartnerRazorpayKeys } from "@/lib/utils/partner/get-razorpay-keys";
import * as Yup from "yup";

type RazorpaySettingsFormValues = {
  razorpay_key_id: string;
  razorpay_secret_key: string;
  razorpay_endpoint_key: string;
};

const RazorpaySettingsForm = () => {
  const { partner_id } = useParams();
  const [initialValues, setInitialValues] =
    useState<RazorpaySettingsFormValues>({
      razorpay_key_id: "",
      razorpay_secret_key: "",
      razorpay_endpoint_key: "",
    });

  const validationSchema = Yup.object().shape({
    razorpay_key_id: Yup.string()
      .trim()
      .required("Razorpay Key ID is required"),
    razorpay_secret_key: Yup.string()
      .trim()
      .required("Razorpay Secret Key is required"),
    razorpay_endpoint_key: Yup.string()
      .trim()
      .required("Razorpay Endpoint Key is required"),
  });

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  useEffect(() => {
    (async () => {
      const razorpayKeysSettings = await getPartnerRazorpayKeys(partner_id);
      if (razorpayKeysSettings) {
        setInitialValues(razorpayKeysSettings);
      }
    })();
  }, []);

  const trimValues = (
    values: RazorpaySettingsFormValues
  ): RazorpaySettingsFormValues => {
    const trimmed = {} as RazorpaySettingsFormValues;
    for (const key in values) {
      const value = values[key as keyof RazorpaySettingsFormValues];
      if (typeof value === "string") {
        trimmed[key as keyof RazorpaySettingsFormValues] = value.replace(
          /\s+/g,
          ""
        ) as any;
      } else {
        trimmed[key as keyof RazorpaySettingsFormValues] = value as any;
      }
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
          const loadingToast = toast.loading("Updating razorpay settings...");

          try {
            const trimmedValues = trimValues(values);

            const payloadArray = await Promise.all(
              Object.entries(trimmedValues).map(async ([key, value]) => {
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
                          : typeof value === "string"
                          ? "string"
                          : "number",
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
                            : typeof value === "string"
                            ? "string"
                            : "number",
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

            toast.success("Razorpay Settings Updated Successfully", {
              id: loadingToast,
            });
          } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update razorpay settings", {
              id: loadingToast,
            });
          }
        }}
      >
        {({ values, setFieldValue, handleSubmit, touched, errors }) => {
          return (
            <Form className="space-y-6 px-2" onSubmit={handleSubmit}>
              <div className="flex items-center w-full gap-8">
                <Text weight="semibold" size="lg" className="w-[250px]">
                  Razorpay Key Id
                </Text>
                <div className="w-full">
                  <Input
                    name="razorpay_key_id"
                    placeholder="Razorpay Key Id"
                    onChange={(e) =>
                      setFieldValue("razorpay_key_id", e.target.value)
                    }
                    value={values.razorpay_key_id}
                    className="w-full"
                  />
                  {errors.razorpay_key_id && touched.razorpay_key_id && (
                    <p className="text-red-500 text-sm">
                      {errors.razorpay_key_id}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center w-full gap-8">
                <Text weight="semibold" size="lg" className="w-[250px]">
                  Razorpay Secret Key
                </Text>
                <div className="w-full">
                  <Input
                    name="razorpay_secret_key"
                    placeholder="Razorpay Secret Key"
                    onChange={(e) =>
                      setFieldValue("razorpay_secret_key", e.target.value)
                    }
                    value={values.razorpay_secret_key}
                    className="w-full"
                  />
                  {errors.razorpay_secret_key &&
                    touched.razorpay_secret_key && (
                      <p className="text-red-500 text-sm">
                        {errors.razorpay_secret_key}
                      </p>
                    )}
                </div>
              </div>
              <div className="flex items-center w-full gap-8">
                <Text weight="semibold" size="lg" className="w-[250px]">
                  Razorpay Endpoint Key
                </Text>
                <div className="w-full">
                  <Input
                    name="razorpay_endpoint_key"
                    placeholder="Razorpay Endpoint Key"
                    onChange={(e) =>
                      setFieldValue("razorpay_endpoint_key", e.target.value)
                    }
                    value={values.razorpay_endpoint_key}
                    className="w-full"
                  />
                  {errors.razorpay_endpoint_key &&
                    touched.razorpay_endpoint_key && (
                      <p className="text-red-500 text-sm">
                        {errors.razorpay_endpoint_key}
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

export default RazorpaySettingsForm;
