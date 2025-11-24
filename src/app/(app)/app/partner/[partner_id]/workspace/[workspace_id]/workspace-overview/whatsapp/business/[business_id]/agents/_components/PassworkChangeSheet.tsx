"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Formik } from "formik";
import React, { ReactElement, useState } from "react";
import { toast } from "sonner";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import { Button } from "@/components/ui/button";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { PasswordInput } from "@/components/ui/passwordInput";
import { usePasswordMutation } from "@/framework/business/users/password-update-mutation";
import { IUserMutation } from "@/framework/business/users/users-update-mutation";
import { yupPasswordResetSchema } from "@/validation-schema/api/yup-password-schema";

type Props = {
  children: ReactElement;
  data: any;
};

const ChangPasswordSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync, isPending } = usePasswordMutation();

  return (
    <Formik
      initialValues={{
        new_password: "",
        confirm_password: "",
      }}
      enableReinitialize
      onSubmit={async (values, { setErrors, resetForm }) => {
        const loadingToast = toast.loading("Loading...");
        try {
          if (values.new_password !== values.confirm_password) {
            toast.error("Passwords do not match", { id: loadingToast });
            return;
          }
           
          if (!data?._id) {
            toast.error("User ID is missing");
            return;
          }
      
          const payload: IUserMutation = {
              user_id: data._id,
              payload: {
                  new_password: values.new_password,
                  confirm_password: values.confirm_password,
              },
              method: "PUT"
          };
      
          await mutateAsync(payload);
          toast.success("Password updated successfully!", { id: loadingToast });
      
          setOpen(false);
          resetForm();
        } catch (error: any) {
          console.error("Error updating password:", error);
          toast.error("Failed to update password", { id: loadingToast });
      
          if (error.response?.status === SERVER_STATUS_CODE.VALIDATION_ERROR_CODE) {
            setErrors(error.response.data?.data || {});
          }
        }
      }}      
      
      validationSchema={yupPasswordResetSchema}
    >
      {({ values, errors, handleChange, handleSubmit, resetForm }) => {
        return (
          <Sheet
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              resetForm({});
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[500px] h-screen flex flex-col p-5">
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Reset Password
                </SheetTitle>
              </SheetHeader>
              <div className=" space-y-4 flex-1  overflow-y-auto bg-scroll pb-4 px-2">
                <PasswordInput
                  label="New Password"
                  name="new_password"
                  placeholder="Enter new password"
                  onChange={handleChange}
                  errorKey={errors?.new_password}
                  value={values?.new_password}
                />
                <PasswordInput
                  label="Confirm Password"
                  name="confirm_password"
                  placeholder="Re-enter password"
                  onChange={handleChange}
                  errorKey={errors?.confirm_password}
                  value={values?.confirm_password}
                />
              </div>

              <SheetFooter>
                <div className="flex items-center gap-2 w-full">
                  <Button
                    type="button"
                    className="mr-auto w-auto"
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={isPending}
                    loading={isPending}
                  >
                    Save
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        );
      }}
    </Formik>
  );
};

export default ChangPasswordSheet;
