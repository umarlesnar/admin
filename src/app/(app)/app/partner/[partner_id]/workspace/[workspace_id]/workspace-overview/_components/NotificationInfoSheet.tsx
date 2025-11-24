"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import { useState } from "react";
import { Formik, Form } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useParams } from "next/navigation";
import { useWorkspaceNotificationInfoMutation } from "@/framework/partner/workspace/workspace-overview/workspace-notification-info-mutation";
import * as Yup from "yup";

export const WorkspaceNotificationSchema = Yup.object({
  email_id: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),

  phone_number: Yup.string()
    .matches(
      /^(\+?[0-9]{1,3}[-\s]?)?([0-9]{3,15})$/,
      "Enter a valid phone number"
    )
    .required("Phone number is required"),
});

const WorkspaceNtificationSheet = ({ children, data = {} }: any) => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const workspace_id = Array.isArray(params?.workspace_id)
    ? params.workspace_id[0]
    : params?.workspace_id ?? "";
  const preventFocus = (event: Event) => event.preventDefault();
  const { mutateAsync } = useWorkspaceNotificationInfoMutation();

  const initialValues = {
    email_id: "",
    phone_number: "",
    ...data,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-md w-full max-h-[90vh] overflow-y-auto p-6 rounded-lg"
        onOpenAutoFocus={preventFocus}
      >
        <DialogHeader className="flex justify-between mb-6">
          <div className="flex flex-row items-center justify-between ">
            <DialogTitle>Edit Notification Info</DialogTitle>
            <CloseIcon
              className="w-4 h-4 text-icon-primary cursor-pointer"
              onClick={() => {
                setOpen(false);
              }}
            />
          </div>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setErrors, resetForm }) => {
            const loadingToast = toast.loading("Loading...");
            try {
              await mutateAsync({
                workspace_id: workspace_id,
                payload: values,
              });
              toast.success(`Workspace notification info Update Successfully`, {
                id: loadingToast,
              });

              setOpen(false);
            } catch (error: any) {
              console.log("error", error);

              toast.error(`Failed to Update Workspace notification info`, {
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
          validationSchema={WorkspaceNotificationSchema}
          enableReinitialize
        >
          {({ values, handleSubmit, isSubmitting, handleChange, errors }) => (
            <Form className="space-y-6">
              <div>
                <Input
                  label="Email Address"
                  value={values?.email_id}
                  name="email_id"
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-md p-2"
                  errorKey={errors?.email_id}
                />
              </div>
              <div>
                <Input
                  label="Phone Number"
                  value={values?.phone_number}
                  name="phone_number"
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full border border-gray-300 rounded-md p-2"
                  errorKey={errors?.phone_number}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
                <Button
                  type="button"
                  onClick={() => {
                    handleSubmit();
                  }}
                  disabled={isSubmitting}
                >
                  update
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceNtificationSheet;
