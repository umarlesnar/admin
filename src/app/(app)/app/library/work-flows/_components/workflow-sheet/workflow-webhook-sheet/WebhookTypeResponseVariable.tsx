import { Button } from "@/components/ui/button";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Text from "@/components/ui/text";
import { FieldArray, useFormikContext } from "formik";
import React from "react";

type Props = {};

const WebHookTypeResponseVariable = (props: Props) => {
  const { values, setFieldValue, handleChange }: any = useFormikContext();
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        <Text size="lg" weight="semibold">
          Save Responses as Variables{" "}
          <Text tag="span" size="xs" weight="light" color="secondary">
            {" "}
            {`(Optional)`}
          </Text>
        </Text>

        <Switch
          checked={values.isResponseEnable}
          onCheckedChange={(value) => {
            setFieldValue("isResponseEnable", value);
          }}
        />
      </div>
      <div className="py-2 space-y-3">
        <Text size="sm" textColor="text-orange-500">
          {`Select from the dropdown below to save a specific part of the response as a variable (you must test the request first).`}
        </Text>
        <Text size="sm" textColor="text-orange-500">
          {`Useful for displaying dynamic data from external sources as buttons or messages.`}
        </Text>

        <Text size="lg" weight="semibold">
          Edit Response Variables
        </Text>
      </div>
      {values.isResponseEnable ? (
        <FieldArray name="response_variable">
          {({ insert, remove, push }: any) => (
            <div className="space-y-3">
              {values?.response_variable.length > 0 &&
                values?.response_variable.map(
                  (response: any, index: number) => (
                    <div key={index} className="w-full flex items-center gap-3">
                      <Input
                        name={`response_variable.${index}.name`}
                        placeholder="name"
                        value={response.name}
                        onChange={handleChange}
                      />
                      <Input
                        name={`response_variable.${index}.path`}
                        placeholder="value"
                        value={response.path}
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
                  )
                )}

              <Button
                size="sm"
                onClick={(e: any) => {
                  push({ name: "", path: "" });
                  e.preventDefault();
                }}
              >
                Add Response Variable
              </Button>
            </div>
          )}
        </FieldArray>
      ) : null}
    </div>
  );
};

export default WebHookTypeResponseVariable;
