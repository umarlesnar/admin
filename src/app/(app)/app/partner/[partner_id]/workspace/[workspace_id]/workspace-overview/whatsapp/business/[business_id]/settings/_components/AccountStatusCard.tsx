"use client";
import { Button } from "@/components/ui/button";
import { Listbox } from "@/components/ui/listbox";
import { useApplication } from "@/contexts/application/application.context";
import { useBusinessAccountStatusUpdateMutation } from "@/framework/business/settings/account-status/account-status-update-mutation";
import { useAccountStatusByIdQuery } from "@/framework/business/settings/account-status/get-account-status-by-id";
import { Form, Formik } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const ACCOUNT_STATUS = [
  { value: "ACTIVE", name: "ACTIVE" },
  { value: "DISABLE", name: "DISABLE" },
  {value:"DELETE",name:"DELETE"}
];

const AccountStatusCard = () => {
  const params = useParams();
  const { setUserParams } = useApplication();
  const business_id = params?.business_id;
  const { mutateAsync } = useBusinessAccountStatusUpdateMutation();

  const { data } = useAccountStatusByIdQuery(business_id);


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
        status: "ACTIVE",
        ...data,
      }}
      onSubmit={async (values) => {
        const loadingToast = toast.loading("Loading...");
        try {
          await mutateAsync({
            status: values.status,
          });
          toast.success("Account Status Updated Successfully", {
            id: loadingToast,
          });
        } catch (error) {
          console.log("error", error);
          toast.error("Failed to update Account Status", {
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
                  options={ACCOUNT_STATUS}
                  buttonClassname="w-[315px]"
                  selectedOption={ACCOUNT_STATUS.find((o) => {
                    return o.value === values.status;
                  })}
                  onSelectData={(selected: any) => {
                    setFieldValue("status", selected.value);
                  }}
                  placeholder="Select Status"
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

export default AccountStatusCard;
