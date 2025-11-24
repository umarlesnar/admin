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
import React, { ReactElement, useState } from "react";
import useStore from "../store";
import { Input } from "@/components/ui/input";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { uiYupButtonSchema } from "@/validation-schema/ui/UiYupButtonSchema";
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

const ButtonTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  return (
    <Formik
      initialValues={{
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
      {({ values, errors, handleChange, handleSubmit, resetForm, setFieldValue }: any) => {
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
                  Set Buttons
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 overflow-auto bg-scroll space-y-4">
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Question text
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

                <FieldArray name="expected_answers">
                  {({ insert, remove, push }: any) => (
                    <div>
                      <div className="flex justify-between items-center">
                        <label className="text-base font-medium ">
                          Add answer variant{" "}
                          <span className="text-xs font-light text-accents-secondary_text">
                            (max 20 chars)
                          </span>
                        </label>
                        <Button
                          type="button"
                          disabled={
                            values.expected_answers.length <= 2 ? false : true
                          }
                          onClick={() =>
                            push({
                              id: Math.random().toString(20).slice(2),
                              expected_input: "",
                              isDefault: false,
                              node_result_id: "",
                            })
                          }
                        >
                          Create
                        </Button>
                      </div>
                      <div className="py-4 space-y-3">
                        {values.expected_answers.length > 0 &&
                          values.expected_answers.map(
                            (value: any, index: number) => (
                              <div className="w-full" key={index}>
                                <div className="w-full h-10 flex items-center gap-2">
                                  <div className="w-full flex-1">
                                    <Input
                                      name={`expected_answers.${index}.expected_input`}
                                      placeholder="Answer"
                                      type="text"
                                      value={value.expected_input}
                                      onChange={handleChange}
                                      errorKey={
                                        errors?.expected_answers?.length > 0 &&
                                        errors?.expected_answers[index]
                                          ?.expected_input
                                      }
                                    />
                                  </div>

                                  {values.expected_answers.length > 1 ? (
                                    <div className="h-10  w-10 p-1 rounded-md bg-red-100 flex justify-center items-center cursor-pointer">
                                      <DeleteIcon
                                        className="w-5 h-5 text-red-400 "
                                        onClick={() => remove(index)}
                                      />
                                    </div>
                                  ) : null}
                                </div>

                                <ErrorMessage
                                  name={`expected_answers.${index}.expected_input`}
                                  component="div"
                                  className="text-sm text-red-500"
                                />
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  )}
                </FieldArray>

                <div></div>
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Save Answers in a variable
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

export default ButtonTypeSheet;
