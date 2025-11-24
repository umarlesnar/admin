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
import { useAddonQuery } from "@/framework/addon/get-addon";
import { useWorkspaceQuery } from "@/framework/workspace/get-workspace";
import { useWorkspaceAddonMutation } from "@/framework/workspace-addon/workspace-addon-mutation";
import { useWorkspaceAddonQuery } from "@/framework/workspace-addon/get-workspace-addon";
import { useWorkspaceByIdQuery } from "@/framework/workspace/get-workspace-by-id";
import { useParams, useSearchParams } from "next/navigation";
import { useApplication } from "@/contexts/application/application.context";

type Props = {
  children: ReactElement;
  data?: any;
};

const EditWorkspaceAddonSheet = ({ children, data }: Props) => {
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

  const { data: workspace } = useWorkspaceByIdQuery(workspace_id);
  const { data: workspaceData } = useWorkspaceQuery(queryPage);

  useEffect(() => {
    if (workspace) {
      setUserParams({
        business: workspace,
      });
    }
  }, [workspace]);

  const addonOptions = useMemo(() => {
    return (
      AddonData?.data?.items?.map((a: any) => ({
        name: a.name,
        value: a._id,
      })) || []
    );
  }, [AddonData?.data]);

  const { data: workspaceAddonData } =useWorkspaceAddonQuery({ workspace_addon_id: data?._id});

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  const initialFormValues = useMemo(() => {
    const item = workspaceAddonData?.items?.[0];

    return {
      workspace_id: item?.workspace_id?._id ?? "",
      addon_id: item?.addon_id?._id ?? "",
      custom_pricing: {
        price_per_month: item?.custom_pricing?.price_per_month ?? "",
        price_per_unit: item?.custom_pricing?.price_per_unit ?? 0,
      },
      activated_at: item?.activated_at ?? new Date(),
      usage: {
        units_used: item?.usage?.units_used ?? 0,
        limit_override: item?.usage?.limit_override ?? 0,
      },
      enabled: item?.enabled ?? true,
    };
  }, [workspaceAddonData]);

  return (
    <Sheet open={open} onOpenChange={(value) => setOpen(value)}>
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
            Update Addon
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
         
            <Formik
              initialValues={initialFormValues}
              enableReinitialize
              onSubmit={async (values, { setErrors, resetForm }) => {
                const loadingToast = toast.loading("Loading...");
                try {
                  await mutateAsync({
                    workspace_addon_id: data?._id,
                    method: "PUT",
                    payload: values,
                  });

                  toast.success(`Workspace Addon Updated Successfully`, {
                    id: loadingToast,
                  });
                  setOpen(false);
                } catch (error: any) {
                  toast.error(`Failed to Update Workspace Addon`, {
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
            >
              {({
                values,
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                resetForm,
              }) => (
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
                            .find(
                              (o: any) => o.value === values.workspace_id
                            ) || null
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

                    <div className="w-full space-y-1">
                      <Input
                        label="Usage"
                        name="usage.units_used"
                        placeholder="Enter usage"
                        onChange={handleChange}
                        value={values.usage.units_used}
                      />
                    </div>

                    <div className="w-full space-y-1">
                      <Input
                        name="custom_pricing.price_per_month"
                        label="Price Per Month"
                        placeholder="Enter a price per month"
                        onChange={handleChange}
                        value={values.custom_pricing.price_per_month}
                      />
                    </div>

                    <div className="space-y-2">
                      <Text size="sm" weight="semibold" color="primary">
                        Enable
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
                      Update Addon
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
              )}
            </Formik>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditWorkspaceAddonSheet;
