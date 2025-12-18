import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Text from "@/components/ui/text";
import { Form, Formik } from "formik";
import React, { ReactElement, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { UiyupStaffSchema } from "@/validation-schema/ui/UiYupWorkspaceUserSchema";
import { useManageUserMutation } from "@/framework/partner/workspace/manage-user/manage-user-mutation";
import { Combobox } from "@/components/ui/combobox";

type Props = {
  children: ReactElement;
  data?: any;
};

const roles = [
  { id: "OWNER", name: "Owner" },
  { id: "ADMINISTRATOR", name: "Administrator" },
  { id: "TEMPLATE_MANAGER", name: "Template manager" },
  { id: "BROADCAST_MANAGER", name: "Broadcast manager" },
  { id: "CONTACT_MANAGER", name: "Contact Manager" },
  { id: "CHAT_MANAGER", name: "Chat Manager" },
  { id: "OPERATOR", name: "Operator" },
  { id: "AUTOMATION_MANAGER", name: "Automation Manager" },
];

const PERMISSION_TEMPLATE: any = {
  OWNER: {
    whatsapp_chat: true,
    manage_advance_wb_chat: false,
    whatsapp_operator_inbox: false,
    chatbot_trigger: false,
    instagram: true,
    web_chat: true,
    contact: true,
    broadcast: true,
    template: true,
    automation: true,
    ecommerce: true,
    ctwa: true,
    whatsapp_flow: true,
    integration: true,
    analytics: true,
    payments: true,
    channel_whatsapp_profile: true,
    channel_live_chat_profile: true,
    channel_instagram_profile: true,
    settings_general_kwic_agent: true,
    settings_general_operator: true,
    settings_general_wallet: true,
    settings_general_payment: true,
    settings_general_subscription: true,
    settings_general_developer: true,
    settings_general_attribute: true,
    settings_general_webhook: true,
    settings_general_tag: true,
    settings_general_billing: true,
  },
  ADMINISTRATOR: {
    whatsapp_chat: true,
    manage_advance_wb_chat: false,
    whatsapp_operator_inbox: false,
    chatbot_trigger: false,
    instagram: true,
    web_chat: true,
    contact: true,
    broadcast: true,
    template: true,
    automation: true,
    ecommerce: true,
    ctwa: true,
    whatsapp_flow: true,
    integration: true,
    analytics: true,
    payments: true,
    channel_whatsapp_profile: true,
    channel_live_chat_profile: true,
    channel_instagram_profile: true,
    settings_general_kwic_agent: true,
    settings_general_operator: true,
    settings_general_wallet: true,
    settings_general_payment: true,
    settings_general_subscription: true,
    settings_general_developer: true,
    settings_general_attribute: true,
    settings_general_webhook: true,
    settings_general_tag: true,
    settings_general_billing: true,
  },
  TEMPLATE_MANAGER: {
    whatsapp_chat: false,
    manage_advance_wb_chat: false,
    chatbot_trigger: false,
    whatsapp_operator_inbox: false,
    instagram: false,
    web_chat: false,
    contact: false,
    broadcast: false,
    template: true,
    automation: false,
    ecommerce: false,
    ctwa: false,
    whatsapp_flow: true,
    integration: false,
    analytics: false,
    payments: true,
    channel_whatsapp_profile: false,
    channel_live_chat_profile: false,
    channel_instagram_profile: false,
    settings_general_kwic_agent: false,
    settings_general_operator: false,
    settings_general_wallet: false,
    settings_general_payment: false,
    settings_general_subscription: false,
    settings_general_developer: false,
    settings_general_attribute: false,
    settings_general_webhook: false,
    settings_general_tag: false,
    settings_general_billing: false,
  },
  BROADCAST_MANAGER: {
    whatsapp_chat: false,
    manage_advance_wb_chat: false,
    whatsapp_operator_inbox: false,
    chatbot_trigger: false,
    instagram: false,
    web_chat: false,
    contact: true,
    broadcast: true,
    template: true,
    automation: false,
    ecommerce: false,
    ctwa: false,
    whatsapp_flow: true,
    integration: false,
    analytics: false,
    payments: true,
    channel_whatsapp_profile: false,
    channel_live_chat_profile: false,
    channel_instagram_profile: false,
    settings_general_kwic_agent: false,
    settings_general_operator: false,
    settings_general_wallet: false,
    settings_general_payment: false,
    settings_general_subscription: false,
    settings_general_developer: false,
    settings_general_attribute: false,
    settings_general_webhook: false,
    settings_general_tag: true,
    settings_general_billing: false,
  },
  CONTACT_MANAGER: {
    whatsapp_chat: false,
    manage_advance_wb_chat: false,
    whatsapp_operator_inbox: false,
    chatbot_trigger: false,
    instagram: false,
    web_chat: false,
    contact: true,
    broadcast: false,
    template: false,
    automation: false,
    ecommerce: false,
    ctwa: false,
    whatsapp_flow: false,
    integration: false,
    analytics: false,
    payments: true,
    channel_whatsapp_profile: false,
    channel_live_chat_profile: false,
    channel_instagram_profile: false,
    settings_general_kwic_agent: false,
    settings_general_operator: false,
    settings_general_wallet: false,
    settings_general_payment: false,
    settings_general_subscription: false,
    settings_general_developer: false,
    settings_general_attribute: true,
    settings_general_webhook: false,
    settings_general_tag: true,
    settings_general_billing: false,
  },
  CHAT_MANAGER: {
    whatsapp_chat: true,
    manage_advance_wb_chat: false,
    whatsapp_operator_inbox: false,
    chatbot_trigger: false,
    instagram: false,
    web_chat: true,
    contact: false,
    broadcast: false,
    template: false,
    automation: false,
    ecommerce: false,
    ctwa: false,
    whatsapp_flow: false,
    integration: false,
    analytics: false,
    payments: true,
    channel_whatsapp_profile: false,
    channel_live_chat_profile: false,
    channel_instagram_profile: false,
    settings_general_kwic_agent: false,
    settings_general_operator: false,
    settings_general_wallet: false,
    settings_general_payment: false,
    settings_general_subscription: false,
    settings_general_developer: false,
    settings_general_attribute: true,
    settings_general_webhook: false,
    settings_general_tag: true,
    settings_general_billing: false,
  },
  OPERATOR: {
    whatsapp_chat: true,
    manage_advance_wb_chat: false,
    whatsapp_operator_inbox: true,
    chatbot_trigger: false,
    instagram: false,
    web_chat: true,
    contact: false,
    broadcast: false,
    template: false,
    automation: false,
    ecommerce: false,
    ctwa: false,
    whatsapp_flow: false,
    integration: false,
    analytics: false,
    payments: true,
    channel_whatsapp_profile: false,
    channel_live_chat_profile: false,
    channel_instagram_profile: false,
    settings_general_kwic_agent: false,
    settings_general_operator: false,
    settings_general_wallet: false,
    settings_general_payment: false,
    settings_general_subscription: false,
    settings_general_developer: false,
    settings_general_attribute: false,
    settings_general_webhook: false,
    settings_general_tag: false,
    settings_general_billing: false,
  },
  AUTOMATION_MANAGER: {
    whatsapp_chat: true,
    manage_advance_wb_chat: false,
    whatsapp_operator_inbox: false,
    chatbot_trigger: false,
    instagram: false,
    web_chat: false,
    contact: false,
    broadcast: false,
    template: true,
    automation: true,
    ecommerce: false,
    ctwa: false,
    whatsapp_flow: true,
    integration: true,
    analytics: false,
    payments: true,
    channel_whatsapp_profile: false,
    channel_live_chat_profile: false,
    channel_instagram_profile: false,
    settings_general_kwic_agent: false,
    settings_general_operator: false,
    settings_general_wallet: false,
    settings_general_payment: false,
    settings_general_subscription: false,
    settings_general_developer: false,
    settings_general_attribute: false,
    settings_general_webhook: false,
    settings_general_tag: false,
    settings_general_billing: false,
  },
};

const permissionsKeys = [
  "whatsapp_chat",
  "manage_advance_wb_chat",
  "whatsapp_operator_inbox",
  "instagram",
  "web_chat",
  "contact",
  "broadcast",
  "template",
  "automation",
  "ecommerce",
  "ctwa",
  "whatsapp_flow",
  "integration",
  "analytics",
  "payments",
  "channel_whatsapp_profile",
  "channel_live_chat_profile",
  "channel_instagram_profile",
  "chatbot_trigger",
  "settings_general_kwic_agent",
  "settings_general_operator",
  "settings_general_wallet",
  "settings_general_payment",
  "settings_general_subscription",
  "settings_general_developer",
  "settings_general_attribute",
  "settings_general_webhook",
  "settings_general_tag",
  "settings_general_billing",
];

const EditManageUserSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = useManageUserMutation();

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="w-[400px] sm:w-[500px] h-screen flex flex-col p-5"
        onOpenAutoFocus={preventFocus}
      >
        <SheetHeader className="flex flex-row items-center gap-4">
          <SheetClose asChild>
            <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
          </SheetClose>
          <SheetTitle className="h-full text-text-primary text-xl font-semibold">
            Update Permission
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              role: data?.role || "",
              permissions: {
                whatsapp_chat: true,
                manage_advance_wb_chat: false,
                whatsapp_operator_inbox: false,
                instagram: true,
                web_chat: true,
                contact: true,
                broadcast: true,
                template: true,
                automation: true,
                ecommerce: true,
                ctwa: true,
                whatsapp_flow: true,
                integration: true,
                analytics: true,
                payments: true,
                channel_whatsapp_profile: true,
                channel_live_chat_profile: true,
                channel_instagram_profile: true,
                settings_general_kwic_agent: true,
                settings_general_operator: true,
                settings_general_wallet: true,
                settings_general_payment: true,
                settings_general_subscription: true,
                settings_general_developer: true,
                settings_general_attribute: true,
                settings_general_webhook: true,
                settings_general_tag: true,
                settings_general_billing: true,
                ...(data?.permissions || {}),
              },
              ...data,
            }}
            validationSchema={UiyupStaffSchema}
            onSubmit={async (values, { setErrors, resetForm }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                await mutateAsync({
                  manage_user_id: data?._id,
                  method: "PUT",
                  payload: {
                    ...values,
                    permission_template: values.role,
                  },
                });
                toast.success(`Permission Update Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Update Permission`, {
                  id: loadingToast,
                });

                if (error.response) {
                  if (
                    error.response.status ===
                    SERVER_STATUS_CODE.VALIDATION_ERROR_CODE
                  ) {
                    setErrors(error.response.data.data);
                  }
                }
              }
            }}
            enableReinitialize
          >
            {({
              values,
              errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              resetForm,
              isValid,
            }) => {
              return (
                <Form className="w-full h-full flex flex-col px-1">
                  <div className="flex-1 gap-4 space-y-5 pb-8">
                    <div className="space-y-4">
                      <Text size="sm" weight="semibold" color="primary">
                        Role
                      </Text>
                      <Combobox
                        options={roles}
                        buttonClassname="w-full"
                        dropdownClassname="p-2"
                        placeholder="Select Role"
                        selectedOption={roles.find((role: any) => {
                          return role.id === values.role;
                        })}
                        onSelectData={(role: any) => {
                          setFieldValue("role", role.id);
                          if (PERMISSION_TEMPLATE[role.id]) {
                            setFieldValue(
                              "permissions",
                              PERMISSION_TEMPLATE[role.id]
                            );
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-4">
                      <Text size="sm" weight="semibold" color="primary">
                        Permissions
                      </Text>

                      {permissionsKeys.map((key) => (
                        <div
                          key={key}
                          className="flex justify-between items-center"
                        >
                          <Text className="capitalize">
                            {key.replaceAll("_", " ")}
                          </Text>
                          <button
                            type="button"
                            className={`w-12 h-6 rounded-full flex items-center transition duration-300 ease-in-out ${
                              values.permissions[key]
                                ? "bg-primary"
                                : "bg-gray-300"
                            }`}
                            onClick={() =>
                              setFieldValue(
                                `permissions.${key}`,
                                !values.permissions[key]
                              )
                            }
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full shadow-md transform ${
                                values.permissions[key]
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              } transition duration-300 ease-in-out`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pb-1">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={!isValid || isSubmitting}
                    >
                      Update Permission
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setOpen(false);
                        resetForm({});
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditManageUserSheet;
