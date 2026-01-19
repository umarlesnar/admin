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
import React, { ReactElement, useRef, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useProductMutation } from "@/framework/product/get-product-mutation";
import ProductFormLists from "./ProductFormPage";
import { UiYupProductSchema } from "@/validation-schema/ui/UiYupPoductSchema";
import { Combobox } from "@/components/ui/combobox";
import { useProductPolicyQuery } from "@/framework/product/get-product-policy";
import { CURRENCY_CODES } from "@/constants/currency";

type Props = {
  children: ReactElement;
  data?: any;
};

const TYPE = [
  { value: "annual", name: "annual" },
  { value: "month", name: "month" },
];

const PLAN_TYPE = [
  { value: "free", name: "Free" },
  { value: "trial", name: "Trial" },
  { value: "standard", name: "Standard" },
  { value: "pay_as_you_go", name: "PAUG" },
];

const DISCOUNT_TYPE = [
  { value: "percentage", name: "Percentage" },
  { value: "fixed", name: "Fixed" },
];

const AddProductSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync } = useProductMutation();
  const { data: policies, isLoading } = useProductPolicyQuery();

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
            Add Product
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
              is_recommeded: false,
              feature: [],
              currency_code: "",
              policy_id: "",
              status: "ENABLE",
            }}
            validationSchema={UiYupProductSchema}
            onSubmit={async (values, { setErrors }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                const response = await mutateAsync({
                  method: "POST",
                  payload: values,
                });
                toast.success(`Product Added Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Add Product`, {
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
                        Type
                      </Text>
                      <Combobox
                        options={TYPE}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Select Type"}
                        selectedOption={TYPE.find((o) => {
                          return o.name === values.type;
                        })}
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
                        selectedOption={TYPE.find((o) => {
                          return o.value === values.policy_id;
                        })}
                        onSelectData={(name: any) => {
                          setFieldValue("policy_id", name.value);
                        }}
                      />
                    </div>

                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Plan Type
                      </Text>
                      <Combobox
                        options={PLAN_TYPE}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Plan Type"}
                        selectedOption={PLAN_TYPE.find((o) => {
                          return o.name === values.type;
                        })}
                        onSelectData={(name: any) => {
                          setFieldValue("plan_type", name.name);
                        }}
                      />
                    </div>

                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Discount Type
                      </Text>
                      <Combobox
                        options={DISCOUNT_TYPE}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Discount Type"}
                        selectedOption={PLAN_TYPE.find((o) => {
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
                        label="Discount"
                        placeholder="Enter a Value"
                        onChange={handleChange}
                        value={values.discount_value}
                        errorKey={errors?.discount_value}
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
                        Currency Code
                      </Text>
                      <Combobox
                        options={CURRENCY_CODES}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Select currency code"}
                        selectedOption={CURRENCY_CODES.find((o) => {
                          return o.name === values.currency_code;
                        })}
                        onSelectData={(name: any) => {
                          setFieldValue("currency_code", name.name);
                        }}
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
                    <ProductFormLists />
                    <div className="flex items-center space-x-2">
                      <Text size="sm" weight="semibold" color="primary">
                        Recommeded
                      </Text>
                      <button
                        type="button"
                        className={`w-12 h-6 rounded-full flex items-center transition duration-300 ease-in-out ${
                          values.is_recommeded ? "bg-primary" : "bg-gray-300"
                        }`}
                        onClick={() =>
                          setFieldValue("is_recommeded", !values.is_recommeded)
                        }
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-md transform ${
                            values.is_recommeded
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
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="ENABLE" value="ENABLE" />
                        <Text size="sm" color="secondary">
                          Enable
                        </Text>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="DISABLE" value="DISABLE" />
                        <Text size="sm" color="secondary">
                          Disable
                        </Text>
                      </div>
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
                      Add Product
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

export default AddProductSheet;
