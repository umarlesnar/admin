import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import Text from "@/components/ui/text";
import Link from "next/link";
import React from "react";

type Props = {};

const TemplateCreationHeader = (props: Props) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <Link href={"/app/library/template"}>
          <ArrowIcon className="w-5 cursor-pointer text-icon-primary" />
        </Link>
        <Text size="lg" weight="semibold" color="primary">
          Create Template
        </Text>
      </div>
    </div>
  );
};

export default TemplateCreationHeader;
