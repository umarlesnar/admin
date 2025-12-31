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
import { ErrorMessage, Formik } from "formik";
import React, { ReactElement, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { Combobox } from "@/components/ui/combobox";
import { Listbox } from "@/components/ui/listbox";
import { Textarea } from "@/components/ui/textarea";
import useWorkflowStore from "../WorkflowStore";

type Props = {
  children: ReactElement;
  sheetData?: any;
  id?: any;
};

const country_code = [
  {
    name: "India",
    value: "IN",
  },
];

const productType = [
  {
    name: "Physical Goods",
    value: "physical-goods",
  },
  {
    name: "Digital Goods",
    value: "digital-goods",
  },
];

const expiredTime = [
  {
    name: "5 minutes",
    value: 5,
  },
  {
    name: "15 minutes",
    value: 15,
  },
  {
    name: "30 minutes",
    value: 30,
  },
  {
    name: "1 Hour",
    value: 60,
  },
];

const WorkflowOrderDetailsSheet = ({ children, sheetData, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState([]);
  const { updateNodeData } = useWorkflowStore();

  return (
    <Formik
      initialValues={{
        body: {
          text: "",
        },
        footer: {
          text: "",
        },
        product_type: "",
        wa_id: "",
        store_type: "",
        payment_configuration: "",
        expired_in_minutes: 0,
        shopify_credential_id: "",
        shipping_country_code: "IN",
        ...sheetData,
      }}
      onSubmit={(values) => {
        if (typeof updateNodeData == "function") {
          updateNodeData(id, {
            ...values,
          });
        }
      }}
      enableReinitialize
    >
      {({
        values,
        errors,
        handleSubmit,
        handleChange,
        resetForm,
        setFieldValue,
      }: any) => {
        return (
          <Sheet
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              resetForm({});
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-[390px] h-screen flex flex-col p-5">
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Order Details Configuration
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 overflow-auto bg-scroll space-y-2">
                <Input
                  name="wa_id"
                  label="Phone Number"
                  onChange={handleChange}
                  value={values?.wa_id}
                  placeholder="Enter Phone Number"
                  errorKey={errors && errors.wa_id}
                  isRequired
                />
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Body
                  </Text>

                  <Textarea
                    name="body.text"
                    onChange={handleChange}
                    placeholder="Enter Your Body Text"
                    value={values?.body?.text}
                  />

                  <ErrorMessage
                    component={"p"}
                    name="body.text"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    label="Footer"
                    name="footer.text"
                    placeholder="Enter your footer"
                    onChange={handleChange}
                    errorKey={errors?.footer?.text}
                    value={values?.footer?.text}
                  />
                </div>
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Country
                  </Text>
                  <Combobox
                    options={country_code || []}
                    buttonClassname={`w-full`}
                    selectedOption={country_code?.find((o: any) => {
                      return o.value == values?.shipping_country_code;
                    })}
                    placeholder={"Select Country"}
                    onSelectData={(selected: any) => {
                      setFieldValue(`shipping_country_code`, selected?.value);
                    }}
                  />
                  <ErrorMessage
                    component={"p"}
                    name="shipping_country_code"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Product Type
                  </Text>
                  <Listbox
                    options={productType || []}
                    buttonClassname={`w-full`}
                    selectedOption={productType?.find((o: any) => {
                      return o.value == values?.product_type;
                    })}
                    onSelectData={(selected: any) => {
                      setFieldValue(`product_type`, selected?.value);
                    }}
                  />
                  <ErrorMessage
                    component={"p"}
                    name="product_type"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Commerce Manager
                  </Text>
                  <Combobox
                    // options={commerce?.data || []}
                    buttonClassname={`w-full`}
                    // selectedOption={commerce?.data?.find((o: any) => {
                    //   return o.name == values?.store_type;
                    // })}
                    placeholder={
                       "Select Manager"
                    }
                    onSelectData={(selected: any) => {
                      setFieldValue(`store_type`, selected?.name);

                      console.log(selected?.name == "shopify");

                      if (selected?.name == "shopify") {
                        console.log(selected?.name == "shopify");
                        setFieldValue(
                          `shopify_credential_id`,
                          selected?.credential_id
                        );
                      }

                      if (selected?.name == "kwic") {
                        console.log(selected?.name == "shopify");
                        setFieldValue(`shopify_credential_id`, "");
                      }
                    }}
                  />
                  <ErrorMessage
                    component={"p"}
                    name="store_type"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Payment Config
                  </Text>
                  <Combobox
                    options={options || []}
                    buttonClassname={`w-full`}
                    selectedOption={options?.find((o: any) => {
                      return (
                        o.configuration_name ==
                        values?.payment_configuration?.configuration_name
                      );
                    })}
                    placeholder={"Select account"}
                    onSelectData={(selected: any) => {
                      setFieldValue(`payment_configuration`, selected);
                    }}
                  />
                  <ErrorMessage
                    component={"p"}
                    name="payment_configurations_name"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Expired time in minutes
                  </Text>
                  <Listbox
                    options={expiredTime || []}
                    buttonClassname={`w-full`}
                    selectedOption={expiredTime?.find((o: any) => {
                      return o.value == values?.expired_in_minutes;
                    })}
                    onSelectData={(selected: any) => {
                      setFieldValue(`expired_in_minutes`, selected?.value);
                    }}
                  />
                  <ErrorMessage
                    component={"p"}
                    name="product_type"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
              </div>

              <div className="w-full flex items-center gap-2 ">
                <SheetClose asChild>
                  <Button type="submit" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </SheetClose>

                <Button
                  type="submit"
                  className="w-full"
                  onClick={() => {
                    handleSubmit();
                    setOpen(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        );
      }}
    </Formik>
  );
};

export default WorkflowOrderDetailsSheet;
