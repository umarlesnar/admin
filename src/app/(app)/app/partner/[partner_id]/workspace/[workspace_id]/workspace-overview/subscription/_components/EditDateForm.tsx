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
import { ErrorMessage, Form, Formik } from "formik";
import React, { ReactElement, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { useSubscriptionMutation } from "@/framework/partner/workspace/subscription/subscription-mutation";
import DatePicker from "@/components/ui/DatePicker";
import moment from "moment";

type Props = {
  children: ReactElement;
  data?: any;
};

const EditSubscriptionDateSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync } = useSubscriptionMutation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between mb-6">
          <DialogTitle>Update Subscription Date</DialogTitle>
          <DialogClose asChild>
            <CloseIcon className="w-4 h-4 cursor-pointer" />
          </DialogClose>
        </DialogHeader>

        <Formik
          initialValues={{
            r_start_at: data?.r_current_start_at || "",
            r_end_at: data?.r_current_end_at || "",
          }}
          enableReinitialize
          onSubmit={async (values, { setErrors }) => {
            const loadingToast = toast.loading("Updating subscription...");

            const payload: Record<string, any> = {};
            if (values.r_start_at !== data?.r_current_start_at)
              payload.r_start_at = values.r_start_at;
            if (values.r_end_at !== data?.r_current_end_at)
              payload.r_end_at = values.r_end_at;

            if (Object.keys(payload).length === 0) {
              toast.info("No changes detected", { id: loadingToast });
              return;
            }

            try {
              await mutateAsync({
                subscription_id: data?._id,
                payload,
              });

              toast.success("Subscription Date Updated Successfully", {
                id: loadingToast,
              });
              setOpen(false);
            } catch (error: any) {
              toast.error(
                error?.response?.data?.message ||
                  "Failed to update subscription date",
                { id: loadingToast }
              );

              if (
                error.response?.status ===
                SERVER_STATUS_CODE.VALIDATION_ERROR_CODE
              ) {
                setErrors(error.response.data.data);
              }
            }
          }}
        >
          {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="flex items-start gap-3">
                {/* Start Date */}
                <div className="w-full">
                  <Text size="sm" tag="label" weight="medium">
                    Start Date
                  </Text>
                  <DatePicker
                    onSelected={(date: any) =>
                      setFieldValue("r_start_at", moment(date).unix())
                    }
                    selected={values?.r_start_at}
                  />
                  <ErrorMessage
                    name="r_start_at"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>

                {/* End Date */}
                <div className="w-full">
                  <Text size="sm" tag="label" weight="medium">
                    End Date
                  </Text>
                  <DatePicker
                    onSelected={(date: any) =>
                      setFieldValue("r_end_at", moment(date).unix())
                    }
                    selected={values?.r_end_at}
                  />
                  <ErrorMessage
                    name="r_end_at"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>
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

export default EditSubscriptionDateSheet;
