import Text from "@/components/ui/text";
import React from "react";
import { FieldArray, useFormikContext } from "formik";
import { Input } from "@/components/ui/input";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { Combobox } from "@/components/ui/combobox";
import { TemplateActionButtonDropdoown } from "./TemplateActionButtonDropdoown";
import OrderDetailsConfig from "./OrderDetailsConfig";
import TemplateButtonDropdown from "./TemplateButtonDropdown";

type Props = { index?: number | any; button?: any };

const url_type = [
  { name: "Static", value: "STATIC" },
  { name: "Dynamic", value: "DYNAMIC" },
];

const extractVariables = (input: string) => {
  const matches = input.match(/{{(.*?)}}/g) || []; // Match all variables in {{ }}
  return matches.map((match) => match.replace(/{{|}}/g, "")); // Remove {{ and }} for each variable name
};

const TemplateButtonsForm = ({ button, index }: Props) => {
  const { values, errors, handleChange, setFieldValue }: any =
    useFormikContext();

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-1">
        <Text size="lg" weight="semibold" className="leading-6">
          Buttons
        </Text>
        <Text
          size="sm"
          weight="semibold"
          color="secondary"
          className="leading-6 mt-1"
        >{`(Optional)`}</Text>
      </div>
      <Text size="sm" className="block">
        Create buttons that enable customers to respond to your messages or take
        action easily.
      </Text>

      <FieldArray name={`components.${index}.buttons`}>
        {({ insert, remove, push, replace }: any) => {
          return (
            <>
              {values.category !== "AUTHENTICATION" ? (
                <div>
                  <TemplateButtonDropdown
                    buttons={button?.buttons || []}
                    onSelectData={(data: any) => {
                      push(data);
                    }}
                    // options={buttonOptions}
                  />
                </div>
              ) : null}

              <div className="space-y-3">
                {button?.buttons.length > 0 &&
                  button?.buttons.map((button: any, idx: number) => {
                    return (
                      <div className="w-full" key={`${index}_${idx}`}>
                        {button.type == "QUICK_REPLY" && (
                          <div className="w-full flex items-center gap-4">
                            <div className="flex-1">
                              <Input
                                label={"Button text"}
                                name={`components.${index}.buttons.${idx}.text`}
                                onChange={handleChange}
                                value={button.text}
                                className="w-full"
                                limit={25}
                                errorKey={
                                  errors?.components?.length > 0 &&
                                  errors?.components[3]?.buttons[idx]?.text
                                }
                              />
                            </div>
                            <DeleteIcon
                              className="w-6 h-6 text-red-500 cursor-pointer"
                              onClick={() => {
                                remove(idx);
                              }}
                            />
                          </div>
                        )}
                        {button.type == "PHONE_NUMBER" && (
                          <div className="w-full flex items-center gap-4 bg-neutral-20 rounded-md p-3">
                            <div className="space-y-[6px] mb-6">
                              <Text weight="semibold" color="primary">
                                Type of Action
                              </Text>
                              <TemplateActionButtonDropdoown
                                buttons={button?.buttons}
                                buttonClassname="w-40"
                                onSelectData={(data: any) => {
                                  replace(idx, data.value);
                                }}
                                selectedOption={button}
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                label={"Button text"}
                                name={`components.${index}.buttons.${idx}.text`}
                                onChange={handleChange}
                                value={button.text}
                                className="w-full"
                                limit={25}
                                errorKey={
                                  errors?.components?.length > 0 &&
                                  errors?.components[3]?.buttons[idx]?.text
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                label={"Phone Number"}
                                name={`components.${index}.buttons.${idx}.phone_number`}
                                placeholder="999xxxxxxxxx"
                                onChange={handleChange}
                                value={button.phone_number}
                                className="w-full"
                                limit={20}
                                errorKey={
                                  errors?.components?.length > 0 &&
                                  errors?.components[3]?.buttons[idx]
                                    ?.phone_number
                                }
                              />
                            </div>
                            <DeleteIcon
                              className="w-6 h-6 text-red-500 cursor-pointer"
                              onClick={() => {
                                remove(idx);
                              }}
                            />
                          </div>
                        )}
                        {button.type == "URL" && (
                          <div className="w-full space-y-3 bg-neutral-20 rounded-md p-3">
                            <div className="w-full flex items-center gap-4">
                              <div className="space-y-[6px] mb-6">
                                <Text weight="semibold" color="primary">
                                  Type of Action
                                </Text>
                                <TemplateActionButtonDropdoown
                                  buttons={button?.buttons}
                                  buttonClassname="w-40"
                                  onSelectData={(data: any) => {
                                    replace(idx, data.value);
                                  }}
                                  selectedOption={button}
                                />
                              </div>
                              <div className="flex-1">
                                <Input
                                  label={"Button text"}
                                  name={`components.${index}.buttons.${idx}.text`}
                                  onChange={handleChange}
                                  value={button.text}
                                  className="w-full"
                                  limit={25}
                                  errorKey={
                                    errors?.components?.length > 0 &&
                                    errors?.components[3]?.buttons[idx]?.text
                                  }
                                />
                              </div>
                            </div>{" "}
                            <div className="w-full flex items-center gap-4">
                              <div className="space-y-[6px] mb-6">
                                <Text weight="semibold" color="primary">
                                  Url Type
                                </Text>
                                <Combobox
                                  options={url_type}
                                  buttonClassname="w-40 h-10"
                                  selectedOption={url_type.find((o) => {
                                    return o.value == button.url_type;
                                  })}
                                  onSelectData={(data: any) => {
                                    replace(idx, {
                                      ...button,
                                      url_type: data.value,
                                    });
                                  }}
                                />
                              </div>

                              <div className="flex-1">
                                <Input
                                  label={"Website Url"}
                                  placeholder="https://www.example.com"
                                  name={`components.${index}.buttons.${idx}.url`}
                                  onChange={(e) => {
                                    setFieldValue(
                                      `components.${index}.buttons.${idx}.url`,
                                      e.target.value
                                    );

                                    const variables = extractVariables(
                                      e.target.value
                                    );

                                    if (variables.length > 0) {
                                      setFieldValue(
                                        `components.${index}.buttons.${idx}.example`,
                                        Array(variables.length).fill("")
                                      );
                                    } else {
                                      setFieldValue(
                                        `components.${index}.buttons.${idx}.example`,
                                        []
                                      );
                                    }
                                  }}
                                  value={button.url}
                                  className="w-full"
                                  limit={200}
                                  errorKey={
                                    errors?.components?.length > 0 &&
                                    errors?.components[3]?.buttons[idx]?.url
                                  }
                                />
                              </div>
                              <DeleteIcon
                                className="w-6 h-6 text-red-500 cursor-pointer "
                                onClick={() => {
                                  remove(idx);
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {button.type == "COPY_CODE" && (
                          <div className="w-full flex items-center gap-4 bg-neutral-20 p-3">
                            <div className="space-y-[6px] mb-6 ">
                              <Text weight="semibold" color="primary">
                                Type of Action
                              </Text>
                              <TemplateActionButtonDropdoown
                                buttons={button?.buttons}
                                buttonClassname="w-40"
                                onSelectData={(data: any) => {
                                  replace(idx, data.value);
                                }}
                                selectedOption={button}
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                label={"Button text"}
                                name={`components.${index}.buttons.${idx}.text`}
                                onChange={handleChange}
                                value={button.text}
                                className="w-full"
                                limit={25}
                                errorKey={
                                  errors?.components?.length > 0 &&
                                  errors?.components[3]?.buttons[idx]?.text
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                label={"Offer code"}
                                name={`components.${index}.buttons.${idx}.example`}
                                placeholder="Enter offer code"
                                onChange={handleChange}
                                value={button.example}
                                className="w-full"
                                limit={15}
                                errorKey={
                                  errors?.components?.length > 0 &&
                                  errors?.components[3]?.buttons[idx]?.example
                                }
                              />
                            </div>
                            <DeleteIcon
                              className="w-6 h-6 text-red-500 cursor-pointer"
                              onClick={() => {
                                remove(idx);
                              }}
                            />
                          </div>
                        )}

                        {button.type == "OTP" &&
                          button?.otp_type == "copy_code" && (
                            <div className="w-full flex items-end gap-4 bg-neutral-20 rounded-md p-3">
                              <Input
                                label={"Button text"}
                                name={`components.${index}.buttons.${idx}.text`}
                                onChange={handleChange}
                                value={button.text}
                                className="w-full"
                              />
                            </div>
                          )}
                        {button.type == "ORDER_DETAILS" && (
                          <div>
                            <div className="w-full gap-4 bg-neutral-20 rounded-md p-3">
                              <Input
                                label={"Button text"}
                                name={`components.${index}.buttons.${idx}.text`}
                                onChange={handleChange}
                                value={button.text}
                                className="w-full"
                              />
                            </div>
                            <OrderDetailsConfig />
                          </div>
                        )}

                        {button?.type == "FLOW" && (
                          <div className="w-full space-y-2 bg-neutral-20 rounded-md p-3">
                            <div className="flex items-start gap-2 w-full">
                              <div className="flex-1 ">
                                <Input
                                  label={"Flow Button Text"}
                                  name={`components.${index}.buttons.${idx}.text`}
                                  placeholder="Enter text for the button"
                                  onChange={handleChange}
                                  value={button.text}
                                  className="w-full"
                                  isRequired
                                  limit={25}
                                  errorKey={
                                    errors?.components?.length > 0 &&
                                    errors?.components[3]?.buttons[idx]?.text
                                  }
                                />
                              </div>
                              <div className="flex-1">
                                <Input
                                  label={"Flow ID"}
                                  name={`components.${index}.buttons.${idx}.flow_id`}
                                  placeholder="Enter Flow ID here"
                                  onChange={handleChange}
                                  value={button.flow_id}
                                  className="w-full"
                                  isRequired
                                  errorKey={
                                    errors?.components?.length > 0 &&
                                    errors?.components[3]?.buttons[idx]?.flow_id
                                  }
                                />
                              </div>
                              <DeleteIcon
                                className="w-6 h-6 text-red-500 cursor-pointer mt-8"
                                onClick={() => {
                                  remove(idx);
                                }}
                              />
                            </div>

                            <div className="flex-1">
                              <Input
                                label={"Navigate"}
                                name={`components.${index}.buttons.${idx}.navigate_screen`}
                                placeholder="Screen ID to navigate to"
                                onChange={handleChange}
                                value={button.navigate_screen}
                                className="w-full"
                                isRequired
                                errorKey={
                                  errors?.components?.length > 0 &&
                                  errors?.components[3]?.buttons[idx]
                                    ?.navigate_screen
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </>
          );
        }}
      </FieldArray>
    </div>
  );
};

export default TemplateButtonsForm;
