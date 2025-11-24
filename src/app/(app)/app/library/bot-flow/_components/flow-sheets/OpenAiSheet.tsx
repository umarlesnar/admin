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
import { FieldArray, Formik } from "formik";
import React, { ReactElement, useState } from "react";
import useStore from "../store";
import {
  AccordionContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { CustomComponentInput } from "@/components/ui/CustomComponentInput";
import { Listbox } from "@/components/ui/listbox";
import { LeftArrowSearchIcon } from "@/components/ui/icons/LeftArrowSearchIcon";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const roles = [
  {
    name: "System",
    value: "system",
  },
  {
    name: "Assistant",
    value: "assistant",
  },
];

const OpenAiSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  const [role, setRole] = useState(roles[0].value);
  const [message, setMessage] = useState("");
  const [editingContent, setEditingContent] = useState<{
    messageIndex: number;
    contentIndex: number;
  } | null>(null);

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        configuration: {
          api_key: "",
          model: "",
          max_tokens: 0,
          temperature: 0,
          top_p: 0,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        message: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: "You are a helpful assistant.",
              },
            ],
          },
        ],
        ...data,
      }}
      onSubmit={(values) => {
        if (typeof updateNodeData == "function") {
          updateNodeData(id, {
            ...data,
            ...values,
          });
        }
        setOpen(false);
      }}
      enableReinitialize
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
              setEditingContent(null);
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent
              className="w-[390px] sm:w-[500px] h-screen flex flex-col p-5"
              onOpenAutoFocus={preventFocus}
            >
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Open Ai
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 overflow-auto bg-scroll space-y-2">
                {/* Configuration and Messages Accordion remain the same */}
                {/* ... previous code for Configuration Accordion ... */}

                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  defaultValue="item-1"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      Configuration
                    </AccordionTrigger>
                    <AccordionContent className="py-2 px-1 space-y-3">
                      <Input
                        label="Api Key"
                        type="text"
                        name={"configuration.api_key"}
                        placeholder="Api Key"
                        onChange={handleChange}
                        value={values?.configuration?.api_key}
                        errorKey={errors?.configuration?.api_key}
                      />
                      <Input
                        label="Model"
                        type="text"
                        name={"configuration.model"}
                        placeholder="Model"
                        onChange={handleChange}
                        value={values?.configuration?.model}
                        errorKey={errors?.configuration?.model}
                      />
                      <Input
                        label="Max Tokens"
                        type="number"
                        name={"configuration.max_tokens"}
                        placeholder="Max Tokens"
                        onChange={handleChange}
                        value={values?.configuration?.max_tokens}
                        errorKey={errors?.configuration?.max_tokens}
                      />
                      <Input
                        label="Temperature"
                        type="number"
                        name={"configuration.temperature"}
                        placeholder="Temperature"
                        onChange={handleChange}
                        value={values?.configuration?.temperature}
                        errorKey={errors?.configuration?.temperature}
                      />
                      <Input
                        label="top"
                        type="number"
                        name={"configuration.top_p"}
                        placeholder="top"
                        onChange={handleChange}
                        value={values?.configuration?.top_p}
                        errorKey={errors?.configuration?.top_p}
                      />
                      <Input
                        label="Frequency Penalty"
                        type="number"
                        name={"configuration.frequency_penalty"}
                        placeholder="Frequency Penalty"
                        onChange={handleChange}
                        value={values?.configuration?.frequency_penalty}
                        errorKey={errors?.configuration?.frequency_penalty}
                      />
                      <Input
                        label="Presence Penalty"
                        type="number"
                        name={"configuration.presence_penalty"}
                        placeholder="Presence Penalty"
                        onChange={handleChange}
                        value={values?.configuration?.presence_penalty}
                        errorKey={errors?.configuration?.presence_penalty}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      Messages
                    </AccordionTrigger>
                    <AccordionContent className="py-2 px-1 space-y-3">
                      <CustomComponentInput
                        placeholder="Enter message"
                        onChange={(e) => {
                          setMessage(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && message) {
                            const exist = values?.message.find((o: any) => {
                              return o.role == role;
                            });

                            if (exist) {
                              let data = { ...exist };

                              data.content.push({
                                type: "text",
                                text: message,
                              });
                            } else {
                              setFieldValue("message", [
                                ...values?.message,
                                {
                                  role: role,
                                  content: [{ type: "text", text: message }],
                                },
                              ]);
                            }
                            setMessage("");
                          }
                        }}
                        value={message}
                        className="p-0 "
                        leftComponent={
                          <Listbox
                            options={roles}
                            selectedOption={roles.find((o: any) => {
                              return o.value == role;
                            })}
                            buttonClassname={
                              "h-7 w-32 outline-none border-none ml-1"
                            }
                            dropdownClassname={"w-full h-auto"}
                            onSelectData={(data: any) => {
                              setRole(data.value);
                            }}
                          />
                        }
                        rightComponent={
                          <Button
                            type="submit"
                            className="h-full px-3 rounded-none rounded-r-md"
                            onClick={() => {
                              if (message) {
                                const exist = values?.message.find((o: any) => {
                                  return o.role == role;
                                });

                                if (exist) {
                                  let data = { ...exist };

                                  data.content.push({
                                    type: "text",
                                    text: message,
                                  });
                                } else {
                                  setFieldValue("message", [
                                    ...values?.message,
                                    {
                                      role: role,
                                      content: [
                                        { type: "text", text: message },
                                      ],
                                    },
                                  ]);
                                }
                                setMessage("");
                              }
                            }}
                            disabled={!message}
                          >
                            <LeftArrowSearchIcon />
                          </Button>
                        }
                      />

                      <FieldArray name="message">
                        {({ remove }) => {
                          return (
                            <div className="space-y-2">
                              {values?.message?.length > 0 &&
                                values?.message?.map(
                                  (item: any, index: number) => {
                                    return (
                                      <div
                                        className="w-full h-auto bg-neutral-20 rounded-md p-2 space-y-2"
                                        key={index}
                                      >
                                        <div className="w-full flex items-center justify-between">
                                          <Text size="base" weight="medium">
                                            {item.role}
                                          </Text>
                                          <DeleteIcon
                                            className="w-4 h-4 text-red-500 cursor-pointer"
                                            onClick={() => {
                                              remove(index);
                                            }}
                                          />
                                        </div>
                                        <div className="w-full space-y-2">
                                          <FieldArray
                                            name={`message.${index}.content`}
                                          >
                                            {({ remove: removeContent }) => (
                                              <>
                                                {item?.content?.map(
                                                  (value: any, idx: number) => {
                                                    const isEditing =
                                                      editingContent?.messageIndex ===
                                                        index &&
                                                      editingContent?.contentIndex ===
                                                        idx;

                                                    return (
                                                      <div
                                                        key={`content_` + idx}
                                                        className="w-full flex items-start justify-between p-2 bg-white rounded-md"
                                                      >
                                                        {isEditing ? (
                                                          <div className="w-full space-y-2">
                                                            <Textarea
                                                              className="w-full"
                                                              value={
                                                                value?.text
                                                              }
                                                              onChange={(e) => {
                                                                setFieldValue(
                                                                  `message.${index}.content.${idx}.text`,
                                                                  e.target.value
                                                                );
                                                              }}
                                                            />
                                                            <div className="w-full flex items-center gap-2 justify-end">
                                                              <Button
                                                                variant="outline"
                                                                onClick={() =>
                                                                  setEditingContent(
                                                                    null
                                                                  )
                                                                }
                                                              >
                                                                Cancel
                                                              </Button>
                                                              <Button
                                                                onClick={() =>
                                                                  setEditingContent(
                                                                    null
                                                                  )
                                                                }
                                                              >
                                                                Update
                                                              </Button>
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          <>
                                                            <div className="w-[95%]">
                                                              <Text>
                                                                {value?.text}
                                                              </Text>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                              <EditIcon
                                                                className="w-3 h-3 text-text-primary cursor-pointer"
                                                                onClick={() =>
                                                                  setEditingContent(
                                                                    {
                                                                      messageIndex:
                                                                        index,
                                                                      contentIndex:
                                                                        idx,
                                                                    }
                                                                  )
                                                                }
                                                              />
                                                              <CloseIcon
                                                                className="w-[10px] h-[10px] text-text-primary cursor-pointer"
                                                                onClick={() => {
                                                                  const newArr =
                                                                    item?.content?.filter(
                                                                      (
                                                                        item: any,
                                                                        index: any
                                                                      ) => {
                                                                        return (
                                                                          idx !=
                                                                          index
                                                                        );
                                                                      }
                                                                    );

                                                                  setFieldValue(
                                                                    `message.${index}.content`,
                                                                    newArr
                                                                  );
                                                                }}
                                                              />
                                                            </div>
                                                          </>
                                                        )}
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </>
                                            )}
                                          </FieldArray>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                            </div>
                          );
                        }}
                      </FieldArray>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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

export default OpenAiSheet;
