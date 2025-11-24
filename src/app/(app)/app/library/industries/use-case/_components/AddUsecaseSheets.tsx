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
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UiYupUsecaseSchema } from "@/validation-schema/ui/UiYupIndustriesSchema";
import { Combobox } from "@/components/ui/combobox";
import { useIndustries } from "@/framework/industries/get-industries";
import { Input } from "@/components/ui/input";
import { useUsecaseMutation } from "@/framework/usecase/usecase-mutation";

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

const AddUsecaseSheet = ({ children }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [tag, setTag] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const inputRef = useRef(null);
  const { mutateAsync } = useUsecaseMutation();

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  const { data } = useIndustries({});

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
            Add Usecase
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1">
          <Formik
            initialValues={{
              name: "",
              status: "ENABLE",
            }}
            onSubmit={async (values, { setErrors, resetForm }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                const response = await mutateAsync({
                  method: "POST",
                  payload: values,
                });
                toast.success(`Usecase Added Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Add Usecase`, {
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
            }) => {
              return (
                <Form className="w-full h-full  flex flex-col">
                  <div className="flex-1 gap-4 space-y-5">
                    {/* <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Industry
                      </Text>
                      <Combobox
                        options={data?.items?.filter(
                          (item: any) => item.status === "ENABLE"
                        )}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2 text-sm`}
                        placeholder={"Select Industry"}
                        selectedOption={data?.items?.find((o: any) => {
                          return o?.name == values?.industry_id;
                        })}
                        onSelectData={(industry: any) => {
                          setFieldValue("industry_id", industry?._id);
                        }}
                      />
                    </div> */}
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
                      Add Usecase
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
              );
            }}
          </Formik>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddUsecaseSheet;
