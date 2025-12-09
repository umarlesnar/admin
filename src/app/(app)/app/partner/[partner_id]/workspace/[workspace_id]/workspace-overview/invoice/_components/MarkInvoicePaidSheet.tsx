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
import { toast } from "sonner";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import { Combobox } from "@/components/ui/combobox";
import moment from "moment";
import * as Yup from "yup";
import { useParams } from "next/navigation";
import http from "@/framework/utils/http";

type Props = {
  children: ReactElement;
  invoice: any;
  refetch: () => void;
};

const PAYMENT_METHODS = [
  { name: "Manual" },
  { name: "Razorpay" },
];

const validationSchema = Yup.object().shape({
  payment_method: Yup.string().required("Payment method is required"),
  paid_at: Yup.number().required("Payment date is required"),
  paid_time: Yup.string().required("Payment time is required"),
});

const MarkInvoicePaidSheet = ({ children, invoice, refetch }: Props) => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const partner_id = params?.partner_id;
  const workspace_id = params?.workspace_id;

  const handleSubmit = async (values: any, { setErrors }: any) => {
    const loadingToast = toast.loading("Updating invoice...");
    try {
      const [hours, minutes] = values.paid_time.split(":").map(Number);
      const paidDate = moment.unix(values.paid_at);
      paidDate.hours(hours).minutes(minutes);

      await http.put(
        `/partner/${partner_id}/workspace/${workspace_id}/invoice`,
        {
          invoice_id: invoice._id,
          payment_method: values.payment_method,
          paid_at: paidDate.unix(),
        }
      );

      toast.success("Invoice marked as paid successfully", {
        id: loadingToast,
      });
      setOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update invoice", {
        id: loadingToast,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between mb-6">
          <DialogTitle>Mark Invoice as Paid</DialogTitle>
          <DialogClose asChild>
            <CloseIcon className="w-4 h-4 cursor-pointer" />
          </DialogClose>
        </DialogHeader>

        <Formik
          initialValues={{
            payment_method: "",
            paid_at: Math.floor(Date.now() / 1000),
            paid_time: moment().format("HH:mm"),
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
            <Form className="space-y-4">
              {/* Payment Method */}
              <div>
                <Text size="sm" tag="label" weight="medium">
                  Payment Method
                </Text>
                <Combobox
                  options={PAYMENT_METHODS}
                  selectedOption={PAYMENT_METHODS.find(
                    (m) => m.name === values.payment_method
                  )}
                  onSelectData={(option: any) =>
                    setFieldValue("payment_method", option.name)
                  }
                  placeholder="Select payment method"
                  buttonClassname="w-full"
                />
                <ErrorMessage
                  name="payment_method"
                  component="p"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Paid At - Date and Time */}
              <div className="space-y-2">
                <Text size="sm" tag="label" weight="medium">
                  Payment Date & Time
                </Text>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <DatePicker
                      onSelected={(date: any) =>
                        setFieldValue("paid_at", moment(date).unix())
                      }
                      selected={values?.paid_at}
                    />
                  </div>
                  <div>
                    <TimePicker
                      value={values.paid_time}
                      onChange={(date: any) => {
                        const time = moment(date[0]).format("HH:mm");
                        setFieldValue("paid_time", time);
                      }}
                    />
                  </div>
                </div>
                <ErrorMessage
                  name="paid_at"
                  component="p"
                  className="text-sm text-red-500 mt-1"
                />
                <ErrorMessage
                  name="paid_time"
                  component="p"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  className="flex-1"
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  Confirm Payment
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

export default MarkInvoicePaidSheet;
