import React from "react";
import TemplateCreationForm from "./_components/TemplateCreationForm";
import { Metadata } from "next";

type Props = {};
export const metadata: Metadata = {
  title: "Template",
};
const TemplateCreatePage = (props: Props) => {
  return (
    <section
      aria-labelledby="primary-heading"
      className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
    >
      <div className="flex-grow overflow-hidden h-screen bg-scroll">
        <div className="w-full h-full flex flex-col max-w-full self-center py-3  sm:px-3.5 md:px-4 lg:px-5 @container min-h-full">
          <TemplateCreationForm />
        </div>
      </div>
    </section>
  );
};

export default TemplateCreatePage;
