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
import { FieldArray, Form, Formik } from "formik";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useIntegrationCategoryApi } from "@/framework/integrations-library/category/get-category";
import { Switch } from "@/components/ui/switch";
import { useMasterModulesMutation } from "@/framework/modules/modules-mutation";
import { UiYupModuleSchema } from "@/validation-schema/ui/UiYupMasterModuleSchema";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";

type Props = {
  children: ReactElement;
  data?: any;
};

const EditModuleSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync } = useMasterModulesMutation();

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
            Update Module
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              module_id: "",
              name: "",
              description: "",
              category: "",
              sort_order: 0,
              default_permission: [] as string[],
              config: {} as Record<string, string>,
              is_active: true,
              ...data,
            }}
            onSubmit={async (values, { setErrors }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                const response = await mutateAsync({
                  modules_id: data?._id,
                  method: "PUT",
                  payload: values,
                });

                toast.success(`Module Updated Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Update Module`, {
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
            validationSchema={UiYupModuleSchema}
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
                <Form className="w-full h-full  flex flex-col p-1">
                  <div className="flex-1 gap-4 space-y-5 pb-8">
                    <div className="w-full space-y-1">
                      <Input
                        name="module_id"
                        label="Module Id"
                        isRequired
                        placeholder="Enter a Module Id"
                        onChange={handleChange}
                        value={values.module_id}
                        errorKey={errors?.module_id}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Input
                        name="name"
                        label="Module Name"
                        isRequired
                        placeholder="Enter a module name"
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
                    </div>
                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                       Permissions
                      </Text>
                      <div className="space-y-2">
                        <Input
                          placeholder="Enter permission"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const value = e.currentTarget.value.trim();
                              if (
                                value &&
                                !values.default_permission.includes(value)
                              ) {
                                setFieldValue("default_permission", [
                                  ...values.default_permission,
                                  value,
                                ]);
                                e.currentTarget.value = "";
                              }
                            }
                          }}
                          className="flex-1"
                        />
                        <div className="flex flex-wrap gap-2">
                          {values.default_permission.map(
                            (permission:any, index:any) => (
                              <div
                                key={index}
                                className="flex items-center w-auto px-2 py-1 border rounded-full bg-gray-50"
                              >
                                <Text className="flex-1">{permission}</Text>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="hover:text-red-500 p-1 h-auto ml-1"
                                  size="sm"
                                  onClick={() => {
                                    const newPermissions =
                                      values.default_permission.filter(
                                        (_: any, i: any) => i !== index
                                      );
                                    setFieldValue(
                                      "default_permission",
                                      newPermissions
                                    );
                                  }}
                                >
                                  <DeleteIcon className="w-3 h-3" />
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Configuration
                      </Text>
                      <div className="space-y-2">
                        <Input
                          placeholder="Enter configuration key"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const key = e.currentTarget.value.trim();
                              if (key && !values.config[key]) {
                                setFieldValue("config", {
                                  ...values.config,
                                  [key]: null,
                                });
                                e.currentTarget.value = "";
                              }
                            }
                          }}
                          className="flex-1"
                        />
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(values.config).map((key) => (
                            <div
                              key={key}
                              className="flex items-center w-auto px-2 py-1 border rounded-full bg-gray-50"
                            >
                              <Text className="flex-1">{key}</Text>
                              <Button
                                type="button"
                                variant="ghost"
                                className="hover:text-red-500 p-1 h-auto ml-1"
                                size="sm"
                                onClick={() => {
                                  const newConfig = { ...values.config };
                                  delete newConfig[key];
                                  setFieldValue("config", newConfig);
                                }}
                              >
                                <DeleteIcon className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-full space-y-1">
                      <Input
                        name="sort_order"
                        label="Sort Order"
                        type="number"
                        placeholder="Enter sort order"
                        onChange={handleChange}
                        value={values.sort_order}
                        errorKey={errors?.sort_order}
                      />
                    </div>

                    <div className="w-full space-y-1 flex items-center justify-between">
                      <Text size="sm" tag="label" weight="medium">
                        Active Status
                      </Text>
                      <Switch
                        checked={values.is_active}
                        onCheckedChange={(checked) =>
                          setFieldValue("is_active", checked)
                        }
                      />
                    </div>
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
                      Update Module
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

export default EditModuleSheet;
