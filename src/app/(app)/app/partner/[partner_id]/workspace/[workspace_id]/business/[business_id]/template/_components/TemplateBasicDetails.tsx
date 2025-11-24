import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { useFormikContext } from "formik";
import React from "react";

type Props = {};

const TEMPLATE_LANGUAGES = [
  { value: "bn", name: "BENGALI" },
  { value: "en_US", name: "ENGLISH US" },
  { value: "en", name: "ENGLISH" },
  { value: "gu", name: "GUJARATI" },
  { value: "hi", name: "HINDI" },
  { value: "kn", name: "KANNADA" },
  { value: "ml", name: "MALAYALAM" },
  { value: "mr", name: "MARATHI" },
  { value: "pa", name: "PUNJABI" },
  { value: "ta", name: "TAMIL" },
  { value: "te", name: "TELUGU" },
];

const TemplateBasicDetails = (props: Props) => {
  const { values, errors, handleChange, setFieldValue }: any =
    useFormikContext();
  return (
    <div className="w-full h-auto grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="w-full space-y-2">
        <Input
          name="name"
          label="Template Name"
          placeholder="Enter a template name"
          onChange={(e: any) => {
            setFieldValue(
              "name",
              e.target.value.replace(/ /g, "_").toLowerCase()
            );
          }}
          value={values.name}
          errorKey={errors?.name}
        />

        <Text size="xs" weight="light" color="secondary">
          {`  Don't use any Special Characters in Template Name`}
        </Text>
      </div>
      <div className="w-full space-y-1">
        <Text size="sm" tag="label" weight="medium">
          Languages
        </Text>
        <Combobox
          options={TEMPLATE_LANGUAGES}
          buttonClassname="w-full"
          dropdownClassname={`p-2`}
          placeholder={"Select Language"}
          selectedOption={TEMPLATE_LANGUAGES.find((o) => {
            return o.value == values.language;
          })}
          onSelectData={(template: any) => {
            setFieldValue("language", template.value);
          }}
        />
      </div>
    </div>
  );
};

export default TemplateBasicDetails;
