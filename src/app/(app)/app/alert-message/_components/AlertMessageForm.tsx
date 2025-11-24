import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { FieldArray, useFormikContext } from "formik";
import React from "react";

type Props = {};

const AlertFormLists = (props: Props) => {
  const { values, handleChange }: any = useFormikContext();

  return (
    <div className="w-full">
      <FieldArray name="feature">
        {({ push, remove }: any) => (
          <div className="space-y-2">
            <div className="w-full flex items-center justify-between pb-1">
              <Text size="sm" weight="semibold">
                Button
              </Text>
              <div
                className="w-6 h-6 bg-primary flex items-center justify-center rounded-md cursor-pointer mr-1"
                onClick={() => push("")}
              >
                <PlusIcon className="w-3 h-3 text-white" />
              </div>
            </div>

            {values.buttons.map(
              (
                button: {
                  title: string | number | readonly string[] | undefined;
                  web_link: string | number | readonly string[] | undefined;
                  ios_link: string | number | readonly string[] | undefined;
                  android_link: string | number | readonly string[] | undefined;
                  text_color: string | number | readonly string[] | undefined;
                  background_color:
                    | string
                    | number
                    | readonly string[]
                    | undefined;
                },
                index: number
              ) => (
                <div key={index} className="border p-3 rounded-md space-y-2">
                  <Input
                    name={`buttons[${index}].title`}
                    label="Button Title"
                    placeholder="Enter a button title"
                    onChange={handleChange}
                    value={button.title}
                  />
                  <Input
                    name={`buttons[${index}].web_link`}
                    label="Web Link"
                    placeholder="Enter a web link"
                    onChange={handleChange}
                    value={button.web_link}
                  />
                  <Input
                    name={`buttons[${index}].ios_link`}
                    label="IOS Link"
                    placeholder="Enter an iOS link"
                    onChange={handleChange}
                    value={button.ios_link}
                  />
                  <Input
                    name={`buttons[${index}].android_link`}
                    label="Android Link"
                    placeholder="Enter an Android link"
                    onChange={handleChange}
                    value={button.android_link}
                  />
                  <Input
                    name={`buttons[${index}].text_color`}
                    label="Text Color"
                    placeholder="Enter a text color"
                    onChange={handleChange}
                    value={button.text_color}
                  />
                  <Input
                    name={`buttons[${index}].background_color`}
                    label="Background Color"
                    placeholder="Enter a background color"
                    onChange={handleChange}
                    value={button.background_color}
                  />
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
              )
            )}
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default AlertFormLists;
