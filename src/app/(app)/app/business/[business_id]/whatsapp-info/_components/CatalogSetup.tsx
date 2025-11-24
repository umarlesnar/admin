"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { useBusinessUpdateMutation } from "@/framework/business/business-update-mutation";
import { CirclePlay, Files } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {};

const CatalogSetup = (props: Props) => {
  const [catalogId, setCatalogId] = useState<string>();
  const { mutateAsync, isPending } = useBusinessUpdateMutation();

  const handleSubmit = async () => {
    const loadingToast = toast.loading("Loading...");
    try {
      await mutateAsync({
        "catalog_settings.catalog_id": catalogId,
      });
      toast.success("Catalog Id Updated Successfully", {
        id: loadingToast,
      });
    } catch (error) {
      console.log("error", error);

      toast.error("Fail to update catelog Id", {
        id: loadingToast,
      });
    }
  };

  const handleCopyLink = (partnerId: string) => {
    navigator.clipboard.writeText(partnerId).then(
      () => {
        toast.success("copied to clipboard!");
      },
      (err) => {
        toast.error("Failed to copy ");
      }
    );
  };

  return (
    <Card className="w-full flex-1 bg-transparent">
      <CardHeader className="space-y-3">
        <CardTitle className="text-text-primary">
          {`Effortless Product Integration with KWIC`}
        </CardTitle>
        <CardDescription className="font-normal text-text-secondary">
          {`Connect your product catalog seamlessly to WhatsApp and engage customers with ease. Follow these simple steps to set up your Facebook catalog with KWIC and start showcasing your products directly in conversations.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4">
        <div className="w-full space-y-4">
          <Text size="lg" weight="semibold" color="primary">
            Steps to Integrate
          </Text>

          <div className="w-full p-6 border border-border-teritary rounded-md space-y-3 bg-white">
            <div className="py-[2px] px-3 rounded-full bg-[#D1FAE5] w-fit">
              <Text size="xs" weight="medium" textColor="text-[#065F46]">
                Step-1
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <Text size="lg" weight="semibold">
                Grant catalog access to KWIC
              </Text>
              <Button
                variant="link"
                rightIcon={<PlusIcon className="w-5 h-5 pl-2" />}
              >
                Go to link
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Text textColor="text-[#000000]">Add KWIC</Text>
              <div className="flex items-center gap-1">
                <Text weight="semibold">2648388605223434</Text>
                <Files
                  className="w-5 h-5 text-icon-primary cursor-pointer"
                  onClick={() => {
                    handleCopyLink("2648388605223434");
                  }}
                />
              </div>
              <Text textColor="text-[#000000]">as catalog partner</Text>
            </div>
          </div>
          <div className="w-full p-6 border border-border-teritary rounded-md space-y-3 bg-white">
            <div className="py-[2px] px-3 rounded-full bg-[#D1FAE5] w-fit">
              <Text size="xs" weight="medium" textColor="text-[#065F46]">
                Step-2
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <Text size="lg" weight="semibold">
                Connect your catalog to your WhatsApp account
              </Text>
              <Button
                variant="link"
                rightIcon={<PlusIcon className="w-5 h-5 pl-2" />}
              >
                Go to link
              </Button>
            </div>
            <Button
              variant="link"
              leftIcon={<CirclePlay className="w-5 h-5" />}
              className="gap-2 px-0"
            >
              Watch Tutorial
            </Button>
          </div>
          <div className="w-full p-6 border border-border-teritary rounded-md space-y-3 bg-white">
            <div className="py-[2px] px-3 rounded-full bg-[#D1FAE5] w-fit">
              <Text size="xs" weight="medium" textColor="text-[#065F46]">
                Step-3
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <Text size="lg" weight="semibold">
                Enter Facebook catalog id
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter catalog id"
                  onChange={(e) => {
                    setCatalogId(e.target?.value);
                  }}
                  value={catalogId}
                />
              </div>
              <Button
                type="button"
                onClick={() => {
                  handleSubmit();
                }}
                disabled={isPending || !catalogId}
                loading={isPending}
              >
                Connect
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CatalogSetup;
