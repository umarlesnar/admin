"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import { useState } from "react";
import { Formik, Form } from "formik";
import Text from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { usePWorkspaceStatusUpdateMutation } from "@/framework/partner/workspace/workspace_id/workspace-by-id-mutation";
import { timezones } from "@/constants/timezone";

const INDUSTRIES = [
  { value: "BEAUTY", name: "Beauty,spa and salon" },
  { value: "APPAREL", name: "Clothing" },
  { value: "EDU", name: "Education" },
  { value: "ENTERTAIN", name: "Entertainment" },
  { value: "EVENT_PLAN", name: "Event planning and service" },
  { value: "FINANCE", name: "Finance and banking" },
  { value: "GROCERY", name: "Food and groceries" },
  { value: "GOVT", name: "Public service" },
  { value: "HOTEL", name: "Hotel and lodging" },
  { value: "HEALTH", name: "Medical and health" },
  { value: "NONPROFIT", name: "Charity" },
  { value: "PROF_SERVICES", name: "Professional services" },
  { value: "RETAIL", name: "Shopping and retail" },
  { value: "TRAVEL", name: "Travel and transportation" },
  { value: "RESTAURANT", name: "Restaurant" },
  { value: "NOT_A_BIZ", name: "Not a business" },
  { value: "OTHER", name: "Other" },
];

const COUNTRIES = [
  { value: "IN", name: "India", code: "IN", phone: "91" },
  { value: "US", name: "United States", code: "US", phone: "1" },
  { value: "GB", name: "United Kingdom", code: "GB", phone: "44" },
  { value: "CA", name: "Canada", code: "CA", phone: "1" },
  { value: "AU", name: "Australia", code: "AU", phone: "61" },
  { value: "DE", name: "Germany", code: "DE", phone: "49" },
  { value: "FR", name: "France", code: "FR", phone: "33" },
  { value: "SG", name: "Singapore", code: "SG", phone: "65" },
  { value: "ITU", name: "United Arab Emirates", code: "ITU", phone: "971" },
];

const CURRENCIES = [
  { value: "USD", name: "USD" },
  { value: "EUR", name: "EUR" },
  { value: "GBP", name: "GBP" },
  { value: "INR", name: "INR" },
  { value: "CAD", name: "CAD" },
  { value: "AUD", name: "AUD" },
  { value: "AED", name: "AED" },
];

const INDIAN_STATES = [
  { value: "MH", name: "Maharashtra" },
  { value: "KA", name: "Karnataka" },
  { value: "TN", name: "Tamil Nadu" },
  { value: "GJ", name: "Gujarat" },
  { value: "RJ", name: "Rajasthan" },
  { value: "UP", name: "Uttar Pradesh" },
];

const MARKETING_SOURCES = [
  { value: "ORGANIC_SEARCH", name: "Organic Search" },
  { value: "PAID_SEARCH", name: "Paid Search" },
  { value: "SOCIAL_MEDIA", name: "Social Media" },
  { value: "EMAIL_MARKETING", name: "Email Marketing" },
  { value: "REFERRAL", name: "Referral" },
  { value: "DIRECT", name: "Direct Traffic" },
  { value: "OTHER", name: "Other" },
];

const CUSTOMER_TIERS = [
  { value: "ENTERPRISE", name: "Enterprise" },
  { value: "PREMIUM", name: "Premium" },
  { value: "STANDARD", name: "Standard" },
  { value: "BASIC", name: "Basic" },
];

const SUPPORT_LEVELS = [
  { value: "DEDICATED_RM", name: "Dedicated RM" },
  { value: "SHARED_RM", name: "Shared RM" },
  { value: "CUSTOMER_SUCCESS", name: "Customer Success" },
  { value: "STANDARD_SUPPORT", name: "Standard Support" },
];

const RELATIONSHIP_MANAGERS = [
  { value: "rm_001", name: "Subramani Krishnan" },
  { value: "rm_002", name: "Vimal Kumar" },
  { value: "rm_003", name: "Imthiyaz" },
  { value: "rm_004", name: "Abubakar" },
];

interface UpdateWorkspaceSheetProps {
  children: React.ReactElement;
  workspace: any;
  onUpdate?: () => void;
}

const UpdateWorkspaceSheet = ({
  children,
  workspace,
  onUpdate,
}: UpdateWorkspaceSheetProps) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync } = usePWorkspaceStatusUpdateMutation();

  const preventFocus = (event: Event) => event.preventDefault();

  const initialValues = {
    name: workspace?.name || "",
    industry: workspace?.industry || "",
    country: workspace?.country || "",
    phone_code: workspace?.phone_code || "",
    currency: workspace?.currency || "",
    country_state: workspace?.country_state || "",
    timezone: workspace?.timezone || "",
    acquisition_source: workspace?.acquisition_source || "",
    utm_campaign: workspace?.utm_campaign || "",
    referral_code: workspace?.referral_code || "",
    customer_tier: workspace?.customer_tier || "STANDARD",
    support_level: workspace?.support_level || "STANDARD_SUPPORT",
    relationship_manager_id: workspace?.relationship_manager_id || "",
    support_channels: workspace?.support_channels || {
      email: true,
      phone: false,
      whatsapp: false,
      chat: true,
    },
    response_sla_hours: workspace?.response_sla_hours || 24,
    priority_level: workspace?.priority_level || "NORMAL",
    notification: {
      email_id: workspace?.notification?.email_id || "",
      phone_number: workspace?.notification?.phone_number || "",
    },
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-lg"
        onOpenAutoFocus={preventFocus}
      >
        <DialogHeader className="flex justify-between mb-6">
          <div className="flex flex-row items-center justify-between">
            <DialogTitle>Update Workspace</DialogTitle>
            <CloseIcon
              className="w-4 h-4 text-icon-primary cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </div>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setErrors }) => {
            const loadingToast = toast.loading("Updating workspace...");

            const cleanPayload = (values: any) => {
              const cleaned: any = {};

              Object.entries(values).forEach(([key, value]) => {
                if (value === null || value === undefined) {
                  return;
                }

                if (
                  typeof value === "object" &&
                  !Array.isArray(value) &&
                  value !== null
                ) {
                  const cleanedNested: any = {};
                  let hasNestedValues = false;

                  Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                    if (
                      key === "notification" &&
                      nestedKey === "phone_number"
                    ) {
                      if (
                        nestedValue &&
                        nestedValue.replace(/[^\d]/g, "").length >
                          values.phone_code.length
                      ) {
                        cleanedNested[nestedKey] = nestedValue;
                        hasNestedValues = true;
                      } else {
                        cleanedNested[nestedKey] = "";
                        hasNestedValues = true;
                      }
                      return;
                    }

                    if (
                      typeof nestedValue === "string" &&
                      nestedValue.trim() === ""
                    ) {
                      return;
                    }
                    if (nestedValue !== null && nestedValue !== undefined) {
                      cleanedNested[nestedKey] = nestedValue;
                      hasNestedValues = true;
                    }
                  });

                  if (
                    hasNestedValues &&
                    Object.keys(cleanedNested).length > 0
                  ) {
                    cleaned[key] = cleanedNested;
                  }
                  return;
                }

                if (typeof value === "string" && value.trim() === "") {
                  return;
                }

                cleaned[key] = value;
              });

              return cleaned;
            };
            // In onSubmit:
            const cleanedValues = cleanPayload(values);

            try {
              await mutateAsync({
                method: "PUT",
                payload: cleanedValues,
                workspace_id: workspace._id,
              });
              toast.success("Workspace updated successfully", {
                id: loadingToast,
              });
              setOpen(false);
              onUpdate?.();
            } catch (error: any) {
              toast.error("Failed to update workspace", {
                id: loadingToast,
              });
              if (
                error.response?.status ===
                SERVER_STATUS_CODE.VALIDATION_ERROR_CODE
              ) {
                setErrors(error.response.data.data);
              }
            }
          }}
          enableReinitialize
        >
          {({
            values,
            setFieldValue,
            handleSubmit,
            isSubmitting,
            handleChange,
          }) => (
            <Form className="space-y-4">
              {/* Basic Information */}
              <div className="border-b pb-4">
                <Text size="sm" weight="semibold" className="mb-3">
                  Basic Information
                </Text>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Name"
                    value={values.name}
                    name="name"
                    onChange={handleChange}
                    placeholder="Enter Name"
                  />
                  <div className="w-full space-y-1">
                    <Text size="sm" tag="label" weight="medium">
                      Industry
                    </Text>
                    <Combobox
                      options={INDUSTRIES}
                      buttonClassname="w-full"
                      placeholder="Select industry"
                      selectedOption={INDUSTRIES.find(
                        (o) => o.value === values.industry
                      )}
                      onSelectData={(industry: any) =>
                        setFieldValue("industry", industry.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Location & Settings */}
              <div className="border-b pb-4">
                <Text size="sm" weight="semibold" className="mb-3">
                  Location & Settings
                </Text>
                <div className="grid grid-cols-3 gap-3">
                  <div className="w-full space-y-1">
                    <Text size="sm" tag="label" weight="medium">
                      Country
                    </Text>
                    <Combobox
                      options={COUNTRIES}
                      buttonClassname="w-full"
                      placeholder="Select country"
                      selectedOption={COUNTRIES.find(
                        (o) => o.value === values.country
                      )}
                      onSelectData={(country: any) => {
                        const oldCountryCode = values.phone_code;
                        const newCountryCode = country.phone;

                        setFieldValue("country", country.value);
                        setFieldValue("phone_code", newCountryCode);

                        // Update phone number with new country code if it exists
                        if (values.notification.phone_number) {
                          // Remove old country code and add new one
                          const phoneDigits =
                            values.notification.phone_number.replace(
                              new RegExp(`^${oldCountryCode}`),
                              ""
                            );
                          setFieldValue(
                            "notification.phone_number",
                            `${newCountryCode}${phoneDigits}`
                          );
                        }

                        if (country.value !== "IN") {
                          setFieldValue("country_state", "");
                        }
                      }}
                    />
                  </div>
                  <Input
                    label="Phone Code"
                    value={values.phone_code}
                    name="phone_code"
                    disabled
                    placeholder="Auto-filled"
                  />
                  <div className="w-full space-y-1">
                    <Text size="sm" tag="label" weight="medium">
                      Currency
                    </Text>
                    <Combobox
                      options={CURRENCIES}
                      buttonClassname="w-full"
                      placeholder="Select currency"
                      selectedOption={CURRENCIES.find(
                        (o) => o.value === values.currency
                      )}
                      onSelectData={(currency: any) =>
                        setFieldValue("currency", currency.value)
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="w-full space-y-1">
                    <Text size="sm" tag="label" weight="medium">
                      State
                    </Text>
                    {values.country === "IN" ? (
                      <Combobox
                        options={INDIAN_STATES}
                        buttonClassname="w-full"
                        placeholder="Select state"
                        selectedOption={INDIAN_STATES.find(
                          (o) => o.value === values.country_state
                        )}
                        onSelectData={(state: any) =>
                          setFieldValue("country_state", state.value)
                        }
                      />
                    ) : (
                      <Input
                        value={values.country_state}
                        name="country_state"
                        onChange={handleChange}
                        placeholder="Enter state"
                      />
                    )}
                  </div>
                  <div className="w-full space-y-1">
                    <Text size="sm" tag="label" weight="medium">
                      Timezone
                    </Text>
                    <Combobox
                      options={timezones.map((tz) => ({
                        name: tz.display_with_offset,
                        value: tz.name,
                      }))}
                      buttonClassname="w-full"
                      placeholder="Select timezone"
                      selectedOption={
                        timezones.find((tz) => tz.name === values.timezone)
                          ? {
                              name: timezones.find(
                                (tz) => tz.name === values.timezone
                              )?.display_with_offset,
                              value: values.timezone,
                            }
                          : null
                      }
                      onSelectData={(timezone: any) =>
                        setFieldValue("timezone", timezone.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Marketing Information */}
              <div className="border-b pb-4">
                <Text size="sm" weight="semibold" className="mb-3">
                  Marketing Information
                </Text>
                <div className="grid grid-cols-3 gap-3">
                  <div className="w-full space-y-1">
                    <Text size="sm" tag="label" weight="medium">
                      Acquisition Source
                    </Text>
                    <Combobox
                      options={MARKETING_SOURCES}
                      buttonClassname="w-full"
                      placeholder="How did they find us?"
                      selectedOption={MARKETING_SOURCES.find(
                        (o) => o.value === values.acquisition_source
                      )}
                      onSelectData={(source: any) =>
                        setFieldValue("acquisition_source", source.value)
                      }
                    />
                  </div>
                  <Input
                    label="Campaign/UTM Source"
                    value={values.utm_campaign}
                    name="utm_campaign"
                    onChange={handleChange}
                    placeholder="Campaign name"
                  />
                  <Input
                    label="Referral Code"
                    value={values.referral_code}
                    name="referral_code"
                    onChange={handleChange}
                    placeholder="Referral code"
                  />
                </div>
              </div>

              {/* Customer Management */}
              <div className="border-b pb-4">
                <Text size="sm" weight="semibold" className="mb-3">
                  Customer Management
                </Text>
                <div className="grid grid-cols-3 gap-3">
                  <div className="w-full space-y-1">
                    <Text size="sm" tag="label" weight="medium">
                      Customer Tier
                    </Text>
                    <Combobox
                      options={CUSTOMER_TIERS}
                      buttonClassname="w-full"
                      placeholder="Select tier"
                      selectedOption={CUSTOMER_TIERS.find(
                        (o) => o.value === values.customer_tier
                      )}
                      onSelectData={(tier: any) => {
                        setFieldValue("customer_tier", tier.value);
                        const supportLevel =
                          tier.value === "ENTERPRISE"
                            ? "DEDICATED_RM"
                            : tier.value === "PREMIUM"
                            ? "SHARED_RM"
                            : tier.value === "STANDARD"
                            ? "CUSTOMER_SUCCESS"
                            : "STANDARD_SUPPORT";
                        setFieldValue("support_level", supportLevel);
                      }}
                    />
                  </div>
                  <div className="w-full space-y-1">
                    <Text size="sm" tag="label" weight="medium">
                      Support Level
                    </Text>
                    <Combobox
                      options={SUPPORT_LEVELS}
                      buttonClassname="w-full"
                      placeholder="Select support level"
                      selectedOption={SUPPORT_LEVELS.find(
                        (o) => o.value === values.support_level
                      )}
                      onSelectData={(level: any) =>
                        setFieldValue("support_level", level.value)
                      }
                    />
                  </div>
                  {(values.support_level === "DEDICATED_RM" ||
                    values.support_level === "SHARED_RM") && (
                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Relationship Manager
                      </Text>
                      <Combobox
                        options={RELATIONSHIP_MANAGERS}
                        buttonClassname="w-full"
                        placeholder="Assign RM"
                        selectedOption={RELATIONSHIP_MANAGERS.find(
                          (o) => o.value === values.relationship_manager_id
                        )}
                        onSelectData={(rm: any) =>
                          setFieldValue("relationship_manager_id", rm.value)
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <Text
                      size="sm"
                      tag="label"
                      weight="medium"
                      className="mb-2"
                    >
                      Support Channels
                    </Text>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: "email", label: "Email" },
                        { key: "phone", label: "Phone" },
                        { key: "whatsapp", label: "WhatsApp" },
                        { key: "chat", label: "Live Chat" },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={key}
                            checked={values.support_channels[key]}
                            onChange={(e) =>
                              setFieldValue(
                                `support_channels.${key}`,
                                e.target.checked
                              )
                            }
                            className="rounded border-gray-300"
                          />
                          <Text size="sm" color="secondary">
                            {label}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Response SLA (Hours)"
                      type="number"
                      value={values.response_sla_hours}
                      name="response_sla_hours"
                      onChange={handleChange}
                      placeholder="24"
                    />
                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Priority Level
                      </Text>
                      <Combobox
                        options={[
                          { value: "LOW", name: "Low" },
                          { value: "NORMAL", name: "Normal" },
                          { value: "HIGH", name: "High" },
                          { value: "CRITICAL", name: "Critical" },
                        ]}
                        buttonClassname="w-full"
                        placeholder="Select priority"
                        selectedOption={{
                          value: values.priority_level,
                          name: values.priority_level,
                        }}
                        onSelectData={(priority: any) =>
                          setFieldValue("priority_level", priority.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-b pb-4">
                <Text size="sm" weight="semibold" className="mb-3">
                  Notification Settings
                </Text>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Notification Email"
                    value={values.notification.email_id}
                    name="notification.email_id"
                    onChange={handleChange}
                    placeholder="notifications@company.com"
                    type="email"
                  />
                  <Input
                    label="Notification Phone"
                    value={
                      values.notification.phone_number
                        ? values.notification.phone_number.replace(
                            new RegExp(`^${values.phone_code}`),
                            ""
                          )
                        : ""
                    }
                    name="notification.phone_number"
                    onChange={(e) => {
                      const phoneNumber = e.target.value.replace(/[^\d]/g, ""); // Remove non-digits

                      if (phoneNumber.trim() === "") {
                        setFieldValue("notification.phone_number", "");
                      } else {
                        setFieldValue(
                          "notification.phone_number",
                          `${values.phone_code}${phoneNumber}`
                        );
                      }
                    }}
                    placeholder="989878823"
                    type="tel"
                  />
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Update Workspace
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateWorkspaceSheet;
