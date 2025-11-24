import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Text from "@/components/ui/text";
import { Form, Formik } from "formik";
import React, { ReactElement, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useWorkspaceModuleMutation } from "@/framework/partner/workspace/modules/module-status-mutation";

type Props = {
  children: ReactElement;
  data?: any;
};

const EditModuleStatusSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = useWorkspaceModuleMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between mb-6">
          <DialogTitle>Update Module Status</DialogTitle>
          <DialogClose asChild>
              <CloseIcon className="w-4 h-4 cursor-pointer" />
          </DialogClose>
        </DialogHeader>

        <Formik
          initialValues={{
            enabled: data?.enabled || false,
            is_visibility: data?.is_visibility || false,
          }}
          onSubmit={async (values, { setErrors }) => {
            const loadingToast = toast.loading("Loading...");
            try {
              await mutateAsync({
                modules_id: data?._id,
                method: "PUT",
                payload: values,
              });
              toast.success(`Module Status Updated Successfully`, {
                id: loadingToast,
              });
              setOpen(false);
            } catch (error: any) {
              toast.error(`Failed to update module status`, {
                id: loadingToast,
              });
              if (error.response?.status === SERVER_STATUS_CODE.VALIDATION_ERROR_CODE) {
                setErrors(error.response.data.data);
              }
            }
          }}
          enableReinitialize
        >
          {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="flex items-center justify-between">
                <Text size="sm" weight="medium">
                  Module Status
                </Text>
                <Switch
                  checked={values.enabled}
                  onCheckedChange={(checked) => setFieldValue("enabled", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Text size="sm" weight="medium">
                  Visibility
                </Text>
                <Switch
                  checked={values.is_visibility}
                  onCheckedChange={(checked) => setFieldValue("is_visibility", checked)}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  className="flex-1"
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  Update
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditModuleStatusSheet;
