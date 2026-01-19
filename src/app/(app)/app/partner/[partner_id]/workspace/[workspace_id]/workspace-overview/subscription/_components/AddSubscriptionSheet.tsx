import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Combobox } from "@/components/ui/combobox";
import DatePicker from "@/components/ui/DatePicker";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import { Input } from "@/components/ui/input";
import { Listbox } from "@/components/ui/listbox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Text from "@/components/ui/text";
import { useProductsQuery } from "@/framework/product/get-product";
import { useWorkspaceSubscriptionMutation } from "@/framework/workspace/subscription/workshop-subscription-mutation";
import { ErrorMessage, Formik } from "formik";
import moment from "moment";
import React, { ReactElement, useEffect, useState } from "react";
import { toast } from "sonner";
import { CURRENCY_CODES } from "@/constants/currency";
type Props = {
  children: ReactElement;
  workspace_id?: any;
};

const payment_gateway = [
  {
    name: "Razorpay",
    value: "razorpay",
  },
  {
    name: "Manual",
    value: "manual",
  },
];

const AddSubscriptionForm = ({ onSheetClose, workspace_id }: any) => {
  const [plans, setPlans] = useState([]);
  const { data, isLoading } = useProductsQuery({ per_page: 100 });
  const { mutateAsync, isPending } = useWorkspaceSubscriptionMutation();

  useEffect(() => {
    if (data?.items?.length > 0) {
      const _plan = data.items.map((item: any) => ({
        ...item,
        name: item.name + `${item.type ? ` ( ${item.type} )` : ""}`,
      }));
      setPlans(_plan);
    }
  }, [data?.items]);

  return (
    <Formik
      initialValues={{
        payment_gateway: "manual",
        plan_id: "",
        auto_renew: false,
        status: "active",
        currency_code: "",
      }}
      onSubmit={async (value, { setErrors }) => {
        const loadingToast = toast.loading("Loading...");
        try {
          const res = await mutateAsync({
            workspace_id: workspace_id,
            payload: value,
          });

          onSheetClose(false);

          toast.success(`Subscription created successfully`, {
            id: loadingToast,
          });
        } catch (error: any) {
          if (error.response.status == 422) {
            setErrors(error?.response?.data?.data);
          }
          toast.error(
            error?.response?.data?.message || `Failed to create subscription`,
            {
              id: loadingToast,
            }
          );

          console.log("subscription creat mutation error", error);
        }
      }}
    >
      {({ values, errors, setFieldValue, handleChange, handleSubmit }: any) => {
        const filteredPlans = plans.filter(
          (item: any) => !values.currency_code || item.currency_code === values.currency_code
        );
        return (
          <div className="w-full h-full flex flex-col">
            <div className="space-y-2 flex-1">
              <div className="w-full space-y-1">
                <Text size="sm" tag="label" weight="medium">
                  Payment Gatway
                </Text>
                <Listbox
                  options={payment_gateway}
                  buttonClassname={`w-full`}
                  dropdownClassname={`w-full`}
                  selectedOption={payment_gateway.find((o: any) => {
                    return o.value == values.payment_gateway;
                  })}
                  onSelectData={(value: any) => {
                    setFieldValue("payment_gateway", value.value);

                    if (value.value == "manual") {
                      setFieldValue("r_subscription_id", "");
                    }
                  }}
                />
              </div>
              {values?.payment_gateway == "razorpay" && (
                <Input
                  name={`r_subscription_id`}
                  label="Subscription Id"
                  onChange={handleChange}
                  value={values.r_subscription_id}
                  errorKey={errors?.r_subscription_id}
                />
              )}
              <div className="w-full space-y-1">
                <Text size="sm" tag="label" weight="medium">
                  Plan
                </Text>
                <Combobox
                  options={filteredPlans}
                  buttonClassname="w-full"
                  dropdownClassname="p-2"
                  placeholder={isLoading ? "Loading plans..." : "Select plan"}
                  selectedOption={
                    filteredPlans.find((o: any) => o._id === values.plan_id) || null
                  }
                  onSelectData={(user: any) =>
                    setFieldValue("plan_id", user._id)
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="w-full space-y-1">
                <Text size="sm" tag="label" weight="medium">
                  Currency Code
                </Text>
                <Combobox
                  options={CURRENCY_CODES}
                  buttonClassname="w-full"
                  dropdownClassname="p-2"
                  placeholder="Select currency code"
                  selectedOption={
                    CURRENCY_CODES.find((o: any) => o.value === values.currency_code) || null
                  }
                  onSelectData={(option: any) =>
                    setFieldValue("currency_code", option.value)
                  }
                />
              </div>
              <div className="w-full flex items-start gap-3">
                <div className="w-full">
                  <Text size="sm" tag="label" weight="medium">
                    Start Date
                  </Text>
                  <DatePicker
                    onSelected={(date: any) => {
                      const unixTimestamp = moment(date).unix();
                      setFieldValue("r_start_at", unixTimestamp);
                    }}
                    selected={values?.r_start_at}
                  />
                  <ErrorMessage
                    name="r_start_at"
                    component={"p"}
                    className="text-sm text-red-500"
                  />
                </div>
                <div className="w-full">
                  <Text size="sm" tag="label" weight="medium">
                    End Date
                  </Text>
                  <DatePicker
                    onSelected={(date: any) => {
                      const unixTimestamp = moment(date).unix();
                      setFieldValue("r_end_at", unixTimestamp);
                    }}
                    selected={values?.r_end_at}
                  />
                  <ErrorMessage
                    name="r_end_at"
                    component={"p"}
                    className="text-sm text-red-500"
                  />
                </div>
              </div>{" "}
              <div className="flex items-center gap-1 py-2">
                <Checkbox
                  id="auto_renew"
                  name="auto_renew"
                  checked={values.auto_renew}
                  onCheckedChange={(value) => {
                    setFieldValue("auto_renew", value);
                  }}
                />
                <Text
                  tag="label"
                  size="sm"
                  className="cursor-pointer"
                  htmlFor="auto_renew"
                  onClick={() => {
                    setFieldValue("auto_renew", !values.auto_renew);
                  }}
                >
                  Is Auto Renewal
                </Text>
              </div>
            </div>
            <div className="w-full flex items-center gap-2">
              <Button
                className="w-full "
                variant="outline"
                type="button"
                onClick={() => {
                  onSheetClose(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="w-full "
                disabled={isPending}
                onClick={handleSubmit}
              >
                Create Subscription
              </Button>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

const AddSubscriptionSheet = ({ children, workspace_id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

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
        // onOpenAutoFocus={preventFocus}
      >
        <SheetHeader className="flex flex-row items-center justify-between gap-4">
          <SheetTitle className="h-full text-text-primary text-xl font-semibold">
            Create Subscription
          </SheetTitle>{" "}
          <SheetClose asChild>
            <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 bg-neutral-10">
          {open && (
            <AddSubscriptionForm
              onSheetClose={setOpen}
              workspace_id={workspace_id}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddSubscriptionSheet;
