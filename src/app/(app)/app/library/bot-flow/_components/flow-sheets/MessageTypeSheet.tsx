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
import React, { ReactElement, useRef, useState } from "react";
import useStore from "../store";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { uiYupMessageFlowTypeSchema } from "@/validation-schema/ui/UiYupMessageSchema";
import VariantButtonDropdown from "../VariantButtonDropdown";
import CustomTooltip from "@/components/ui/CustomTooltip";
import EmojiPickerNew from "../../../template/_components/EmojiPickerNew";
import { BoldIcon } from "@/components/ui/icons/BoldIcon";
import { ItalicIcon } from "@/components/ui/icons/ItalicIcon";
import { StrikeThrough } from "@/components/ui/icons/StrikeThroughIcon";
// import { useMediaUploadMutation } from "@/framework/media/media-upload-mutation";

type Props = {
  children: ReactElement;
  sheetData?: any;
  id?: any;
};

const MessageTypeSheet = ({ children, sheetData, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData, variables } = useStore();
  const inputRef = useRef(null);
  // const media = useMediaUploadMutation();

  return (
    <Formik
      initialValues={{
        type: "image",
        data: "",
        url: "",
        caption: "",
        mime_type: "",
        ...sheetData?.flow_replies,
      }}
      onSubmit={(values) => {
        if (typeof updateNodeData == "function") {
          updateNodeData(id, {
            ...sheetData,
            flow_replies: values,
          });
        }
      }}
      enableReinitialize
      validationSchema={uiYupMessageFlowTypeSchema}
    >
      {({ values, setFieldValue, handleSubmit, resetForm, handleChange }) => {
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
                  Send Message
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 py-2 overflow-auto bg-scroll space-y-2">
                <div className="w-full">
                  <input
                    type="file"
                    name="file"
                    ref={inputRef}
                    // onChange={async (event: any) => {
                    //   event.preventDefault();

                    //   const fileUploaded = event.target.files[0];
                    //   if (fileUploaded) {
                    //     const response = await media.mutateAsync({
                    //       payload: fileUploaded,
                    //     });

                    //     const full_url = response.public_url;
                    //     setFieldValue("url", full_url);
                    //     setFieldValue("data", response.file_path);
                    //     setFieldValue("mime_type", fileUploaded.type);
                    //   }

                    //   event.target.value = null;
                    // }}
                    style={{ display: "none" }}
                    accept={
                      values?.type == "image"
                        ? "image/png,image/jpeg"
                        : values?.type == "video"
                        ? "video/MP4,video/3GPP"
                        : values?.type == "audio"
                        ? ".mp3,audio/*"
                        : values?.type == "document"
                        ? ".pdf"
                        : ""
                    }
                  />
                  <RadioGroup
                    className="w-full flex items-center gap-3 my-2"
                    onValueChange={(value) => {
                      setFieldValue("type", value);
                      setFieldValue("data", "");
                      setFieldValue("url", "");
                      setFieldValue("mime_type", "");
                    }}
                    defaultValue={values?.type}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="text" id="text">
                        Text
                      </RadioGroupItem>
                      <Text
                        tag="label"
                        htmlFor="text"
                        weight="medium"
                        className="mb-1"
                      >
                        Text
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="image" id="image">
                        Image
                      </RadioGroupItem>
                      <Text
                        tag="label"
                        htmlFor="image"
                        weight="medium"
                        className="mb-1"
                      >
                        Image
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="video" id="video">
                        Image
                      </RadioGroupItem>
                      <Text
                        tag="label"
                        htmlFor="video"
                        weight="medium"
                        className="mb-1"
                      >
                        Video
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="audio" id="audio" />
                      <Text
                        tag="label"
                        htmlFor="audio"
                        weight="medium"
                        className="mb-1"
                      >
                        Audio
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="document" id="document" />
                      <Text
                        tag="label"
                        htmlFor="document"
                        weight="medium"
                        className="mb-1"
                      >
                        Document
                      </Text>
                    </div>
                  </RadioGroup>
                  <ErrorMessage
                    component={"p"}
                    name="data"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
                {values.type == "text" ? (
                  <div className="space-y-2">
                    <Text size="sm" weight="medium">
                      Message{" "}
                      <span className="text-sm text-red-500 ml-[2px]">*</span>
                    </Text>
                    <Textarea
                      name="data"
                      onChange={handleChange}
                      value={values?.data}
                    />
                    <div className="flex justify-between items-center ">
                      <VariantButtonDropdown
                        options={variables}
                        onSelect={(variableValue: any) => {
                          const currentText = values?.data || "";
                          setFieldValue("data", currentText + variableValue);
                        }}
                      />
                      <div className="flex gap-3 items-center">
                        <CustomTooltip value={"Emoji"} sideOffset={10}>
                          <div>
                            <EmojiPickerNew
                              iconClassName={"w-3 h-3"}
                              onChange={(emoji: string) => {
                                const currentText = values?.data || "";
                                setFieldValue(`data`, currentText + emoji);
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
                                const currentText = values?.data || "";
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

                                setFieldValue(`data`, newText);

                                setTimeout(() => {
                                  textarea.focus();
                                  textarea.setSelectionRange(
                                    start + 2,
                                    end + 2
                                  ); // Adjust cursor inside bold text
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
                                const currentText = values?.data || "";
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

                                setFieldValue(`data`, newText);

                                // Refocus textarea after update
                                setTimeout(() => {
                                  textarea.focus();
                                  textarea.setSelectionRange(
                                    start + 2,
                                    end + 2
                                  ); // Adjust cursor inside italics
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
                                const currentText = values?.data || "";
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

                                setFieldValue(`data`, newText);

                                // Refocus textarea after update
                                setTimeout(() => {
                                  textarea.focus();
                                  textarea.setSelectionRange(
                                    start + 2,
                                    end + 2
                                  ); // Adjust cursor inside strikethrough
                                }, 10);
                              }}
                              className="w-3 h-3 text-[#304742] cursor-pointer"
                            />
                          </div>
                        </CustomTooltip>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-4">
                    {values?.url ? (
                      <>
                        {values.type == "image" && (
                          <div className="w-full h-44 bg-neutral-20 rounded-md relative">
                            <Image
                              src={values?.url}
                              alt="Template Image"
                              className="absolute rounded-md object-contain w-full h-44"
                            />
                            <div
                              className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                              onClick={() => {
                                setFieldValue("data", "");
                                setFieldValue("url", "");
                                setFieldValue("mime_type", "");
                              }}
                            >
                              <CloseIcon className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                        {values.type == "document" && (
                          <div className="w-full h-44 bg-neutral-20 rounded-md relative">
                            <iframe
                              className="w-full h-full bg-neutral-20 rounded-md relative"
                              src={values?.url}
                            />
                            <div
                              className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                              onClick={() => {
                                setFieldValue("data", "");
                                setFieldValue("url", "");
                                setFieldValue("mime_type", "");
                              }}
                            >
                              <CloseIcon className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                        {values.type == "video" && (
                          <div
                            className="w-full h-44 bg-neutral-20 rounded-md relative"
                            onClick={() => {
                              setFieldValue("data", "");
                              setFieldValue("url", "");
                              setFieldValue("mime_type", "");
                            }}
                          >
                            <video
                              src={values?.url}
                              controls
                              className="w-full max-h-44 rounded-md"
                            />
                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
                              <CloseIcon className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                        {values.type == "audio" && (
                          <div
                            className="w-full  bg-neutral-20 rounded-md relative"
                            onClick={() => {
                              setFieldValue("data", "");
                              setFieldValue("url", "");
                              setFieldValue("mime_type", "");
                            }}
                          >
                            <audio
                              className="w-full"
                              controls
                              src={values?.url}
                            ></audio>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          type="button"
                          onClick={() => {
                            if (inputRef) {
                              //@ts-ignore
                              inputRef?.current.click();
                            }
                          }}
                          // disabled={media.isPending}
                          // loading={media.isPending}
                        >
                          Select File
                        </Button>
                      </div>
                    )}
                  </div>
                )}
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
                    setOpen(false);
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

export default MessageTypeSheet;
