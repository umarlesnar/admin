"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useSmsTemplateMutation } from "@/framework/template/sms-template-mutation";
import { uiTemplateSmsSchema } from "@/validation-schema/ui/UiYupTemplateSchema";
import { Formik } from "formik";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

type Props = {
  data?: any;
};

const SmsTemplateForm = ({ data }: Props) => {
  const { mutateAsync } = useSmsTemplateMutation();
  const { template_id }: any = useParams();
  return (
    <Formik
      initialValues={{
        template_id: "",
        body: "",
        ...data,
      }}
      onSubmit={async (values, { setErrors }: any) => {
        const loadingToast = toast.loading("Loading...");
        try {
          await mutateAsync({
            template_id: template_id,
            paylaod: values,
          });
          toast.success(`Template updated Successfully`, {
            id: loadingToast,
          });
        } catch (error: any) {
          toast.error(`Failed to update template`, {
            id: loadingToast,
          });
          if (error.response) {
            if (error.response.status === 422) {
              setErrors(error.response.data.data);
            }
          }
        }
      }}
      validationSchema={uiTemplateSmsSchema}
    >
      {({ values, errors, handleChange, handleSubmit }) => {
        return (
          <div className="w-full space-y-2">
            <Input
              name="template_id"
              label="Sms Template Id"
              placeholder="Sms template id"
              onChange={handleChange}
              value={values?.template_id}
              errorKey={errors?.template_id}
            />
            <div className="space-y-2">
              <div className="space-y-1">
                <Text weight="semibold" tag="label">
                  Body{" "}
                </Text>
                <Text size="xs" color="secondary">
                  To add a custom variable, please add a variable in double
                  curly brackets without a space. Example:{" "}
                  <Text
                    tag="label"
                    size="xs"
                    textColor="text-green-500"
                  >{`{{ customer_name }}`}</Text>
                </Text>
              </div>
              <Textarea
                name="body"
                placeholder="Sms template body..."
                onChange={handleChange}
                value={values?.body}
                errorKey={errors?.body}
              />
            </div>
            <div className="w-full flex justify-end pt-4">
              <Button
                type="button"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default SmsTemplateForm;
