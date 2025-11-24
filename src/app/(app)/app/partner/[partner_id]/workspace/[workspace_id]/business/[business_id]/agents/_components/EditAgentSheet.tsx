import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import { Input } from "@/components/ui/input";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Text from "@/components/ui/text";
import { useUserMutation } from "@/framework/business/users/users-update-mutation";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { Form, Formik } from "formik";
import React, { ReactElement, useState } from "react";
import { toast } from "sonner";
import AgentsPermissionsSheets from "./AgentsPermissionsSheets";
import { Listbox } from "@/components/ui/listbox";

type Props = {
  children: ReactElement;
  data?: any;
};

const ACCOUNT_STATUS = [
  { value: "ACTIVE", name: "ACTIVE" },
  { value: "DISABLE", name: "DISABLE" },
];

const EditAgentSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = useUserMutation();

  const [permissions, setPermissions] = useState<Record<string, boolean>>(
    data?.permissions || {}
  );

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        profile: {
          first_name: data?.profile?.first_name || "",
          last_name: data?.profile?.last_name || "",
        },
        email: [{ email_id: data?.email?.[0]?.email_id || "" }],
        phone: [{ mobile_number: data?.phone?.[0]?.mobile_number || "" }],
        permissions,
        status: data?.status || "ACTIVE",
        ...data,
      }}
      onSubmit={async (values, { setErrors }) => {
        const loadingToast = toast.loading("Loading...");
        try {
          const response = await mutateAsync({
            user_id: data?._id,
            method: "PUT",
            payload: { ...values, permissions },
          });

          toast.success(`Agent Updated Successfully`, {
            id: loadingToast,
          });

          setOpen(false);
        } catch (error: any) {
          console.log("error", error);

          toast.error(`Failed to Update User`, {
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
      enableReinitialize={true}
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
                  Edit Agent
                </SheetTitle>
              </SheetHeader>

              <Form className="flex h-full flex-col justify-between overflow-y-auto bg-scroll">
                <div className="w-full flex-1 overflow-y-auto bg-scroll p-2 space-y-4">
                  <div className=" space-y-6 w-full">
                    <Input
                      label="First name"
                      name="profile.first_name"
                      placeholder="Enter your first name"
                      onChange={handleChange}
                      errorKey={errors.profile?.first_name}
                      value={values.profile?.first_name}
                      isRequired
                    />
                    <Input
                      label="Last name"
                      name="profile.last_name"
                      placeholder="Enter your last name"
                      onChange={handleChange}
                      errorKey={errors.profile?.last_name}
                      value={values.profile?.last_name}
                    />
                    <Input
                      label="Email"
                      name="email.[0].email_id"
                      placeholder="Enter your email address"
                      onChange={handleChange}
                      errorKey={errors?.email?.[0]?.email_id}
                      value={values?.email?.[0]?.email_id}
                    />
                    <Input
                      label="Phone number"
                      name="phone.[0].mobile_number"
                      placeholder="Enter your phone number"
                      onChange={handleChange}
                      errorKey={errors?.phone?.[0]?.mobile_number}
                      value={values?.phone?.[0]?.mobile_number}
                    />
                    <div className="flex flex-col gap-3 w-1/2  justify-center">
                      <Text size="sm" weight="semibold" color="primary">
                        Status
                      </Text>
                      <div className="">
                        <Listbox
                          options={ACCOUNT_STATUS}
                          buttonClassname="w-[200px]"
                          selectedOption={ACCOUNT_STATUS.find(
                            (status) => status.value === values.status
                          )}
                          onSelectData={(selected: any) => {
                            setFieldValue("status", selected.value);
                          }}
                          placeholder="Select Status"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pr-4">
                        <Text size="sm" weight="semibold" color="primary">
                          Permissions
                        </Text>
                        <AgentsPermissionsSheets
                          currentPermissions={permissions}
                          onSave={(updatedPermissions) => {
                            setPermissions(updatedPermissions);
                            setFieldValue("permissions", updatedPermissions);
                          }}
                        >
                          <Button variant="outline">Add</Button>
                        </AgentsPermissionsSheets>
                      </div>
                      <div className="flex flex-wrap gap-3 pt-4">
                        {Object.entries(permissions).map(([key, value]) => (
                          <>
                            {value ? (
                              <div
                                key={key}
                                className={`px-3 py-1 rounded-full text-center text-sm font-medium bg-green-100 text-green-700 ${
                                  value
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {key.replace(/_/g, " ")}
                              </div>
                            ) : null}
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={!isValid || isSubmitting}
                  >
                    Update Agent
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

export default EditAgentSheet;
