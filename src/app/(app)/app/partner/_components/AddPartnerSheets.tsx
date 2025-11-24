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
import { ErrorMessage, Form, Formik } from "formik";
import React, { ReactElement, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { UiYupPartnerSchema } from "@/validation-schema/ui/UiYupPartnerSchema";
import { usePartnerMutation } from "@/framework/partner/partner-mutation";
import { CustomComponentInput } from "@/components/ui/CustomComponentInput";
import { Listbox } from "@/components/ui/listbox";

type Props = {
  children: ReactElement;
  data?: any;
};

const options = [
  { name: "+91", value: "91" },
  { name: "+971", value: "991" },
];

const AddPartnerSheet = ({ children, data }: Props) => {
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
            Add Partner
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              name: "",
              domain: "",
              first_name: "",
              last_name: "",
              email: {
                email_id: "",
              },
              phone: {
                dial_code: "91",
                mobile_number: "",
              },
              password: "",
            }}
            validationSchema={UiYupPartnerSchema}
            onSubmit={async (values, { setErrors }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                const response = await mutateAsync({
                  method: "POST",
                  payload: values,
                });
                toast.success(`Partner Added Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Add Partner`, {
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
                  <div className="flex-1 gap-4 space-y-5 ">
                    <div className="w-full space-y-1">
                      <Input
                        name="name"
                        label="Business Name"
                        isRequired
                        placeholder="Enter a business name"
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
                    <div className="flex items-start gap-2">
                      <div className="w-full space-y-1">
                        <Input
                          name="first_name"
                          label="First Name"
                          isRequired
                          placeholder="Enter a first name"
                          onChange={handleChange}
                          value={values.first_name}
                          errorKey={errors?.first_name}
                        />
                      </div>
                      <div className="w-full space-y-1">
                        <Input
                          name="last_name"
                          label="Last Name"
                          placeholder="Enter a last name"
                          onChange={handleChange}
                          value={values.last_name}
                          errorKey={errors?.last_name}
                        />
                      </div>
                    </div>
                    <div className="w-full space-y-1">
                      <Input
                        name="email.email_id"
                        label="Email"
                        isRequired
                        placeholder="Enter a email"
                        onChange={handleChange}
                        value={values?.email?.email_id}
                        errorKey={errors?.email?.email_id}
                      />
                    </div>
                    <div className="space-y-2">
                      <CustomComponentInput
                        name={`phone.mobile_number`}
                        placeholder="999xxxxxxxxx"
                        onChange={handleChange}
                        value={values?.phone?.mobile_number}
                        className="p-0"
                        leftComponent={
                          <Listbox
                            options={options}
                            selectedOption={options.find(
                              (o) => o.value === values?.phone?.dial_code
                            )}
                            buttonClassname={
                              "h-7 w-24 outline-none border-none mx-1"
                            }
                            dropdownClassname={"w-full h-auto"}
                            onSelectData={(data: any) =>
                              setFieldValue(`phone.dial_code`, data.value)
                            }
                          />
                        }
                      />
                      <ErrorMessage
                        name={`phone.mobile_number`}
                        component={"p"}
                        className="text-xs text-red-500"
                      />
                    </div>

                    <div className="w-full space-y-1">
                      <Input
                        name="password"
                        label="Password"
                        isRequired
                        placeholder="Enter a password"
                        onChange={handleChange}
                        value={values?.password}
                        errorKey={errors?.password}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pb-1">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={isSubmitting}
                    >
                      Add Partner
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

export default AddPartnerSheet;
