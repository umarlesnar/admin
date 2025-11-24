import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { FieldArray, useFormikContext } from "formik";
import React from "react";

type Props = {};

const PlanFormLists = (props: Props) => {
  const { values, handleChange }: any = useFormikContext();

  return (
    <div className="w-full">
      <FieldArray name="feature">
        {({ push, remove }: any) => (
          <div className="space-y-2">
            <div className="w-full flex items-center justify-between pb-1">
              <Text size="sm" weight="semibold">
                Features
              </Text>
              <div
                className="w-6 h-6 bg-primary flex items-center justify-center rounded-md cursor-pointer mr-1"
                onClick={() => push("")}
              >
                <PlusIcon className="w-3 h-3 text-white" />
              </div>
            </div>

            {values?.feature?.length > 0 &&
              values.feature.map((item: string, index: number) => (
                <div
                  key={index}
                  className="w-full flex items-center justify-between gap-2"
                >
                  <div className="w-full">
                    <Input
                      name={`feature.${index}`}
                      placeholder="Enter feature"
                      value={item}
                      onChange={handleChange}
                      className="text-xs"
                    />
                  </div>
                  {index > 0 ? (
                     <div className="w-8 h-8 flex items-center justify-center">
                    <DeleteIcon
                      className="w-4 h-4 cursor-pointer text-red-500"
                      onClick={() => remove(index)}
                    />
                    </div>
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center cursor-not-allowed">
                    <DeleteIcon className="w-4 h-4 text-icon-secondary cursor-not-allowed" />
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default PlanFormLists;
