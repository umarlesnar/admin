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
import { UiYupProductSchema } from "@/validation-schema/ui/UiYupPoductSchema";
import { Combobox } from "@/components/ui/combobox";
import PlanFormLists from "./PlanFormPage";
import { usePartnerProductMutation } from "@/framework/partner/partner-product-mutation";
import { usePartnerProductPolicyQuery } from "@/framework/partner/get-partner-product-policy";
import { Switch } from "@/components/ui/switch";
import { ModulesIcon } from "@/components/ui/icons/ModulesIcon";
import PlanIncludedModulesSheet from "./PlanIncludedModulesSheet";
import { ModuleConfig } from "./PlanModuleConfigSheet";

type Props = {
  children: ReactElement;
  data?: any;
};

const CURRENCY_CODE = [
  { value: "INR", name: "INR" },
  { value: "USD", name: "USD" },
  { value: "EUR", name: "EUR" },
  { value: "AUD", name: "AUD" },
  { value: "CAD", name: "CAD" },
];

const TYPE = [
  { value: "annual", name: "annual" },
  { value: "month", name: "month" },
];

const PLAN_TYPE = [
  { value: "free", name: "free" },
  { value: "trial", name: "trial" },
  { value: "standard", name: "standard" },
];

const DISCOUNT_TYPE = [
  { value: "percentage", name: "percentage" },
  { value: "fixed", name: "fixed" },
];

const AddPlanSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [manageModulesOpen, setManageModulesOpen] = useState(false);

  const { mutateAsync } = usePartnerProductMutation();
  const { data: policies } = usePartnerProductPolicyQuery();

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
            Add Plan
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              name: "",
              type: "",
              plan_type: "",
              price: "",
              discount_type: "",
              discount_value: "",
              r_plan_id: "",
              included_modules: [] as ModuleConfig[],
              tax_percentage: 0,
              is_recommeded: false,
              feature: [],
              currency_code: "",
              policy_id: "",
              status: "ENABLE",
              trial_duration: "",
              visibility: false,
            }}
            validationSchema={UiYupProductSchema}
            onSubmit={async (values, { setErrors }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                await mutateAsync({
                  method: "POST",
                  payload: values,
                });
                toast.success(`Plan Added Successfully`, {
                  id: loadingToast,
                });
                setOpen(false);
              } catch (error: any) {
                console.log("error", error);
                toast.error(`Failed to Add Plan`, {
                  id: loadingToast,
                });
                if (
                  error.response?.status ===
                  SERVER_STATUS_CODE.VALIDATION_ERROR_CODE
                ) {
                  setErrors(error.response.data.data);
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
                  <div className="flex-1 gap-4 space-y-5">
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
                        Type
                      </Text>
                      <Combobox
                        options={TYPE}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Select Type"}
                        selectedOption={TYPE.find(
                          (o) => o.name === values.type,
                        )}
                        onSelectData={(name: any) => {
                          setFieldValue("type", name.name);
                        }}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Policy
                      </Text>
                      <Combobox
                        options={policies || []}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Select Policy"}
                        selectedOption={policies?.find((o: any) => {
                          return o.value === values.policy_id;
                        })}
                        onSelectData={(name: any) => {
                          setFieldValue("policy_id", name.value);
                        }}
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
                          (o) => o.name === values.plan_type,
                        )}
                        onSelectData={(option: any) => {
                          setFieldValue("plan_type", option.value);
                          if (
                            option.value === "free" ||
                            option.value === "trial"
                          ) {
                            setFieldValue("price", "0");
                          }
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
                        selectedOption={DISCOUNT_TYPE.find((o) => {
                          return o.name === values.type;
                        })}
                        onSelectData={(name: any) => {
                          setFieldValue("discount_type", name.name);
                        }}
                      />
                    </div>

                    <div className="w-full space-y-1">
                      <Input
                        name="discount_value"
                        label="Discount Value"
                        placeholder="Enter a discount value"
                        onChange={handleChange}
                        value={values.discount_value}
                        errorKey={errors?.discount_value}
                      />
                    </div>

                    {values.plan_type === "trial" && (
                      <Input
                        name="trial_duration"
                        label="Trial Duration (in days)"
                        type="number"
                        placeholder="Enter trial duration"
                        onChange={handleChange}
                        value={values.trial_duration}
                        errorKey={errors?.trial_duration}
                      />
                    )}

                    <Input
                      name="price"
                      label="Price"
                      placeholder="Enter a price"
                      onChange={handleChange}
                      value={values.price}
                      errorKey={errors?.price}
                      disabled={
                        values.plan_type === "free" ||
                        values.plan_type === "trial"
                      }
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
                    <div className="w-full space-y-1">
                      <Input
                        name="tax_percentage"
                        type="number"
                        label="Tax Percentage"
                        placeholder="Enter a tax percentage"
                        onChange={handleChange}
                        value={values.tax_percentage}
                        errorKey={errors?.tax_percentage}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Input
                        name="r_plan_id"
                        label="Razorpay Plan Id"
                        placeholder="Enter a razorpay plan id"
                        onChange={handleChange}
                        value={values.r_plan_id}
                        errorKey={errors?.r_plan_id}
                      />
                    </div>
                    <PlanFormLists />
                    <div className="flex items-center gap-5">
                      <div className="flex items-center space-x-2">
                        <Text size="sm" weight="semibold" color="primary">
                          Recommended
                        </Text>
                        <Switch
                          checked={values.is_recommeded}
                          onCheckedChange={(checked) =>
                            setFieldValue("is_recommeded", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Text size="sm" weight="semibold" color="primary">
                          Visibility
                        </Text>
                        <Switch
                          checked={values.visibility}
                          onCheckedChange={(checked) =>
                            setFieldValue("visibility", checked)
                          }
                        />
                      </div>
                    </div>

                    <Text size="sm" weight="semibold" color="primary">
                      Status
                    </Text>
                    <RadioGroup
                      className=" flex"
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
                      disabled={isSubmitting}
                    >
                      Add Plan
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

export default AddPlanSheet;
