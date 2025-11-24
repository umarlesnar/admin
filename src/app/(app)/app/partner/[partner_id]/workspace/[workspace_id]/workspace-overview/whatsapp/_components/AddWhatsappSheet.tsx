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
import { Form, Formik } from "formik";
import React, { ReactElement, useRef, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { useWorkspaceBusinessMutation } from "@/framework/workspace/workspace-business-mutation";
import { Textarea } from "@/components/ui/textarea";
import { useChannelMutation } from "@/framework/partner/workspace/whatsapp/channel-mutation";

type Props = {
  children: ReactElement;
  data?: any;
};

const options = [
  {
    name: "CONNECTED",
    value: "CONNECTED",
  },
  {
    name: "NOT CONNECTED",
    value: "NOT CONNECTED",
  },
];

const AddWhatsappSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync } = useChannelMutation();

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
            Add Whatsapp
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 ">
          <Formik
            initialValues={{
              name: "",
              wba_id: "",
              phone_number_id: "",
              access_token: "",
              fb_app_id: "",
              wb_status: {
                status: "CONNECTED",
                phone_number: "",
              },
            }}
            onSubmit={async (values, { setErrors }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                const response = await mutateAsync({
                  method: "POST",
                  payload: values,
                });
                toast.success(`Channel Added Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Add Channel`, {
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
                        label="Name"
                        isRequired
                        placeholder="Enter a name"
                        onChange={handleChange}
                        value={values.name}
                        errorKey={errors?.name}
                      />
                    </div>

                    {/* <div className="flex gap-4 w-full h-full mb-8"> */}
                    <div className="w-full">
                      <Input
                        name="wba_id"
                        label="WhatsApp Id"
                        placeholder="Enter whatsapp channel id"
                        onChange={handleChange}
                        value={values.wba_id || ""}
                        className="w-full"
                      />
                    </div>
                    <div className="w-full">
                      <Input
                        name="phone_number_id"
                        label="Phone Number Id"
                        placeholder="Enter phone number id"
                        onChange={handleChange}
                        value={values.phone_number_id || ""}
                        className="w-full"
                      />
                      {/* </div> */}
                    </div>
                    <div className="w-full space-y-1">
                      <label
                        htmlFor="access_token"
                        className="text-sm font-semibold text-text-primary"
                      >
                        Access Token
                      </label>
                      <Textarea
                        name="access_token"
                        placeholder="Enter access token"
                        onChange={handleChange}
                        value={values.access_token || ""}
                        className="w-full"
                      />
                    </div>
                    <div className="w-full">
                      <Input
                        name="fb_app_id"
                        label="App Id"
                        placeholder="Enter app id"
                        onChange={handleChange}
                        value={values.fb_app_id || ""}
                        className="w-full"
                      />
                    </div>

                    <div className="flex gap-4 w-full h-full ">
                      <div className="w-full flex-1 space-y-1">
                        <label
                          htmlFor="status"
                          className="text-sm font-semibold text-text-primary"
                        >
                          Status
                        </label>
                        <Combobox
                          buttonClassname={`h-9 w-52`}
                          value={values.wb_status?.status}
                          onSelectData={(selectedItem: any) => {
                            setFieldValue(
                              "wb_status.status",
                              selectedItem.value
                            );
                          }}
                          options={options}
                          selectedOption={options.find(
                            (option: any) =>
                              option.value === data?.wb_status?.status
                          )}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          name="wb_status.phone_number"
                          label="Phone Number"
                          placeholder="Enter phone number"
                          onChange={handleChange}
                          value={values.wb_status.phone_number || ""}
                          className="w-full"
                        />
                      </div>
                    </div>
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
                      Add Whatsapp
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

export default AddWhatsappSheet;