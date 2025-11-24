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
import React, { ReactElement, useState } from "react";
import useStore from "../store";
// import { useRazorpayAccountsQuery } from "@/framework/integration/razorpay/get-razorpay-account";
import Text from "@/components/ui/text";
import { Combobox } from "@/components/ui/combobox";
import { Listbox } from "@/components/ui/listbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StrikeThrough } from "@/components/ui/icons/StrikeThroughIcon";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { ItalicIcon } from "@/components/ui/icons/ItalicIcon";
import VariantButtonDropdown from "../VariantButtonDropdown";
import EmojiPickerNew from "../../../template/_components/EmojiPickerNew";
import { BoldIcon } from "@/components/ui/icons/BoldIcon";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const RAZORPAY_TYPE = [
  { name: "Standard", value: "standard" },
  { name: "UPI", value: "UPI" },
];
const CURRENCY = [{ name: "Indian Ruppess", value: "INR" }];

const RazorpayTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  // const accounts = useRazorpayAccountsQuery();
  return (
    <Formik
      initialValues={{
        type: "standard",
        credential_id: "",
        amount: "@payment",
        currency: "INR",
        payment_notes: "",
        node_result_id: "",
        user_input_variable: "",
        ...data,
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
        setFieldValue,
        handleSubmit,
        resetForm,
        handleChange,
      }) => {
        return (
          <Sheet
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            resetForm(data?.flow_replies);
          }}
        >
          <SheetTrigger asChild>{children}</SheetTrigger>
          <SheetContent className="w-[390px] sm:w-[500px] h-screen flex flex-col p-5">
            <SheetHeader className="flex flex-row items-center gap-4">
              <SheetClose asChild>
                <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
              </SheetClose>
              <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                Razorpay
              </SheetTitle>
            </SheetHeader>

            {/* form body */}
            <div className="flex flex-1 flex-col px-1 py-2 overflow-auto bg-scroll space-y-2">
              <div className="space-y-2">
                <Text size="sm" weight="medium">
                  Razorpay Accounts
                </Text>
                <Combobox
                  // options={accounts?.data?.data || []}
                  buttonClassname={`w-full`}
                  // selectedOption={accounts?.data?.data?.find((o: any) => {
                  //   return o._id == values?.credential_id;
                  // })}
                  placeholder={
                    "Select account"
                    // accounts?.isLoading ? "Loading..." : "Select account"
                  }
                  onSelectData={(selected: any) => {
                    setFieldValue(`credential_id`, selected._id);
                  }}
                />
                <ErrorMessage
                  component={"p"}
                  name="credential_id"
                  className="test-sm font-normal text-red-500"
                />
              </div>
              <div className="space-y-2">
                <Text size="sm" weight="medium">
                  Type
                </Text>
                <Listbox
                  options={RAZORPAY_TYPE}
                  selectedOption={RAZORPAY_TYPE.find((o) => {
                    return o.value == values.type;
                  })}
                  buttonClassname={`w-full`}
                  onSelectData={(type: any) => {
                    setFieldValue("type", type.value);
                  }}
                />
              </div>
              <Input
                label="Amount"
                name="amount"
                onChange={handleChange}
                value={values?.amount}
                errorKey={errors && errors.amount}
              />
              <div className="space-y-2">
                <Text size="sm" weight="medium">
                  Currency
                </Text>
                <Listbox
                  options={CURRENCY}
                  selectedOption={CURRENCY.find((o) => {
                    return o.value == values.currency;
                  })}
                  buttonClassname={`w-full`}
                  onSelectData={(currency: any) => {
                    setFieldValue("currency", currency.value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Text size="sm" weight="medium">
                  Payment Notes
                </Text>
                <Textarea
                  name="payment_notes"
                  onChange={handleChange}
                  value={values?.payment_notes}
                />
                <div className="flex justify-between items-center ">
                  <VariantButtonDropdown
                    onSelect={(variableValue: any) => {
                      const currentText = values?.payment_notes || "";
                      setFieldValue(
                        "payment_notes",
                        currentText + variableValue
                      );
                    }}
                  />
                  <div className="flex gap-3 items-center">
                    <CustomTooltip value={"Emoji"} sideOffset={10}>
                      <div>
                        <EmojiPickerNew
                          iconClassName={"w-3 h-3"}
                          onChange={(emoji: string) => {
                            const currentText = values?.payment_notes || "";
                            setFieldValue(
                              `payment_notes`,
                              currentText + emoji
                            );
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
                            const currentText = values?.payment_notes || "";
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

                            setFieldValue(`payment_notes`, newText);

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
                            const currentText = values?.payment_notes || "";
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

                            setFieldValue(`payment_notes`, newText);

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
                            const currentText = values?.payment_notes || "";
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

                            setFieldValue(`payment_notes`, newText);

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

              <Input
                label="Callback Url"
                name="callback_url"
                onChange={handleChange}
                value={values?.callback_url}
                errorKey={errors && errors.callback_url}
              />
              <Input
                label="Input Variable"
                name="user_input_variable"
                onChange={handleChange}
                value={values?.user_input_variable}
                errorKey={errors && errors.user_input_variable}
              />
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

export default RazorpayTypeSheet;
