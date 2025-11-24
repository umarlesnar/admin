import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { FieldArray, useFormikContext } from "formik";
import React from "react";
import { Combobox } from "@/components/ui/combobox";

type Props = {};

const LIMITS_KEYS = [
  { name: "user" },
  { name: "user_session_web" },
  { name: "user_session_mobile" },
  { name: "broadcast" },
  { name: "flow" },
  { name: "whatsapp_chat_message" },
  { name: "whatsapp_message_template" },
  { name: "web_chat_message" },
  { name: "whatsapp_bot_flow_trigger" },
  { name: "web_chat_bot_flow_trigger" },
  { name: "api_limit" },
  { name: "whatapp_session_limit_per_day" },
  { name: "media_storage" },
  { name: "message_retention" },
  { name: "broadcast_log_retention" },
];

const ViewPolicyForm = (props: Props) => {
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
            </div>
            {values?.limits?.length > 0 &&
              values?.limits?.map((parameter: any, index: number) => (
                <div key={index} className="w-full flex items-center gap-2">
                 
                  <div className="flex w-full justify-between gap-2">
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
                      className="h-8 w-96 text-xs"
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default ViewPolicyForm;
