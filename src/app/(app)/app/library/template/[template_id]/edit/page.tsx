import React from "react";
import TemplateEditForm from "./_components/TemplateEditForm";

type Props = {};

const TemplateEditPage = (props: Props) => {
  return (
    <section
      aria-labelledby="primary-heading"
      className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
    >
      <div className="flex-grow overflow-hidden h-screen bg-scroll">
        <div className="w-full h-full flex flex-col max-w-full self-center  py-3 sm:px-3.5 md:px-4 lg:px-5 @container min-h-full">
          <TemplateEditForm />
        </div>
      </div>
    </section>
  );
};

export default TemplateEditPage;
