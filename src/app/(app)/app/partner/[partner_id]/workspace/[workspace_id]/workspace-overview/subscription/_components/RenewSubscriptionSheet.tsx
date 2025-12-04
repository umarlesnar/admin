import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useFormik } from "formik";
import { useRenewPartnerWorkspaceSubscriptionMutation } from "@/framework/partner/workspace/subscription/subscription-renew-mutation";
import { UiYupRenewSubscriptionSchema } from "@/validation-schema/ui/UiYupRenewSubscriptionSchema";
import moment from "moment";
import DatePicker from "@/components/ui/DatePicker";
import { Listbox } from "@/components/ui/listbox";
import Text from "@/components/ui/text";

interface RenewSubscriptionSheetProps {
  subscription: any;
  children?: React.ReactNode;
}

const PAYMENT_STATUS_OPTIONS = [
  { value: "paid", name: "Paid" },
  { value: "pending", name: "Pending" },
];

const DURATION_OPTIONS = [
  { label: "1 Month", value: 1, unit: "months" },
  { label: "3 Months", value: 3, unit: "months" },
  { label: "6 Months", value: 6, unit: "months" },
  { label: "1 Year", value: 1, unit: "years" },
];

export default function RenewSubscriptionSheet({
  subscription,
  children
}: RenewSubscriptionSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useRenewPartnerWorkspaceSubscriptionMutation();

  const formik = useFormik({
    initialValues: {
      start_at: new Date(),
      end_at: undefined as Date | undefined,
      payment_status: "paid",
    },
    validationSchema: UiYupRenewSubscriptionSchema,
    onSubmit: (values) => {
      if (values.start_at && values.end_at) {
        const startTimestamp = moment(values.start_at).startOf('day').unix();
        const endTimestamp = moment(values.end_at).endOf('day').unix();
        
        mutate(
          {
            subscription_id: subscription._id,
            start_at: startTimestamp,
            end_at: endTimestamp,
            payment_status: values.payment_status,
          },
          {
            onSuccess: () => {
              setIsOpen(false);
              formik.resetForm();
            },
          }
        );
      }
    },
  });

  const handleDurationSelect = (value: number, unit: any) => {
    if (formik.values.start_at) {
      const newEndDate = moment(formik.values.start_at).add(value, unit).toDate();
      formik.setFieldValue("end_at", newEndDate);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            Renew
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Renew Subscription</SheetTitle>
          <SheetDescription>
            Reactivate <strong>{subscription.plan_name}</strong> by defining a new period and invoice status.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 py-6">
          
          {/* Quick Duration Selection */}
          <div className="space-y-2">
            <Text size="sm" weight="medium">Quick Duration</Text>
            <div className="grid grid-cols-2 gap-2">
              {DURATION_OPTIONS.map((opt) => (
                <Button
                  key={opt.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDurationSelect(opt.value, opt.unit as any)}
                  className="w-full text-xs"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Start Date Picker */}
          <div className="space-y-2 flex flex-col">
            <label htmlFor="start_at" className="mb-1 text-sm font-medium">Select Start Date</label>
            <DatePicker
              selected={formik.values.start_at}
              onSelected={(date : any) => {
                formik.setFieldValue("start_at", date);
                // Reset end date if user changes start date to avoid inconsistencies unless we want to recalc duration
                // For better UX, we can keep end date if valid, or clear it. Let's clear to force re-selection or manual update.
                 if (formik.values.end_at && moment(date).isAfter(formik.values.end_at)) {
                   formik.setFieldValue("end_at", undefined);
                }
              }}
              placeholder="Pick a start date"
              className="w-full"
            />
            {formik.touched.start_at && formik.errors.start_at && (
              <p className="text-sm text-red-500">{formik.errors.start_at as string}</p>
            )}
          </div>

          {/* End Date Picker */}
          <div className="space-y-2 flex flex-col">
            <label htmlFor="end_at" className="mb-1 text-sm font-medium">Select Expiry Date</label>
            <DatePicker
              selected={formik.values.end_at}
              onSelected={(date : any) => formik.setFieldValue("end_at", date)}
              placeholder="Pick a new end date"
              className="w-full"
              minDate={formik.values.start_at} 
            />
            {formik.touched.end_at && formik.errors.end_at && (
              <p className="text-sm text-red-500">{formik.errors.end_at as string}</p>
            )}
          </div>

          {/* Show calculated range text for clarity */}
          {formik.values.start_at && formik.values.end_at && (
             <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-700 border border-blue-100">
               <span className="font-semibold">Renewal Period:</span> {moment(formik.values.start_at).format("DD MMM YYYY")} - {moment(formik.values.end_at).format("DD MMM YYYY")}
             </div>
          )}

          {/* Payment Status Selection (ComboBox) */}
          <div className="space-y-2 flex flex-col">
            <label htmlFor="payment_status" className="mb-1 text-sm font-medium">Payment Invoice Status</label>
            <Listbox
                options={PAYMENT_STATUS_OPTIONS}
                selectedOption={PAYMENT_STATUS_OPTIONS.find(o => o.value === formik.values.payment_status)}
                onSelectData={(option: any) => formik.setFieldValue("payment_status", option.value)}
                buttonClassname="w-full"
            />
            {formik.touched.payment_status && formik.errors.payment_status && (
              <p className="text-sm text-red-500">{formik.errors.payment_status as string}</p>
            )}
          </div>

          <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-800 border border-yellow-200">
            <p className="text-xs">
              This subscription is currently <strong>expired</strong>. 
              An invoice will be generated with the status: <strong>{formik.values.payment_status === 'paid' ? 'Paid' : 'Pending'}</strong>.
            </p>
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !formik.values.start_at || !formik.values.end_at}>
              {isPending ? "Renewing..." : "Confirm Renewal"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}