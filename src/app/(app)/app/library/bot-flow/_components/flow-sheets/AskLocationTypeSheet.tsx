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
import React, { ReactElement, useCallback, useState } from "react";
import useStore from "../store";
import Text from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { StrikeThrough } from "@/components/ui/icons/StrikeThroughIcon";
import { BoldIcon } from "@/components/ui/icons/BoldIcon";
import VariantButtonDropdown from "../VariantButtonDropdown";
import { ItalicIcon } from "@/components/ui/icons/ItalicIcon";
import { uiYupLocationSchema } from "@/validation-schema/ui/UiYupLocationSchema";
import { Switch } from "@/components/ui/switch";
import EmojiPickerNew from "../EmojiPickerNew";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const AskLocationTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
    const handleAdvanceToggle = useCallback(
      (value: boolean, setFieldValue: (field: string, value: any) => void) => {
        setFieldValue("isAdvanceEnable", value);
        setFieldValue("answer_validation", {
          fallback: "",
          failsCount: "1",
          validation_error_message: "",
        });
      },
      []
    );

  return (
    <Formik
    initialValues={{
      flow_replies: {
        type: "1",
        data: "",
      },
      user_input_variable: "@action",
      isAdvanceEnable: false,
      answer_validation: {
        fallback: "",
        validation_error_message: "",
        failsCount: "",
      },
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
      validationSchema={uiYupLocationSchema}
    >
      {({ values,errors, handleChange, setFieldValue, handleSubmit, resetForm }) => {
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
                  Ask Location
                </SheetTitle>
              </SheetHeader>
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
                    className="text-xs font-normal text-red-500"
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
                    Save Location in a variable
                  </Text>
                  <Input
                    name="user_input_variable"
                    value={values?.user_input_variable}
                    placeholder={"@value"}
                    onChange={handleChange}
                  />
                </div>
                   {/* Enhanced Advanced Options */}
                   <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <Text size="sm" weight="semibold" color="primary">
                        Advanced Options
                      </Text>
                      <Text size="xs" color="secondary" className="mt-1">
                        Configure validation and error handling
                      </Text>
                    </div>
                    <Switch
                      checked={values?.isAdvanceEnable}
                      onCheckedChange={(value) =>
                        handleAdvanceToggle(value, setFieldValue)
                      }
                    />
                  </div>

                  {values?.isAdvanceEnable && (
                    <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <Text size="base" weight="semibold" color="primary">
                        Validation Settings
                      </Text>

                      <div className="grid grid-cols-1 gap-4">
                        <Input
                          label="Maximum Attempts"
                          name="answer_validation.failsCount"
                          value={values?.answer_validation?.failsCount}
                          placeholder="3"
                          onChange={handleChange}
                          errorKey={(errors?.answer_validation as any)?.failsCount}
                          className="border-orange-200 bg-white"
                        />

                        <div className="space-y-2">
                          <Text size="sm" weight="medium" color="primary">
                            Validation Error Message
                          </Text>
                          <Textarea
                            name="answer_validation.validation_error_message"
                            onChange={handleChange}
                            value={
                              values?.answer_validation
                                ?.validation_error_message
                            }
                            errorKey={
                              (errors?.answer_validation as any)
                                ?.validation_error_message
                            }
                            placeholder="Please provide a valid answer."
                            className="border-orange-200 bg-white "
                          />
                        </div>

                        <div className="space-y-2">
                          <Text size="sm" weight="medium" color="primary">
                            Fallback Message
                          </Text>
                          <Textarea
                            name="answer_validation.fallback"
                            onChange={handleChange}
                            value={values?.answer_validation?.fallback}
                            errorKey={(errors?.answer_validation as any)?.fallback}
                            placeholder="I'll connect you with a human agent to assist you further."
                            className="border-orange-200 bg-white "
                          />
                        </div>
                      </div>
                    </div>
                  )}
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

export default AskLocationTypeSheet;
