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
import { usePoliciesMutation } from "@/framework/iam/policies/policy-mutation";
import { Combobox } from "@/components/ui/combobox";
import { UiYupPoliciesSchema } from "@/validation-schema/ui/UiYupPoliciesSchema";
import LimitsLists from "./LimitsFormPage";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  children: ReactElement;
  data?: any;
};
const TYPE = [{ name: "MANAGED" }, { name: "CUSTOM" }];

const AddPoliciesSheet = ({ children }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = usePoliciesMutation();

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
            Add Policy
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              name: "",
              description: "",
              type: "",
              status: "ACTIVE",
              limits: [],
            }}
            onSubmit={async (values, { setErrors, resetForm }) => {
              const loadingToast = toast.loading("Loading...");

              const transformedLimits: Record<string, string> = {};
              values.limits.forEach((item: any) => {
                if (item.key) {
                  transformedLimits[item.key] = item.value;
                }
              });
              try {
                const response = await mutateAsync({
                  method: "POST",
                  payload: {
                    ...values,
                    limits: transformedLimits,
                  },
                });
                toast.success(`Policy Added Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Add Policy`, {
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
            validationSchema={UiYupPoliciesSchema}
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
                <Form className="w-full h-full flex flex-col px-1">
                  <div className="flex-1 gap-4 space-y-5 pb-8">
                    <div className="w-full space-y-1">
                      <Input
                        name="name"
                        label="Name"
                        placeholder="Enter a Policies"
                        onChange={handleChange}
                        value={values.name}
                        errorKey={errors?.name}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Text size="sm" weight="semibold" color="primary">
                        Description
                      </Text>
                      <Textarea
                        name="description"
                        placeholder="Enter a description"
                        onChange={handleChange}
                        value={values.description}
                        errorKey={errors?.description}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Type
                      </Text>
                      <Combobox
                        options={TYPE}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Select Type"}
                        selectedOption={TYPE.find((o) => {
                          return o.name === values.type;
                        })}
                        onSelectData={(type: any) => {
                          setFieldValue("type", type.name);
                        }}
                      />
                    </div>

                    <LimitsLists />

                    <Text size="sm" weight="semibold" color="primary">
                      Status
                    </Text>
                    <RadioGroup
                      className=" flex"
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
                      type="button"
                      className="w-full"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={isSubmitting}
                    >
                      Add Policy
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

export default AddPoliciesSheet;
