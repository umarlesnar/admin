import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { useIndustries } from "@/framework/industries/get-industries";
import { useFormikContext } from "formik";
import React from "react";
import TemplateCatagoryTabs from "./TemplateCatagoryTabs";
import { useUsecaseApi } from "@/framework/usecase/get-usecase";
import { use } from "chai";

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
const CATEGORY = [
  { name: "MARKETING" },
  { name: "UTILITY" },
  { name: "AUTHENTICATION" },
];

const TemplateBasicDetails = (props: Props) => {
  const { values, errors, handleChange, setFieldValue }: any =
    useFormikContext();

  const { data: industriesData } = useIndustries({});

  const { data: useCasesData } = useUsecaseApi({
    industries_id: values.industry_id,
  });

  // Find the current industry name based on industry_id
  const currentIndustry = industriesData?.items?.find(
    (item: any) => item._id === values.industry_id
  );

  // Find the current usecase name based on use_case_id  
  const currentUsecase = useCasesData?.items?.find(
    (item: any) => item._id === values.use_case_id
  );

  return (
    <div className="w-full h-auto grid grid-cols-1 md:grid-cols-5 gap-4 p-1">
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
          {`Don't use any Special Characters in Template Name`}
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
            return o.value === values.language;
          })}
          onSelectData={(template: any) => {
            setFieldValue("language", template.value);
          }}
        />
      </div>

      <div className="w-full space-y-1">
        <Text size="sm" tag="label" weight="medium">
          Category
        </Text>
        <TemplateCatagoryTabs />
      </div>

      <div className="w-full space-y-1">
        <Text size="sm" tag="label" weight="medium">
          Industry
        </Text>
        <Combobox
          options={industriesData?.items?.filter(
            (item: any) => item.status === "ENABLE"
          )}
          buttonClassname="w-full"
          dropdownClassname={`p-2 text-sm`}
          placeholder={"Select Industry"}
          selectedOption={currentIndustry} // Show the industry name based on industry_id
          onSelectData={(industry: any) => {
            setFieldValue("industry_id", industry?._id); // Only store the ID
          }}
        />
      </div>

      <div className="w-full space-y-1">
        <Text size="sm" tag="label" weight="medium">
          Usecase
        </Text>
        <Combobox
          options={useCasesData?.items || []}
          buttonClassname="w-full"
          dropdownClassname={`p-2`}
          placeholder={"Select Usecase"}
          selectedOption={currentUsecase} // Show the usecase name based on use_case_id
          onSelectData={(use_case: any) => {
            setFieldValue("use_case_id", use_case._id); // Only store the ID
          }}
        />
      </div>
    </div>
  );
};

export default TemplateBasicDetails;
