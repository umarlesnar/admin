"use client";
import { Button } from "@/components/ui/button";
import Text from "@/components/ui/text";
import BillingSheet from "./BillingSheet";
import { useParams } from "next/navigation";
import { useApplication } from "@/contexts/application/application.context";
import { useEffect } from "react";
import { useWorkspaceOverview } from "@/framework/partner/workspace/workspace-overview/get-workspace-overview";
import WorkspaceNtificationSheet from "./NotificationInfoSheet";

const Overview = () => {
  const params = useParams();
  const { setUserParams } = useApplication();
  const workspace_id = Array.isArray(params?.workspace_id)
    ? params.workspace_id[0]
    : params?.workspace_id ?? "";

  const { data, isLoading } = useWorkspaceOverview(workspace_id);

  useEffect(() => {
    if (data) {
      setUserParams({
        workspace: data,
      });
    }
  }, [data]);

  return (
    <div className="w-full bg-scroll h-full overflow-auto">
      <div className="flex  justify-between  w-full gap-4">
        <div className="flex flex-col gap-4">
          {!isLoading ? (
            <div className="bg-white rounded-lg p-5 px-6 space-y-4 w-[400px] min-h-[250px]">
              <div className="w-full flex items-center justify-between">
                <Text size="lg" weight="semibold">
                  Notification Info
                </Text>
                <WorkspaceNtificationSheet data={data?.[0]?.notification || {}}>
                  <Button size="sm">Update</Button>
                </WorkspaceNtificationSheet>
              </div>

              <div className="space-y-1">
                <Text
                  tag="p"
                  size="base"
                  weight="medium"
                  textColor="text-icon-primary"
                >
                  Notified Email
                </Text>
                <Text
                  tag="p"
                  size="base"
                  weight="regular"
                  textColor="text-icon-primary"
                  className="pt-2"
                >
                  {data?.[0]?.notification?.email_id ?? "---"}
                </Text>
              </div>
              <div className="space-y-1">
                <Text
                  tag="p"
                  size="base"
                  weight="medium"
                  textColor="text-icon-primary"
                >
                  Notified Phone
                </Text>
                <Text
                  tag="p"
                  size="base"
                  weight="regular"
                  textColor="text-icon-primary"
                  className="pt-2"
                >
                  {data?.[0]?.notification?.phone_number ?? "---"}
                </Text>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-40 rounded-xl animate-pulse w-[500px] min-h-[250px]"></div>
          )}
          {!isLoading ? (
            <div className="bg-white rounded-lg p-5 px-6 space-y-4 w-[400px]  min-h-[250px]">
              <div className="">
                <Text size="lg" weight="semibold">
                  Plan
                </Text>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-40 rounded-xl animate-pulse w-[500px] min-h-[250px]"></div>
          )}

          {!isLoading ? (
            <div className="bg-white rounded-lg p-5 px-6 space-y-4 w-[400px]  min-h-[250px]">
              <div className="">
                <Text size="lg" weight="semibold">
                  Limitation
                </Text>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-40 rounded-xl animate-pulse w-[500px] min-h-[250px]"></div>
          )}
        </div>

        {!isLoading ? (
          <div className="bg-white rounded-lg p-5 px-6 space-y-4 w-full ">
            <div className="flex justify-between">
              <Text size="lg" weight="semibold">
                Billing Info
              </Text>
              <BillingSheet billing_address={data?.[0]?.billing_address}>
                <Button size="sm">Update</Button>
              </BillingSheet>
            </div>
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <Text
                  tag="p"
                  size="base"
                  weight="medium"
                  textColor="text-icon-primary"
                >
                  Billing Email Address:
                </Text>
                <Text
                  tag="p"
                  size="base"
                  weight="regular"
                  textColor="text-icon-primary"
                  className="pt-2"
                >
                  {data?.[0]?.billing_address?.email_id ?? "---"}
                </Text>
              </div>
              <div className="space-y-1">
                <Text
                  tag="p"
                  size="base"
                  weight="medium"
                  textColor="text-icon-primary"
                >
                  Billing Phone Number:
                </Text>
                <Text
                  tag="p"
                  size="base"
                  weight="regular"
                  textColor="text-icon-primary"
                  className="pt-2"
                >
                  {data?.[0]?.billing_address?.phone_number ?? "---"}
                </Text>
              </div>
              <div className="space-y-1">
                <Text
                  tag="p"
                  size="base"
                  weight="medium"
                  textColor="text-icon-primary"
                >
                  Company Name:
                </Text>
                <Text
                  tag="p"
                  size="base"
                  weight="regular"
                  textColor="text-icon-primary"
                  className="pt-2"
                >
                  {data?.[0]?.billing_address?.company_name ?? "---"}
                </Text>
              </div>
              <div className="space-y-1">
                <Text
                  tag="p"
                  size="base"
                  weight="medium"
                  textColor="text-icon-primary"
                >
                  Country:
                </Text>
                <Text
                  tag="p"
                  size="base"
                  weight="regular"
                  textColor="text-icon-primary"
                  className="pt-2"
                >
                  {data?.[0]?.billing_address?.billing_country ?? "---"}
                </Text>
              </div>
              <div className="space-y-1">
                <Text
                  tag="p"
                  size="base"
                  weight="medium"
                  textColor="text-icon-primary"
                >
                  Address 1:
                </Text>
                <Text
                  tag="p"
                  size="base"
                  weight="regular"
                  textColor="text-icon-primary"
                  className="pt-2"
                >
                  {data?.[0]?.billing_address?.address_1 ?? "---"}
                </Text>
              </div>
              <div className="space-y-1">
                <Text
                  tag="p"
                  size="base"
                  weight="medium"
                  textColor="text-icon-primary"
                >
                  Address 2:
                </Text>
                <Text
                  tag="p"
                  size="base"
                  weight="regular"
                  textColor="text-icon-primary"
                  className="pt-2"
                >
                  {data?.[0]?.billing_address?.address_2 ?? "---"}
                </Text>
              </div>
              <div className="space-y-1">
                <Text
                  tag="p"
                  size="base"
                  weight="medium"
                  textColor="text-icon-primary"
                >
                  City:
                </Text>
                <Text
                  tag="p"
                  size="base"
                  weight="regular"
                  textColor="text-icon-primary"
                  className="pt-2"
                >
                  {data?.[0]?.billing_address?.city ?? "---"}
                </Text>
              </div>
              <div className="space-y-1">
                <Text
                  tag="p"
                  size="base"
                  weight="medium"
                  textColor="text-icon-primary"
                >
                  State:
                </Text>
                <Text
                  tag="p"
                  size="base"
                  weight="regular"
                  textColor="text-icon-primary"
                  className="pt-2"
                >
                  {data?.[0]?.billing_address?.state ?? "---"}
                </Text>
              </div>
              <div className="space-y-1">
                <Text
                  tag="p"
                  size="base"
                  weight="medium"
                  textColor="text-icon-primary"
                >
                  Zip:
                </Text>
                <Text
                  tag="p"
                  size="base"
                  weight="regular"
                  textColor="text-icon-primary"
                  className="pt-2"
                >
                  {data?.[0]?.billing_address?.zip_code ?? "---"}
                </Text>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[450px] flex gap-8 justify-between p-4 items-center w-full bg-neutral-40 rounded-xl animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default Overview;
