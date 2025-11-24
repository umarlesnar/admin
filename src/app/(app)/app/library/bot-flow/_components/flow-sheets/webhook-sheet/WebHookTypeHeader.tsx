import { Button } from "@/components/ui/button";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Text from "@/components/ui/text";
import { ErrorMessage, FieldArray, useFormikContext } from "formik";
import React from "react";

type Props = {};

const WebHookTypeHeader = (props: Props) => {
  const { values, setFieldValue, handleChange }: any = useFormikContext();
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        <Text size="lg" weight="semibold">
          Customize Headers{" "}
          <Text tag="span" size="xs" weight="light" color="secondary">
            {" "}
            {`(Optional)`}
          </Text>
        </Text>

        <Switch
          checked={values.isHeaderEnable}
          onCheckedChange={(value) => {
            setFieldValue("isHeaderEnable", value);
          }}
        />
      </div>
      <div className="py-2 space-y-3">
        <Text size="sm" color="secondary">
          {`Add headers to your request (example: Content-Type: application/json)`}
        </Text>
        <Text size="sm" textColor="text-orange-500">
          {`(User-Agent is not sent as a header by default. make sure you include it if necessary.)`}
        </Text>
      </div>
      {values.isHeaderEnable ? (
        <FieldArray name="headers">
          {({ insert, remove, push }: any) => (
            <div className="space-y-3">
              {values?.headers.length > 0 &&
                values?.headers.map((header: any, index: number) => (
                  <div key={index} className="w-full flex items-center gap-3">
                    <Input
                      name={`headers.${index}.name`}
                      placeholder="name"
                      value={header.name}
                      onChange={handleChange}
                    />
                    <Input
                      name={`headers.${index}.value`}
                      placeholder="value"
                      value={header.value}
                      onChange={handleChange}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon className="w-5 h-5" />
                    </Button>
                  </div>
                ))}

              <Button
                size="sm"
                onClick={(e: any) => {
                  push({ name: "", value: "" });
                  e.preventDefault();
                }}
              >
                Add Header
              </Button>
            </div>
          )}
        </FieldArray>
      ) : null}
    </div>
  );
};

export default WebHookTypeHeader;
