import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Text from "@/components/ui/text";
import { Form, Formik } from "formik";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Combobox } from "@/components/ui/combobox";
import { useIntegrationMutation } from "@/framework/integrations-library/integrations-mutation";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { useMediaUploadMutation } from "@/framework/media/media-upload-mutation";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { UiYupIntegrationSchema } from "@/validation-schema/ui/UiYupIntegrationSchema";
import { useIntegrationCategoryApi } from "@/framework/integrations-library/category/get-category";
import { Switch } from "@/components/ui/switch";

type Props = {
  children: ReactElement;
  data?: any;
};

const TEMPLATE_LANGUAGES = [
  { value: "bn", name: "BENGALI" },
  { value: "en_US", name: "ENGLISH US" },
  { value: "en", name: "English" },
  { value: "gu", name: "GUJARATI" },
  { value: "hi", name: "HINDI" },
  { value: "kn", name: "KANNADA" },
  { value: "ml", name: "MALAYALAM" },
  { value: "mr", name: "MARATHI" },
  { value: "pa", name: "PUNJABI" },
  { value: "ta", name: "TAMIL" },
  { value: "te", name: "TELUGU" },
];

const AddIntegrationSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync } = useIntegrationMutation();
  const media = useMediaUploadMutation();

  const CategoryData = useIntegrationCategoryApi({});

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="w-[400px] sm:w-[500px] h-screen flex flex-col p-5"
        onOpenAutoFocus={preventFocus}
      >
        <SheetHeader className="flex flex-row items-center gap-4">
          <SheetClose asChild>
            <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
          </SheetClose>
          <SheetTitle className="h-full text-text-primary text-xl font-semibold">
            Add Integration
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              image_url: "",
              name: "",
              description: "",
              type: "",
              tutorial_link: "",
              documentation_link: "",
              price: "Free",
              language: "English",
              category: "",
              link: "",
              coming_soon: false,
              status: "ENABLE",
            }}
            onSubmit={async (values, { setErrors, resetForm }) => {
              const loadingToast = toast.loading("Loading...");

              const getFilePathFromUrl = (url: string) => {
                return url.replace(/^https?:\/\/[^/]+/, "");
              };

              const updatedValues = {
                ...values,
                image_url: getFilePathFromUrl(values.image_url),
              };

              try {
                const response = await mutateAsync({
                  method: "POST",
                  payload: updatedValues,
                });
                toast.success(`Integration Added Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Add Integration`, {
                  id: loadingToast,
                });

                if (error.response) {
                  if (
                    error.response.status ===
                    SERVER_STATUS_CODE.VALIDATION_ERROR_CODE
                  ) {
                    setErrors(error.response.data.data);
                  } else {
                  }
                } else {
                }
              }
            }}
            validationSchema={UiYupIntegrationSchema}
            enableReinitialize
          >
            {({
              values,
              errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              resetForm,
              isValid,
            }) => {
              const changeHandler = async (event: any) => {
                event.preventDefault();

                const fileUploaded = event.target.files[0];
                const response: any = await media.mutateAsync({
                  payload: fileUploaded,
                  file_path_type: "general",
                });
                setFieldValue("image_url", response.public_url || "");
              };
              return (
                <Form className="w-full h-full  flex flex-col p-1">
                  <div className="flex-1 gap-4 space-y-5 pb-8">
                    <div className="space-y-4">
                      <Text size="base" tag="label" weight="medium">
                        Integration Logo <span className="text-red-500">*</span>
                      </Text>
                      <input
                        type="file"
                        ref={inputRef}
                        onChange={changeHandler}
                        style={{ display: "none" }}
                        accept={"image/png,image/jpeg"}
                      />
                      <div className="space-y-3">
                        {values.image_url ? (
                          <div className="relative w-32 h-32">
                            <img
                              src={values.image_url}
                              alt="Uploaded"
                              loading="eager"
                              className=" object-cover rounded-md  w-32 h-32"
                            />
                            <div
                              className="absolute top-1 right-1 p-1.5 bg-white rounded-full shadow cursor-pointer"
                              onClick={() => {
                                setFieldValue("image_url", ""); // Reset the image URL
                              }}
                            >
                              <CloseIcon className="w-3 h-3 text-red-500" />
                            </div>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            className="h-full"
                            leftIcon={<PlusIcon className="w-4 h-4 mr-[6px]" />}
                            onClick={() => {
                              inputRef?.current?.click();
                            }}
                            disabled={media?.isPending}
                            loading={media?.isPending}
                          >
                            Add Logo
                          </Button>
                        )}
                      </div>
                      <Text size="xs" textColor="text-red-500">
                        {" "}
                        {errors?.image_url}
                      </Text>
                    </div>

                    <div className="w-full space-y-1">
                      <Input
                        name="name"
                        label="Name"
                        isRequired
                        placeholder="Enter a name"
                        onChange={handleChange}
                        value={values.name}
                        errorKey={errors?.name}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Description
                      </Text>
                      <Textarea
                        name="description"
                        placeholder="Enter a description"
                        onChange={handleChange}
                        value={values.description}
                        errorKey={errors?.description}
                      />
                    </div>
                    <div className="w-full space-y-2">
                      <Input
                        name="type"
                        label="Type"
                        placeholder="Enter a type name"
                        isRequired
                        onChange={(e: any) => {
                          setFieldValue(
                            "type",
                            e.target.value.replace(/ /g, "_").toLowerCase()
                          );
                        }}
                        value={values.type}
                        errorKey={errors?.type}
                      />
                      <Text size="xs" weight="light" color="secondary">
                        {`Don't use any Special Characters in Type Name`}
                      </Text>
                    </div>
                    <div className="w-full space-y-1">
                      <Input
                        name="tutorial_link"
                        label="Tutorial Link"
                        placeholder="Enter a tutorial link"
                        onChange={handleChange}
                        value={values.tutorial_link}
                        errorKey={errors?.tutorial_link}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Input
                        name="documentation_link"
                        label="Documentation Link"
                        placeholder="Enter a documentation link"
                        onChange={handleChange}
                        value={values.documentation_link}
                        errorKey={errors?.documentation_link}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Input
                        name="price"
                        label="Price"
                        placeholder="Enter a price"
                        onChange={handleChange}
                        value={values.price}
                        errorKey={errors?.price}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Language
                      </Text>
                      <Combobox
                        options={TEMPLATE_LANGUAGES}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Select language"}
                        selectedOption={TEMPLATE_LANGUAGES.find((o) => {
                          return o.name === values.language;
                        })}
                        onSelectData={(name: any) => {
                          setFieldValue("language", name.name);
                        }}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Category
                      </Text>
                      <span className="text-red-500 ml-1">*</span>
                      <Combobox
                        options={CategoryData?.data?.items?.filter(
                          (item: any) => item.status === "ENABLE"
                        )}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Select category"}
                        selectedOption={CategoryData?.data?.items.find(
                          (o: any) => {
                            return o.name === values.category;
                          }
                        )}
                        onSelectData={(name: any) => {
                          setFieldValue("category", name.name);
                        }}
                      />
                      {errors?.category && (
                        <span className="text-red-500 text-xs ml-1">
                          {errors?.category}
                        </span>
                      )}
                    </div>
                    <div className="w-full space-y-1">
                      <Input
                        name="link"
                        label="Link"
                        isRequired
                        placeholder="Enter a link"
                        onChange={handleChange}
                        value={values.link}
                        errorKey={errors?.link}
                      />
                    </div>

                    <Text size="sm" weight="semibold" color="secondary">
                      Status
                    </Text>
                    <RadioGroup
                      className=" flex"
                      value={values.status}
                      onValueChange={(value) => setFieldValue("status", value)}
                    >
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <RadioGroupItem id="ENABLE" value="ENABLE" />
                        <Text size="sm">Enable</Text>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <RadioGroupItem id="DISABLE" value="DISABLE" />
                        <Text size="sm">Disable</Text>
                      </label>
                    </RadioGroup>
                  </div>

                  <div className="sticky bottom-0 bg-white pt-2 flex items-center gap-2">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={!isValid || isSubmitting}
                    >
                      Add Integration
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setOpen(false);
                        resetForm({});
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddIntegrationSheet;
