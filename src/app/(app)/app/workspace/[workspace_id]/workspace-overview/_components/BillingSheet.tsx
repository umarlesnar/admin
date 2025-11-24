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
import * as Yup from "yup";
import Text from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { useWorkspaceOverviewMutation } from "@/framework/workspace/workspace-overview/workspace-overview-mutation";
import { toast } from "sonner";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useWorkspaceQuery } from "@/framework/workspace/get-workspace";
import { useWorkspaceOverviewQuery } from "@/framework/workspace/workspace-overview/get-workspace-overview";
import { useParams } from "next/navigation";
import { useApplication } from "@/contexts/application/application.context";

const COUNTRY = [
  { name: "United States" },
  { name: "India" },
  { name: "Germany" },
];
const BillingSheet = ({ children }: { children: React.ReactElement}) => {
  const [open, setOpen] = useState(false);
   const params = useParams();
    const { setUserParams } = useApplication();
    const workspace_id = Array.isArray(params?.workspace_id)
      ? params.workspace_id[0]
      : params?.workspace_id ?? "";
  const preventFocus = (event: Event) => event.preventDefault();
  const { mutateAsync } = useWorkspaceOverviewMutation();

    const { data, isLoading } = useWorkspaceOverviewQuery(workspace_id);
    const workspaceData = Array.isArray(data) ? data[0] : data;

  const initialValues = {
    billing_address:{
      email_id: workspaceData?.billing_address?.email_id ?? "",
      billing_country: workspaceData?.billing_address?.billing_country ?? "",
      company_name: workspaceData?.billing_address?.company_name ?? "",
      address_1: workspaceData?.billing_address?.address_1 ?? "",
      address_2: workspaceData?.billing_address?.address_2 ?? "",
      city: workspaceData?.billing_address?.city ?? "",
      state: workspaceData?.billing_address?.state ?? "",
      zip_code: workspaceData?.billing_address?.zip_code ?? "",
    },
    billingOnly: false,
  };

  //   const validationSchema = Yup.object({
  //     email: Yup.string().email("Invalid email").required("Required"),
  //     address1: Yup.string().required("Required"),
  //     city: Yup.string().required("Required"),
  //     state: Yup.string().required("Required"),
  //     zip: Yup.string().required("Required"),
  //   });


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-lg"
        onOpenAutoFocus={preventFocus}
      >
        <DialogHeader className="flex justify-between mb-6">
          <div className="flex flex-row items-center justify-between ">
            <DialogTitle>Edit Billing Profile</DialogTitle>
            <CloseIcon
              className="w-4 h-4 text-icon-primary cursor-pointer"
              onClick={() => {
                setOpen(false);
              }}
            />
          </div>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          //   validationSchema={validationSchema}
          // onSubmit={(values)=>console.log("values",values)}
          onSubmit={async (values, { setErrors, resetForm }) => {
            const loadingToast = toast.loading("Loading...");
            try {
              await mutateAsync({
                workspace_id: workspace_id,
                method: "PUT",
                payload: values,
              });
              toast.success(`Workspace Overview Update Successfully`, {
                id: loadingToast,
              });

              setOpen(false);
            } catch (error: any) {
              console.log("error", error);

              toast.error(`Failed to Update Workspace Overview`, {
                id: loadingToast,
              });

              if (error.response) {
                if (
                  error.response.status ===
                  SERVER_STATUS_CODE.VALIDATION_ERROR_CODE
                ) {
                  setErrors(error.response.data.data);
                } else {
                }
              } else {
              }
            }
          }}
          enableReinitialize
        >
          {({ values, setFieldValue, handleSubmit, isSubmitting, handleChange}) => (
            <Form className="space-y-6">
              <div>
                <Input
                  label="Billing Email Address"
                  value={values.billing_address?.email_id}
                  name="billing_address.email_id"
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  name="billingOnly"
                  id="billingOnly"
                  className="mt-1"
                  onChange={handleChange}
                />
                <div>
                  <Text size="sm" weight="semibold">
                    Only send invoice emails to the Billing Email Address
                  </Text>
                  <Text size="sm" weight="regular">
                    If unchecked, MongoDB will send invoice emails to
                    Organization Owners and Billing Admins.
                  </Text>
                </div>
              </div>

              <div>
                <div className="space-y-3">
                  <Input
                    label="Invoice Address"
                    value={values.billing_address?.company_name}
                    name="billing_address.company_name"
                    onChange={handleChange}
                    placeholder="Company Name (Optional)"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <div className="w-full space-y-1">
                    <Text size="sm" tag="label" weight="medium">
                      Country
                    </Text>
                    <Combobox
                      options={COUNTRY}
                      buttonClassname="w-full"
                      dropdownClassname={`p-2`}
                      placeholder={"Select country"}
                      selectedOption={COUNTRY.find((o) => {
                        return o.name === values.billing_address?.billing_country;
                      })}
                      onSelectData={(country: any) => {
                        setFieldValue("billing_address.billing_country", country.name);
                      }}
                    />
                  </div>
                  <Input
                    label="Address 1"
                    value={values.billing_address?.address_1}
                    onChange={handleChange}
                    name="billing_address.address_1"
                    placeholder="Address Line 1"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <Input
                    label="Address 2"
                    value={values.billing_address?.address_2}
                    name="billing_address.address_2"
                    onChange={handleChange}
                    placeholder="Address Line 2 (Optional)"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <Input
                    label="City"
                    value={values.billing_address?.city}
                    placeholder="City"
                    onChange={handleChange}
                    name="billing_address.city"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <Input
                    label="State / Province / Region"
                    value={values.billing_address?.state}
                    name="billing_address.state"
                    onChange={handleChange}
                    placeholder="State / Province / Region"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <Input
                    label="Zip Code"
                    value={values.billing_address?.zip_code}
                    name="billing_address.zip_code"
                    onChange={handleChange}
                    placeholder="Zip Code"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
                <Button
                  type="button"
                  onClick={() => {
                    handleSubmit();
                  }}
                  disabled={isSubmitting}
                >
                  update
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default BillingSheet;
