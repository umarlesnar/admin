import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { FieldArray, useFormikContext } from "formik";
import React, { useEffect, useMemo, useState } from "react";

type Props = {};

const TemplateSampleContent = (props: Props) => {
  const { values, setFieldValue, handleChange, errors }: any =
    useFormikContext();
  const [headerVariable, setHeaderVariable] = useState<any[]>([]);
  const [variable, setVariable] = useState<any[]>([]);
  const [buttonVariable, setButtonVariable] = useState<any[]>([]);

  const extractVariables = (input: string) => {
    if (input) {
      const matches = input.match(/{{(.*?)}}/g) || []; // Match all variables in {{ }}
      return matches.map((match) => match.replace(/{{|}}/g, "")); // Remove {{ and }} for each variable name
    } else {
      return [];
    }
  };

  useMemo(() => {
    if (values?.components[0]?.format == "TEXT") {
      const value = values?.components[0]?.text;
      const variables = extractVariables(value);

      if (variables.length > 0) {
        setHeaderVariable(variables);
        setFieldValue(`components.${0}.example`, {
          header_text: Array(variables.length).fill(""),
        });
      } else {
        setHeaderVariable([]);
        const header = values?.components[0];
        delete header.example;
        setFieldValue(`components.${0}`, {
          ...header,
        });
      }
    }
  }, [values?.components[0]?.text]);

  useMemo(() => {
    const value = values?.components[1]?.text;
    const variables = extractVariables(value);
    if (variables.length > 0) {
      setVariable(variables);
      setFieldValue(`components.${1}.example`, {
        body_text: Array(variables.length).fill(""),
      });
    } else {
      setVariable([]);
      const body = values?.components[1];
      delete body.example;
      setFieldValue(`components.${1}`, {
        ...body,
      });
    }
  }, [values?.components[1]?.text]);

  useEffect(() => {
    const buttons = values?.components[3]?.buttons || [];
    const variablesArray = [];

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      if (button.type === "URL") {
        const variables = extractVariables(button.url);
        if (variables.length > 0) {
          variablesArray.push(variables); // Add extracted variables as an array for each URL
        }
      } else {
        variablesArray.push([]); // Empty array if type is not URL
      }
    }

    setButtonVariable(variablesArray); // Update state with array of arrays
  }, [values?.components[3]?.buttons]);

  return (
    <div>
      {headerVariable?.length > 0 ||
      variable?.length > 0 ||
      buttonVariable?.length > 0 ? (
        <Text size="lg" weight="semibold" className="leading-6">
          Sample Content
        </Text>
      ) : null}

      <FieldArray name={`components.${0}.example`}>
        {({ insert, remove, push }: any) => (
          <div className="space-y-6 my-4">
            {values?.components[0]?.example?.header_text?.length > 0 &&
              values?.components[0]?.example?.header_text?.map(
                (sample: any, index: number) => {
                  return (
                    <>
                      <Input
                        key={index}
                        name={`components.${0}.example.header_text.${index}`}
                        onChange={handleChange}
                        value={sample}
                        // errorKey={
                        //   errors?.components[0]?.example?.header_text[index]
                        // }
                        placeholder={`Enter sample content for ${headerVariable[index]}`}
                      />
                    </>
                  );
                }
              )}
          </div>
        )}
      </FieldArray>
      <FieldArray name={`components.${1}.example`}>
        {({ insert, remove, push }: any) => (
          <div className="space-y-6 my-4">
            {values?.components[1]?.example?.body_text?.length > 0 &&
              values?.components[1]?.example?.body_text?.map(
                (sample: any, index: number) => {
                  return (
                    <>
                      <Input
                        key={index}
                        name={`components.${1}.example.body_text.${index}`}
                        onChange={handleChange}
                        value={sample}
                        // errorKey={errors?.components[1]?.example?.body_text[index]}
                        placeholder={`Enter sample content for ${variable[index]}`}
                      />
                    </>
                  );
                }
              )}
          </div>
        )}
      </FieldArray>

      {values?.components[3]?.buttons?.map((button: any, index: number) => {
        return (
          <>
            {button?.example?.length > 0 ? (
              <FieldArray name={`components.${3}.buttons.${index}.example`}>
                {({ insert, remove, push }: any) => (
                  <div className="space-y-6 my-4">
                    {values?.components[3]?.buttons[index]?.example?.length >
                      0 &&
                      values?.components[3]?.buttons[index].type == "URL" &&
                      values?.components[3]?.buttons[index]?.example?.map(
                        (sample: any, idx: number) => {
                          return (
                            <>
                              <Input
                                key={index}
                                name={`components.${3}.buttons.${index}.example.${idx}`}
                                onChange={handleChange}
                                value={sample}
                                // errorKey={errors?.components[1]?.example?.body_text[index]}
                                placeholder={`Enter sample content for ${
                                  buttonVariable[index]?.length > 0
                                    ? buttonVariable[index][idx]
                                    : ""
                                }`}
                              />
                            </>
                          );
                        }
                      )}
                  </div>
                )}
              </FieldArray>
            ) : null}
          </>
        );
      })}
    </div>
  );
};

export default TemplateSampleContent;
