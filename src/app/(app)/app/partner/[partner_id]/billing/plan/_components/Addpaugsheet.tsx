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
import { ErrorMessage, Form, Formik } from "formik";
import React, { ReactElement, useRef, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { UiYupPaugSchema } from "@/validation-schema/ui/UiYupPoductSchema";
import { Combobox } from "@/components/ui/combobox";
import PlanFormLists from "./PlanFormPage";
import { usePartnerProductMutation } from "@/framework/partner/partner-product-mutation";
import { usePartnerProductPolicyQuery } from "@/framework/partner/get-partner-product-policy";
import { useModulesQuery } from "@/framework/modules/get-modules";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  children: ReactElement;
  data?: any;
};

const CURRENCY_CODE = [{ value: "INR", name: "INR" }];

const TYPE = [
  { value: "annual", name: "annual" },
  { value: "month", name: "month" },
];

const PLAN_TYPE = [{ value: "pay_as_you_go", name: "paug" }];

const DISCOUNT_TYPE = [
  { value: "percentage", name: "percentage" },
  { value: "fixed", name: "fixed" },
];

const AddPaugSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
   const [searchTerm, setSearchTerm] = useState("");
  const { mutateAsync } = usePartnerProductMutation();
  const { data: policies, isLoading } = usePartnerProductPolicyQuery();
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
            Add Paug
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              name: "",
              plan_type: "",
              price: "",
              discount_type: "",
              discount_value: "",
              tax_percentage: 0,
              included_modules: [] as string[],
              feature: [],
              currency_code: "",
              policy_id: "",
              visibility: false,
              status: "ENABLE",
            }}
            validationSchema={UiYupPaugSchema}
            onSubmit={async (values, { setErrors }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                const response = await mutateAsync({
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
                      <Text size="sm" tag="label" weight="medium">
                        Policy
                      </Text>
                      <Combobox
                        options={policies || []}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Select Policy"}
                        selectedOption={TYPE.find((o) => {
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
                        placeholder="select plan"
                        selectedOption={PLAN_TYPE.find((o) => {
                          return o.name === values.plan_type;
                        })}
                        onSelectData={(type: any) => {
                          setFieldValue("plan_type", type.name);
                        }}
                      />
                    </div>
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
                          return o.name === values.discount_type;
                        })}
                        onSelectData={(type: any) => {
                          setFieldValue("discount_type", type.name);
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
                      <Text size="sm" tag="label" weight="medium">
                        Module
                      </Text>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {values.included_modules?.length > 0
                              ? `${values.included_modules.length} modules selected`
                              : "Select Modules"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-auto min-w-[400px] max-w-[600px]">
                          <DialogHeader className="flex flex-row items-center justify-between">
                            <DialogTitle>Select Modules</DialogTitle>
                            <DialogClose asChild>
                              <Button variant="ghost" size="sm">
                                <CloseIcon className="w-4 h-4" />
                              </Button>
                            </DialogClose>
                          </DialogHeader>
                          <Input
                            placeholder="Search modules..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-4"
                          />
                          <div className="grid grid-cols-2 gap-5 max-h-80 overflow-y-auto p-2">
                            {(Modules?.data?.items || [])
                              .filter(
                                (item: any) =>
                                  item.is_active === true &&
                                  item.module_id
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                              )
                              .map((module: any) => (
                                <div
                                  key={module.module_id}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="checkbox"
                                    id={module.module_id}
                                    checked={
                                      values.included_modules?.includes(
                                        module.module_id
                                      ) || false
                                    }
                                    onChange={(e) => {
                                      const currentModules = Array.isArray(
                                        values.included_modules
                                      )
                                        ? values.included_modules
                                        : [];
                                      const newModules = e.target.checked
                                        ? [...currentModules, module.module_id]
                                        : currentModules.filter(
                                            (id: string) =>
                                              id !== module.module_id
                                          );
                                      setFieldValue(
                                        "included_modules",
                                        newModules
                                      );
                                    }}
                                    className="w-4 h-4 cursor-pointer"
                                  />
                                  <label
                                    htmlFor={module.module_id}
                                    className="text-sm cursor-pointer"
                                  >
                                    {module.module_id}
                                  </label>
                                </div>
                              ))}
                          </div>
                          <div className="flex justify-end pt-4">
                            <DialogClose asChild>
                              <Button>Save</Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                     <ErrorMessage name="included_modules" component={"p"} className="text-xs text-red-500" />
                    </div>
                    <PlanFormLists />
                    <div className="flex items-center space-x-2">
                      <Text size="sm" weight="semibold" color="primary">
                        Visibility
                      </Text>
                      <button
                        type="button"
                        className={`w-12 h-6 rounded-full flex items-center transition duration-300 ease-in-out ${
                          values.visibility ? "bg-primary" : "bg-gray-300"
                        }`}
                        onClick={() =>
                          setFieldValue("visibility", !values.visibility)
                        }
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-md transform ${
                            values.visibility
                              ? "translate-x-6"
                              : "translate-x-1"
                          } transition duration-300 ease-in-out`}
                        />
                      </button>
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
                      Add Paug
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

export default AddPaugSheet;
