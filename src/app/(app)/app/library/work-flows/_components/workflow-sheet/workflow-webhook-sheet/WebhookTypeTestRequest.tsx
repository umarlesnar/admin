import { Button } from "@/components/ui/button";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Text from "@/components/ui/text";
import { FieldArray, useFormikContext } from "formik";
import React from "react";

type Props = {};

const WebHookTypeTestRequest = (props: Props) => {
  const { values, setFieldValue, handleChange }: any = useFormikContext();
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        <Text size="lg" weight="semibold">
          Test Your Request{" "}
          <Text tag="span" size="xs" weight="light" color="secondary">
            {" "}
            {`(Optional)`}
          </Text>
        </Text>

        <Switch
          checked={values.isTestEnable}
          onCheckedChange={(value) => {
            setFieldValue("isTestEnable", value);
          }}
        />
      </div>
      <div className="py-2 space-y-3">
        <Text size="sm" color="secondary">
          {` Manually set values for test variables`}
        </Text>
        <Text size="sm" textColor="text-orange-500">
          {`(If your request contains variables, you can manually set their values for testing purposes.)`}
        </Text>
      </div>
      {values.isTestEnable ? (
        <FieldArray name="test_variable">
          {({ insert, remove, push }: any) => (
            <div className="space-y-3">
              {values?.test_variable.length > 0 &&
                values?.test_variable.map((request: any, index: number) => (
                  <div key={index} className="w-full flex items-center gap-3">
                    <Input
                      name={`test_variable.${index}.name`}
                      placeholder="name"
                      value={request.name}
                      onChange={handleChange}
                    />
                    <Input
                      name={`test_variable.${index}.value`}
                      placeholder="value"
                      value={request.value}
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
                Add Test variable
              </Button>
            </div>
          )}
        </FieldArray>
      ) : null}
    </div>
  );
};

export default WebHookTypeTestRequest;
