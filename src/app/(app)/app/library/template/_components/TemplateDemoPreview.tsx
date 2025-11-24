import Text from "@/components/ui/text";
import { useFormikContext } from "formik";
import React from "react";

type Props = {};

const TemplateDemoPreview = (props: Props) => {
  const { values }: any = useFormikContext();

  return (
    <div className="w-full h-full bg-white rounded-md p-4">
      <div className="w-full h-full rounded-md border border-border-teritary flex flex-col">
        <div className="w-full h-12 bg-neutral-10 flex items-center p-2">
          <Text size="lg" weight="semibold">
            Template Preview
          </Text>
        </div>
        <div className="w-full flex-1 relative">
          <img
            src={values?.demo?.image_url}
            alt={"demo image"}
            className="absolute object-fill"
          />
        </div>
        <div className="w-full  bg-neutral-10 px-3  py-7 space-y-4">
          <div className="space-y-1">
            <Text>This template is good for</Text>
            <Text size="xs" weight="light" color="secondary">
              {values?.demo?.good_for}
            </Text>
          </div>
          <div className="space-y-1">
            <Text>Template areas you can customize</Text>
            <Text size="xs" weight="light" color="secondary">
              {values?.demo?.customizable_areas}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDemoPreview;
