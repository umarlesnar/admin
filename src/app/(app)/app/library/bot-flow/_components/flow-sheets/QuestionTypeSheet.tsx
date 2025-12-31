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
import { ErrorMessage, Formik } from "formik";
import React, {
  ReactElement,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import useStore from "../store";
import { Input } from "@/components/ui/input";
import { uiYupQuestionSchema } from "@/validation-schema/ui/UiYupQuestionSchema";
import VariantButtonDropdown from "../VariantButtonDropdown";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { BoldIcon } from "@/components/ui/icons/BoldIcon";
import { ItalicIcon } from "lucide-react";
import { StrikeThrough } from "@/components/ui/icons/StrikeThroughIcon";
import { Switch } from "@/components/ui/switch";
import { Listbox } from "@/components/ui/listbox";
import EmojiPickerNew from "../EmojiPickerNew";

// Proper TypeScript interfaces
interface FlowReplies {
  type: string;
  data: string;
  caption: string;
  mime_type: string;
}

interface AnswerValidation {
  type: number;
  min: string;
  max: string;
  regex: string;
  fallback: string;
  failsCount: string;
  validation_error_message: string;
}

interface FormValues {
  flow_replies: FlowReplies;
  user_input_variable: string;
  answer_validation: AnswerValidation;
  isAdvanceEnable: boolean;
}

interface Props {
  children: ReactElement;
  data?: Partial<FormValues>;
  id?: any;
}

const VALIDATION_OPTIONS = [
  { name: "String", value: 0 },
  { name: "Number", value: 1 },
  { name: "Email", value: 2 },
  { name: "Location", value: 3 },
] as const;

const QuestionTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { updateNodeData } = useStore();

  const initialValues: FormValues = useMemo(
    () => ({
      flow_replies: {
        type: "1",
        data: "",
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
        validation_error_message: "",
        failsCount: "",
      },
      isAdvanceEnable: false,
      ...data,
    }),
    [data]
  );

  const formatText = useCallback(
    (
      format: "bold" | "italic" | "strikethrough",
      currentText: string,
      setFieldValue: (field: string, value: string) => void
    ) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = currentText.substring(start, end);

      const formatMap = {
        bold: { wrapper: "**", fallback: " **" },
        italic: { wrapper: "_", fallback: " _" },
        strikethrough: { wrapper: "~", fallback: " ~" },
      };

      const { wrapper, fallback } = formatMap[format];

      const newText = selectedText
        ? `${currentText.substring(0, start)}${wrapper}${selectedText}${wrapper}${currentText.substring(end)}`
        : currentText + fallback;

      setFieldValue("flow_replies.data", newText);

      setTimeout(() => {
        textarea.focus();
        const offset = wrapper.length;
        textarea.setSelectionRange(start + offset, end + offset);
      }, 10);
    },
    []
  );

  const handleSubmit = useCallback(
    (values: FormValues) => {
      if (typeof updateNodeData === "function") {
        updateNodeData(id, values);
      }
      setOpen(false);
    },
    [updateNodeData, id]
  );

  const handleAdvanceToggle = useCallback(
    (value: boolean, setFieldValue: (field: string, value: any) => void) => {
      setFieldValue("isAdvanceEnable", value);
      setFieldValue("answer_validation", {
        type: 0,
        min: "",
        max: "",
        regex: "",
        fallback: "",
        failsCount: "1",
        validation_error_message: "",
      });
    },
    []
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
      validationSchema={uiYupQuestionSchema}
      context={{ isAdvanceEnable: initialValues.isAdvanceEnable }}
    >
      {({
        values,
        errors,
        handleChange,
        handleSubmit: formikSubmit,
        resetForm,
        setFieldValue,
      }) => (
        <Sheet
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            if (!value) resetForm();
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
                  Set a Question
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
                    ref={textareaRef}
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
                      onSelect={(variableValue: string) => {
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
                          onClick={() =>
                            formatText(
                              "bold",
                              values?.flow_replies.data || "",
                              setFieldValue
                            )
                          }
                        >
                          <BoldIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      </CustomTooltip>

                      <CustomTooltip value="Italic" sideOffset={10}>
                        <button
                          type="button"
                          className="p-2 hover:bg-white rounded-md transition-colors"
                          onClick={() =>
                            formatText(
                              "italic",
                              values?.flow_replies.data || "",
                              setFieldValue
                            )
                          }
                        >
                          <ItalicIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      </CustomTooltip>

                      <CustomTooltip value="Strikethrough" sideOffset={10}>
                        <button
                          type="button"
                          className="p-2 hover:bg-white rounded-md transition-colors"
                          onClick={() =>
                            formatText(
                              "strikethrough",
                              values?.flow_replies.data || "",
                              setFieldValue
                            )
                          }
                        >
                          <StrikeThrough className="w-4 h-4 text-gray-600" />
                        </button>
                      </CustomTooltip>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Variable Section */}
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Text size="sm" weight="semibold" color="primary">
                  Save Answers in Variable
                </Text>
                <Input
                  name="user_input_variable"
                  value={values?.user_input_variable}
                  placeholder="@Action1"
                  onChange={handleChange}
                  className="border-blue-200 bg-white"
                />
                <ErrorMessage
                  component="p"
                  name="user_input_variable"
                  className="text-sm font-normal text-red-500"
                />
                <Text size="xs" color="secondary">
                  {`This variable will store the user's answer`}
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

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Text size="sm" weight="medium" color="primary">
                            Validation Type
                          </Text>
                          <span className="text-red-500 text-sm">*</span>
                        </div>
                        <Listbox
                          options={VALIDATION_OPTIONS}
                          selectedOption={VALIDATION_OPTIONS.find(
                            (o) => o.value === values.answer_validation?.type
                          )}
                          buttonClassname="w-full border-orange-200 bg-white"
                          onSelectData={(
                            option: (typeof VALIDATION_OPTIONS)[0]
                          ) => {
                            setFieldValue(
                              "answer_validation.type",
                              option.value
                            );
                            setFieldValue("answer_validation.min", "");
                            setFieldValue("answer_validation.max", "");
                          }}
                        />
                      </div>

                      {(values.answer_validation?.type === 1 ||
                        values.answer_validation?.type === 0) && (
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Minimum"
                            name="answer_validation.min"
                            value={values?.answer_validation?.min}
                            errorKey={errors?.answer_validation?.min}
                            placeholder="0"
                            onChange={handleChange}
                            className="border-orange-200 bg-white"
                            isRequired
                          />
                          <Input
                            label="Maximum"
                            name="answer_validation.max"
                            value={values?.answer_validation?.max}
                            errorKey={errors?.answer_validation?.max}
                            placeholder="1000"
                            onChange={handleChange}
                            className="border-orange-200 bg-white"
                            isRequired
                          />
                        </div>
                      )}

                      <Input
                        label="Maximum Attempts"
                        name="answer_validation.failsCount"
                        value={values?.answer_validation?.failsCount}
                        errorKey={errors?.answer_validation?.failsCount}
                        placeholder="3"
                        onChange={handleChange}
                        className="border-orange-200 bg-white"
                        isRequired
                      />

                      <div className="space-y-2">
                        <Text size="sm" weight="medium" color="primary">
                          Validation Error Message
                        </Text>
                        <Textarea
                          name="answer_validation.validation_error_message"
                          onChange={handleChange}
                          value={
                            values?.answer_validation?.validation_error_message
                          }
                          errorKey={
                            errors?.answer_validation?.validation_error_message
                          }
                          placeholder="Please provide a valid answer."
                          className="border-orange-200 bg-white min-h-[80px]"
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
                          className="border-orange-200 bg-white min-h-[80px]"
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
                onClick={() => formikSubmit()}
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

export default QuestionTypeSheet;
