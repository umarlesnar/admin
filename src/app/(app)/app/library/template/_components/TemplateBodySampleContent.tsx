import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { FieldArray, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import _uniq from "lodash/uniq";
import _map from "lodash/map";

type Props = {};

const TemplateBodySampleContent = (props: Props) => {
  const { values, setFieldValue, handleChange, errors }: any =
    useFormikContext();
  const [bodyVariable, setBodyVariable] = useState<string[]>([]);

  const extractVariables = (input: string): string[] => {
    return input
      ? _uniq(
          _map(input.match(/{{(.*?)}}/g) || [], (match) => match.slice(2, -2))
        )
      : [];
  };
  // Extract body variables
  useEffect(() => {
    const component = values?.components[1];
    const variables = extractVariables(component?.text);
    setBodyVariable(variables);

    if (variables.length > 0) {
      const currentBodyText = component?.example?.body_text || [];
      const newBodyText = variables.map(
        (_, index) => currentBodyText[index] || ""
      );

      setFieldValue("components.1.example", {
        body_text: newBodyText,
      });
    } else {
      const { example, ...rest } = component;
      setFieldValue("components.1", rest);
    }
  }, [values?.components[1]?.text]);

  const renderSampleInputs = (
    fieldName: string,
    valuesArray: string[],
    variableNames: string[],
    errorArray: any
  ) => (
    <FieldArray name={fieldName}>
      {() => (
        <div className="space-y-4 my-3">
          {valuesArray?.map((val, index) => (
            <Input
              key={index}
              name={`${fieldName}.${index}`}
              onChange={handleChange}
              value={val}
              errorKey={
                Array.isArray(errorArray) ? errorArray[index] : undefined
              }
              placeholder={`Enter sample content for ${
                variableNames[index] || ""
              }`}
            />
          ))}
        </div>
      )}
    </FieldArray>
  );

  const shouldShowSample = bodyVariable.length > 0;

  return shouldShowSample ? (
    <div className="w-full">
      <Text size="base" weight="semibold" className="leading-6">
        Body Sample Content
      </Text>

      {/* Body Samples */}
      {values?.components[1]?.example?.body_text &&
        renderSampleInputs(
          "components.1.example.body_text",
          values?.components[1]?.example?.body_text,
          bodyVariable,
          errors?.components?.[1]?.example?.body_text
        )}
    </div>
  ) : null;
};

export default TemplateBodySampleContent;
