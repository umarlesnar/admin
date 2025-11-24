
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Text from "@/components/ui/text";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { UiYupPoliciesSchema } from "@/validation-schema/ui/UiYupPoliciesSchema";
import { Form, Formik } from "formik";
import React, { ReactElement, useState } from "react";
import { toast } from "sonner";
import LimitsLists from "./LimitsFormPage";
import { useIamPoliciesMutation } from "@/framework/partner/iam/policies/policy-mutation";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  children: ReactElement;
  data?: any;
};
const TYPE = [{ name: "MANAGED" }, { name: "CUSTOM" }];

const EditPoliciesSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = useIamPoliciesMutation();
  const preventFocus = (event: Event) => {
    event.preventDefault();
  };
  const sheetData = data;

  return (
    <Formik
      initialValues={{
        name: sheetData?.name || "",
        description: sheetData?.description || "",
        type: sheetData?.type || "",
        status: sheetData?.status || "ACTIVE",
        limits: Array.isArray(sheetData?.limits)
          ? sheetData.limits.map((item: any) => ({
              key: item.key || "",
              value: item.value || "",
            }))
          : Object.entries(sheetData?.limits || {}).map(([key, value]) => ({
              key,
              value,
            })),
      }}
      onSubmit={async (values, { setErrors }) => {
        const loadingToast = toast.loading("Loading...");

        const transformedLimits: Record<string, string> = {};
        values.limits.forEach((item: any) => {
          if (item.key) {
            transformedLimits[item.key] = item.value;
          }
        });
        try {
          const response = await mutateAsync({
            policy_id: sheetData?._id,
            method: "PUT",
            payload: {
              ...values,
              limits: transformedLimits,
            },
          });

          toast.success(`Policy Updated Successfully`, {
            id: loadingToast,
          });

          setOpen(false);
        } catch (error: any) {
          console.log("error", error);

          toast.error(`Failed to Update Policy`, {
            id: loadingToast,
          });

          if (error.response) {
            if (
              error.response.status === SERVER_STATUS_CODE.VALIDATION_ERROR_CODE
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
      }: any) => {
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
                  Update Policy
                </SheetTitle>
              </SheetHeader>

              <Form className="flex flex-1 flex-col justify-between overflow-y-scroll px-1">
                <div className="flex-1 flex-col gap-4 space-y-5">
                  <div className="w-full space-y-1">
                    <Input
                      name="name"
                      label="Name"
                      placeholder="Enter a Policy Name"
                      onChange={handleChange}
                      value={values.name}
                      errorKey={errors?.name}
                    />
                  </div>
                  <div className="w-full space-y-1">
                    <Text size="sm" tag="label" weight="medium">
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
                      <Text size="sm">Active</Text>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem id="DISABLED" value="DISABLED" />
                      <Text size="sm">Disabled</Text>
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
                    disabled={!isValid || isSubmitting}
                  >
                    Update Policy
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
            </SheetContent>
          </Sheet>
        );
      }}
    </Formik>
  );
};

export default EditPoliciesSheet;