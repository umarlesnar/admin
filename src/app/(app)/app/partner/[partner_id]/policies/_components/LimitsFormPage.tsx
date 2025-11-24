import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { FieldArray, Form, Formik, useFormikContext } from "formik";
import React from "react";
import { Combobox } from "@/components/ui/combobox";

type Props = {};

const LIMITS_KEYS = [
  { name: "user" },
  { name: "user_session_web" },
  { name: "user_session_mobile" },
  { name: "broadcast_instant_enabled" },
  { name: "broadcast_schedule_enabled" },
  { name: "broadcast_report_basic_view" },
  { name: "broadcast_report_advance_view" },
  { name: "broadcast_log_retention" },
  { name: "contact_limit" },
  { name: "contact_export" },
  { name: "botflow_limit" },
  { name: "workflow_limit" },
  { name: "whatsapp_conversation_limit" },
  { name: "whatsapp_message_template_limit" },
  { name: "whatsapp_botflow_trigger_limit" },
  { name: "whatsapp_workflow_trigger_limit" },
  { name: "whatsapp_quick_reply_limit" },
  { name: "api_key_limit" },
  { name: "api_rate_limit" },
  { name: "tag_limit" },
  { name: "custom_attribute_limit" },
  { name: "web_chat_botflow_trigger_limit" },
  { name: "web_conversation_limit" },
  { name: "media_storage" },
  { name: "message_retention" },
];

const LimitsLists = (props: Props) => {
  const { values, handleChange, setFieldValue }: any = useFormikContext();

  return (
    <div className="w-full">
      <FieldArray name="limits">
        {({ insert, remove, push }: any) => (
          <div className="space-y-2">
            <div className="w-full flex items-center justify-between pb-1">
              <Text size="sm" weight="semibold">
                Limits
              </Text>
              <div className="flex items-center gap-2 mr-1">
                <div
                  className="w-6 h-6 bg-primary flex items-center justify-center rounded-md cursor-pointer"
                  onClick={() => {
                    push({
                      key: "",
                      value: "",
                    });
                  }}
                >
                  <PlusIcon className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            {values?.limits?.length > 0 &&
              values?.limits?.map((parameter: any, index: number) => (
                <div key={index} className="w-full flex items-center gap-2">
                  {/* Dropdown for Keys */}
                  <div className="flex w-full justify-between gap-1">
                    <Combobox
                      options={LIMITS_KEYS}
                      placeholder="Select a Key"
                      selectedOption={LIMITS_KEYS.find(
                        (o) => o.name === parameter?.key
                      )}
                      onSelectData={(selected: any) => {
                        setFieldValue(`limits.${index}.key`, selected.name);
                      }}
                      buttonClassname="w-[60%] h-8 text-xs"
                    />

                    <Input
                      name={`limits.${index}.value`}
                      placeholder="Value"
                      onChange={handleChange}
                      value={parameter?.value}
                      className="h-8 w-full text-xs"
                    />
                  </div>

                  <div className="">
                    {index ? (
                      <div className="w-8 h-8 flex items-center justify-center">
                        <DeleteIcon
                          className="w-4 h-4 cursor-pointer text-red-500"
                          onClick={() => {
                            remove(index);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center cursor-not-allowed">
                        <DeleteIcon className="w-4 h-4 text-icon-secondary cursor-not-allowed" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default LimitsLists;
