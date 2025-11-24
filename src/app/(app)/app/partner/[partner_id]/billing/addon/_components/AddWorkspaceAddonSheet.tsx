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
import { Form, Formik } from "formik";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { Combobox } from "@/components/ui/combobox";
import { useWorkspaceQuery } from "@/framework/workspace/get-workspace";
import { useAddonQuery } from "@/framework/addon/get-addon";
import { useWorkspaceAddonMutation } from "@/framework/workspace-addon/workspace-addon-mutation";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useSearchParams } from "next/navigation";
import { useApplication } from "@/contexts/application/application.context";
import { useWorkspaceByIdQuery } from "@/framework/workspace/get-workspace-by-id";

type Props = {
  children: ReactElement;
  data?: any;
};

const CATEGORY = [
  { value: "AI", name: "AI" },
  { value: "Storage", name: "Storage" },
  { value: "Integration", name: "Integration" },
  { value: "Workspace", name: "Workspace" },
];

const TYPE = [
  { value: "flat", name: "flat" },
  { value: "usage", name: "usage" },
  { value: "free", name: "free" },
];

const AddWorkspaceAddonSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = useWorkspaceAddonMutation();
  const AddonData = useAddonQuery({});
  const params = useParams();
  const searchParams = useSearchParams();

  const { setUserParams } = useApplication();
  const workspace_id = params?.workspace_id as string;
  const partner_id = params?.partner_id as string;

  const safeJSONParse = (jsonString: string | null, defaultValue: any) => {
    try {
      return jsonString ? JSON.parse(jsonString) : defaultValue;
    } catch (error) {
      console.error("JSON parse error:", error);
      return defaultValue;
    }
  };

  const [queryPage, setQueryPage] = useState(() => ({
    per_page: Number(searchParams.get("per_page") || "20"),
    page: Number(searchParams.get("page") || "1"),
    q: searchParams.get("q") || "",
    filter: safeJSONParse(searchParams.get("filter"), {
      status: "",
      partner_id,
    }),
    sort: safeJSONParse(searchParams.get("sort"), { created_at: "-1" }),
  }));

  const { data: workspace, isLoading } = useWorkspaceByIdQuery(workspace_id);
  const { data: workspaceData } = useWorkspaceQuery(queryPage);

  useEffect(() => {
    if (workspace) {
      setUserParams({
        business: workspace,
      });
    }
  }, [workspace]);

  const addonOptions = useMemo(() => {
    if (!AddonData?.data?.items) return [];
    return AddonData.data.items.map((item: any) => ({
      name: item.name,
      value: item._id,
    }));
  }, [AddonData?.data]);

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
            Addon Mapping
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              workspace_id: "",
              addon_id: "",
              name: "",
              code: "",
              description: "",
              category: "",
              billing_type: "",
              custom_pricing: {
                price_per_month: 0,
                price_per_unit: 0,
              },
              usage: {
                units_used: 0,
                limit_override: 0,
              },
              enabled: true,
            }}
            onSubmit={async (values, { setErrors }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                await mutateAsync({
                  method: "POST",
                  payload: values,
                });
                toast.success(`Workspace Addon Added Successfully`, {
                  id: loadingToast,
                });
                setOpen(false);
              } catch (error: any) {
                toast.error(`Failed to Add Workspace Addon`, {
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
              errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              resetForm,
            }) => {
              return (
                <Form className="w-full h-full flex flex-col px-1">
                  <div className="flex-1 gap-4 space-y-5">
                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Workspace
                      </Text>
                      <Combobox
                        options={
                          workspaceData?.items?.map((item: any) => ({
                            name: item.name,
                            value: item._id,
                          })) || []
                        }
                        buttonClassname="w-full"
                        dropdownClassname="p-2"
                        placeholder={
                          workspaceData?.isLoading
                            ? "Loading Workspaces..."
                            : "Select workspace"
                        }
                        selectedOption={
                          workspaceData?.items
                            ?.map((item: any) => ({
                              name: item.name,
                              value: item._id,
                            }))
                            .find((o:any) => o.value === values.workspace_id) ||
                          null
                        }
                        onSelectData={(workspace: any) =>
                          setFieldValue("workspace_id", workspace.value)
                        }
                        disabled={workspaceData?.isLoading}
                      />
                    </div>

                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Addon
                      </Text>
                      <Combobox
                        options={addonOptions}
                        buttonClassname="w-full"
                        dropdownClassname="p-2"
                        placeholder={
                          AddonData.isLoading
                            ? "Loading Addons..."
                            : "Select Addon"
                        }
                        selectedOption={
                          addonOptions.find(
                            (o: any) => o.value === values.addon_id
                          ) || null
                        }
                        onSelectData={(addon: any) => {
                          setFieldValue("addon_id", addon.value);

                          const selectedAddon = AddonData.data?.items.find(
                            (a: any) => a._id === addon.value
                          );

                          if (selectedAddon) {
                            setFieldValue("name", selectedAddon.name || "");
                            setFieldValue("code", selectedAddon.code || "");
                            setFieldValue(
                              "description",
                              selectedAddon.description || ""
                            );
                            setFieldValue(
                              "category",
                              selectedAddon.category || ""
                            );
                            setFieldValue(
                              "default_limit",
                              selectedAddon.default_limit || "5000"
                            );
                            setFieldValue(
                              "is_public",
                              selectedAddon.is_public || false
                            );
                          }
                        }}
                        disabled={AddonData.isLoading}
                      />
                    </div>

                    <Input
                      name="name"
                      label="Name"
                      isRequired
                      placeholder="Enter a name"
                      onChange={handleChange}
                      value={values.name}
                      errorKey={errors?.name}
                    />

                    <Input
                      name="code"
                      label="Code"
                      placeholder="Enter a code"
                      onChange={handleChange}
                      value={values.code}
                      errorKey={errors?.code}
                    />

                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Description
                      </Text>
                      <Textarea
                        name="description"
                        placeholder="Enter a description"
                        onChange={handleChange}
                        value={values.description}
                        errorKey={errors?.description}
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="w-full space-y-1">
                        <Text size="sm" tag="label" weight="medium">
                          Category
                        </Text>
                        <Combobox
                          options={CATEGORY}
                          buttonClassname="w-full"
                          dropdownClassname="p-2"
                          placeholder="Select Category"
                          selectedOption={CATEGORY.find(
                            (o) => o.name === values.category
                          )}
                          onSelectData={(category: any) =>
                            setFieldValue("category", category.name)
                          }
                        />
                      </div>

                      <div className="w-full space-y-1">
                        <Text size="sm" tag="label" weight="medium">
                          Billing Type
                        </Text>
                        <Combobox
                          options={TYPE}
                          buttonClassname="w-full"
                          dropdownClassname="p-2"
                          placeholder="Select Billing Type"
                          selectedOption={TYPE.find(
                            (o) => o.name === values.billing_type
                          )}
                          onSelectData={(type: any) =>
                            setFieldValue("billing_type", type.name)
                          }
                        />
                      </div>
                    </div>

                    <Input
                      name="custom_pricing.price_per_month"
                      label="Price Per Month"
                      type="number"
                      placeholder="Enter a price per month"
                      onChange={handleChange}
                      value={values.custom_pricing.price_per_month}
                      errorKey={errors?.custom_pricing?.price_per_month}
                    />

                    <Input
                      name="usage.units_used"
                      label="Units Used"
                      type="number"
                      placeholder="Enter a units used"
                      onChange={handleChange}
                      value={values.usage.units_used}
                      errorKey={errors?.usage?.units_used}
                    />

                    <div className="space-y-2">
                      <Text size="sm" weight="semibold" color="primary">
                        Addon Visibility
                      </Text>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          name="enabled"
                          checked={values.enabled}
                          onChange={(e) =>
                            setFieldValue("enabled", e.target.checked)
                          }
                        />
                        <span className="text-sm text-text-primary">
                          Make addon public
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pb-1 pt-4">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => handleSubmit()}
                      disabled={isSubmitting}
                    >
                      Addon Mapping
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

export default AddWorkspaceAddonSheet;
