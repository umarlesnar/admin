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
import { Form, Formik, FieldArray } from "formik";
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Text from "@/components/ui/text";
import { Combobox } from "@/components/ui/combobox";
import { UiyupAlertMessageSchema } from "@/validation-schema/ui/UiYupAlertMessageSchema";
import { toast } from "sonner";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePartnerNotificationMutation } from "@/framework/partner/workspace/notification/notification-mutation";

type Props = {
  children: React.ReactElement;
  data?: any;
};

const TYPE_OPTIONS = [{ name: "Alert" }, { name: "Info" }, { name: "Warning" }];

const AddNotificationSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync } = usePartnerNotificationMutation();

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  const handleColorChange = (e: any, setFieldValue: any) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
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
            Add Message
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-scroll overflow-x-hidden">
          <Formik
            initialValues={{
              title: "",
              body: "",
              type: "",
              background_color: "#000000",
              ios_link: "",
              android_link: "",
              text_color: "#000000",
              status: "ENABLE",
              buttons: [],
            }}
            validationSchema={UiyupAlertMessageSchema}
            onSubmit={async (values, { setErrors, resetForm }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                await mutateAsync({
                  notification_id: data?._id,
                  method: "POST",
                  payload: values,
                });
                toast.success(`Message Added Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Added Message`, {
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
            }) => (
              <Form className="w-full h-full flex flex-col px-1">
                <div className="flex-1 gap-4 space-y-5">
                  <div className="w-full space-y-1">
                    <Input
                      name="title"
                      label="Name"
                      placeholder="Enter a Name"
                      onChange={handleChange}
                      value={values.title}
                      errorKey={errors?.title}
                    />
                  </div>
                  <div className="w-full space-y-1">
                    <Text size="sm" weight="semibold" color="primary">
                      Description
                    </Text>
                    <Textarea
                      name="body"
                      placeholder="Enter a Description"
                      onChange={handleChange}
                      value={values.body}
                      errorKey={errors?.body}
                    />
                  </div>
                  <div className="w-full space-y-1">
                    <Text size="sm" weight="semibold" color="primary">
                      Type
                    </Text>
                    <Combobox
                      options={TYPE_OPTIONS}
                      buttonClassname="w-full"
                      dropdownClassname="p-2"
                      placeholder="Select Type"
                      selectedOption={TYPE_OPTIONS.find(
                        (option) => option.name === values.type
                      )}
                      onSelectData={(selectedType: any) => {
                        setFieldValue("type", selectedType.name);
                      }}
                    />
                  </div>
                  <div className="w-full space-y-1">
                    <Text size="sm" weight="semibold" color="primary">
                      Background Color
                    </Text>
                    <div className="w-full flex items-center gap-2">
                      <Input
                        type="text"
                        name="background_color"
                        placeholder="#000000"
                        onChange={(e) => handleColorChange(e, setFieldValue)}
                        value={values.background_color}
                        errorKey={errors?.background_color}
                        className="w-96"
                      />
                      <Input
                        type="color"
                        name="background_color"
                        onChange={(e) => handleColorChange(e, setFieldValue)}
                        value={values.background_color}
                        className="w-12 h-10 cursor-pointer border-none p-0"
                      />
                    </div>
                  </div>
                  <div className="w-full space-y-1">
                    <Input
                      name="ios_link"
                      label="IOS Link"
                      placeholder="Enter an iOS link"
                      onChange={handleChange}
                      value={values.ios_link}
                      errorKey={errors?.ios_link}
                    />
                  </div>
                  <div className="w-full space-y-1">
                    <Input
                      name="android_link"
                      label="Android Link"
                      placeholder="Enter an Android link"
                      onChange={handleChange}
                      value={values.android_link}
                      errorKey={errors?.android_link}
                    />
                  </div>
                  <div className="w-full space-y-1">
                    <Text size="sm" weight="semibold" color="primary">
                      Text Color
                    </Text>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        name="text_color"
                        placeholder="#000000"
                        onChange={(e) => handleColorChange(e, setFieldValue)}
                        value={values.text_color}
                        errorKey={errors?.text_color}
                        className="w-96"
                      />
                      <Input
                        type="color"
                        name="text_color"
                        onChange={(e) => handleColorChange(e, setFieldValue)}
                        value={values.text_color}
                        className="w-12 h-10 cursor-pointer border-none p-0"
                      />
                    </div>
                    <div>
                      <Text size="sm" weight="semibold" color="primary">
                        Status
                      </Text>
                      <RadioGroup
                        className=" flex"
                        value={values.status}
                        onValueChange={(value) =>
                          setFieldValue("status", value)
                        }
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
                  </div>
                  <FieldArray name="buttons">
                    {({ push, remove }) => (
                      <div className="space-y-5 pb-2">
                        <div className="flex items-center justify-between">
                          <Text size="sm" weight="semibold" color="primary">
                            Button
                          </Text>
                          <Button
                            type="button"
                            className="bg-primary "
                            onClick={() =>
                              push({
                                title: "",
                                web_link: "",
                                ios_link: "",
                                android_link: "",
                                text_color: "",
                                background_color: "",
                              })
                            }
                            disabled={values.buttons.length >= 2}
                          >
                            <PlusIcon className="w-3 h-3 text-white" />
                          </Button>
                        </div>

                        {values.buttons.length > 0 && (
                          <div className="space-y-3">
                            {values.buttons.map((button: any, index) => (
                              <div
                                key={index}
                                className="space-y-2 border p-3 rounded-md"
                              >
                                <Input
                                  name={`buttons[${index}].title`}
                                  label="Button Title"
                                  placeholder="Enter a button title"
                                  onChange={handleChange}
                                  value={button.title}
                                />
                                <Input
                                  name={`buttons[${index}].web_link`}
                                  label="Web Link"
                                  placeholder="Enter a web link"
                                  onChange={handleChange}
                                  value={button.web_link}
                                />
                                <Input
                                  name={`buttons[${index}].ios_link`}
                                  label="iOS Link"
                                  placeholder="Enter an iOS link"
                                  onChange={handleChange}
                                  value={button.ios_link}
                                />
                                <Input
                                  name={`buttons[${index}].android_link`}
                                  label="Android Link"
                                  placeholder="Enter an Android link"
                                  onChange={handleChange}
                                  value={button.android_link}
                                />
                                <div className="w-full space-y-1">
                                  <Text
                                    size="sm"
                                    weight="semibold"
                                    color="primary"
                                  >
                                    Text Color
                                  </Text>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="text"
                                      name={`buttons[${index}].text_color`}
                                      placeholder="#000000"
                                      onChange={(e) =>
                                        handleColorChange(e, setFieldValue)
                                      }
                                      value={button.text_color}
                                      className="w-96"
                                    />
                                    <Input
                                      type="color"
                                      name={`buttons[${index}].text_color`}
                                      onChange={(e) =>
                                        handleColorChange(e, setFieldValue)
                                      }
                                      value={button.text_color}
                                      className="w-9 h-10 cursor-pointer border-none p-0"
                                    />
                                  </div>
                                </div>
                                <div className="w-full space-y-1">
                                  <Text
                                    size="sm"
                                    weight="semibold"
                                    color="primary"
                                  >
                                    Background Color
                                  </Text>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="text"
                                      name={`buttons[${index}].background_color`}
                                      placeholder="#000000"
                                      onChange={(e) =>
                                        handleColorChange(e, setFieldValue)
                                      }
                                      value={button.background_color}
                                      className="w-96"
                                    />
                                    <Input
                                      type="color"
                                      name={`buttons[${index}].background_color`}
                                      onChange={(e) =>
                                        handleColorChange(e, setFieldValue)
                                      }
                                      value={button.background_color}
                                      className="w-9 h-10 cursor-pointer border-none p-0"
                                    />
                                  </div>
                                </div>

                                {values.buttons.length > 0 && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => remove(index)}
                                  >
                                    <DeleteIcon className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </FieldArray>
                </div>

                <div className="flex items-center gap-2 pb-1">
                  <Button
                    type="button"
                    onClick={async () => {
                      handleSubmit();
                    }}
                    className="w-full"
                    disabled={!isValid || isSubmitting}
                  >
                    Add Message
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddNotificationSheet;
