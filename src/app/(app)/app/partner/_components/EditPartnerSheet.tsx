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
import { usePartnerMutation } from "@/framework/partner/partner-mutation";
import { UiYupPartnerSchema } from "@/validation-schema/ui/UiYupPartnerSchema";
import { useParams } from "next/navigation";

type Props = {
  children: ReactElement;
  data?: any;
};

const EditPartnerSheet = ({ children, data }: Props) => {
  const {partner_id,settings_key} = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = usePartnerMutation();

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
            Update Partner
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              name: "",
              domain: "",
              status: "ENABLE",
              ...data,
            }}
            validationSchema={UiYupPartnerSchema}
            onSubmit={async (values, { setErrors, resetForm }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                await mutateAsync({
                  partner_id: data?._id,
                  method: "PUT",
                  payload: values,
                });
                toast.success(`Partner Update Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Update Partner`, {
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
                  <div className="flex-1 gap-4 space-y-5 pb-8">
                    <div className="w-full space-y-1">
                      <Input
                        name="name"
                        label="Name"
                        isRequired
                        placeholder="Enter a name"
                        onChange={handleChange}
                        value={values.name}
                        errorKey={errors?.name}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Input
                        name="domain"
                        label="Domain"
                        isRequired
                        placeholder="Enter a domain"
                        onChange={handleChange}
                        value={values.domain}
                        errorKey={errors?.domain}
                      />
                    </div>

                    <Text size="sm" weight="semibold" color="primary">
                      Status
                    </Text>
                    <RadioGroup
                      className="flex"
                      value={values.status}
                      onValueChange={(value) => setFieldValue("status", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="ENABLE" value="ENABLE" />
                        <Text size="sm" color="secondary">
                          Enable
                        </Text>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="DISABLE" value="DISABLE" />
                        <Text size="sm" color="secondary">
                          Disable
                        </Text>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center gap-2 pb-1">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={!isValid || isSubmitting}
                    >
                      Update Partner
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

export default EditPartnerSheet;
