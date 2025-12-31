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
import VariantButtonDropdown from "../VariantButtonDropdown";
import { Checkbox } from "@/components/ui/Checkbox";
import EmojiPickerNew from "../EmojiPickerNew";

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
          allow_multiple_images: false,
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
          updateNodeData(id, { ...values });
        }
        setOpen(false);
      }}
      enableReinitialize
      validationSchema={uiYupQuestionSchema}
    >
      {({ values, handleChange, handleSubmit, resetForm, setFieldValue }) => (
        <Sheet
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            resetForm(data?.flow_replies);
          }}
        >
          <SheetTrigger asChild>{children}</SheetTrigger>
          <SheetContent className="w-[420px] sm:w-[520px] h-screen flex flex-col p-0">
            {/* Enhanced Header */}
            <SheetHeader className="flex flex-row items-center justify-between p-4 border-b border-border-input bg-gray-50/50">
              <div className="flex items-center gap-3">
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <CloseIcon className="w-4 h-4" />
                  </Button>
                </SheetClose>
                <SheetTitle className="text-xl font-semibold text-text-primary">
                  Ask Media
                </SheetTitle>
              </div>
            </SheetHeader>

            {/* Enhanced Form Body */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Question Text Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Text size="sm" weight="semibold" color="primary">
                    Body
                  </Text>
                  <span className="text-red-500 text-sm">*</span>
                </div>

                <div className="space-y-3">
                  <Textarea
                    name="flow_replies.data"
                    onChange={handleChange}
                    value={values?.flow_replies?.data}
                    placeholder="Enter your question text here..."
                  />

                  <ErrorMessage
                    component="p"
                    name="flow_replies.data"
                    className="text-sm font-normal text-red-500"
                  />

                  {/* Enhanced Formatting Toolbar */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <VariantButtonDropdown
                      onSelect={(variableValue: any) => {
                        const currentText = values?.flow_replies?.data || "";
                        setFieldValue(
                          "flow_replies.data",
                          currentText + variableValue
                        );
                      }}
                    />

                    <div className="flex items-center gap-2">
                      <CustomTooltip value="Add Emoji" sideOffset={10}>
                        <div className="p-2 hover:bg-white rounded-md transition-colors">
                          <EmojiPickerNew
                            iconClassName="w-4 h-4 text-gray-600"
                            onChange={(emoji: string) => {
                              const currentText =
                                values?.flow_replies.data || "";
                              setFieldValue(
                                "flow_replies.data",
                                currentText + emoji
                              );
                            }}
                          />
                        </div>
                      </CustomTooltip>

                      <div className="w-px h-6 bg-gray-300" />

                      <CustomTooltip value="Bold" sideOffset={10}>
                        <button
                          type="button"
                          className="p-2 hover:bg-white rounded-md transition-colors"
                          onClick={() => {
                            const textarea = document.querySelector("textarea");
                            if (!textarea) return;

                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const currentText = values?.flow_replies.data || "";
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

                            setFieldValue("flow_replies.data", newText);
                            setTimeout(() => {
                              textarea.focus();
                              textarea.setSelectionRange(start + 2, end + 2);
                            }, 10);
                          }}
                        >
                          <BoldIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      </CustomTooltip>

                      <CustomTooltip value="Italic" sideOffset={10}>
                        <button
                          type="button"
                          className="p-2 hover:bg-white rounded-md transition-colors"
                          onClick={() => {
                            const textarea = document.querySelector("textarea");
                            if (!textarea) return;

                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const currentText = values?.flow_replies.data || "";
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
                              newText = currentText + " __";
                            }

                            setFieldValue("flow_replies.data", newText);
                            setTimeout(() => {
                              textarea.focus();
                              textarea.setSelectionRange(start + 2, end + 2);
                            }, 10);
                          }}
                        >
                          <ItalicIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      </CustomTooltip>

                      <CustomTooltip value="Strikethrough" sideOffset={10}>
                        <button
                          type="button"
                          className="p-2 hover:bg-white rounded-md transition-colors"
                          onClick={() => {
                            const textarea = document.querySelector("textarea");
                            if (!textarea) return;

                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const currentText = values?.flow_replies.data || "";
                            const selectedText = currentText.substring(
                              start,
                              end
                            );

                            let newText = "";
                            if (selectedText) {
                              newText =
                                currentText.substring(0, start) +
                                `~${selectedText}~` +
                                currentText.substring(end);
                            } else {
                              newText = currentText + " ~~";
                            }

                            setFieldValue("flow_replies.data", newText);
                            setTimeout(() => {
                              textarea.focus();
                              textarea.setSelectionRange(start + 2, end + 2);
                            }, 10);
                          }}
                        >
                          <StrikeThrough className="w-4 h-4 text-gray-600" />
                        </button>
                      </CustomTooltip>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Types Section */}
              <div className="space-y-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <Text size="sm" weight="semibold" color="primary">
                  Accept File Types
                </Text>
                <DropdownTagFilter
                  label="Accept file"
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
                    setFieldValue("answer_validation.accept_file_type", array);
                  }}
                  dropdownClassname="w-[400px]"
                  selectedOptions={
                    values?.answer_validation?.accept_file_type || []
                  }
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start text-text-primary border-orange-200 bg-white"
                  >
                    {values?.answer_validation?.accept_file_type?.length > 0
                      ? values?.answer_validation?.accept_file_type?.join(", ")
                      : "Select Accept file types"}
                  </Button>
                </DropdownTagFilter>
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Text size="sm" weight="medium" color="primary">
                    Maximum Attempts
                  </Text>
                  <Input
                    name="answer_validation.failsCount"
                    type="number"
                    value={values?.answer_validation?.failsCount}
                    placeholder="3"
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Text size="sm" weight="medium" color="primary">
                    Validation Error Message
                  </Text>
                  <Textarea
                    name="answer_validation.fallback"
                    onChange={handleChange}
                    value={values?.answer_validation?.fallback}
                    placeholder="Please upload a valid file type."
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              {/* Multiple Images Option */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
                <Checkbox
                  id="allow_multiple_images"
                  checked={values.flow_replies.allow_multiple_images}
                  onCheckedChange={(value) => {
                    setFieldValue("flow_replies.allow_multiple_images", value);
                  }}
                />
                <Text
                  size="sm"
                  tag="label"
                  weight="medium"
                  className="cursor-pointer"
                  htmlFor="allow_multiple_images"
                >
                  Allow Multiple Images
                </Text>
              </div>

              {/* Variable Section */}
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Text size="sm" weight="semibold" color="primary">
                  Save Media URL Variable
                </Text>
                <Input
                  name="user_input_variable"
                  value={values?.user_input_variable}
                  placeholder="@media_url"
                  onChange={handleChange}
                  className="border-blue-200 bg-white"
                />
                <Text size="xs" color="secondary">
                  This variable will store the uploaded media URL
                </Text>
              </div>
            </div>

            {/* Enhanced Footer */}
            <div className="flex items-center gap-3 p-6 border-t border-border-input bg-gray-50/50">
              <SheetClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                className="flex-1"
                onClick={() => handleSubmit()}
              >
                Save Configuration
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </Formik>
  );
};

export default AskMediaTypeSheet;
