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
import { uiYupListButtonSchema } from "@/validation-schema/ui/UiYupListButtonSchema";
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

const ListTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
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
        user_input_variable: "@action",
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
                  Set List
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 overflow-auto bg-scroll space-y-4">
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Header Text
                    <span className="text-xs text-text-secondary ml-[2px]">
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
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Body Text
                    <span className="text-sm text-red-500 ml-[2px]">*</span>
                  </Text>
                  <Textarea
                    name="interactiveListBody"
                    onChange={handleChange}
                    value={values?.interactiveListBody}
                  />

                  <ErrorMessage
                    component={"p"}
                    name="interactiveListBody"
                    className="test-sm font-normal text-red-500"
                  />
                  <div className="flex justify-between items-center ">
                    <VariantButtonDropdown
                      onSelect={(variableValue: any) => {
                        const currentText = values?.interactiveListBody || "";
                        setFieldValue(
                          "interactiveListBody",
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
                                values?.interactiveListBody || "";
                              setFieldValue(
                                `interactiveListBody`,
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

                              setFieldValue(`interactiveListBody`, newText);

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
                                // If no text is selected, add __Italic__
                                newText = currentText + " __";
                              }

                              setFieldValue(`interactiveListBody`, newText);

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
                                values?.interactiveListBody || "";
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

                              setFieldValue(`interactiveListBody`, newText);

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
                    Footer
                    <span className="text-xs text-text-secondary ml-[2px]">
                      (optional, max 60 chars)
                    </span>
                  </Text>
                  <Input
                    name="interactiveListFooter"
                    onChange={handleChange}
                    placeholder="Enter the foot text"
                    value={values?.interactiveListFooter}
                    errorKey={errors?.interactiveListFooter}
                  />
                </div>
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Button name
                    <span className="text-sm text-red-500 ml-[2px]">*</span>
                  </Text>
                  <Input
                    name="interactiveListButton"
                    onChange={handleChange}
                    placeholder="Enter button name"
                    value={values?.interactiveListButton}
                    errorKey={errors?.interactiveListButton}
                  />
                </div>

                <FieldArray name="interactiveListSections">
                  {({ insert, remove, push }: any) => (
                    <div>
                      {values.interactiveListSections.length > 0 &&
                        values.interactiveListSections.map(
                          (value: any, index: any) => (
                            <div
                              className=" w-full h-auto rounded bg-gray-100 px-3 py-2 mb-4"
                              key={index}
                            >
                              <h4 className="text-sm font-medium text-base-primary">
                                {`section_${index + 1}`}{" "}
                                <span className="text-[10px] font-normal">
                                  {" (optional, max 24 chars)"}
                                </span>
                              </h4>
                              <div className="w-full py-4 border-b border-gray-200">
                                <Input
                                  name={`interactiveListSections.${index}.title`}
                                  type="text"
                                  placeholder={`section_${index + 1}`}
                                  value={value.title}
                                  onChange={handleChange}
                                />
                                <ErrorMessage
                                  name={`interactiveListSections.${index}.title`}
                                  component="div"
                                  className="text-xs text-red-500 pt-1"
                                />
                              </div>
                              <div className="w-full py-3">
                                <FieldArray
                                  name={`interactiveListSections[${index}].rows`}
                                >
                                  {({ insert, remove, push }: any) => (
                                    <div>
                                      {values.interactiveListSections[index]
                                        .rows.length > 0 &&
                                        values.interactiveListSections[
                                          index
                                        ].rows.map((row: any, idx: number) => (
                                          <div
                                            className=" w-full h-auto rounded bg-gray-100 px-3 py-2 mb-4 "
                                            key={"row" + idx}
                                          >
                                            <div className="border-b border-gray-300 pb-2">
                                              <div className="my-2">
                                                <div className="flex items-center justify-between my-2">
                                                  <p className="text-sm font-medium text-text-primary">
                                                    {`Row ${idx + 1}`}{" "}
                                                    <span className="text-[10px] font-normal">
                                                      {" (max 24 chars)"}
                                                    </span>
                                                  </p>
                                                  <p
                                                    className="text-xs font-normal text-accents-secondary_text underline underline-offset-[3px] decoration-0"
                                                    onClick={() => {
                                                      setFieldValue(
                                                        `interactiveListSections.${index}.rows.${idx}.descriptionEnable`,
                                                        true
                                                      );
                                                    }}
                                                  >
                                                    Description
                                                  </p>
                                                </div>
                                                <div className="w-full h-10 flex items-center gap-2">
                                                  <div className="flex-1">
                                                    <Input
                                                      name={`interactiveListSections.${index}.rows.${idx}.title`}
                                                      placeholder={`section_${
                                                        index + 1
                                                      }_row_${idx + 1}`}
                                                      onChange={handleChange}
                                                      value={row.title}
                                                    />
                                                  </div>

                                                  <div
                                                    className="h-10 w-10 bg-red-200 rounded flex items-center justify-center cursor-pointer"
                                                    onClick={() => {
                                                      remove(idx);
                                                    }}
                                                  >
                                                    <DeleteIcon className="text-base text-red-500" />
                                                  </div>
                                                </div>
                                                <ErrorMessage
                                                  name={`interactiveListSections.${index}.rows.${idx}.title`}
                                                  component="div"
                                                  className="text-xs text-red-500 pt-1"
                                                />
                                              </div>

                                              {values.interactiveListSections[
                                                index
                                              ].rows[idx].descriptionEnable ? (
                                                <div className="my-2">
                                                  <div className="flex items-center justify-between pt-2 my-2">
                                                    <p className="text-xs font-medium text-base-primary">
                                                      {`description`}{" "}
                                                      <span className="text-[10px] font-normal">
                                                        {
                                                          " (optional, max 72 chars)"
                                                        }
                                                      </span>
                                                    </p>
                                                  </div>
                                                  <div className="w-full h-10 flex items-center gap-2">
                                                    <div className="flex-1">
                                                      <Input
                                                        name={`interactiveListSections.${index}.rows.${idx}.description`}
                                                        type="text"
                                                        placeholder={`input value`}
                                                        onChange={handleChange}
                                                        value={row.description}
                                                      />
                                                    </div>
                                                    <div
                                                      className="h-10 w-10 bg-red-200 rounded flex items-center justify-center cursor-pointer"
                                                      onClick={() => {
                                                        setFieldValue(
                                                          `interactiveListSections.${index}.rows.${idx}.descriptionEnable`,
                                                          false
                                                        );
                                                      }}
                                                    >
                                                      <DeleteIcon className="text-base text-red-500" />
                                                    </div>
                                                  </div>
                                                  <ErrorMessage
                                                    name={`interactiveListSections.${index}.rows.${idx}.description`}
                                                    component="div"
                                                    className="text-xs text-red-500 pt-1 px-1"
                                                  />
                                                </div>
                                              ) : null}
                                            </div>
                                          </div>
                                        ))}
                                      <p
                                        className="text-xs font-normal text-blue-500 cursor-pointer underline underline-offset-[3px] decoration-0"
                                        onClick={() => {
                                          push({
                                            id: Math.random()
                                              .toString(20)
                                              .slice(2),
                                            title: "",
                                            description: "",
                                            descriptionEnable: false,
                                          });
                                        }}
                                      >
                                        Add Row
                                      </p>
                                    </div>
                                  )}
                                </FieldArray>
                              </div>
                              <div
                                className="w-full h-10 border border-red-500 bg-red-50 rounded flex justify-center items-center text-sm font-normal text-red-500"
                                onClick={() => {
                                  remove(index);
                                }}
                              >
                                Deleted Section
                              </div>
                            </div>
                          )
                        )}

                      {errors.interactiveListSections ===
                        "You can create up to 10 rows." && (
                        <div className="w-full text-sm font-medium text-red-500 pb-3">
                          {errors?.interactiveListSections}
                        </div>
                      )}

                      <div className=" w-full">
                        <div
                          className="w-full h-10 border border-green-500 bg-green-50 rounded flex justify-center items-center text-sm font-normal text-green-500"
                          onClick={() => {
                            if (values.interactiveListSections.length <= 9) {
                              push({
                                id: Math.random().toString(10).slice(2),
                                title: "",
                                rows: [],
                              });
                            }
                          }}
                        >
                          Add New Section
                        </div>
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

export default ListTypeSheet;
