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
import { useTemplateMutation } from "@/framework/partner/whatsapp/Template-mutation";
import { Listbox } from "@/components/ui/listbox";

type Props = {
  children: ReactElement;
  data?: any;
};
const CATEGORIES = [
    { value: "MARKETING", name: "Marketing" },
    { value: "UTILITY", name: "Utility" },
    { value: "AUTHENTICATION", name: "Authentication" },
  ];
  
  const STATUSES = [
    { value: "APPROVED", name: "Approved" },
    { value: "PENDING", name: "Pending" },
    { value: "REJECTED", name: "Rejected" },
    { value: "PAUSED" , name: "Paused"},
    { value: "DISABLED", name: "Disabled"},
    { value:"PENDING_DELETION", name: "Pending Deletion"},
  ];
  

const EditTemplateSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = useTemplateMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md h-[380px]">
        <DialogHeader className="flex flex-row items-center justify-between mb-6">
          <DialogTitle>Update Template</DialogTitle>
          <DialogClose asChild>
              <CloseIcon className="w-4 h-4" />
          </DialogClose>
        </DialogHeader>

        <Formik
          initialValues={{
            category: data?.category || "",
            status: data?.status || "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const loadingToast = toast.loading("Loading...");
            try {
              await mutateAsync({
                template_id: data?._id,
                method: "PUT",
                payload: {
                    category: values.category,
                    status: values.status,
                },
              });
              toast.success(`Template Updated Successfully`, {
                id: loadingToast,
              });
              setOpen(false);
            } catch (error: any) {
              toast.error(`Failed to update Template`, {
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
            <Form className="space-y-8">
               <div>
                <Text size="sm" weight="medium" className="mb-2">
                  Category
                </Text>
                <Listbox
                  options={CATEGORIES}
                  buttonClassname="w-full"
                  selectedOption={CATEGORIES.find(cat => cat.value === values.category)}
                  onSelectData={(selected:any) => setFieldValue("category", selected.value)}
                  placeholder="Select Category"
                />
              </div>

              <div>
                <Text size="sm" weight="medium" className="mb-2">
                  Status
                </Text>
                <Listbox
                  options={STATUSES}
                  buttonClassname="w-full"
                  selectedOption={STATUSES.find(status => status.value === values.status)}
                  onSelectData={(selected:any) => setFieldValue("status", selected.value)}
                  placeholder="Select Status"
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

export default EditTemplateSheet;
