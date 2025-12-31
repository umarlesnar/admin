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
import { uiYupListButtonSchema } from "@/validation-schema/ui/UiYupListButtonSchema";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { StrikeThrough } from "@/components/ui/icons/StrikeThroughIcon";
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

const ListTypeSheet = ({ children, data, id }: Props) => {
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
        interactiveListHeader: "",
        interactiveListBody: "",
        interactiveListFooter: "",
        interactiveListButton: "",
        interactiveListSections: [
          {
            id: Math.random().toString(10).slice(2),
            title: "",
            rows: [
              {
                id: Math.random().toString(20).slice(2),
                title: "",
                description: "",
                descriptionEnable: false,
              },
            ],
          },
        ],
        isAdvanceEnable: false,
        answer_validation: {
          fallback: "",
          validation_error_message: "",
          failsCount: "",
        },
        user_input_variable: "@user_response",
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
      validationSchema={uiYupListButtonSchema}
    >
      {({
        values,
        errors,
        setFieldValue,
        handleChange,
        handleSubmit,
        resetForm,
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
                    Configure List
                  </SheetTitle>
                </div>
              </SheetHeader>

              {/* Enhanced Form Body */}
              <div className="flex-1 overflow-auto p-6 space-y-6">
                {/* Header Text Section */}
                <div className="space-y-3">
                  <Text size="sm" weight="semibold" color="primary">
                    Header Text
                    <span className="text-xs text-text-secondary ml-1 font-normal">
                      (optional, max 60 chars)
                    </span>
                  </Text>
                  <Input
                    name="interactiveListHeader"
                    onChange={handleChange}
                    placeholder="Enter the header text"
                    value={values?.interactiveListHeader}
                    errorKey={errors?.interactiveListHeader}
                  />
                </div>

                {/* Body Text Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Text size="sm" weight="semibold" color="primary">
                      Body Text
                    </Text>
                    <span className="text-red-500 text-sm">*</span>
                  </div>

                  <div className="space-y-3">
                    <Textarea
                      name="interactiveListBody"
                      onChange={handleChange}
                      value={values?.interactiveListBody}
                      placeholder="Enter your message text here..."
                    />

                    <ErrorMessage
                      component="p"
                      name="interactiveListBody"
                      className="text-sm font-normal text-red-500"
                    />

                    {/* Enhanced Formatting Toolbar */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <VariantButtonDropdown
                        onSelect={(variableValue: any) => {
                          const currentText = values?.interactiveListBody || "";
                          setFieldValue(
                            "interactiveListBody",
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
                                  values?.interactiveListBody || "";
                                setFieldValue(
                                  "interactiveListBody",
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
                                values?.interactiveListBody || "";
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

                              setFieldValue("interactiveListBody", newText);

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
                                values?.interactiveListBody || "";
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

                              setFieldValue("interactiveListBody", newText);

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
                                values?.interactiveListBody || "";
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

                              setFieldValue("interactiveListBody", newText);

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

                {/* Footer and Button Sections */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-3">
                    <Text size="sm" weight="semibold" color="primary">
                      Footer
                      <span className="text-xs text-text-secondary ml-1 font-normal">
                        (optional, max 60 chars)
                      </span>
                    </Text>
                    <Input
                      name="interactiveListFooter"
                      onChange={handleChange}
                      placeholder="Enter the footer text"
                      value={values?.interactiveListFooter}
                      errorKey={errors?.interactiveListFooter}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Text size="sm" weight="semibold" color="primary">
                        Button Name
                      </Text>
                      <span className="text-red-500 text-sm">*</span>
                    </div>
                    <Input
                      name="interactiveListButton"
                      onChange={handleChange}
                      placeholder="Enter button name"
                      value={values?.interactiveListButton}
                      errorKey={errors?.interactiveListButton}
                    />
                  </div>
                </div>

                {/* Enhanced List Sections */}
                <FieldArray name="interactiveListSections">
                  {({ insert, remove, push }: any) => (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Text size="sm" weight="semibold" color="primary">
                            List Sections
                          </Text>
                          <Text size="xs" color="secondary" className="mt-1">
                            Configure your interactive list sections
                          </Text>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {values.interactiveListSections.length > 0 &&
                          values.interactiveListSections.map(
                            (value: any, index: any) => (
                              <div
                                key={index}
                                className="p-4 bg-gray-50 rounded-lg border space-y-4"
                              >
                                {/* Section Header */}
                                <div className="flex items-center justify-between">
                                  <Text
                                    size="sm"
                                    weight="medium"
                                    color="primary"
                                  >
                                    Section {index + 1}
                                    <span className="text-xs font-normal text-text-secondary ml-1">
                                      (optional, max 24 chars)
                                    </span>
                                  </Text>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                    onClick={() => remove(index)}
                                  >
                                    Delete Section
                                  </Button>
                                </div>

                                {/* Section Title Input */}
                                <div className="space-y-2">
                                  <Input
                                    name={`interactiveListSections.${index}.title`}
                                    type="text"
                                    placeholder={`Section ${index + 1} title`}
                                    value={value.title}
                                    onChange={handleChange}
                                    className="border-white bg-white"
                                  />
                                  <ErrorMessage
                                    name={`interactiveListSections.${index}.title`}
                                    component="div"
                                    className="text-xs text-red-500"
                                  />
                                </div>

                                {/* Section Rows */}
                                <FieldArray
                                  name={`interactiveListSections[${index}].rows`}
                                >
                                  {({ insert, remove, push }: any) => (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <Text
                                          size="sm"
                                          weight="medium"
                                          color="primary"
                                        >
                                          Rows
                                        </Text>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            push({
                                              id: Math.random()
                                                .toString(20)
                                                .slice(2),
                                              title: "",
                                              description: "",
                                              descriptionEnable: false,
                                              node_result_id: "",
                                            });
                                          }}
                                          leftIcon={
                                            <PlusIcon className="w-3 h-3" />
                                          }
                                        >
                                          Add Row
                                        </Button>
                                      </div>

                                      {values.interactiveListSections[index]
                                        .rows.length > 0 &&
                                        values.interactiveListSections[
                                          index
                                        ].rows.map((row: any, idx: number) => (
                                          <div
                                            key={idx}
                                            className="p-3 bg-white rounded-lg border space-y-3"
                                          >
                                            {/* Row Header */}
                                            <div className="flex items-center justify-between">
                                              <Text
                                                size="sm"
                                                weight="medium"
                                                color="primary"
                                              >
                                                Row {idx + 1}
                                                <span className="text-xs font-normal text-text-secondary ml-1">
                                                  (max 24 chars)
                                                </span>
                                              </Text>
                                              <div className="flex items-center gap-2">
                                                <button
                                                  type="button"
                                                  className="text-xs text-blue-500 underline"
                                                  onClick={() => {
                                                    setFieldValue(
                                                      `interactiveListSections.${index}.rows.${idx}.descriptionEnable`,
                                                      true
                                                    );
                                                  }}
                                                >
                                                  Add Description
                                                </button>
                                                <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                  onClick={() => remove(idx)}
                                                >
                                                  <DeleteIcon className="w-4 h-4" />
                                                </Button>
                                              </div>
                                            </div>

                                            {/* Row Title */}
                                            <div className="space-y-2">
                                              <Input
                                                name={`interactiveListSections.${index}.rows.${idx}.title`}
                                                placeholder={`Row ${idx + 1} title`}
                                                onChange={handleChange}
                                                value={row.title}
                                                className="border-gray-200"
                                              />
                                              <ErrorMessage
                                                name={`interactiveListSections.${index}.rows.${idx}.title`}
                                                component="div"
                                                className="text-xs text-red-500"
                                              />
                                            </div>

                                            {/* Row Description */}
                                            {values.interactiveListSections[
                                              index
                                            ].rows[idx].descriptionEnable && (
                                              <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                  <Text
                                                    size="xs"
                                                    weight="medium"
                                                    color="primary"
                                                  >
                                                    Description
                                                    <span className="text-xs font-normal text-text-secondary ml-1">
                                                      (optional, max 72 chars)
                                                    </span>
                                                  </Text>
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-red-500 hover:bg-red-50"
                                                    onClick={() => {
                                                      setFieldValue(
                                                        `interactiveListSections.${index}.rows.${idx}.descriptionEnable`,
                                                        false
                                                      );
                                                      setFieldValue(
                                                        `interactiveListSections.${index}.rows.${idx}.description`,
                                                        ""
                                                      );
                                                    }}
                                                  >
                                                    <DeleteIcon className="w-3 h-3" />
                                                  </Button>
                                                </div>
                                                <Input
                                                  name={`interactiveListSections.${index}.rows.${idx}.description`}
                                                  type="text"
                                                  placeholder="Enter description"
                                                  onChange={handleChange}
                                                  value={row.description}
                                                  className="border-gray-200"
                                                />
                                                <ErrorMessage
                                                  name={`interactiveListSections.${index}.rows.${idx}.description`}
                                                  component="div"
                                                  className="text-xs text-red-500"
                                                />
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </FieldArray>
                              </div>
                            )
                          )}

                        {errors.interactiveListSections ===
                          "You can create up to 10 rows." && (
                          <div className="text-sm font-medium text-red-500">
                            {errors?.interactiveListSections}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={values.interactiveListSections.length >= 10}
                        onClick={() => {
                          if (values.interactiveListSections.length <= 9) {
                            push({
                              id: Math.random().toString(10).slice(2),
                              title: "",
                              rows: [],
                            });
                          }
                        }}
                        leftIcon={<PlusIcon className="w-4 h-4" />}
                      >
                        Add Section
                      </Button>
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
                            placeholder="Please select a valid option from the list."
                            className="border-orange-200 bg-white"
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

export default ListTypeSheet;
