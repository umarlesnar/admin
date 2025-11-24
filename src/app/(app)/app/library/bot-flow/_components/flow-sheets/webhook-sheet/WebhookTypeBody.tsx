import { Switch } from "@/components/ui/switch";
import Text from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage, useFormikContext } from "formik";
import React from "react";
import VariantButtonDropdown from "../../VariantButtonDropdown";

type Props = {};

const WebHookTypeBody = (props: Props) => {
  const { values, setFieldValue, handleChange }: any = useFormikContext();
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        <Text size="lg" weight="semibold">
          Customize Body{" "}
          <Text tag="span" size="xs" weight="light" color="secondary">
            {" "}
            {`(optional)`}
          </Text>
        </Text>

        <Switch
          checked={values.isBodyEnable}
          onCheckedChange={(value) => {
            setFieldValue("isBodyEnable", value);
          }}
        />
      </div>
      <div className="py-2 space-y-3">
        <Text size="sm" textColor="text-orange-500">
          {`Formatting Tips: – Strings and Variables must be wrapped in quotes →"@name" – A comma is needed between 2 key-value pairs →"Email": "@email", "Name": "@name"`}
        </Text>

        <Text size="lg" weight="semibold">
          {`Request Body (JSON only)`}
        </Text>
      </div>
      {values.isBodyEnable ? (
        <>
          <Textarea
            name="body"
            onChange={handleChange}
            value={values.body}
            placeholder={`{ "variable" : "value" }`}
          />

          <ErrorMessage
            name="body"
            component={"p"}
            className="text-sm font-normal text-red-500 py-1"
          />
          <div className="mt-4">
            <VariantButtonDropdown
              onSelect={(variableValue: any) => {
                const currentText = values?.body || "";
                setFieldValue("body", currentText + variableValue);
              }}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default WebHookTypeBody;
