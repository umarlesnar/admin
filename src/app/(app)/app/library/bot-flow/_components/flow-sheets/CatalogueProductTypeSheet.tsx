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
import { Listbox } from "@/components/ui/listbox";
import * as yup from "yup";
import Text from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { StrikeThrough } from "@/components/ui/icons/StrikeThroughIcon";
import { ItalicIcon } from "@/components/ui/icons/ItalicIcon";
import { BoldIcon } from "@/components/ui/icons/BoldIcon";
import VariantButtonDropdown from "../VariantButtonDropdown";
import EmojiPickerNew from "../EmojiPickerNew";

const validationSchema = yup.object({
  body: yup
    .string()
    .max(1024, "Body must be 1024 characters or less"),
  footer: yup.string().max(60, "Footer must be 60 characters or less")
});

type Props = {
  children: ReactElement;
  sheetData?: any;
  id?: any;
};

const CatalogueProductTypeSheet = ({ children, sheetData, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();

  return (
    <Formik
      initialValues={{
        product_id: "",
        name: "",
        image_url: "",
        retailer_id: "",
        product_price: "",
        body: "",
        footer: "",
        ...sheetData,
      }}
      onSubmit={(values) => {
        if (typeof updateNodeData == "function") {
          updateNodeData(id, {
            ...values,
          });
        }
        setOpen(false);
      }}
      validationSchema={validationSchema}
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
              resetForm(sheetData?.flow_replies);
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-[390px] sm:w-[500px] h-screen flex flex-col p-5">
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Set Catalogue Product
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 py-1 overflow-auto bg-scroll space-y-2">
                <Listbox
                  // options={data?.items || []}
                  // selectedOption={data?.items?.find((o: any) => {
                  //   return o.id == values?.product_id;
                  // })}
                  buttonClassname={"w-full h-10"}
                  dropdownClassname={"w-full h-auto"}
                  onSelectData={(data: any) => {
                    setFieldValue("name", data?.name);
                    setFieldValue("product_id", data?.product_id);
                    setFieldValue("catalog_id", data?.catalog_id);
                    setFieldValue("retailer_id", data?.retailer_id);
                    setFieldValue("image_url", data?.image_url);
                    setFieldValue("product_price", data?.product_price);
                  }}
                />
                <div className="space-y-2">
                  <div className="w-full flex ">
                    <Text size="sm" weight="medium">
                      Body
                    </Text>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <Textarea
                    name="body"
                    placeholder="Enter body text"
                    onChange={handleChange}
                    value={values?.body}
                    errorKey={errors.body}
                  />

                  <div className="flex justify-between items-center ">
                    <VariantButtonDropdown
                      onSelect={(variableValue: any) => {
                        const currentText = values?.body || "";
                        setFieldValue("body", currentText + variableValue);
                      }}
                    />
                    <div className="flex gap-3 items-center">
                      <CustomTooltip value={"Emoji"} sideOffset={10}>
                        <div>
                          <EmojiPickerNew
                            iconClassName={"w-3 h-3"}
                            onChange={(emoji: string) => {
                              const currentText = values?.body || "";
                              setFieldValue(`body`, currentText + emoji);
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
                              const currentText = values?.body || "";
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

                              setFieldValue(`body`, newText);

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
                          <ItalicIcon
                            onClick={() => {
                              const textarea =
                                document.querySelector("textarea");
                              if (!textarea) return;

                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const currentText = values?.body || "";
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

                              setFieldValue(`body`, newText);

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
                              const currentText = values?.body || "";
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

                              setFieldValue(`body`, newText);

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
                  <div className="w-full flex ">
                    <Text size="sm" weight="medium">
                      Footer
                    </Text>
                  </div>
                  <Input
                    name="footer"
                    placeholder="Enter footer text"
                    onChange={handleChange}
                    value={values?.footer}
                    errorKey={errors.footer}
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

export default CatalogueProductTypeSheet;
