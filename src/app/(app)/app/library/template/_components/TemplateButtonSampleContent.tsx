import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { FieldArray, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import _uniq from "lodash/uniq";
import _map from "lodash/map";

type Props = {};

const TemplateButtonSampleContent = (props: Props) => {
  const { values, setFieldValue, handleChange, errors }: any =
    useFormikContext();
  const [buttonVariable, setButtonVariable] = useState<string[][]>([]);

  const extractVariables = (input: string): string[] => {
    return input
      ? _uniq(
          _map(input.match(/{{(.*?)}}/g) || [], (match) => match.slice(2, -2))
        )
      : [];
  };

  // Extract button variables
  useEffect(() => {
    const buttons = values?.components[3]?.buttons || [];
    const variablesArray = buttons.map((btn: any) =>
      btn.type === "URL" ? extractVariables(btn.url) : []
    );
    setButtonVariable(variablesArray);
  }, [values?.components[3]?.buttons]);

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

  const shouldShowSample = buttonVariable.some((v) => v.length > 0);

  return shouldShowSample ? (
    <div className="w-full space-y-2">
      <Text size="base" weight="semibold" className="leading-6">
        Button Sample Content
      </Text>

      {/* Button Samples */}
      {values?.components[3]?.buttons?.map((btn: any, btnIndex: number) => {
        const btnExample = btn?.example;
        if (
          btn.type === "URL" &&
          Array.isArray(btnExample) &&
          btnExample.length > 0
        ) {
          return renderSampleInputs(
            `components.3.buttons.${btnIndex}.example`,
            btnExample,
            buttonVariable[btnIndex] || [],
            null // Add error handling if needed
          );
        }
        return null;
      })}
    </div>
  ) : null;
};

export default TemplateButtonSampleContent;
