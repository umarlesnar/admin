"use client";
import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import TemplateViewHeader from "./TemplateViewHeader";
import TemplatePreview from "../../../_components/TemplatePreview";
import TemplateHeaderForm from "../../../_components/TemplateHeaderForm";
import TemplateBodyForm from "../../../_components/TemplateBodyForm";
import TemplateFooterForm from "../../../_components/TemplateFooterForm";
import TemplateButtonsForm from "../../../_components/TemplateButtonsForm";
import TemplateBasicDetails from "../../../_components/TemplateBasicDetails";
import { useTemplateByIdQuery } from "@/framework/template/get-template-by-id";
import _pick from "lodash/pick";
import { LoadingAnimation } from "@/components/ui/icons/LoadingAnimation";
import { useParams } from "next/navigation";
import TemplateCaurosalForm from "../../../_components/TemplateCaurosalForm";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import SmsTemplateForm from "../../../_components/SmsTemplateForm";

type Props = {};

const TemplateViewForm = (props: Props) => {
  const [formValue, setFormValue] = useState<any>({});
  const { template_id }: any = useParams();
  const { data, isLoading } = useTemplateByIdQuery(template_id);

  useEffect(() => {
    if (data) {
      setFormValue({
        ..._pick(data, ["_id", "name", "language", "category", "components"]),
        industry_id: data?.industry_id,
        use_case_id: data?.use_case_id,
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full h-full p-5 flex justify-center">
        <LoadingAnimation className="w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <>
      {!isLoading && (
        <Formik
          initialValues={{
            name: "",
            language: "en",
            category: "UTILITY",
            industry: "",
            use_case: "",
            components: [
              {
                type: "HEADER",
                format: "NONE",
                text: "",
              },
              {
                type: "BODY",
                text: "",
              },
              {
                type: "FOOTER",
                text: "",
              },
              {
                type: "BUTTONS",
                buttons: [],
              },
            ],
            ...formValue,
          }}
          onSubmit={(values) => {}}
          enableReinitialize
        >
          {({ values, errors, setFieldValue, handleSubmit }) => {
            return (
              <Form className="w-full h-full">
                <div className="w-full h-full flex-1 flex flex-col max-w-full self-center space-y-3 sm:space-y-3.5 md:space-y-4 lg:space-y-5">
                  <TemplateViewHeader />

                  <div className="flex flex-1 w-full h-full mr-auto overflow-auto bg-scroll gap-2">
                    <div className="w-full md:w-[70%] h-full flex flex-col">
                      <div className="w-full flex-1  rounded-md  space-y-6">
                        <TemplateBasicDetails />
                        <FieldArray name="components">
                          {({ insert, remove, push }: any) => (
                            <div className="space-y-6 my-4">
                              {values.components.length > 0 &&
                                values.components.map(
                                  (component: any, index: number) => {
                                    return (
                                      <>
                                        {component.type == "HEADER" ? (
                                          <TemplateHeaderForm
                                            index={index}
                                            header={component}
                                          />
                                        ) : null}
                                        {component.type == "BODY" ? (
                                          <TemplateBodyForm index={index} />
                                        ) : null}
                                        {component.type == "carousel" ? (
                                          <div className="border-b bg-white rounded-lg">
                                            <TemplateCaurosalForm
                                              index={index}
                                            />
                                          </div>
                                        ) : null}
                                        {component.type == "FOOTER" ? (
                                          <TemplateFooterForm index={index} />
                                        ) : null}
                                        {component.type == "BUTTONS" ? (
                                          <TemplateButtonsForm
                                            button={component}
                                            index={index}
                                          />
                                        ) : null}
                                      </>
                                    );
                                  }
                                )}
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </div>
                    <div className="w-[30%] h-full sticky top-0 hidden md:block">
                      <TemplatePreview />
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </>
  );
};

export default TemplateViewForm;
