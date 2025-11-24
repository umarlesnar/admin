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
import DropdownTagFilter from "@/components/ui/filter-drop-down";
import { StrikeThrough } from "@/components/ui/icons/StrikeThroughIcon";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { ItalicIcon } from "@/components/ui/icons/ItalicIcon";
import { BoldIcon } from "@/components/ui/icons/BoldIcon";
import EmojiPickerNew from "../../../template/_components/EmojiPickerNew";
import VariantButtonDropdown from "../VariantButtonDropdown";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const AskMediaTypeSheet = ({ children, data, id }: Props) => {
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
          accept_file_type: [],
          fallback: "",
          failsCount: 1,
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
      {({ values, handleChange, handleSubmit, resetForm, setFieldValue }) => {
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
                  Ask Media
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 overflow-auto bg-scroll space-y-4">
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Body
                    <span className="text-sm text-red-500 ml-[2px]">*</span>
                  </Text>
                  <Textarea
                    name="flow_replies.data"
                    placeholder="What do you think?"
                    onChange={handleChange}
                    value={values?.flow_replies?.data}
                  />

                  <ErrorMessage
                    component={"p"}
                    name="flow_replies.data"
                    className="test-sm font-normal text-red-500"
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
                    Accept file
                  </Text>
                  <DropdownTagFilter
                    label={" Accept file"}
                    options={[
                      { name: "PNG", value: "PNG" },
                      { name: "JPEG", value: "JPEG" },
                      { name: "MP4", value: "MP4" },
                      { name: "MP3", value: "MP3" },
                      { name: "PDF", value: "PDF" },
                      { name: "DOCX", value: "DOCX" },
                      { name: "XLSX", value: "XLSX" },
                    ]}
                    onSelectData={(array: any) => {
                      setFieldValue(
                        "answer_validation.accept_file_type",
                        array
                      );
                    }}
                    dropdownClassname={`w-[400px]`}
                    selectedOptions={
                      values?.answer_validation?.accept_file_type || []
                    }
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-text-primary"
                    >
                      {values?.answer_validation?.accept_file_type?.length > 0
                        ? values?.answer_validation?.accept_file_type?.join(
                            " , "
                          )
                        : "Select Accept file types"}
                    </Button>
                  </DropdownTagFilter>
                  <ErrorMessage
                    component={"p"}
                    name="flow_replies.data"
                    className="test-sm font-normal text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Attempt
                  </Text>
                  <Input
                    name="answer_validation.failsCount"
                    type="number"
                    value={values?.answer_validation?.failsCount}
                    placeholder={"Attempts"}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Validation Error Message
                  </Text>
                  <Textarea
                    name="answer_validation.fallback"
                    onChange={handleChange}
                    value={values?.answer_validation?.fallback}
                    placeholder="Enter your error message..."
                  />

                  <ErrorMessage
                    component={"p"}
                    name="answer_validation.fallback"
                    className="test-sm font-normal text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Save Media URL in a variable
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

export default AskMediaTypeSheet;
