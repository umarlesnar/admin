"use client";
import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import TemplateViewHeader from "./TemplateViewHeader";
import _pick from "lodash/pick";
import { LoadingAnimation } from "@/components/ui/icons/LoadingAnimation";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateBasicDetails from "../../../_components/TemplateBasicDetails";
import TemplateHeaderForm from "../../../_components/TemplateHeaderForm";
import TemplateBodyForm from "../../../_components/TemplateBodyForm";
import TemplateFooterForm from "../../../_components/TemplateFooterForm";
import TemplateButtonsForm from "../../../_components/TemplateButtonsForm";
import SmsTemplateForm from "../../../_components/SmsTemplateForm";
import TemplatePreview from "../../../_components/TemplatePreview";
import { useBusinessTemplateByIdQuery } from "@/framework/business/template/get-business-template-by-id";

type Props = {};

const TemplateViewForm = (props: Props) => {
  const [formValue, setFormValue] = useState<any>({});
  const { template_id }: any = useParams();
  const { data, isLoading } = useBusinessTemplateByIdQuery(template_id);

  console.log("template_id", template_id);
  console.log("my data", data);

  useEffect(() => {
    setFormValue(
      _pick(data, ["_id", "components", "name", "category", "language", "sms"])
    );
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
            step: 1,
            name: "",
            language: "en",
            category: "UTILITY",
            components: [
              {
                type: "HEADER",
                format: "TEXT",
                text: "",
              },
              {
                type: "BODY",
                format: "TEXT",
                text: "",
                // //example: { body_text: [] },
                add_security_recommendation: true,
              },
              {
                type: "FOOTER",
                format: "TEXT",
                text: "",
                code_expiration_minutes: 10,
              },
              {
                type: "BUTTONS",
                text: "",
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
                      <Tabs
                        defaultValue="whatsapp"
                        className="w-full bg-white border border-border-teritary pt-2 p-4"
                      >
                        <TabsList className="w-fit bg-neutral-20 p-2 ">
                          <TabsTrigger
                            value="whatsapp"
                            className="rounded-full text-sm data-[state=active]:text-primary text-text-primary"
                          >
                            Whatsapp
                          </TabsTrigger>
                          <TabsTrigger
                            value="sms"
                            className="rounded-full px-5 data-[state=active]:text-primary text-text-primary"
                          >
                            Sms
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="whatsapp" className="w-full">
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
                                            {component.type == "FOOTER" ? (
                                              <TemplateFooterForm
                                                index={index}
                                              />
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
                        </TabsContent>
                        <TabsContent value="sms">
                          <SmsTemplateForm data={formValue?.sms} />
                        </TabsContent>
                      </Tabs>
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
