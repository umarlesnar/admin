"use client";
import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import Text from "@/components/ui/text";
import _pick from "lodash/pick";
import TemplateEditHeader from "./TemplateEditHeader";
import TemplatePreview from "../../../_components/TemplatePreview";
import TemplateHeaderForm from "../../../_components/TemplateHeaderForm";
import TemplateBodyForm from "../../../_components/TemplateBodyForm";
import TemplateFooterForm from "../../../_components/TemplateFooterForm";
import TemplateButtonsForm from "../../../_components/TemplateButtonsForm";
import TemplateBasicDetails from "../../../_components/TemplateBasicDetails";
import { useTemplateByIdQuery } from "@/framework/template/get-template-by-id";
import { useTemplateMutation } from "@/framework/template/template-mutation";
import { LoadingAnimation } from "@/components/ui/icons/LoadingAnimation";
import { toast } from "sonner";
import _uniq from "lodash/uniq";
import _omit from "lodash/omit";
import { uiTemplateSchema } from "@/validation-schema/ui/UiYupTemplateSchema";
import TemplateCaurosalForm from "../../../_components/TemplateCaurosalForm";
import { utilityDemo } from "../../../_components/constants/templateCategoryExamples";

type TextComponent = {
  type: "BODY" | "HEADER" | "FOOTER";
  format?: "TEXT";
  text: string;
  example?: any;
  add_security_recommendation?: boolean;
};

type MediaComponent = {
  type: "HEADER";
  format: "NONE" | "IMAGE" | "VIDEO" | "DOCUMENT";
  example?: any;
  example1?: any;
};

type ButtonComponent = {
  type: "BUTTONS";
  buttons: any[];
};

type Component = TextComponent | MediaComponent | ButtonComponent;

interface Values {
  components: Component[];
  [key: string]: any;
}

type FbComponent = {
  type: string;
  text?: string;
  format?: string;
  example?: any;
  example1?: any;
  buttons?: any[];
  add_security_recommendation?: boolean;
};

type Variable = {
  custom_variable: string;
  type: string;
  variable_index: string;
};

type Props = {};

const TemplateEditForm = (props: Props) => {
  const router = useRouter();
  const [formValue, setFormValue] = useState<any>({});
  const { template_id }: any = useParams();
  const { data, isLoading } = useTemplateByIdQuery(template_id);
  const [error, setError] = useState("");
  const { mutateAsync, isPending } = useTemplateMutation();

  useEffect(() => {
    if (data) {
      setFormValue({
        ..._pick(data, [
          "_id",
          "name",
          "language", 
          "category",
          "components",
        ]),
        industry_id: data?.industry_id,
        use_case_id: data?.use_case_id,
      });
    }
  }, [data]);

  const onHandleSubmit = async (values: Values, { setErrors }: any) => {
    const text_match_expression = /{{\w*}}/g;
    const fb_components: FbComponent[] = [];
    const variables: Variable[] = [];

    const replaceAll = (str: string, find: string, replace: string): string =>
      str.split(find).join(replace);

    // Process text components and add variables
    const handleTextComponent = (component: TextComponent) => {
      if (component.type !== "FOOTER") {
        const matches = component.text.match(text_match_expression) || [];
        let processedText = component.text;

        matches.forEach((item, index) => {
          variables.push({
            custom_variable: item,
            type: component.type,
            variable_index: `{{${index + 1}}}`,
          });
          processedText = replaceAll(processedText, item, `{{${index + 1}}}`);
        });

        // Transform example structure
        const transformedExample = component.example?.body_text
          ? { body_text: component.example.body_text }
          : undefined;

        // Special handling for BODY component in AUTHENTICATION category
        if (component.type === "BODY" && values.category === "AUTHENTICATION") {
          fb_components.push({
            type: "BODY",
            add_security_recommendation: true,
            ...(transformedExample && { example: transformedExample }),
          });
        } else {
          console.log("body", component);

          fb_components.push({
            ...component,
            type: component.type,
            text: processedText,
            ...(component.type === "BODY" &&
              transformedExample && {
                example: transformedExample,
              }),
            ...(component.type === "HEADER" && { format: "TEXT" }),
          });
        }
      } else {
        let _component: any = {};

        if (values.category === "AUTHENTICATION") {
          _component = _omit(component, ["text"]);
        } else {
          _component = component;
        }

        fb_components.push(_component);
      }
    };

    // Process media components
    const handleMediaComponent = (component: MediaComponent) => {
      fb_components.push({
        format: component.format,
        type: "HEADER",
        example: component.example1,
      });
    };

    // Process buttons and replace variables in URL if url_type is DYNAMIC
    const handleButtonComponent = (component: ButtonComponent) => {
      const processedButtons = component.buttons.map((button) => {
        let processedButton = { ...button };

        // Only replace variables if url_type is "DYNAMIC"
        if (
          button.type == "URL" &&
          button.url &&
          button.url_type === "DYNAMIC"
        ) {
          const matches = button.url.match(text_match_expression) || [];

          matches.forEach((item: any, index: number) => {
            variables.push({
              custom_variable: item,
              type: "BUTTONS",
              variable_index: `{{${index + 1}}}`,
            });
            processedButton.url = replaceAll(
              processedButton.url,
              item,
              `{{${index + 1}}}`
            );
          });
        }

        return _omit(processedButton, ["url_type"]);
      });

      if (processedButtons.length > 0) {
        fb_components.push({
          type: "BUTTONS",
          buttons: processedButtons,
        });
      }
    };

    // ------------------------
    // CAROUSEL COMPONENT HANDLER
    // ------------------------
    const handleCarouselComponent = (component: any) => {
      const processHeader = (comp: any) => ({
        type: "header",
        format: comp.format,
        example: comp.example,
      });

      const processBody = (comp: any) => {
        const matches = _uniq(comp.text.match(text_match_expression) || []);
        let processedText = comp.text;
        //@ts-ignore
        matches.forEach((item: string, index: number) => {
          variables.push({
            custom_variable: item,
            type: "CAROUSEL",
            variable_index: `{{${index + 1}}}`,
          });
          processedText = replaceAll(processedText, item, `{{${index + 1}}}`);
        });

        const transformedExample = comp.example?.body_text
          ? { body_text: [comp.example.body_text] }
          : undefined;

        return {
          type: "body",
          text: processedText,
          ...(transformedExample && { example: transformedExample }),
        };
      };
      const processButtons = (comp: any) => {
        const processedButtons = comp.buttons.map((button: any) => {
          let processedButton = { ...button };

          if (
            button.type === "url" &&
            button.url &&
            button.url_type === "DYNAMIC"
          ) {
            const matches = button.url.match(text_match_expression) || [];
            matches.forEach((item: string, index: number) => {
              variables.push({
                custom_variable: item,
                type: "BUTTONS",
                variable_index: `{{${index + 1}}}`,
              });
              processedButton.url = replaceAll(
                processedButton.url,
                item,
                `{{${index + 1}}}`
              );
            });

            processedButton.example = ["123121122"];
          }

          return _omit(processedButton, ["url_type"]);
        });

        return processedButtons.length > 0
          ? { type: "buttons", buttons: processedButtons }
          : null;
      };

      const cards = component.cards?.map((card: any) => {
        const processedComponents = card.components
          ?.map((comp: any) => {
            if (comp.type === "header") return processHeader(comp);
            if (comp.type === "body") return processBody(comp);
            if (comp.type === "buttons") return processButtons(comp);
            return null;
          })
          .filter(Boolean);

        return { ...card, components: processedComponents };
      });

      fb_components.push({
        type: "carousel",
        //@ts-ignore
        cards: cards,
      });
    };
    // Main loop to process components
    values.components.forEach((component: any) => {
      if (component.type === "BUTTONS")
        handleButtonComponent(component as ButtonComponent);
      else if (component?.text) handleTextComponent(component as TextComponent);
      else if (["IMAGE", "VIDEO", "DOCUMENT"].includes(component.format))
        handleMediaComponent(component as MediaComponent);
    });
    const loadingToast = toast.loading("Loading...");
    const final_value = _pick(values, [
      "_id",
      "components",
      "name",
      "category",
      "language",
      "industry",
      "use_case",
    ]);

    const finalPayload = {
      ...final_value,
      wba_components: fb_components,
      wba_variables: variables,
    };

    try {
      await mutateAsync({
        template_id: finalPayload._id,
        method: "PUT",
        payload: finalPayload,
      });
      toast.success(`Template updated Successfully`, {
        id: loadingToast,
      });
      router.push("/app/library/template");
    } catch (error: any) {
      toast.error(`Failed to update template`, {
        id: loadingToast,
      });
      if (error.response) {
        const ErrorObj = error.response?.data?.data?.error;

        if (ErrorObj?.error_user_msg) {
          setError(error.response?.data?.data?.error?.error_user_msg);
        } else {
          setError(error.response?.data?.data?.error?.message);
        }

        if (error.response.status === 422) {
          setErrors(error.response.data.data);
        } else {
        }
      } else {
      }
    }
  };

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
             demo: utilityDemo[0],
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
          onSubmit={onHandleSubmit}
          validateOnBlur={false}
          validationSchema={uiTemplateSchema}
          enableReinitialize
        >
          {({ values, handleSubmit }) => {
            return (
              <Form className="w-full h-full">
                <div className="w-full h-full flex-1 flex flex-col max-w-full self-center space-y-3">
                  <TemplateEditHeader />

                  <div className="flex flex-1 w-full h-full mr-auto overflow-auto bg-scroll gap-2 pt-2">
                    <div className="w-full md:w-[70%] h-full flex flex-col ">
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
                                        <TemplateCaurosalForm index={index} />
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
                      <div className="w-full px-1 py-4">
                        <Text textColor="text-red-500" weight="medium">
                          {error}
                        </Text>
                      </div>
                      <div className="w-full h-auto pt-3 flex items-end justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            router.push("/app/library/template");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            handleSubmit();
                          }}
                          disabled={isPending}
                          loading={isPending}
                        >
                          Save
                        </Button>
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

export default TemplateEditForm;
