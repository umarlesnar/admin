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

interface RenewSubscriptionSheetProps {
  subscription: any;
  children?: React.ReactNode;
}

export default function RenewSubscriptionSheet({
  subscription,
  children
}: RenewSubscriptionSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useRenewPartnerWorkspaceSubscriptionMutation();

  const formik = useFormik({
    initialValues: {
      end_at: undefined as Date | undefined, 
    },
    validationSchema: UiYupRenewSubscriptionSchema,
    onSubmit: (values) => {
      if (values.end_at) {
        // Convert JS Date to Unix Timestamp (seconds)
        const unixTimestamp = moment(values.end_at).endOf('day').unix();
        
        mutate(
          {
            subscription_id: subscription._id,
            end_at: unixTimestamp,
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            Renew
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="max-w-md">
        <SheetHeader>
          <SheetTitle>Renew Subscription</SheetTitle>
          <SheetDescription>
            Reactivate <strong>{subscription.plan_name}</strong> until a specific date.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 py-6">
          <div className="space-y-2 flex flex-col">
            <label htmlFor="end_at" className="mb-1">Select Expiry Date</label>
            <DatePicker
              selected={formik.values.end_at}
              onSelected={(date : any) => formik.setFieldValue("end_at", date)}
              placeholder="Pick a new end date"
              className="w-full"
              minDate={new Date()} // Disable past dates
            />
            {formik.touched.end_at && formik.errors.end_at && (
              <p className="text-sm text-red-500">{formik.errors.end_at as string}</p>
            )}
          </div>

          <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-800 border border-yellow-200">
            <p className="text-xs">
              This plan is currently <strong>completed</strong>. 
              The renewal period will start from <strong>Today</strong> and end on your selected date.
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
            <Button type="submit" disabled={isPending || !formik.values.end_at}>
              {isPending ? "Renewing..." : "Confirm Renewal"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}