import { Button } from "@/components/ui/button";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Text from "@/components/ui/text";
import { FieldArray, useFormikContext } from "formik";
import React from "react";

type Props = {};

const WebHookTypeStatusCode = (props: Props) => {
  const { values, setFieldValue, handleChange }: any = useFormikContext();
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        <Text size="lg" weight="semibold">
          Response Routing
        </Text>

        <Switch
          checked={values.isStatusEnable}
          onCheckedChange={(value) => {
            setFieldValue("isStatusEnable", value);
          }}
        />
      </div>
      <div className="py-2 space-y-3">
        <Text size="sm" textColor="text-orange-500">
          {`Split your flow based on response status codes (200, 400,500, etc).`}
        </Text>

        <Text size="lg" weight="semibold">
          Expected Statuses
        </Text>
      </div>
      {values.isStatusEnable ? (
        <FieldArray name="expected_status_code">
          {({ insert, remove, push }: any) => (
            <div className="space-y-3">
              {values?.expected_status_code.length > 0 &&
                values?.expected_status_code.map(
                  (status: any, index: number) => (
                    <div key={index} className="w-full flex items-center gap-3">
                      <Input
                        name={`expected_status_code.${index}.status_code`}
                        type="number"
                        placeholder="200"
                        value={status.status_code}
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
                  push({
                    id: Math.random().toString(20).slice(2),
                    status_code: "",
                    node_result_id: "",
                    is_default: false,
                  });
                  e.preventDefault();
                }}
              >
                Add Expected Status
              </Button>
            </div>
          )}
        </FieldArray>
      ) : null}
    </div>
  );
};

export default WebHookTypeStatusCode;
