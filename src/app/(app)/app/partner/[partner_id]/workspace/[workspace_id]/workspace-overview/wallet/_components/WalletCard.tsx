"use client";
import { Button } from "@/components/ui/button";
import Text from "@/components/ui/text";
import { useParams } from "next/navigation";
import { useApplication } from "@/contexts/application/application.context";
import { useEffect } from "react";
import { useWalletQuery } from "@/framework/partner/workspace/wallet/get-wallet";
import WalletSheet from "./EditWalletSheet";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { WalletIcon } from "@/components/ui/icons/WalletIcon";
import { EditIcon } from "@/components/ui/icons/EditIcone";

const WalletCard = () => {
  const params = useParams();
  const { setUserParams } = useApplication();
  const workspace_id = Array.isArray(params?.workspace_id)
    ? params.workspace_id[0]
    : params?.workspace_id ?? "";

  const { data, isLoading } = useWalletQuery(workspace_id);

  useEffect(() => {
    if (data) {
      setUserParams({
        workspace: data,
      });
    }
  }, [data]);

  return (
    <div className="w-full space-y-2">
      <Text size="xl" weight="bold">
        Wallet
      </Text>
      <div className="lg:flex overflow-hidden gap-4 space-y-4 lg:space-y-0">
        {!isLoading ? (
          <div className="bg-white rounded-lg p-5 px-6 space-y-2 w-full  min-h-[100px]">
            <div className="flex justify-between">
              <Text size="lg" weight="semibold">
                Available Credits
              </Text>
              <WalletSheet>
                <Button leftIcon={<EditIcon className="w-4 h-4 mr-1" />}>
                  Edit
                </Button>
              </WalletSheet>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="space-y-1 flex items-center gap-2">
                  <div className="bg-violet-100 p-3 rounded-full">
                    <WalletIcon />
                  </div>
                  <Text
                    tag="p"
                    size="xl"
                    weight="bold"
                    textColor="text-icon-primary"
                    className=""
                  >
                    {data?.items?.[0]?.credit_balance || "---"}
                  </Text>
                </div>

                <div className="flex items-center gap-2 pt-3">
                  <Text
                    tag="p"
                    size="base"
                    weight="medium"
                    textColor="text-icon-primary"
                  >
                    Created on:
                  </Text>
                  <Text
                    tag="p"
                    size="base"
                    weight="regular"
                    textColor="text-icon-primary"
                    className=""
                  >
                    {data?.items?.[0]?.created_at
                      ? moment
                          .unix(data?.items?.[0]?.created_at)
                          .format("DD-MM-YYYY")
                      : "---"}
                  </Text>
                </div>
              </div>
              <div className="space-y-1">
                <Badge
                  className={
                    data?.items?.[0]?.is_active === true
                      ? "bg-green-200 text-green-500 hover:bg-green-200"
                      : data?.items?.[0]?.is_active === false
                      ? "bg-red-200"
                      : "bg-blue-200"
                  }
                >
                  {data?.items?.[0]?.is_active === true
                    ? "Active"
                    : data?.items?.[0]?.is_active === false
                    ? "Disabled"
                    : "---"}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[150px] flex gap-8 justify-between p-4 items-center w-full bg-neutral-40 rounded-xl animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default WalletCard;
