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
import Text from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uiYupQuestionSchema } from "@/validation-schema/ui/UiYupQuestionSchema";
import { Combobox } from "@/components/ui/combobox";
import VariantButtonDropdown from "../VariantButtonDropdown";
import CustomTooltip from "@/components/ui/CustomTooltip";
import EmojiPickerNew from "../../../template/_components/EmojiPickerNew";
import { BoldIcon } from "@/components/ui/icons/BoldIcon";
import { ItalicIcon } from "@/components/ui/icons/ItalicIcon";
import { StrikeThrough } from "@/components/ui/icons/StrikeThroughIcon";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const country_code = [
  {
    name: "India",
    value: "IN",
  },
];

const AskAddressTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  return (
    <Formik
      initialValues={{
        flow_replies: {
          type: "1",
          data: "",
          country: "IN",
          caption: "",
          mime_type: "",
        },
        user_input_variable: "@Action1",
        answer_validation: {
          type: 2,
          min: "",
          max: "",
          regex: "",
          fallback: "",
          failsCount: "",
        },

        isAdvanceEnable: false,
        ...data,
      }}
      onSubmit={(values) => {
        if (typeof updateNodeData == "function") {
          updateNodeData(id, {
            ...values,
          });
        }
        setOpen(false);
      }}
      enableReinitialize
      validationSchema={uiYupQuestionSchema}
    >
      {({ values, handleChange, setFieldValue, handleSubmit, resetForm }) => {
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
                  Ask Address
                </SheetTitle>
              </SheetHeader>
              <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-md">
                <Text size="sm" textColor="text-amber-700">
                  ⚠️ This feature is only available in{" "}
                  <Text
                    size="sm"
                    tag="span"
                    textColor="text-amber-700"
                    weight="semibold"
                  >
                    India
                  </Text>
                </Text>
              </div>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 overflow-auto bg-scroll space-y-4">
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Body
                    <span className="text-sm text-red-500 ml-[2px]">*</span>
                  </Text>
                  <Textarea
                    name="flow_replies.data"
                    onChange={handleChange}
                    value={values?.flow_replies?.data}
                  />

                  <ErrorMessage
                    component={"p"}
                    name="flow_replies.data"
                    className="text-sm font-normal text-red-500"
                  />
                  <div className="flex justify-between items-center ">
                    <VariantButtonDropdown
                      onSelect={(variableValue: any) => {
                        const currentText = values?.flow_replies?.data || "";
                        setFieldValue(
                          "flow_replies.data",
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
                              const currentText =
                                values?.flow_replies.data || "";
                              setFieldValue(
                                `flow_replies.data`,
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
                              const currentText =
                                values?.flow_replies.data || "";
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

                              setFieldValue(`flow_replies.data`, newText);

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
                              const currentText =
                                values?.flow_replies.data || "";
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

                              setFieldValue(`flow_replies.data`, newText);

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
                              const currentText =
                                values?.flow_replies.data || "";
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

                              setFieldValue(`flow_replies.data`, newText);

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
                  <Text size="sm" weight="medium">
                    Country
                  </Text>
                  <Combobox
                    options={country_code || []}
                    buttonClassname={`w-full`}
                    selectedOption={country_code?.find((o: any) => {
                      return o.value == values?.country;
                    })}
                    placeholder={"Select Country"}
                    onSelectData={(selected: any) => {
                      setFieldValue(`country`, selected?.value);
                    }}
                  />
                  <ErrorMessage
                    component={"p"}
                    name="country_code"
                    className="test-sm font-normal text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Save Address in a variable
                  </Text>
                  <Input
                    name="user_input_variable"
                    value={values?.user_input_variable}
                    placeholder={"@value"}
                    onChange={handleChange}
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

export default AskAddressTypeSheet;
