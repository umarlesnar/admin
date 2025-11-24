"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import Text from "@/components/ui/text";
import { useBusinessByIdQuery } from "@/framework/business/get-business-by-id";
import { useWebhookUpdateMutation } from "@/framework/business/whatsapp/webhook-subscription/webhook-subscription-update-mutation";
import { useWebhookSubscriptionQuery } from "@/framework/webhook-subscription/get-webhook-subscription";
import { Formik } from "formik";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

const WebhookSubscriptionForm = () => {
  const params = useParams();
  const business_id = params.business_id;
  const queryClient = useQueryClient();
  const [queryFilter, setQueryFilter] = useState({ search: "" });

  const { data: webhookData, isLoading } = useWebhookSubscriptionQuery(queryFilter);
  const { mutateAsync } = useWebhookUpdateMutation();

  const { data: businessData } = useBusinessByIdQuery(business_id);

  const selectedWebhook = webhookData?.items.find(
    (webhook:any) =>
      webhook.url === businessData?.override_callback_uri &&
      webhook.token === businessData?.verify_token
  );

  return (
    <Formik
      initialValues={{
        override_callback_uri: businessData?.override_callback_uri || "",
        verify_token: businessData?.verify_token || "",
        webhook_subscription_id: selectedWebhook?._id || "",
      }}
      enableReinitialize
      onSubmit={async (values) => {
        const loadingToast = toast.loading("Updating webhook...");

        try {
          await mutateAsync({
            override_callback_uri: values.override_callback_uri,
            verify_token: values.verify_token,
          });
        //@ts-ignore
          await queryClient.invalidateQueries(["webhookSubscriptions"]); 

          toast.success("Webhook updated successfully!", { id: loadingToast });
        } catch (error) {
          console.error("Error updating webhook:", error);
          toast.error("Failed to update webhook", { id: loadingToast });
        }
      }}
    >
      {({ values, handleSubmit, setFieldValue }) => (
        <form className="p-6" onSubmit={handleSubmit}>
          <Text tag="h1" size="2xl" weight="medium" className="pb-6">
            Webhook Subscription
          </Text>
          <div className="space-y-3">
            <div className="w-full space-y-1 flex items-center gap-4">
              <Combobox
                options={
                  isLoading
                    ? []
                    : webhookData?.items.map((webhook:any) => ({
                        name: webhook.name,
                        value: webhook._id,
                        callback_uri: webhook.url,
                        token: webhook.token,
                      })) || []
                }
                placeholder={
                  isLoading
                    ? "Loading..."
                    : values.webhook_subscription_id
                    ? webhookData?.items.find(
                        (webhook: any) => webhook._id === values.webhook_subscription_id
                      )?.name || "Select webhook"
                    : "Select webhook"
                }
                onSelectData={(webhook:any) => {
                  setFieldValue("webhook_subscription_id", webhook.value);
                  setFieldValue("override_callback_uri", webhook.callback_uri || "");
                  setFieldValue("verify_token", webhook.token || "");
                }}
                //@ts-ignore
                onSearch={(searchText) => setQueryFilter({ search: searchText })}
                disabled={isLoading}
              />
              <div className="flex items-center pb-1">
              <Button type="submit">Update</Button>
            </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default WebhookSubscriptionForm;
