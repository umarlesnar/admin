import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CatalogIcon } from "@/components/ui/icons/CatalogIcon";
import { DotIcon } from "@/components/ui/icons/DotIcon";
import { RefreshIcon } from "@/components/ui/icons/RefreshIcon";
import { Switch } from "@/components/ui/switch";
import Text from "@/components/ui/text";
import { useApplication } from "@/contexts/application/application.context";
import React from "react";
import CatalogReconnectModal from "./CatalogReconnectModal";
import { useCartEnableMutation } from "@/framework/business/catalog/enable-cart-mutation";
import { useCatalogVisibleMutation } from "@/framework/business/catalog/catalog-visible-mutation";

type Props = {};

const CatalogDetails = (props: Props) => {
  const { business } = useApplication();
  const visible = useCatalogVisibleMutation();
  const cart = useCartEnableMutation();
  return (
    <Card className="w-full flex-1">
      <CardHeader className=" flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-text-primary text-lg font-semibold">{`Catalog`}</CardTitle>
          <CardDescription className="font-normal text-text-secondary">
            {`Manage your catalog`}
          </CardDescription>
        </div>
        <div>
          <CatalogReconnectModal>
            <Button
              variant="outline"
              size="sm"
              leftIcon={
                <RefreshIcon className="w-4 h-4 text-icon-primary mr-1" />
              }
              className="border border-primary"
            >
              Reconnect
            </Button>
          </CatalogReconnectModal>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4">
        <div className="w-full p-6 border border-border-teritary rounded-md space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CatalogIcon className="w-12 h-12 text-primary-500" />
              <div className="space-y-1">
                <Text size="xs">Catalog Id</Text>
                <Text size="base" weight="semibold">
                  {business?.catalog_settings?.catalog_id}
                </Text>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-neutral-20 px-3 py-1 rounded-full">
              <DotIcon className="text-green-500" />
              <Text weight="medium" textColor="text-[#1F2937]">
                Active
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Switch
              defaultChecked={business?.catalog_settings?.is_cart_enable}
              onCheckedChange={async (value) => {
                try {
                  await cart.mutateAsync({
                    is_cart_enable: value,
                  });
                } catch (error) {
                  console.log("error", error);
                }
              }}
            />
            <div className="space-y-1">
              <Text size="base" weight="semibold">
                Cart
              </Text>{" "}
              <Text size="sm" color="secondary">
                Enable customers to add products to a cart for a smoother
                shopping experience.
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Switch
              defaultChecked={business?.catalog_settings?.is_catalog_visible}
              onCheckedChange={async (value) => {
                try {
                  await visible.mutateAsync({
                    is_catalog_visible: value,
                  });
                } catch (error) {
                  console.log("error", error);
                }
              }}
            />
            <div className="space-y-1">
              <Text size="base" weight="semibold">
                Catalog Visibility
              </Text>{" "}
              <Text size="sm" color="secondary">
                Control whether your catalog is visible to customers on your
                Whatsapp account.
              </Text>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CatalogDetails;
