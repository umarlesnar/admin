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
import { useIndustries } from "@/framework/industries/get-industries";
import { useUsecaseMutation } from "@/framework/usecase/usecase-mutation";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import {
  UiYupIndustriesSchema,
  UiYupUsecaseSchema,
} from "@/validation-schema/ui/UiYupIndustriesSchema";
import { Form, Formik } from "formik";
import React, { ReactElement, useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  children: ReactElement;
  data?: any;
};
const NAME = [
  { name: "ECOMMERCE" },
  { name: "HEALTH CARE" },
  { name: "EDUCATION" },
  { name: "FOOD PRODUCTS" },
  { name: "B2B" },
  { name: "TRAVEL & HOSPITALITY" },
  { name: "ADVERTISING" },
];

const EditUsecaseSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [tag, setTag] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const { mutateAsync } = useUsecaseMutation();
  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  const sheetData = data;

  const industryData = useIndustries({});

  return (
    <Formik
      initialValues={{
        industry_id: "",
        name: "",
        status: "ENABLE",
        ...sheetData,
      }}
      onSubmit={async (values, { setErrors }) => {
        const loadingToast = toast.loading("Loading...");
        try {
          const response = await mutateAsync({
            usecase_id: sheetData?._id,
            method: "PUT",
            payload: values,
          });

          toast.success(`Usecase Updated Successfully`, {
            id: loadingToast,
          });

          setOpen(false);
        } catch (error: any) {
          console.log("error", error);

          toast.error(`Failed to Update Usecase`, {
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
      validationSchema={UiYupUsecaseSchema}
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
                  Update Usecase
                </SheetTitle>
              </SheetHeader>

              <Form className="  flex flex-1 flex-col justify-between ">
                <div className="flex-1 flex-col gap-4 space-y-5 ">
                  <div className="w-full space-y-1">
                    <Text size="sm" tag="label" weight="medium">
                      Industry
                    </Text>
                    <Combobox
                      options={
                        industryData?.data?.items?.filter(
                          (item: any) => item.status === "ENABLE"
                        ) || []
                      }
                      buttonClassname="w-full"
                      dropdownClassname={`p-2 text-sm`}
                      placeholder={"Select Industry"}
                      selectedOption={industryData.data?.items?.find(
                        (o: any) => {
                          return o?._id === values?.industry_id;
                        }
                      )}
                      onSelectData={(industry: any) => {
                        setFieldValue("industry_id", industry?._id);
                      }}
                    />
                  </div>
                  <div className="w-full space-y-1">
                    <Input
                      name="name"
                      label="Usecase"
                      placeholder="Enter a Usecase"
                      onChange={handleChange}
                      value={values.name}
                      errorKey={errors?.name}
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
                      <Text size="sm">Enable</Text>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem id="DISABLE" value="DISABLE" />
                      <Text size="sm">Disable</Text>
                    </label>
                  </RadioGroup>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={!isValid || isSubmitting}
                  >
                    Update Usecase
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setTag("");
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

export default EditUsecaseSheet;
