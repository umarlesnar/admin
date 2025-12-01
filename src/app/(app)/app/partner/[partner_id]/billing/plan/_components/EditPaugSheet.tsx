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
import React, { ReactElement, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { UiYupPaugSchema } from "@/validation-schema/ui/UiYupPoductSchema";
import { Combobox } from "@/components/ui/combobox";
import PlanFormLists from "./PlanFormPage";
import { usePartnerProductMutation } from "@/framework/partner/partner-product-mutation";
import { ModulesIcon } from "@/components/ui/icons/ModulesIcon";
import PlanIncludedModulesSheet from "./PlanIncludedModulesSheet";
import { ModuleConfig } from "./PlanModuleConfigSheet";

type Props = {
  children: ReactElement;
  data?: any;
};

const CURRENCY_CODE = [{ value: "INR", name: "INR" }];

const PLAN_TYPE = [{ value: "paug", name: "paug" }];

const DISCOUNT_TYPE = [
  { value: "percentage", name: "percentage" },
  { value: "fixed", name: "fixed" },
];

const EditPaugSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [manageModulesOpen, setManageModulesOpen] = useState(false);
  const { mutateAsync } = usePartnerProductMutation();

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
            Update Plan
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              name: "",
              plan_type: "paug",
              price: "",
              discount_type: "",
              discount_value: "",
              feature: data?.feature || [],
              currency_code: "",
              status: "ENABLE",
              ...data,
              // Normalize included_modules data for backward compatibility
              included_modules: (data?.included_modules || []).map((m: any) => {
                if (typeof m === "string") {
                  return {
                    module_id: m,
                    enabled: true,
                    is_visibility: true,
                    config: {},
                  };
                }
                return {
                  ...m,
                  config: m.config || {},
                };
              }) as ModuleConfig[],
            }}
            validationSchema={UiYupPaugSchema}
            onSubmit={async (values, { setErrors, resetForm }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                await mutateAsync({
                  product_id: data?._id,
                  method: "PUT",
                  payload: values,
                });
                toast.success(`Plan Update Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Update Plan`, {
                  id: loadingToast,
                });

                if (error.response) {
                  if (
                    error.response.status ===
                    SERVER_STATUS_CODE.VALIDATION_ERROR_CODE
                  ) {
                    setErrors(error.response.data.data);
                  }
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
                <Form className="w-full h-full flex flex-col px-1">
                  <div className="flex-1 gap-4 space-y-5 pb-8">
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

                    <div className="space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Plan
                      </Text>
                      <Combobox
                        options={PLAN_TYPE}
                        buttonClassname="w-full"
                        dropdownClassname="p-2"
                        placeholder="Select Plan"
                        selectedOption={PLAN_TYPE.find(
                          (o) => o.name === values.plan_type
                        )}
                        onSelectData={(option: any) => {
                          setFieldValue("plan_type", option.value);
                        }}
                      />
                    </div>

                    {/* MODULES SECTION */}
                    <div className="w-full space-y-2 border rounded-md p-4 bg-gray-50/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-primary-50 rounded-md">
                            <ModulesIcon className="w-4 h-4 text-primary-600" />
                          </div>
                          <div className="flex flex-col">
                            <Text size="sm" weight="semibold">
                              Included Modules
                            </Text>
                            <Text size="xs" className="text-gray-500">
                              {values.included_modules.length} modules
                              configured
                            </Text>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setManageModulesOpen(true)}
                        >
                          Manage
                        </Button>
                      </div>
                    </div>

                    <PlanIncludedModulesSheet
                      open={manageModulesOpen}
                      onClose={() => setManageModulesOpen(false)}
                      modules={values.included_modules}
                      onChange={(modules) =>
                        setFieldValue("included_modules", modules)
                      }
                    />

                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Discount
                      </Text>
                      <Combobox
                        options={DISCOUNT_TYPE}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Select Discount"}
                        selectedOption={DISCOUNT_TYPE.find(
                          (o) => o.value === values.discount_type
                        )}
                        onSelectData={(option: any) => {
                          setFieldValue("discount_type", option.value);
                        }}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Input
                        name="discount_value"
                        label="Discount Value"
                        placeholder="Enter a Discount Value"
                        onChange={handleChange}
                        value={values.discount_value}
                        errorKey={errors?.discount_value}
                      />
                    </div>

                    <Input
                      name="price"
                      label="Price"
                      placeholder="Enter a price"
                      onChange={handleChange}
                      value={values.price}
                      errorKey={errors?.price}
                    />
                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Currency Code
                      </Text>
                      <Combobox
                        options={CURRENCY_CODE}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Select currency code"}
                        selectedOption={CURRENCY_CODE.find((o) => {
                          return o.name === values.currency_code;
                        })}
                        onSelectData={(name: any) => {
                          setFieldValue("currency_code", name.name);
                        }}
                      />
                    </div>

                    <PlanFormLists />

                    <Text size="sm" weight="semibold" color="primary">
                      Status
                    </Text>
                    <RadioGroup
                      className="flex"
                      value={values.status}
                      onValueChange={(value) => setFieldValue("status", value)}
                    >
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <RadioGroupItem id="ENABLE" value="ENABLE" />
                        <Text size="sm" color="primary">
                          Enable
                        </Text>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <RadioGroupItem id="DISABLE" value="DISABLE" />
                        <Text size="sm" color="primary">
                          Disable
                        </Text>
                      </label>
                    </RadioGroup>
                  </div>
                  <div className="flex items-center gap-2 pb-1 pt-4">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={!isValid || isSubmitting}
                    >
                      Update Plan
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

export default EditPaugSheet;