"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { UploadIcon } from "@/components/ui/icons/UploadIcon";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import UserAvatar from "@/components/ui/UserAvatar";
import { useApplication } from "@/contexts/application/application.context";
import { useBusinessUpdateMutation } from "@/framework/business/business-update-mutation";
import { useBusinessByIdQuery } from "@/framework/business/get-business-by-id";
import { useImageUploadMutation } from "@/framework/business/image-upload-mutation";
import { options } from "@/lib/utils/common";
import axios from "axios";
import { Form, Formik } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const BusinessInfoForm = () => {
  const [url, setUrl] = useState<any>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
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
        business_profile: {
          address: "",
          description: "",
          email: "",
          vertical: "",
          websites: "",
        },
        ...data,
      }}
      enableReinitialize={true}
      onSubmit={async (values) => {
        const loadingToast = toast.loading("Loading...");
        try {
          await mutateAsync({
            ...values,
          });
          toast.success("Info Updated Successfully", {
            id: loadingToast,
          });
        } catch (error) {
          console.log("error", error);

          toast.error("Fail to update info", {
            id: loadingToast,
          });
        }
      }}
    >
      {({ values, setFieldValue, handleSubmit, handleChange }) => {
        return (
          <Form className="p-6">
            <Text tag={"h1"} size="2xl" weight="medium" className="pb-6">
              Whatsapp Info
            </Text>
            <div className="flex space-x-4 my-1 pb-2">
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
            </div>
            <div className="flex gap-4 w-full h-full mb-8">
              <div className="w-full">
                <Input
                  name="business_profile.address"
                  label="Address"
                  placeholder="Enter address"
                  onChange={handleChange}
                  value={values.business_profile.address || ""}
                  className="w-full"
                />
              </div>
              <div className="w-full">
                <Input
                  name="business_profile.description"
                  label="description"
                  placeholder="Enter description"
                  onChange={handleChange}
                  value={values.business_profile.description || ""}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-4 w-full h-full mb-8">
              <div className="w-full">
                <Input
                  name="business_profile.email"
                  label="Channel Email"
                  placeholder="Enter channel Email"
                  onChange={handleChange}
                  value={values.business_profile.email || ""}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-4 w-full h-full mb-8">
              <div className="w-full flex-1 space-y-1">
                <label
                  htmlFor="Channel Vertical"
                  className="text-sm font-semibold text-text-primary"
                >
                  Channel Vertical
                </label>
                <Combobox
                  buttonClassname={`h-9 w-52`}
                  value={values.business_profile.vertical}
                  onSelectData={(selectedItem: any) => {
                    setFieldValue(
                      "business_profile.vertical",
                      selectedItem.value
                    );
                  }}
                  options={options}
                  selectedOption={options.find(
                    (option: any) =>
                      option.value === values.business_profile.vertical
                  )}
                />
              </div>
              <div className="w-full">
                <Input
                  name="business_profile.websites"
                  label="Websites"
                  placeholder="Enter websites"
                  onChange={handleChange}
                  value={values.business_profile.websites || ""}
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
          </Form>
        );
      }}
    </Formik>
  );
};

export default BusinessInfoForm;
