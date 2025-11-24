import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { useFormikContext } from "formik";
import React from "react";

type Props = {
  index?: number | any;
};

const TemplateFooterForm = ({ index }: Props) => {
  const { values, errors, setFieldValue }: any = useFormikContext();
  return (
    <div className="w-full space-y-1 p-1">
      <div className="flex items-center gap-1">
        <Text size="lg" weight="semibold" className="leading-6">
          Footer
        </Text>
        <Text
          size="sm"
          weight="semibold"
          color="secondary"
          className="leading-6 mt-1"
        >{`(Optional)`}</Text>
      </div>
      <Text size="sm" className="block">
        Add a short line of text to the bottom of your message template.
      </Text>

      <Input
        name={`components.${index}.text`}
        onChange={(e) => {
          setFieldValue(`components.${index}.text`, e.target.value);
        }}
        placeholder="Enter your footer message here..."
        className="my-2"
        value={values?.components[index]?.text}
        disabled={values.category == "AUTHENTICATION"}
        limit={60}
        errorKey={errors?.components?.length > 0 && errors?.components[2]?.text}
      />

      {values.category == "AUTHENTICATION" && (
        <div className="w-32">
          <Input
            name={`components.${index}.code_expiration_minutes`}
            label="Expires in"
            type="number"
            placeholder="Expires in"
            className="my-2"
            onBlur={(e) => {
              if (!e.target.value) {
                setFieldValue(`components.${index}.code_expiration_minutes`, 1);
                setFieldValue(
                  `components.${index}.text`,
                  `This code expires in ${1} minutes.`
                );
              }
            }}
            onChange={(e) => {
              setFieldValue(
                `components.${index}.code_expiration_minutes`,
                e.target.value
              );

              setFieldValue(
                `components.${index}.text`,
                `This code expires in ${e.target.value} minutes.`
              );
            }}
            value={values?.components[index]?.code_expiration_minutes}
          />
        </div>
      )}
    </div>
  );
};

export default TemplateFooterForm;
