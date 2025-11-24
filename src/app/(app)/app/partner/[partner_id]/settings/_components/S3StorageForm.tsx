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
import { getPartnerS3StorageSetting } from "@/lib/utils/partner/get-s3-storage-setting";

const S3StorageForm = () => {
  const { partner_id } = useParams();
  const [initialValues, setInitialValues] = useState({
    s3_access_key: "",
    s3_secret_key: "",
    s3_bucket: "",
    s3_port: "",
    s3_endpoint: "",
    s3_ssl: "",
    s3_region: "",
    s3_public_custom_domain: "",
  });

  const validationSchema = Yup.object().shape({
    s3_access_key: Yup.string().trim().required("S3 Access Key is required"),
    s3_secret_key: Yup.string().trim().required("S3 Secret Key is required"),
    s3_bucket: Yup.string().trim().required("S3 Bucket is required"),
    s3_port: Yup.string().trim().required("S3 Port is required"),
    s3_endpoint: Yup.string().trim().required("S3 Endpoint is required"),
    s3_ssl: Yup.string().trim().required("S3 SSL is required"),
    s3_region: Yup.string().trim().required("S3 Region is required"),
    s3_public_custom_domain: Yup.string()
      .trim()
      .required("S3 Public Custom Domain is required"),
  });

  const { data } = usePartnerByIdQuery(partner_id);
  const { mutateAsync } = usePartnerMutation();

  useEffect(() => {
    (async () => {
      const s3StorageSettings = await getPartnerS3StorageSetting(
        //@ts-ignore
        partner_id
      );

      setInitialValues({
        s3_access_key: s3StorageSettings?.s3_access_key ?? "",
        s3_secret_key: s3StorageSettings?.s3_secret_key ?? "",
        s3_bucket: s3StorageSettings?.s3_bucket ?? "",
        s3_port: s3StorageSettings?.s3_port ?? "",
        s3_endpoint: s3StorageSettings?.s3_endpoint ?? "",
        s3_ssl: s3StorageSettings?.s3_ssl ?? "",
        s3_region: s3StorageSettings?.s3_region ?? "",
        s3_public_custom_domain:
          s3StorageSettings?.s3_public_custom_domain ?? "",
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
          const loadingToast = toast.loading("Updating S3 Storage settings...");
          try {
            const existingSetting = await getPartnerSettingValue(
              //@ts-ignore
              partner_id,
              "s3_storage"
            );

            const payload = {
              partner_id,
              settings_key: "s3_storage",
              method: existingSetting ? "PUT" : "POST",
              payload: {
                setting_key: "s3_storage",
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

            toast.success("S3 Storage Settings Updated", {
              id: loadingToast,
            });
          } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update S3 Storage settings", {
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
                <Text weight="semibold" size="lg" className="w-[300px]">
                  S3 Access Key
                </Text>
                <div className="w-full">
                  <Input
                    name="s3_access_key"
                    placeholder="Enter S3 Access Key"
                    onChange={(e) =>
                      setFieldValue("s3_access_key", e.target.value)
                    }
                    value={values.s3_access_key}
                    className="w-full"
                  />
                  {errors.s3_access_key && touched.s3_access_key && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.s3_access_key}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="lg" className="w-[300px]">
                  S3 Secret Key
                </Text>
                <div className="w-full">
                  <Input
                    name="s3_secret_key"
                    placeholder="Enter S3 Secret Key"
                    onChange={(e) =>
                      setFieldValue("s3_secret_key", e.target.value)
                    }
                    value={values.s3_secret_key}
                    className="w-full"
                  />
                  {errors.s3_secret_key && touched.s3_secret_key && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.s3_secret_key}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="lg" className="w-[300px]">
                  S3 Bucket
                </Text>
                <div className="w-full">
                  <Input
                    name="s3_bucket"
                    placeholder="Enter S3 Bucket"
                    onChange={(e) => setFieldValue("s3_bucket", e.target.value)}
                    value={values.s3_bucket}
                    className="w-full"
                  />
                  {errors.s3_bucket && touched.s3_bucket && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.s3_bucket}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="lg" className="w-[300px]">
                  S3 Port
                </Text>
                <div className="w-full">
                  <Input
                    name="s3_port"
                    placeholder="Enter S3 Port"
                    onChange={(e) => setFieldValue("s3_port", e.target.value)}
                    value={values.s3_port}
                    className="w-full"
                  />
                  {errors.s3_port && touched.s3_port && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.s3_port}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="lg" className="w-[300px]">
                  S3 Endpoint
                </Text>
                <div className="w-full">
                  <Input
                    name="s3_endpoint"
                    placeholder="Enter S3 Endpoint"
                    onChange={(e) =>
                      setFieldValue("s3_endpoint", e.target.value)
                    }
                    value={values.s3_endpoint}
                    className="w-full"
                  />
                  {errors.s3_endpoint && touched.s3_endpoint && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.s3_endpoint}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="lg" className="w-[300px]">
                  S3 SSL
                </Text>
                <div className="w-full">
                  <Input
                    name="s3_ssl"
                    placeholder="Enter S3 SSL"
                    onChange={(e) => setFieldValue("s3_ssl", e.target.value)}
                    value={values.s3_ssl}
                    className="w-full"
                  />
                  {errors.s3_ssl && touched.s3_ssl && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.s3_ssl}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="lg" className="w-[300px]">
                  S3 Region
                </Text>
                <div className="w-full">
                  <Input
                    name="s3_region"
                    placeholder="Enter S3 Region"
                    onChange={(e) => setFieldValue("s3_region", e.target.value)}
                    value={values.s3_region}
                    className="w-full"
                  />
                  {errors.s3_region && touched.s3_region && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.s3_region}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="lg" className="w-[300px]">
                  S3 Public Custom Domain
                </Text>
                <div className="w-full">
                  <Input
                    name="s3_public_custom_domain"
                    placeholder="Enter S3 Public Custom Domain"
                    onChange={(e) =>
                      setFieldValue("s3_public_custom_domain", e.target.value)
                    }
                    value={values.s3_public_custom_domain}
                    className="w-full"
                  />
                  {errors.s3_public_custom_domain &&
                    touched.s3_public_custom_domain && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.s3_public_custom_domain}
                      </div>
                    )}
                </div>
              </div>

              {/* <div className="flex items-center gap-8 mt-1 w-full">
                <Text weight="semibold" size="lg" className="w-[300px]">
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

export default S3StorageForm;
