"use client";
import { Button } from "@/components/ui/button";
import { Listbox } from "@/components/ui/listbox";
import { Switch } from "@/components/ui/switch";
import Text from "@/components/ui/text";
import { useApplication } from "@/contexts/application/application.context";
import { useBusinessAccountStatusUpdateMutation } from "@/framework/business/settings/account-status/account-status-update-mutation";
import { useAccountStatusByIdQuery } from "@/framework/business/settings/account-status/get-account-status-by-id";
import http from "@/framework/utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const ACCOUNT_STATUS = [
  { value: "ACTIVE", name: "ACTIVE" },
  { value: "DISABLE", name: "DISABLE" },
  {value:"DELETE",name:"DELETE"}
];

const WHATSAPP_STATUSES = [
  { value: "REREGISTER", name: "REREGISTER" },
  { value: "CONNECTED", name: "CONNECTED" },
  { value: "DISCONNECTED", name: "DISCONNECTED" },
  { value: "OFFLINE", name: "OFFLINE" },
];

const AccountStatusCard = () => {
  const params = useParams();
  const { setUserParams } = useApplication();
  const queryClient = useQueryClient();
  const business_id = params?.business_id;
  const workspace_id = params?.workspace_id as string;
  const partner_id = params?.partner_id as string;
  const { mutateAsync } = useBusinessAccountStatusUpdateMutation();

  const { data } = useAccountStatusByIdQuery(business_id);

  // Fetch WhatsApp business config
  const { data: configData, isLoading: isConfigLoading } = useQuery({
    queryKey: ["business-config", business_id],
    queryFn: async () => {
      const res = await http.get(
        `/partner/${partner_id}/workspace/${workspace_id}/business/${business_id}/business-config`
      );
      return res.data?.data;
    },
  });

  const whatsappMutation = useMutation({
    mutationFn: async (payload: any) => {
      return http.post(
        `/partner/${partner_id}/workspace/${workspace_id}/business/${business_id}/business-config`,
        payload
      );
    },
    onSuccess: () => {
      toast.success("WhatsApp Configuration Updated");
      queryClient.invalidateQueries({ queryKey: ["business-config", business_id] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update configuration");
    },
  });

  useEffect(() => {
    if (data) {
      setUserParams({
        business: data,
      });
    }
  }, [data]);

  if (isConfigLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Account Status Section */}
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

      {/* WhatsApp Configuration Section */}
      <div className="p-4 border rounded-md bg-white space-y-4">
        <div className="flex flex-col gap-1">
          <Text size="lg" weight="bold">Update connection status and Biz App settings</Text>
        </div>

        <Formik
          initialValues={{
            whatsapp_status: configData?.wb_status?.status || "OFFLINE",
            is_on_biz_app: configData?.is_on_biz_app || false,
          }}
          onSubmit={(values) => {
            whatsappMutation.mutate({
              status: values.whatsapp_status,
              is_on_biz_app: values.is_on_biz_app,
            });
          }}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              {/* WhatsApp Status Dropdown */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Connection Status</label>
                <div className="flex gap-2 items-center">
                  <Listbox
                    options={WHATSAPP_STATUSES}
                    buttonClassname="w-[180px]"
                    selectedOption={WHATSAPP_STATUSES.find(
                      (o) => o.value === values.whatsapp_status
                    )}
                    onSelectData={(selected: any) => {
                      setFieldValue("whatsapp_status", selected.value);
                    }}
                  />
                </div>
              </div>

              {/* Biz App Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Is On Biz App?</label>
                <Switch
                  checked={values.is_on_biz_app}
                  onCheckedChange={(checked) => setFieldValue("is_on_biz_app", checked)}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={whatsappMutation.isPending}>
                  {whatsappMutation.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AccountStatusCard;
