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
import { Form, Formik, FieldArray, ErrorMessage } from "formik";
import React, { ReactElement, useRef, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useModulesQuery } from "@/framework/modules/get-modules";
import { Listbox } from "@/components/ui/listbox";
import { Switch } from "@/components/ui/switch";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { Combobox } from "@/components/ui/combobox";
import { UiyupWorkspaceModuleSchema } from "@/validation-schema/ui/UiYupWorkspaceModuleSchema";
import { useCreateWorkspaceModuleMutation } from "@/framework/partner/workspace/modules/module-mutation";

type Props = {
  children: ReactElement;
  data?: any;
  onSuccess?: () => void;
};
const PLANS = [
  {
    value: "plan",
    name: "Plan",
  },
  {
    value: "trial",
    name: "Trial",
  },
  {
    value: "addon",
    name: "Addon",
  },
];

const AddWorkspaceModuleSheet = ({ children, data, onSuccess }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync } = useCreateWorkspaceModuleMutation();
  const Modules = useModulesQuery({
    per_page: 1000,
    page: 1,
    sort: {},
    filter: {},
  });

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
            Add Module
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-hidden">
          <Formik
            initialValues={{
              module_id: "",
              source: "",
              is_visibility: true,
              enabled: true,
              config: {} as Record<string, string>,
              expired_at: "",
            }}
            validationSchema={UiyupWorkspaceModuleSchema}
            onSubmit={async (values, { setErrors }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                const response = await mutateAsync({
                  method: "POST",
                  payload: values,
                });
                toast.success(`Module Added Successfully`, {
                  id: loadingToast,
                });
                onSuccess?.();
                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Add Module`, {
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
                <Form className="w-full h-full  flex flex-col">
                  <div className="flex-1 overflow-y-auto">
                  <div className="gap-4 space-y-6 px-1">
                    <div className="w-full space-y-2">
                      <Text size="sm" weight="semibold" color="primary">
                        Modules
                      </Text>
                      <Combobox
                        options={Modules?.data?.items?.filter(
                          (module: any) => module.is_active === true
                        )}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Select Modules"}
                        selectedOption={Modules?.data?.items.find((o: any) => {
                          return o.name === values.module_id;
                        })}
                        onSelectData={(type: any) => {
                          setFieldValue("module_id", type.name);
                        }}
                      />
                      <ErrorMessage
                        name="module_id"
                        component={"p"}
                        className="text-xs text-red-500"
                      />
                      <div>
                        <Text
                          size="sm"
                          weight="medium"
                          className="text-gray-600 mb-1"
                        >
                          Source
                        </Text>
                        <Listbox
                          options={PLANS}
                          buttonClassname="w-full"
                          selectedOption={PLANS.find(
                            (plan) => plan.value === values.source
                          )}
                          onSelectData={(selected: any) => {
                            setFieldValue("source", selected.value);
                          }}
                          placeholder="Select Source"
                        />
                        <ErrorMessage
                          name="source"
                          component={"p"}
                          className="text-xs text-red-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Text size="sm" weight="medium">
                        Module Status
                      </Text>
                      <Switch
                        checked={values.enabled}
                        onCheckedChange={(checked) =>
                          setFieldValue("enabled", checked)
                        }
                      />
                      {values.source !== "plan" && (
                        <div>
                          <Text size="sm" weight="medium">
                            Expired At
                          </Text>
                          <Input
                            type="datetime-local"
                            value={values.expired_at}
                            onClick={(e) => {
                              e.currentTarget.showPicker();
                            }}
                            onChange={(e) => {
                              setFieldValue("expired_at", e.target.value);
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Text size="sm" weight="medium">
                        Visibility
                      </Text>
                      <Switch
                        checked={values.is_visibility}
                        onCheckedChange={(checked) =>
                          setFieldValue("is_visibility", checked)
                        }
                      />
                    </div>

                    <div>
                      <Text size="sm" weight="medium">
                        Configuration
                      </Text>
                      <FieldArray name="config">
                        {() => {
                          const selectedModule = Modules?.data?.items?.find(
                            (module: any) => module.name === values.module_id
                          );
                          const configKeys = selectedModule?.config
                            ? Object.keys(selectedModule.config)
                            : [];
                          const customKeys = Object.keys(values.config).filter(
                            (key) => !configKeys.includes(key)
                          );

                          return (
                            <div className="space-y-2">
                              {/* Default config keys from module */}
                              {configKeys.map((key: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <Input
                                    value={key}
                                    disabled
                                    className="flex-1"
                                    placeholder="Key"
                                  />
                                  <Input
                                    placeholder="Enter value"
                                    value={values.config[key] || ""}
                                    onChange={(e) => {
                                      setFieldValue(
                                        `config.${key}`,
                                        e.target.value
                                      );
                                    }}
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="cursor-not-allowed"
                                  >
                                    <DeleteIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}

                              {/* Custom added keys */}
                              {customKeys.map((key: string, index: number) => (
                                <div
                                  key={`custom-${index}`}
                                  className="flex items-center space-x-2"
                                >
                                  <Input
                                    value={
                                      key ===
                                      "custom_key_" + key.split("_").pop()
                                        ? ""
                                        : key
                                    }
                                    onChange={(e) => {
                                      const newConfig = {
                                        ...values.config,
                                      };
                                      delete newConfig[key];
                                      newConfig[e.target.value] =
                                        values.config[key];
                                      setFieldValue("config", newConfig);
                                    }}
                                    className="flex-1"
                                    placeholder="enter key"
                                  />
                                  <Input
                                    placeholder="Enter value"
                                    value={values.config[key] || ""}
                                    onChange={(e) => {
                                      setFieldValue(
                                        `config.${key}`,
                                        e.target.value
                                      );
                                    }}
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newConfig = {
                                        ...values.config,
                                      };
                                      delete newConfig[key];
                                      setFieldValue("config", newConfig);
                                    }}
                                    className="hover:text-red-500"
                                  >
                                    <DeleteIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              {/* Add new key-value pair button */}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newKey = `custom_key_${Date.now()}`;
                                  setFieldValue(`config.${newKey}`, "");
                                }}
                                leftIcon={<PlusIcon className="h-3 w-3 mr-2" />}
                              >
                                Add
                              </Button>
                            </div>
                          );
                        }}
                      </FieldArray>
                    </div>
                  </div>
                  </div>

                  <div className="flex items-center gap-2 pb-1 pt-4 bg-white">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={isSubmitting}
                    >
                      Add Module
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

export default AddWorkspaceModuleSheet;
