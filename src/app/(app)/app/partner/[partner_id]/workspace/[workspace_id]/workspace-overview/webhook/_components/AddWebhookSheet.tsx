import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Text from "@/components/ui/text";
import { Form, Formik } from "formik";
import React, { ReactElement, useRef, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import WebhookTokenFilter from "./WebhookTokenFilter";
import { UiYupWebhooksSchema } from "@/validation-schema/ui/UiYupWebhookSchema";
import { useWebhooksMutation } from "@/framework/partner/workspace/webhook/webhook-mutation";

type Props = {
  children: ReactElement;
  data?: any;
  onSuccess?: () => void;
};

const AddWebhookSheet = ({ children, data, onSuccess }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync } = useWebhooksMutation();

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="w-[400px] sm:w-[500px] h-screen flex flex-col p-5"
        onOpenAutoFocus={preventFocus}
      >
        <SheetHeader className="flex flex-row items-center gap-4">
          <SheetClose asChild>
            <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
          </SheetClose>
          <SheetTitle className="h-full text-text-primary text-xl font-semibold">
            Add Webhook
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              name: "",
              events: [],
              url: "",
              status: "ENABLE",
            }}
            validationSchema={UiYupWebhooksSchema}
            onSubmit={async (values, { setErrors }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                const response = await mutateAsync({
                  method: "POST",
                  payload: {
                    name: values.name,
                    events: values.events,
                    url: values.url,
                    status: values.status,
                  },
                });
                toast.success(`Webhook Added Successfully`, {
                  id: loadingToast,
                });
                onSuccess?.();
                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Add Webhook`, {
                  id: loadingToast,
                });

                if (error.response) {
                  if (
                    error.response.status ===
                    SERVER_STATUS_CODE.VALIDATION_ERROR_CODE
                  ) {
                    setErrors(error.response.data.data);
                  } else {
                  }
                } else {
                }
              }
            }}
            enableReinitialize
          >
            {({
              values,
              errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              resetForm,
              isValid,
            }) => {
              return (
                <Form className="w-full h-full  flex flex-col px-1">
                  <div className="flex-1 gap-4 space-y-4">
                    <Input
                      name="name"
                      label="Name"
                      isRequired
                      placeholder="Enter a name"
                      onChange={handleChange}
                      value={values.name}
                      errorKey={errors?.name}
                    />
                    <div className="w-[50%] space-y-1 flex flex-col">
                      <Text
                        size="sm"
                        tag="label"
                        weight="semibold"
                        color="primary"
                      >
                        Token
                      </Text>
                      <WebhookTokenFilter
                        selectedTokens={values.events}
                        onTokenSelect={(val) => setFieldValue("events", val)}
                      />
                    </div>

                    <div className="w-full space-y-1">
                      <Input
                        name="url"
                        label="Webhook Url"
                        isRequired
                        placeholder="Enter a url"
                        onChange={handleChange}
                        value={values.url}
                        errorKey={errors?.url}
                      />
                    </div>

                    <Text size="sm" weight="semibold" color="primary">
                      Status
                    </Text>
                    <RadioGroup
                      className=" flex"
                      value={values.status}
                      onValueChange={(value) => setFieldValue("status", value)}
                    >
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <RadioGroupItem id="ENABLE" value="ENABLE" />
                        <Text size="sm" color="secondary">
                          Enable
                        </Text>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <RadioGroupItem id="DISABLE" value="DISABLE" />
                        <Text size="sm" color="secondary">
                          Disable
                        </Text>
                      </label>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center gap-2 pb-1 pt-4">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={isSubmitting}
                    >
                      Add Webhook
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setOpen(false);
                        resetForm({});
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddWebhookSheet;
