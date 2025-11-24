"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { useApplication } from "@/contexts/application/application.context";
import { useBusinessCloudProviderUpdateMutation } from "@/framework/business/settings/cloud-provider/business-cloud-provider-mutation";
import { useCloudProviderByIdQuery } from "@/framework/business/settings/cloud-provider/get-cloud-provider-by-id";
import { Formik } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const CLOUD_PROVIDER = [
  { value: "AWS_SERVERLESS", name: "Aws Serverless" },
  { value: "NATIVE_SERVICE", name: "Native Service" },
  { value: "SELF_HOSTING", name: "Self Hosting" },
];

const CloudProviderForm = () => {
  const { mutateAsync } = useBusinessCloudProviderUpdateMutation();

  const params = useParams();
  const { setUserParams } = useApplication();
  const business_id = params?.business_id;

  const { data } = useCloudProviderByIdQuery(business_id);

  useEffect(() => {
    if (data) {
      setUserParams({
        business: data,
      });
    }
  }, [data]);

  return (
    <Formik
      initialValues={{
        cloud_provider: "",
        ...data,
      }}
      enableReinitialize={true}
      onSubmit={async (values) => {
        const loadingToast = toast.loading("Loading...");
        try {
          await mutateAsync({
            cloud_provider: values?.cloud_provider,
          });
          toast.success("Cloud Provider Updated Successfully", {
            id: loadingToast,
          });
        } catch (error) {
          console.log("error", error);

          toast.error("Failed to update Cloud Provider", {
            id: loadingToast,
          });
        }
      }}
    >
      {({ values, setFieldValue, handleSubmit }) => {
        return (
          <form className="" onSubmit={handleSubmit}>
            <div className=" flex justify-between items-center ">
              <div className="w-[30%] flex items-end">
                <Combobox
                  options={CLOUD_PROVIDER}
                  buttonClassname="w-full"
                  dropdownClassname={`p-2`}
                  placeholder={"Select Cloud provider"}
                  selectedOption={CLOUD_PROVIDER.find((o) => {
                    return o.value === values.cloud_provider;
                  })}
                  onSelectData={(name: any) => {
                    setFieldValue("cloud_provider", name.value);
                  }}
                />
              </div>
              <div className="flex items-center h-full w-[15%]">
                <Button type="submit" className="w-full">
                  Update
                </Button>
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default CloudProviderForm;
