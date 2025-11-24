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
import { useIndustriesMutation } from "@/framework/industries/get-industries-mutation";
import { UiYupIndustriesSchema } from "@/validation-schema/ui/UiYupIndustriesSchema";
import { Combobox } from "@/components/ui/combobox";

type Props = {
  children: ReactElement;
  data?: any;
};

const NAME = [
  { name: "AUTOMOBILE" },
  { name: "ECOMMERCE" },
  { name: "HEALTHCARE" },
  { name: "FINANCE" },
  { name: "REAL ESTATE" },
  { name: "TRAVEL" },
  { name: "WELLNESS" },
  { name: "AUTOMOTIVE" },
  { name: "HR/RECRUITMENT" },
  { name: "GOVERNMENT" },
  { name: "ECOMMERCE/D2C" },
  { name: "EDUCATION" },
];

const AddIndustriesSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [tag, setTag] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const inputRef = useRef(null);
  const { mutateAsync } = useIndustriesMutation();

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
            Add Industry
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
                toast.success(`Industry Added Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Add Industry`, {
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
            validationSchema={UiYupIndustriesSchema}
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
                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Name
                      </Text>
                      <Combobox
                        options={NAME}
                        buttonClassname="w-full"
                        dropdownClassname={`p-2`}
                        placeholder={"Select Industry"}
                        selectedOption={NAME.find((o) => {
                          return o.name == values.name;
                        })}
                        onSelectData={(name: any) => {
                          setFieldValue("name", name.name);
                        }}
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
                      Add Industry
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

export default AddIndustriesSheet;
