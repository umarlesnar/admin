import React, { useState, useMemo, useEffect } from "react";
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
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import moment from "moment";
import { Listbox } from "@/components/ui/listbox";
import Text from "@/components/ui/text";
import { usePartnerProductQuery } from "@/framework/partner/get-partner-product";
import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import * as Yup from "yup";
import { useParams } from "next/navigation";
import DatePicker from "@/components/ui/DatePicker";

interface Subscription {
  _id: string;
  plan_id: string;
  plan_name: string;
  total_amount: number;
  r_current_end_at?: number;
}

interface UpgradeSubscriptionSheetProps {
  subscription: Subscription;
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

const UpgradeSchema = Yup.object().shape({
  new_plan_id: Yup.string().required("Please select a plan"),
  payment_status: Yup.string().required("Payment status is required"),
  end_at: Yup.date().required("End date is required"),
});

export default function UpgradeSubscriptionSheet({
  subscription,
  children,
}: UpgradeSubscriptionSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { partner_id, workspace_id } = useParams();
  const queryClient = useQueryClient();

  const { data: productData } = usePartnerProductQuery({
    page: 1,
    per_page: 100,
    filter: { status: "ENABLE" },
  });

  const availablePlans = useMemo(() => {
    return (productData?.items || [])
      .filter((plan: any) => plan._id !== subscription.plan_id)
      .map((plan: any) => ({
        value: plan._id,
        name: `${plan.name} (${plan.type} - ${plan.price} ${plan.currency_code})`,
        original: plan,
      }));
  }, [productData, subscription.plan_id]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: any) => {
      // Convert dates to unix timestamp for API
      const payload = {
        ...values,
        r_start_at: moment(values.start_at).startOf("day").unix(),
        r_end_at: moment(values.end_at).endOf("day").unix(),
      };
      
      const res = await http.post(
        `/partner/${partner_id}/workspace/${workspace_id}/subscription/${subscription._id}/upgrade`,
        payload
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Plan upgraded successfully");
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.SUBSCRIPTION] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to upgrade plan");
    },
  });

  const formik = useFormik({
    initialValues: {
      new_plan_id: "",
      payment_status: "paid",
      start_at: new Date(), // Calculated automatically
      end_at: undefined as Date | undefined,
    },
    validationSchema: UpgradeSchema,
    onSubmit: (values) => {
      mutate(values);
    },
  });

  // Calculate Start Date Logic
  const selectedPlanInfo = useMemo(() => {
    const plan = availablePlans.find((p: any) => p.value === formik.values.new_plan_id)?.original;
    if (!plan) return null;

    const currentPrice = subscription.total_amount || 0;
    const newPrice = plan.price || 0;
    
    const isImmediate = newPrice > currentPrice;
    
    let effectiveDate = moment();
    if (!isImmediate && subscription.r_current_end_at) {
      const currentEnd = moment.unix(subscription.r_current_end_at);
      // If current plan expired, start now regardless of price
      if (currentEnd.isAfter(moment())) {
        effectiveDate = currentEnd;
      }
    }

    return {
      plan,
      isImmediate,
      effectiveDate, // This is the start date
    };
  }, [formik.values.new_plan_id, availablePlans, subscription]);

  // Update start_at in formik when logic changes
  useEffect(() => {
    if (selectedPlanInfo) {
      formik.setFieldValue("start_at", selectedPlanInfo.effectiveDate.toDate());
      
      // Auto-set default duration based on plan type if not set yet
      if (!formik.values.end_at) {
        const unit = selectedPlanInfo.plan.type === "annual" ? "years" : "months";
        const newEnd = selectedPlanInfo.effectiveDate.clone().add(1, unit).toDate();
        formik.setFieldValue("end_at", newEnd);
      }
    }
  }, [selectedPlanInfo?.effectiveDate, selectedPlanInfo?.plan]);

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
          <Button variant="default" size="sm">
             Upgrade
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Upgrade / Switch Plan</SheetTitle>
          <SheetDescription>
            Switch from <strong>{subscription.plan_name}</strong> to a new plan.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 py-6">
          
          {/* Plan Selection */}
          <div className="space-y-2 flex flex-col">
            <label htmlFor="new_plan_id" className="mb-1 text-sm font-medium">Select New Plan</label>
            <Listbox
                options={availablePlans}
                selectedOption={availablePlans.find((o: any) => o.value === formik.values.new_plan_id)}
                onSelectData={(option: any) => {
                    formik.setFieldValue("new_plan_id", option.value);
                    formik.setFieldValue("end_at", undefined); // Reset end date on plan change
                }}
                buttonClassname="w-full"
                placeholder="Choose a plan..."
            />
            {formik.touched.new_plan_id && formik.errors.new_plan_id && (
              <p className="text-sm text-red-500">{formik.errors.new_plan_id as string}</p>
            )}
          </div>

          {/* Logic Information Box */}
          {selectedPlanInfo && (
             <div className={`rounded-md p-3 text-sm border mb-4 ${selectedPlanInfo.isImmediate ? 'bg-green-50 text-green-800 border-green-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
               <div className="flex justify-between items-start">
                 <div>
                    <div className="font-semibold text-xs uppercase tracking-wider mb-1">
                        {selectedPlanInfo.isImmediate ? "Immediate Change" : "Scheduled Change"}
                    </div>
                    <p className="text-xs opacity-90">
                        Starts on: <strong>{selectedPlanInfo.effectiveDate.format("DD MMM YYYY")}</strong>
                    </p>
                 </div>
                 <div className="text-right">
                    <div className="text-xs font-medium">New Price</div>
                    <div className="font-bold">{selectedPlanInfo.plan.currency_code} {selectedPlanInfo.plan.price}</div>
                 </div>
               </div>
             </div>
          )}

          {/* Date Selection Section */}
          {formik.values.new_plan_id && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="space-y-2">
                    <Text size="sm" weight="medium">Set Duration</Text>
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

                <div className="space-y-2 flex flex-col">
                    <label htmlFor="end_at" className="mb-1 text-sm font-medium">Subscription End Date</label>
                    <DatePicker
                        selected={formik.values.end_at}
                        onSelected={(date : any) => formik.setFieldValue("end_at", date)}
                        placeholder="Select expiry date"
                        className="w-full"
                        minDate={formik.values.start_at} 
                    />
                    {formik.touched.end_at && formik.errors.end_at && (
                        <p className="text-sm text-red-500">{formik.errors.end_at as string}</p>
                    )}
                </div>
            </div>
          )}

          {/* Payment Status Selection */}
          <div className="space-y-2 flex flex-col">
            <label htmlFor="payment_status" className="mb-1 text-sm font-medium">Invoice Status</label>
            <Listbox
                options={PAYMENT_STATUS_OPTIONS}
                selectedOption={PAYMENT_STATUS_OPTIONS.find(o => o.value === formik.values.payment_status)}
                onSelectData={(option: any) => formik.setFieldValue("payment_status", option.value)}
                buttonClassname="w-full"
            />
          </div>

          <SheetFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !formik.values.new_plan_id || !formik.values.end_at}>
              {isPending ? "Processing..." : "Confirm Upgrade"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}