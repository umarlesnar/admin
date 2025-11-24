"use client";
import { Button } from "@/components/ui/button";
import { Listbox } from "@/components/ui/listbox";
import { useApplication } from "@/contexts/application/application.context";
import { useWorkspaceStatusByIdQuery } from "@/framework/partner/workspace/workspace_id/get-workspace-by-id";
import { usePWorkspaceStatusUpdateMutation } from "@/framework/partner/workspace/workspace_id/workspace-by-id-mutation";
import { Form, Formik } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const ACCOUNT_STATUS = [
  { value: "ACTIVE", name: "ACTIVE" },
  { value: "SUSPENDED", name: "SUSPENDED" },
  { value: "DISABLED", name: "DISABLED" }
];

const WorkspaceStatusCard = () => {
  const params = useParams();
  const { setUserParams } = useApplication();
  const workspace_id = params?.workspace_id as string;

  const { mutateAsync } = usePWorkspaceStatusUpdateMutation();
  const { data ,isLoading} = useWorkspaceStatusByIdQuery(workspace_id);

  useEffect(() => {
    if (data) {
      setUserParams({ business: data });
    }
  }, [data]);

  return (
    <Formik
      initialValues={{
        status: data?.status || "ACTIVE",
      }}
      onSubmit={async (values) => {
        const loadingToast = toast.loading("Updating...");
        try {
          await mutateAsync({
            workspace_id,
            payload: {
                status: values.status,
              },
          });

          toast.success("Workspace Status Updated Successfully", {
            id: loadingToast,
          });
        } catch (error) {
          console.error("Error updating status:", error);
          toast.error("Failed to update workspace status", {
            id: loadingToast,
          });
        }
      }}
      enableReinitialize
    >
      {({ values, setFieldValue }) => (
        <Form className="flex h-full flex-col justify-between overflow-y-auto bg-scroll">
          <div className="flex justify-between items-center">
            <div className="pl-3">
              <Listbox
                options={ACCOUNT_STATUS}
                buttonClassname="w-[150px]"
                selectedOption={ACCOUNT_STATUS.find(
                  (o) => o.value === values.status || ""
                )}
                onSelectData={(selected: any) => {
                  setFieldValue("status", selected.value);
                }}
                placeholder={isLoading ? "Loading..." : "Select Status" }
              />
            </div>
            <div className="flex items-center h-full w-[15%]">
              <Button type="submit" className="w-full">
                Update
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default WorkspaceStatusCard;
