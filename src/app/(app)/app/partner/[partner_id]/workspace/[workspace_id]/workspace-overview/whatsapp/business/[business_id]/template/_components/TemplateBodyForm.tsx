import Text from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useFormikContext } from "formik";
import React from "react";

type Props = { index?: number | any };

const TemplateBodyForm = ({ index }: Props) => {
  const { values, errors, setFieldValue }: any = useFormikContext();

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Text size="lg" weight="semibold" className="leading-6">
          Body Message
        </Text>
        <Text size="sm" className="block">
          The Whatsapp message in the language you have selected
        </Text>
      </div>

      <Textarea
        placeholder="Enter your body message here..."
        className="h-[200px]"
        onChange={(e: any) => {
          setFieldValue(`components.${index}.text`, e.target.value);
        }}
        value={values?.components[1]?.text}
        errorKey={errors?.components?.length > 0 && errors?.components[1]?.text}
      />
    </div>
  );
};

export default TemplateBodyForm;
