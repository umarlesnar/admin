"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApplication } from "@/contexts/application/application.context";
import { useBusinessByIdQuery } from "@/framework/business/get-business-by-id";
import { Formik } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import BusinessDisplayName from "./BusinessDisplayName";
import axios from "axios";
import Text from "@/components/ui/text";
import { UploadIcon } from "@/components/ui/icons/UploadIcon";
import UserAvatar from "@/components/ui/UserAvatar";
import { toast } from "sonner";
import { useImageUploadMutation } from "@/framework/business/image-upload-mutation";
import { useBusinessUpdateMutation } from "@/framework/business/business-update-mutation";

const options = [
  {
    name: "CONNECTED",
    value: "CONNECTED",
  },
  {
    name: "NOT CONNECTED",
    value: "NOT CONNECTED",
  },
];
const BusinessConfigForm = () => {
  const [url, setUrl] = useState<any>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  // const { mutateAsync } = useWhatsappMutation();
  const { mutateAsync } = useBusinessUpdateMutation();
  const imageUplaod = useImageUploadMutation();
  const { business } = useApplication();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement> | any,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const imageFormData = new FormData();
      const response = await axios.post(
        "/api/business/" + business._id + "/whatsapp/uploads-url",
        {
          file_length: file?.size,
          file_type: file?.type,
          file_name: file?.name,
        }
      );
      imageFormData.append("url", response?.data?.data?.id);
      imageFormData.append("file", file);
      const res = await imageUplaod.mutateAsync(imageFormData);
      const url = URL.createObjectURL(file);

      setUrl(url);
      setFieldValue("business_logo_url", res?.data?.data?.h);
      toast.success("image upload successfully and save the changes");
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
    event.target.value = null;
  };
  const params = useParams();
  const business_id = params?.business_id;

  const { data } = useBusinessByIdQuery(business_id);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Formik
      initialValues={{
        business_logo_url: "",
        name: "",
        wba_id: "",
        phone_number_id: "",
        access_token: "",
        fb_app_id: "",
        wb_status: {
          status: "",
          phone_number: "",
        },
        ...data,
      }}
      onSubmit={async (values) => {
        const loadingToast = toast.loading("Loading...");
        try {
          await mutateAsync({
            ...values,
          });
          toast.success("Business Config Updated Successfully", {
            id: loadingToast,
          });
        } catch (error) {
          console.log("error", error);

          toast.error("Fail to update business config", {
            id: loadingToast,
          });
        }
      }}
    >
      {({ values, setFieldValue, handleSubmit, handleChange }) => {
        return (
          <form className="p-6 ">
            <Text tag={"h1"} size="2xl" weight="medium" className="pb-6">
              Account
            </Text>
            {/* <div className="flex space-x-4 my-1 pb-2">
              {values.business_logo_url ? (
                <img
                  src={`https://static.kwic.in${
                    url ? url : values?.business_logo_url
                  }`}
                  alt="whatsapp profile picture"
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <UserAvatar size="lg">
                  <Text
                    size="xl"
                    weight="semibold"
                    className="capitalize"
                    textColor="white"
                  >
                    {business?.name?.charAt(0)}
                  </Text>
                </UserAvatar>
              )}

              <div className="flex flex-1 flex-col space-y-1">
                <label
                  htmlFor="upload-photo"
                  className="bg-primary-50 border border-primary-100 w-fit rounded-md px-3 py-2 text-sm flex gap-1 items-center cursor-pointer"
                >
                  <UploadIcon className="mr-1 text-primary-800" />
                  <Text textColor="text-primary-800">
                    {isUploading ? "Uploading..." : "Upload Photo"}
                  </Text>
                  <input
                    id="upload-photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setFieldValue)}
                    style={{ display: "none" }}
                  />
                </label>
                <Text size="xs" color="secondary" className="mt-1">
                  A square image with a maximum edge of 640px and a size up to
                  5MB is recommended.
                </Text>
              </div>
            </div> */}

            <div>
              <BusinessDisplayName />
            </div>
            <div className="flex gap-4 w-full h-full mb-8">
              <div className="w-full">
                <Input
                  name="name"
                  label="Business Name"
                  placeholder="Enter business name"
                  onChange={handleChange}
                  value={values.name || ""}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-4 w-full h-full mb-8">
              <div className="w-full">
                <Input
                  name="wba_id"
                  label="WhatsApp Business Id"
                  placeholder="Enter whatsapp business id"
                  onChange={handleChange}
                  value={values.wba_id || ""}
                  className="w-full"
                />
              </div>
              <div className="w-full">
                <Input
                  name="phone_number_id"
                  label="Phone Number Id"
                  placeholder="Enter phone number id"
                  onChange={handleChange}
                  value={values.phone_number_id || ""}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-4 w-full h-full mb-8">
              <div className="w-full space-y-1">
                <label
                  htmlFor="access_token"
                  className="text-sm font-semibold text-text-primary"
                >
                  Access Token
                </label>
                <Textarea
                  name="access_token"
                  placeholder="Enter access token"
                  onChange={handleChange}
                  value={values.access_token || ""}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-4 w-full h-full mb-8">
              <div className="w-full">
                <Input
                  name="fb_app_id"
                  label="App Id"
                  placeholder="Enter app id"
                  onChange={handleChange}
                  value={values.fb_app_id || ""}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-4 w-full h-full mb-8">
              <div className="w-full flex-1 space-y-1">
                <label
                  htmlFor="status"
                  className="text-sm font-semibold text-text-primary"
                >
                  Status
                </label>
                <Combobox
                  buttonClassname={`h-9 w-52`}
                  value={values.wb_status?.status}
                  onSelectData={(selectedItem: any) => {
                    setFieldValue("wb_status.status", selectedItem.value);
                  }}
                  options={options}
                  selectedOption={options.find(
                    (option: any) => option.value === data?.wb_status?.status
                  )}
                />
              </div>
              <div className="w-full">
                <Input
                  name="wb_status.phone_number"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  onChange={handleChange}
                  value={values.wb_status.phone_number || ""}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Update
              </Button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default BusinessConfigForm;
