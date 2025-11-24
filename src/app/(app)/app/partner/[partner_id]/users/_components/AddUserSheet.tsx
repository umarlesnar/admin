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
import React, { ReactElement, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { UiYupUserSchema } from "@/validation-schema/ui/UiYupUserSchema";
import { CustomComponentInput } from "@/components/ui/CustomComponentInput";
import { Listbox } from "@/components/ui/listbox";
import { PasswordInput } from "@/components/ui/passwordInput";
import { usePartnerUserMutation } from "@/framework/partner/users/partner-user-mutation";

type Props = {
  children: ReactElement;
  data?: any;
};

const AddUserSheet = ({ children }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = usePartnerUserMutation();

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  const options = [
    { name: "+91", value: "91" },
    { name: "+971", value: "971" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
            Add User
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              profile: {
                first_name: "",
                last_name: "",
              },
              email: {
                email_id: "",
              },
              phone: {
                dial_code: "91",
                mobile_number: "",
              },
              auth_credentials: {
                password: "",
              },
              status: "ACTIVE",
            }}
            validationSchema={UiYupUserSchema}
            enableReinitialize
            onSubmit={async (values, { setErrors }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                // Transform payload
                const payload = {
                  ...values,
                  email: [
                    {
                      email_id: values.email.email_id,
                    },
                  ],
                  phone: [
                    {
                      dial_code: values.phone.dial_code,
                      mobile_number: values.phone.mobile_number,
                    },
                  ],
                };

                const response = await mutateAsync({
                  method: "POST",
                  payload,
                });

                toast.success(`User Added Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);
                toast.error(`Failed to Add User`, {
                  id: loadingToast,
                });

                if (
                  error.response?.status ===
                  SERVER_STATUS_CODE.VALIDATION_ERROR_CODE
                ) {
                  setErrors(error.response.data.data);
                }
              }
            }}
          >
            {({
              values,
              errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              resetForm,
            }) => (
              <Form className="w-full h-full flex flex-col px-1">
                <div className="flex-1 gap-4 space-y-5 pb-8">
                  <Input
                    name="profile.first_name"
                    label="First Name"
                    placeholder="Enter a first name"
                    onChange={handleChange}
                    value={values.profile.first_name}
                    errorKey={errors?.profile?.first_name}
                  />
                  <Input
                    name="profile.last_name"
                    label="Last Name"
                    placeholder="Enter a last name"
                    onChange={handleChange}
                    value={values.profile.last_name}
                    errorKey={errors?.profile?.last_name}
                  />
                  <Input
                    name="email.email_id"
                    label="Email"
                    placeholder="Enter an email"
                    onChange={handleChange}
                    value={values.email.email_id}
                    errorKey={errors?.email?.email_id}
                  />
                  <div className="w-full space-y-1">
                    <Text size="sm" weight="medium" color="primary">
                      Phone Number
                    </Text>
                    <CustomComponentInput
                      name="phone.mobile_number"
                      placeholder="999xxxxxxxxx"
                      onChange={handleChange}
                      value={values.phone.mobile_number}
                      className="p-0"
                      leftComponent={
                        <Listbox
                          options={options}
                          selectedOption={options.find(
                            (o) => o.value === values.phone.dial_code
                          )}
                          buttonClassname="h-7 w-24 outline-none border-none mx-1"
                          dropdownClassname="w-full h-auto"
                          onSelectData={(data: any) =>
                            setFieldValue("phone.dial_code", data.value)
                          }
                        />
                      }
                    />
                  </div>
                  <PasswordInput
                    name="auth_credentials.password"
                    label="Password"
                    placeholder="Enter a password"
                    onChange={handleChange}
                    value={values.auth_credentials.password}
                    errorKey={errors?.auth_credentials?.password}
                  />

                  <Text size="sm" weight="semibold" color="primary">
                    Status
                  </Text>
                  <RadioGroup
                    className="flex"
                    value={values.status}
                    onValueChange={(value) => setFieldValue("status", value)}
                  >
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem id="ACTIVE" value="ACTIVE" />
                      <Text size="sm" color="secondary">
                        Active
                      </Text>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem id="DISABLED" value="DISABLED" />
                      <Text size="sm" color="secondary">
                        Disabled
                      </Text>
                    </label>
                  </RadioGroup>
                </div>

                <div className="flex items-center gap-2 pb-1">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Add User
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddUserSheet;
