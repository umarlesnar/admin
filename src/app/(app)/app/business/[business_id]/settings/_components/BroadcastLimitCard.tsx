"use client";
import { Button } from "@/components/ui/button";
import { Listbox } from "@/components/ui/listbox";
import { useApplication } from "@/contexts/application/application.context";
import { useBusinessAccountStatusUpdateMutation } from "@/framework/business/settings/account-status/account-status-update-mutation";
import { useAccountStatusByIdQuery } from "@/framework/business/settings/account-status/get-account-status-by-id";
import { useBusinessBroadcasrLimitUpdateMutation } from "@/framework/business/settings/broadcast-limit/business-broadcast-limit-mutation";
import { useBroadcasrLimitByIdQuery } from "@/framework/business/settings/broadcast-limit/get-broadcast-limit-by-id";
import { Form, Formik } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const BROADCAST_LIMT_VALUE = [
  { value: 250, name: "250" },
  { value: 1000, name: "1000" },
  { value: 10000, name: "10000" },
  { value: 100000, name: "100000" },
];

const BroadcastLimitCard = () => {
  const params = useParams();
  const { setUserParams } = useApplication();
  const business_id = params?.business_id;
  const { mutateAsync } = useBusinessBroadcasrLimitUpdateMutation();

  const { data } = useBroadcasrLimitByIdQuery(business_id);

  useEffect(() => {
    if (data) {
      setUserParams({
        business: data,
      });
    }
  }, [data]);

  return (
    <Formik
      initialValues={{
        per_day_limit: 250,
        ...data,
      }}
      onSubmit={async (values) => {
        const loadingToast = toast.loading("Loading...");
        try {
          await mutateAsync({
            per_day_limit: values.per_day_limit,
          });
          toast.success("Broadcast Limit Updated Successfully", {
            id: loadingToast,
          });
        } catch (error) {
          console.log("error", error);
          toast.error("Failed to update Broadcast Limit", {
            id: loadingToast,
          });
        }
      }}
      enableReinitialize={true}
    >
      {({ values, setFieldValue }) => {
        return (
          <Form className="flex h-full flex-col justify-between overflow-y-auto bg-scroll">
            <div className="flex justify-between items-center ">
              <div className="pl-3">
                <Listbox
                  options={BROADCAST_LIMT_VALUE}
                  buttonClassname="w-[315px]"
                  selectedOption={BROADCAST_LIMT_VALUE.find((o) => {
                    return o.value === values.per_day_limit;
                  })}
                  onSelectData={(selected: any) => {
                    setFieldValue("per_day_limit", selected.value);
                  }}
                  placeholder="Select Broadcast Limit"
                />
              </div>
              <div className="flex items-center h-full w-[15%]">
                <Button type="submit" className="w-full">
                  Update
                </Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default BroadcastLimitCard;
