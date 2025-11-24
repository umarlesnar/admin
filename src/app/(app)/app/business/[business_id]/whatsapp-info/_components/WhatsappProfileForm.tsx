"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { AddIcon } from "@/components/ui/icons/AddIcon";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { UploadIcon } from "@/components/ui/icons/UploadIcon";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/ui/UserAvatar";
import { useApplication } from "@/contexts/application/application.context";
// import { useImageUploadMutation } from "@/framework/whatsapp/image-upload-mutation";
// import { useWhatsappMutation } from "@/framework/whatsapp/whatsapp-mutation";
import axios from "axios";
import { FieldArray, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
// import { vertical } from "../../team-management/_components/constants/teamoptions";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import { EllipsisVertical, Globe, Mail, Store } from "lucide-react";
import { LocationIcon } from "@/components/ui/icons/LocationIcon";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useBusinessByIdQuery } from "@/framework/business/get-business-by-id";
import { useParams } from "next/navigation";
import { useBusinessUpdateMutation } from "@/framework/business/business-update-mutation";
import { useImageUploadMutation } from "@/framework/business/image-upload-mutation";
// import { useWhatsappQuery } from "@/framework/whatsapp/get-whatsapp-profile";

type Props = {};

export const vertical = [
  { value: "BEAUTY", name: "Beauty,spa and salon" },
  { value: "APPAREL", name: "Clothing" },
  { value: "EDU", name: "Education" },
  { value: "ENTERTAIN", name: "Entertaiment" },
  { value: "EVENT_PLAN", name: "Event planning and service" },
  { value: "FINANCE", name: "Finance and banking" },
  { value: "GROCERY", name: "Food and groceries" },
  { value: "GOVT", name: "Public service" },
  { value: "HOTEL", name: "Hodel and lodging" },
  { value: "HEALTH", name: "Medical and health" },
  { value: "NONPROFIT", name: "Charity" },
  { value: "PROF_SERVICES", name: "Professional services" },
  { value: "RETAIL", name: "Shopping and retail" },
  { value: "TRAVEL", name: "Travel and transportation" },
  { value: "RESTAURANT", name: "Restaurant" },
  { value: "NOT_A_BIZ", name: "Not a business" },
  { value: "OTHER", name: "Other" },
];

const WhatsappProfileForm = (props: Props) => {
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
    <div className="w-full h-auto flex flex-col  ">
      <Formik
        initialValues={{
          about: "",
          vertical: "",
          description: "",
          address: "",
          email: "",
          websites: [],
          ...data?.business_profile,
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
        enableReinitialize
      >
        {({ values, errors, handleChange, handleSubmit, setFieldValue }) => {
          return (
            <div className="w-full flex flex-col p-4 space-y-4  ">
              <div className="flex items-center justify-between">
                <div className="">
                  <Text size="lg" weight="semibold" color="primary">
                    Whatsapp Profile
                  </Text>
                  <Text color="secondary">
                    Optimize and Control Your WhatsApp Profile
                  </Text>
                </div>
                <Button
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Save
                </Button>
              </div>{" "}
              <div className="flex space-x-4 my-1 pb-2">
                {url || values.profile_picture_url ? (
                  <img
                    src={url ? url : values.profile_picture_url}
                    alt="whatsapp profile picture"
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <UserAvatar size="lg">
                    <Text size="2xl" weight="semibold" color="white">
                      {business?.name?.charAt(0)?.toUpperCase()}
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
                    5MB is recommended. Images with a height or width less than
                    192px may cause issues during resizing.
                  </Text>
                </div>
              </div>
              <div className="w-full flex-1 flex items-start gap-5">
                <div className="h-full flex-1 space-y-3">
                  <div className="space-y-2">
                    <Text color="secondary" size="sm" weight="medium">
                      About
                    </Text>
                    <Input
                      name="about"
                      placeholder="Hey there! I am using WhatsApp."
                      onChange={handleChange}
                      errorKey={errors?.about}
                      value={values.about}
                    />
                  </div>{" "}
                  <div className="space-y-2">
                    <Text color="secondary" size="sm" weight="medium">
                      Business Verticals
                    </Text>

                    <Combobox
                      options={vertical}
                      buttonClassname="w-full"
                      dropdownClassname={`p-2`}
                      selectedOption={vertical.find((o) => {
                        return o.value == values.vertical;
                      })}
                      placeholder={"Select Vertical"}
                      onSelectData={(item: any) => {
                        setFieldValue("vertical", item?.value);
                      }}
                    />
                  </div>{" "}
                  <div className="space-y-2">
                    <Text color="secondary" size="sm" weight="medium">
                      Business Description
                    </Text>
                    <Textarea
                      name="description"
                      placeholder="Write here..."
                      onChange={handleChange}
                      errorKey={errors?.description}
                      value={values.description}
                    />
                  </div>
                  <div className="space-y-2">
                    <Text color="secondary" size="sm" weight="medium">
                      Business address
                    </Text>
                    <Input
                      name="address"
                      placeholder="Your Business Name"
                      onChange={handleChange}
                      errorKey={errors.address}
                      value={values.address}
                    />
                  </div>
                  <div className="space-y-2">
                    <Text color="secondary" size="sm" weight="medium">
                      Email
                    </Text>
                    <Input
                      name="email"
                      placeholder="Your Business Email"
                      onChange={handleChange}
                      errorKey={errors.email}
                      value={values.email}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldArray name="websites">
                      {({ remove, push }) => (
                        <>
                          <div className="flex items-center justify-between">
                            <Text color="secondary" size="sm" weight="medium">
                              Websites
                            </Text>
                            {values?.websites?.length < 2 && (
                              <div
                                className="w-6 h-6 bg-primary flex items-center justify-center rounded-md cursor-pointer"
                                onClick={() => {
                                  push("");
                                }}
                              >
                                <AddIcon className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>

                          {values?.websites?.map((website: any, index: any) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 mt-2 w-full"
                            >
                              <div className="w-full">
                                <Input
                                  placeholder="www.example.com"
                                  name={`websites.${index}`}
                                  className="w-full pr-10"
                                  onChange={handleChange}
                                  value={website}
                                />
                              </div>
                              <Button
                                type="button"
                                onClick={() => remove(index)}
                                variant="secondary"
                              >
                                <DeleteIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </>
                      )}
                    </FieldArray>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default WhatsappProfileForm;
