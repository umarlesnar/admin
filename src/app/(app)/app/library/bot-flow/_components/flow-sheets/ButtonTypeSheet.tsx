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
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage, FieldArray, Formik } from "formik";
import React, { ReactElement, useCallback, useState } from "react";
import useStore from "../store";
import { Input } from "@/components/ui/input";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { uiYupButtonSchema } from "@/validation-schema/ui/UiYupButtonSchema";
import { StrikeThrough } from "@/components/ui/icons/StrikeThroughIcon";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { ItalicIcon } from "@/components/ui/icons/ItalicIcon";
import { BoldIcon } from "@/components/ui/icons/BoldIcon";
import VariantButtonDropdown from "../VariantButtonDropdown";
import { Switch } from "@/components/ui/switch";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import EmojiPickerNew from "../EmojiPickerNew";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const ButtonTypeSheet = ({ children, data, id }: Props) => {
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
          caption: "",
          mime_type: "",
        },
        user_input_variable: "@user_response",
        isAdvanceEnable: false,
        answer_validation: {
          fallback: "",
          validation_error_message: "",
          failsCount: "",
        },
        expected_answers: [
          {
            id: Math.random().toString(20).slice(2),
            expected_input: "",
            isDefault: false,
            node_result_id: "",
          },
        ],
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
      validationSchema={uiYupButtonSchema}
    >
      {({
        values,
        errors,
        handleChange,
        handleSubmit,
        resetForm,
        setFieldValue,
      }: any) => {
        return (
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
                    Configure Button
                  </SheetTitle>
                </div>
              </SheetHeader>

              {/* Enhanced Form Body */}
              <div className="flex-1 overflow-auto p-6 space-y-6">
                {/* Question Text Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Text size="sm" weight="semibold" color="primary">
                      Question Text
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

                {/* Enhanced Answer Variants Section */}
                <FieldArray name="expected_answers">
                  {({ insert, remove, push }: any) => (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Text size="sm" weight="semibold" color="primary">
                            Answer Variants
                          </Text>
                          <Text size="xs" color="secondary" className="mt-1">
                            Maximum 20 characters per answer
                          </Text>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={values.expected_answers.length >= 3}
                          onClick={() =>
                            push({
                              id: Math.random().toString(20).slice(2),
                              expected_input: "",
                              isDefault: false,
                              node_result_id: "",
                            })
                          }
                          leftIcon={<PlusIcon className="w-4 h-4 mr-1" />}
                        >
                          Add Answer
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {values.expected_answers.length > 0 &&
                          values.expected_answers.map(
                            (value: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border"
                              >
                                <div className="flex-1">
                                  <Input
                                    name={`expected_answers.${index}.expected_input`}
                                    placeholder={`Answer option ${index + 1}`}
                                    type="text"
                                    value={value.expected_input}
                                    onChange={handleChange}
                                    errorKey={
                                      errors?.expected_answers?.length > 0 &&
                                      errors?.expected_answers[index]
                                        ?.expected_input
                                    }
                                    className="border-white bg-white"
                                  />
                                </div>

                                {values.expected_answers.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-red-500 hover:bg-red-50 hover:text-red-600"
                                    onClick={() => remove(index)}
                                  >
                                    <DeleteIcon className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  )}
                </FieldArray>

                {/* Enhanced Variable Section */}
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Text size="sm" weight="semibold" color="primary">
                    Save Response Variable
                  </Text>
                  <Input
                    name="user_input_variable"
                    value={values?.user_input_variable}
                    placeholder="@user_response"
                    onChange={handleChange}
                    className="border-blue-200 bg-white"
                  />
                  <Text size="xs" color="secondary">
                    {`This variable will store the user's selected answer`}
                  </Text>
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
                          errorKey={errors?.answer_validation?.failsCount}
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
                              errors?.answer_validation
                                ?.validation_error_message
                            }
                            placeholder="Please select a valid option from the buttons above."
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
                            errorKey={errors?.answer_validation?.fallback}
                            placeholder="I'll connect you with a human agent to assist you further."
                            className="border-orange-200 bg-white "
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
        );
      }}
    </Formik>
  );
};

export default ButtonTypeSheet;
