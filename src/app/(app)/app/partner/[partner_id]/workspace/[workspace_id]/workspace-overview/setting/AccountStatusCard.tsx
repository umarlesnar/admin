// src/app/(app)/app/partner/[partner_id]/workspace/[workspace_id]/workspace-overview/setting/WhatsappStatusCard.tsx

"use client";
import { Button } from "@/components/ui/button";
import { Listbox } from "@/components/ui/listbox";
import { Switch } from "@/components/ui/switch";
import Text from "@/components/ui/text";
import http from "@/framework/utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const ACCOUNT_STATUSES = [
  { value: "REREGISTER", name: "REREGISTER" },
  { value: "CONNECTED", name: "CONNECTED" },
  { value: "DISCONNECTED", name: "DISCONNECTED" },
  { value: "OFFLINE", name: "OFFLINE" },
];

const AccountStatusCard = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const workspace_id = params?.workspace_id as string;
  const partner_id = params?.partner_id as string;

  // Fetch current config
  const { data: configData, isLoading } = useQuery({
    queryKey: ["business-config", workspace_id],
    queryFn: async () => {
      const res = await http.get(
        `/partner/${partner_id}/workspace/${workspace_id}/business-config`
      );
      return res.data?.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      return http.post(
        `/partner/${partner_id}/workspace/${workspace_id}/business-config`,
        payload
      );
    },
    onSuccess: () => {
      toast.success("WhatsApp Configuration Updated");
      queryClient.invalidateQueries({ queryKey: ["business-config", workspace_id] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update configuration");
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 border rounded-md bg-white space-y-4">
      <div className="flex flex-col gap-1">
        <Text size="lg" weight="bold">Update connection status and Biz App settings</Text>
      </div>

      <Formik
        initialValues={{
          status: configData?.wb_status?.status || "OFFLINE",
          is_on_biz_app: configData?.is_on_biz_app || false,
        }}
        onSubmit={(values) => {
          mutation.mutate(values);
        }}
        enableReinitialize
      >
        {({ values, setFieldValue, submitForm }) => (
          <Form className="space-y-4">
            {/* Status Dropdown */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Connection Status</label>
              <div className="flex gap-2 items-center">
                <Listbox
                  options={ACCOUNT_STATUSES}
                  buttonClassname="w-[180px]"
                  selectedOption={ACCOUNT_STATUSES.find(
                    (o) => o.value === values.status
                  )}
                  onSelectData={(selected: any) => {
                    setFieldValue("status", selected.value);
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
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AccountStatusCard;