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
import { getPartnerKwicSetting } from "@/lib/utils/partner/get-kwic-settings";

const KwicSettingsForm = () => {
  const { partner_id } = useParams();
  const [initialValues, setInitialValues] = useState({
    workflow_url: "",
  });

  const validationSchema = Yup.object().shape({
    workflow_url: Yup.string().trim().required("Workflow url is required"),
  });

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  useEffect(() => {
    (async () => {
      const brandSettings: any = await getPartnerKwicSetting(
        //@ts-ignore
        partner_id
      );

      setInitialValues({
        workflow_url: brandSettings?.workflow_url ?? "",
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
              "kwic"
            );

            const payload = {
              partner_id,
              settings_key: "kwic",
              method: existingSetting ? "PUT" : "POST",
              payload: {
                setting_key: "kwic",
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
                  Workflow Url
                </Text>
                <div className="w-full">
                  <Input
                    name="workflow_url"
                    placeholder="Enter Kwic workflow url"
                    onChange={(e) =>
                      setFieldValue("workflow_url", e.target.value)
                    }
                    value={values.workflow_url}
                    className="w-full"
                  />
                  {errors.workflow_url && touched.workflow_url && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.workflow_url}
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

export default KwicSettingsForm;
