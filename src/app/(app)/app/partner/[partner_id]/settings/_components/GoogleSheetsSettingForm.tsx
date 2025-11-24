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
import { getPartnerGoogleSheetsSetting } from "@/lib/utils/partner/get-google-sheets-setting";

const GoogleSheetsSettingForm = () => {
  const { partner_id } = useParams();
  const [initialValues, setInitialValues] = useState({
    google_sheets_client_id: "",
    google_sheets_client_secret: "",
    google_sheets_api_key: "",
  });

  const validationSchema = Yup.object().shape({
    google_sheets_client_id: Yup.string()
      .trim()
      .required("Google Sheets Client ID is required"),
    google_sheets_client_secret: Yup.string()
      .trim()
      .required("Google Sheets Client Secret is required"),
    google_sheets_api_key: Yup.string()
      .trim()
      .required("Google Sheets API Key is required"),
  });

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  useEffect(() => {
    (async () => {
      const googleSheetsSettings = await getPartnerGoogleSheetsSetting(
        //@ts-ignore
        partner_id
      );

      setInitialValues({
        google_sheets_client_id:
          googleSheetsSettings?.google_sheets_client_id ?? "",
        google_sheets_client_secret:
          googleSheetsSettings?.google_sheets_client_secret ?? "",
        google_sheets_api_key:
          googleSheetsSettings?.google_sheets_api_key ?? "",
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
          const loadingToast = toast.loading(
            "Updating Google Sheets settings..."
          );
          try {
            const existingSetting = await getPartnerSettingValue(
              //@ts-ignore
              partner_id,
              "google_sheet"
            );

            const payload = {
              partner_id,
              settings_key: "google_sheet",
              method: existingSetting ? "PUT" : "POST",
              payload: {
                setting_key: "google_sheet",
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

            toast.success("Google Sheets Settings Updated", {
              id: loadingToast,
            });
          } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update Google Sheets settings", {
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
                <Text weight="semibold" size="base" className="w-[300px]">
                  Google Sheets Client ID
                </Text>
                <div className="w-full">
                  <Input
                    name="google_sheets_client_id"
                    placeholder="Enter Google Sheets Client ID"
                    onChange={(e) =>
                      setFieldValue("google_sheets_client_id", e.target.value)
                    }
                    value={values.google_sheets_client_id}
                    className="w-full"
                  />
                  {errors.google_sheets_client_id &&
                    touched.google_sheets_client_id && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.google_sheets_client_id}
                      </div>
                    )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="base" className="w-[300px]">
                  Google Sheets Client Secret
                </Text>
                <div className="w-full">
                  <Input
                    name="google_sheets_client_secret"
                    placeholder="Enter Google Sheets Client Secret"
                    onChange={(e) =>
                      setFieldValue(
                        "google_sheets_client_secret",
                        e.target.value
                      )
                    }
                    value={values.google_sheets_client_secret}
                    className="w-full"
                  />
                  {errors.google_sheets_client_secret &&
                    touched.google_sheets_client_secret && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.google_sheets_client_secret}
                      </div>
                    )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="base" className="w-[300px]">
                  Google Sheets API Key
                </Text>
                <div className="w-full">
                  <Input
                    name="google_sheets_api_key"
                    placeholder="Enter Google Sheets API Key"
                    onChange={(e) =>
                      setFieldValue("google_sheets_api_key", e.target.value)
                    }
                    value={values.google_sheets_api_key}
                    className="w-full"
                  />
                  {errors.google_sheets_api_key &&
                    touched.google_sheets_api_key && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.google_sheets_api_key}
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

export default GoogleSheetsSettingForm;
