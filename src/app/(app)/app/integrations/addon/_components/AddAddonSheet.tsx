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
import { FieldArray, Form, Formik } from "formik";
import React, { ReactElement, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useAddonMutation } from "@/framework/addon/addon-mutation";
import Text from "@/components/ui/text";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { Switch } from "@/components/ui/switch";
import { UiYupAddonSchema } from "@/validation-schema/ui/UiYupAddonSchema";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
type Props = {
  children: ReactElement;
  data?: any;
};

const CATEGORY = [
    { value: "AI", name: "AI" },
    { value: "Storage", name: "Storage" },
    { value: "Integration", name: "Integration" },
    { value: "Workspace", name: "Workspace" },
  ];

  const TYPE = [
    { value: "flat", name: "flat" },
    { value: "usage", name: "usage" },
    { value: "free", name: "free" },
  ];

const AddAddonSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = useAddonMutation();

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
            Add Addon
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              name: "",
              code: "",
              config: "",
              description: "",
              category: "",
              billing_type: "",
              price_per_month: "",
              default_limit: "5000",
              is_public: true,
            }}
            validationSchema={UiYupAddonSchema}
            onSubmit={async (values, { setErrors }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                const response = await mutateAsync({
                  method: "POST",
                  payload: values,
                });
                toast.success(`Addon Added Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Add Addon`, {
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
              return (
                <Form className="w-full h-full  flex flex-col px-1">
                  <div className="flex-1 gap-4 space-y-5 ">
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
                      <Input
                        name="code"
                        label="Code"
                        placeholder="Enter a code"
                        onChange={handleChange}
                        value={values.code}
                        errorKey={errors?.code}
                      />
                    </div>
                    <div className="w-full space-y-1">
                        <Text size="sm" tag="label" weight="medium">
                          Configation
                        </Text>
                        <Textarea
                          name="config"
                          placeholder="Enter a configation"
                          onChange={handleChange}
                          value={values.config}
                          errorKey={errors?.config}
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
                    <div className="flex items-start gap-2">
                       <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Category
                      </Text>
                      <Combobox
                        options={CATEGORY}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Select Category"}
                        selectedOption={CATEGORY.find((o) => {
                          return o.name === values.category;
                        })}
                        onSelectData={(category: any) => {
                          setFieldValue("category", category.name);
                        }}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Billing Type
                      </Text>
                      <Combobox
                        options={TYPE}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Select Billing Type"}
                        selectedOption={TYPE.find((o) => {
                          return o.name === values.billing_type;
                        })}
                        onSelectData={(type: any) => {
                          setFieldValue("billing_type", type.name);
                         
                        }}
                      />
                    </div>
                    </div>
                    <div className="w-full space-y-1">
                      <Input
                        name="price_per_month"
                        label="Price Per Month"
                        placeholder="Enter a price per month"
                        onChange={handleChange}
                        value={values.price_per_month}
                        errorKey={errors?.price_per_month}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Input
                        name="default_limit"
                        label="Default Limit"
                        placeholder="Enter a default limit"
                        onChange={handleChange}
                        value={values.default_limit}
                        errorKey={errors?.default_limit}
                      />
                    </div>
{/* 
                    <div className="space-y-2">
                      <FieldArray name="config.models">
                        {({ push, remove }) => (
                          <div className="space-y-2">
                            <div className="w-full flex items-center justify-between pb-1">
                              <Text size="sm" weight="semibold">
                                Models
                              </Text>
                              <div
                                className="w-6 h-6 bg-primary flex items-center justify-center rounded-md cursor-pointer mr-1"
                                onClick={() => push("")}
                              >
                                <PlusIcon className="w-3 h-3 text-white" />
                              </div>
                            </div>
                            {values.config.models.map(
                              (model: any, index: any) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <Input
                                    name={`config.models[${index}]`}
                                    placeholder="Enter model name"
                                    value={model}
                                    onChange={handleChange}
                                    errorKey={errors?.config?.models?.[index]}
                                    className="w-[415px]"
                                  />
                                  <DeleteIcon
                                    className="w-4 h-4 cursor-pointer text-red-500"
                                    onClick={() => remove(index)}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </FieldArray>
                    </div> */}
                    {/* Features Switches */}
                    {/* <div className="space-y-2">
                      <Text size="sm" weight="semibold" color="primary">Features</Text>
                      <div className="space-y-4">
                        {[
                          { name: "code_assistance", label: "Code Assistance" },
                          {
                            name: "image_generation",
                            label: "Image Generation",
                          },
                          {
                            name: "audio_transcription",
                            label: "Audio Transcription",
                          },
                        ].map((feature) => (
                          <div
                            key={feature.name}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-text-primary">
                              {feature.label}
                            </span>
                            <Switch
                              id={`config.features.${feature.name}`}
                              checked={
                                values.config.features[
                                  feature.name as keyof typeof values.config.features
                                ]
                              }
                              onCheckedChange={(checked: boolean) =>
                                setFieldValue(
                                  `config.features.${feature.name}`,
                                  checked
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div> */}

                    {/* <div className="w-full space-y-1">
                      <Input
                        name="config.max_input_tokens"
                        label="Max Input Tokens"
                        placeholder="Enter a max input tokens"
                        onChange={handleChange}
                        value={values.config.max_input_tokens}
                        errorKey={errors?.config?.max_input_tokens}
                      />
                    </div> */}
                    {/* <div className="w-full space-y-1">
                      <Input
                        name="config.max_output_tokens"
                        label="Max Output Tokens"
                        placeholder="Enter a max output tokens"
                        onChange={handleChange}
                        value={values.config.max_output_tokens}
                        errorKey={errors?.config?.max_output_tokens}
                      />
                    </div> */}
                    <div className="space-y-2">
                      <Text size="sm" weight="semibold" color="primary">
                        Addon Visibility
                      </Text>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          name="is_public"
                          checked={values.is_public}
                          onChange={(e) =>
                            setFieldValue("is_public", e.target.checked)
                          }
                        />
                        <span className="text-sm text-text-primary">
                          Make addon public
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pb-1 pt-4">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={isSubmitting}
                    >
                        Add Addon
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

export default AddAddonSheet;