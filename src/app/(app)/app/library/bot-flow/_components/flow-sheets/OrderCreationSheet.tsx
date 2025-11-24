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
import useStore from "../store";
import { Input } from "@/components/ui/input";
// import { useWhatsappPaymentConfigQuery } from "@/framework/whatsapp/get-payment-configurations";
import Text from "@/components/ui/text";
import { Combobox } from "@/components/ui/combobox";
// import { useEcommerceIntegrationQuery } from "@/framework/whatsapp/get-ecommerce-integration";
import { Listbox } from "@/components/ui/listbox";
import { Textarea } from "@/components/ui/textarea";
import { StrikeThrough } from "@/components/ui/icons/StrikeThroughIcon";
import CustomTooltip from "@/components/ui/CustomTooltip";
import VariantButtonDropdown from "../VariantButtonDropdown";
import { ItalicIcon } from "@/components/ui/icons/ItalicIcon";
import EmojiPickerNew from "../../../template/_components/EmojiPickerNew";
import { BoldIcon } from "@/components/ui/icons/BoldIcon";

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

const OrderCreationSheet = ({ children, sheetData, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState([]);
  const { updateNodeData } = useStore();
  // const commerce = useEcommerceIntegrationQuery();
  // const { data, isLoading } = useWhatsappPaymentConfigQuery();

  // useEffect(() => {
  //   if (data?.length > 0 && data[0]?.payment_configurations) {
  //     const config = data[0]?.payment_configurations?.map((item: any) => {
  //       return {
  //         name: item?.configuration_name,
  //         ...item,
  //       };
  //     });

  //     setOptions(config);
  //   }
  // }, [data]);

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
        store_type: "",
        payment_configuration: {},
        expired_in_minutes: 5,
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
                  <div className="flex justify-between items-center ">
                    <VariantButtonDropdown
                      onSelect={(variableValue: any) => {
                        const currentText = values?.body.text || "";
                        setFieldValue("body.text", currentText + variableValue);
                      }}
                    />
                    <div className="flex gap-3 items-center">
                      <CustomTooltip value={"Emoji"} sideOffset={10}>
                        <div>
                          <EmojiPickerNew
                            iconClassName={"w-3 h-3"}
                            onChange={(emoji: string) => {
                              const currentText = values?.body.text || "";
                              setFieldValue(`body.text`, currentText + emoji);
                            }}
                          />
                        </div>
                      </CustomTooltip>{" "}
                      <CustomTooltip value={"Bold"} sideOffset={10}>
                        <div>
                          <BoldIcon
                            onClick={() => {
                              const textarea =
                                document.querySelector("textarea");
                              if (!textarea) return;

                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const currentText = values?.body.text || "";
                              const selectedText = currentText.substring(
                                start,
                                end
                              );

                              let newText = "";
                              if (selectedText) {
                                newText =
                                  currentText.substring(0, start) +
                                  `**${selectedText}**` +
                                  currentText.substring(end);
                              } else {
                                newText = currentText + " **";
                              }

                              setFieldValue(`body.text`, newText);

                              setTimeout(() => {
                                textarea.focus();
                                textarea.setSelectionRange(start + 2, end + 2); // Adjust cursor inside bold text
                              }, 10);
                            }}
                            className="w-3 h-3 text-[#304742] cursor-pointer"
                          />
                        </div>
                      </CustomTooltip>
                      <CustomTooltip value={"Italic"} sideOffset={10}>
                        <div>
                          {" "}
                          <ItalicIcon
                            onClick={() => {
                              const textarea =
                                document.querySelector("textarea");
                              if (!textarea) return;

                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const currentText = values?.body.text || "";
                              const selectedText = currentText.substring(
                                start,
                                end
                              );

                              let newText = "";
                              if (selectedText) {
                                newText =
                                  currentText.substring(0, start) +
                                  `_${selectedText}_` +
                                  currentText.substring(end);
                              } else {
                                // If no text is selected, add __Italic__
                                newText = currentText + " __";
                              }

                              setFieldValue(`body.text`, newText);

                              // Refocus textarea after update
                              setTimeout(() => {
                                textarea.focus();
                                textarea.setSelectionRange(start + 2, end + 2); // Adjust cursor inside italics
                              }, 10);
                            }}
                            className="w-3 h-3 text-[#304742] cursor-pointer"
                          />
                        </div>
                      </CustomTooltip>
                      <CustomTooltip value={"Strikethrough"} sideOffset={10}>
                        <div>
                          <StrikeThrough
                            onClick={() => {
                              const textarea =
                                document.querySelector("textarea");
                              if (!textarea) return;

                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const currentText = values?.body.text || "";
                              const selectedText = currentText.substring(
                                start,
                                end
                              );

                              let newText = "";
                              if (selectedText) {
                                // Wrap selected text with ~~
                                newText =
                                  currentText.substring(0, start) +
                                  `~${selectedText}~` +
                                  currentText.substring(end);
                              } else {
                                // If no text is selected, add ~~Strikethrough~~
                                newText = currentText + " ~~";
                              }

                              setFieldValue(`body.text`, newText);

                              // Refocus textarea after update
                              setTimeout(() => {
                                textarea.focus();
                                textarea.setSelectionRange(start + 2, end + 2); // Adjust cursor inside strikethrough
                              }, 10);
                            }}
                            className="w-3 h-3 text-[#304742] cursor-pointer"
                          />
                        </div>
                      </CustomTooltip>
                    </div>
                  </div>
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
                  {/* <Combobox
                    options={commerce?.data || []}
                    buttonClassname={`w-full`}
                    selectedOption={commerce?.data?.find((o: any) => {
                      return o.name == values?.store_type;
                    })}
                    placeholder={
                      commerce?.isLoading ? "Loading..." : "Select Manager"
                    }
                    onSelectData={(selected: any) => {
                      setFieldValue(`store_type`, selected?.name);

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
                  /> */}
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
                    // placeholder={isLoading ? "Loading..." : "Select account"}
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

export default OrderCreationSheet;
