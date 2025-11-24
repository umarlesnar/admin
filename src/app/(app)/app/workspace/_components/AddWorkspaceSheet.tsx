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
import { useMemo, useState } from "react";
import { Formik, Form } from "formik";
import Text from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useWorkspaceMutation } from "@/framework/workspace/workspace-mutation";
import { useUsersApi } from "@/framework/iam/users/get-users";
import { toNamespacedPath } from "path";

const COUNTRY = [
  { name: "United States" },
  { name: "India" },
  { name: "Germany" },
];
const BILLING_COUNTRY = [{ name: "India" }, { name: "Germany" }];
const AddWorkspaceSheet = ({ children }: { children: React.ReactElement }) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync } = useWorkspaceMutation();
  const UserData: ReturnType<typeof useUsersApi> = useUsersApi({});

  const preventFocus = (event: Event) => event.preventDefault();

  const userOptions = useMemo(() => {
    if (!UserData?.data || !Array.isArray(UserData.data?.items)) return [];
    return UserData.data?.items.map((user: any) => ({
      name: user.username,
      value: user._id
    }));
  }, [UserData?.data]);

  const initialValues = {
    name: "",
    plan_name: "",
    country: "",
    user_id: "",
    billing_address: {
      email_id: "",
      billing_country: "",
      company_name: "",
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      zip_code: "",
    },
    status: "ACTIVE",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-lg"
        onOpenAutoFocus={preventFocus}
      >
        <DialogHeader className="flex justify-between mb-6">
          <div className="flex flex-row items-center justify-between ">
            <DialogTitle>Add Workspace</DialogTitle>
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
          onSubmit={async (values, { setErrors }) => {
            const loadingToast = toast.loading("Loading...");
            try {
              const response = await mutateAsync({
                method: "POST",
                payload: values,
              });
              toast.success(`Workspace Added Successfully`, {
                id: loadingToast,
              });

              setOpen(false);
            } catch (error: any) {
              console.log("error", error);

              toast.error(`Failed to Add Workspace`, {
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
          {({
            values,
            setFieldValue,
            handleSubmit,
            isSubmitting,
            handleChange,
          }) => (
            <Form className="space-y-3">
              <div>
                <Input
                  label="Name"
                  value={values.name}
                  name="name"
                  onChange={handleChange}
                  placeholder="Enter Name"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <Input
                  label="Plan Name"
                  value={values.plan_name}
                  name="plan_name"
                  onChange={handleChange}
                  placeholder="Enter Plan Name"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
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
                    return o.name === values.country;
                  })}
                  onSelectData={(country: any) => {
                    setFieldValue("country", country.name);
                  }}
                />
               
              </div>
              <div className="w-full space-y-1">
                <Text size="sm" tag="label" weight="medium">
                  User
                </Text>
                <Combobox
                  options={userOptions}
                  buttonClassname="w-full"
                  dropdownClassname="p-2"
                  placeholder={
                    UserData.isLoading ? "Loading users..." : "Select User"
                  }
                  selectedOption={
                    userOptions.find((o: any) => o.value === values.user_id) ||
                    null
                  }
                  onSelectData={(user: any) =>
                    setFieldValue("user_id", user.value)
                  }
                  disabled={UserData.isLoading}
                />
              </div>
              
              <div>
                <Text size="sm" tag="label" weight="medium">
                  Billing Address
                </Text>
              </div>
              <div className="border border-border-teritary rounded-md p-2 space-y-4">
                <div>
                  <Input
                    label="Email Address"
                    value={values.billing_address.email_id}
                    name="billing_address.email_id"
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="">
                  <Input
                    label="Company Name"
                    value={values.billing_address.company_name}
                    name="billing_address.company_name"
                    onChange={handleChange}
                    placeholder="Company Name (Optional)"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="w-full space-y-1">
                  <Text size="sm" tag="label" weight="medium">
                    Country
                  </Text>
                  <Combobox
                    options={BILLING_COUNTRY}
                    buttonClassname="w-full"
                    dropdownClassname={`p-2`}
                    placeholder={"Select country"}
                    selectedOption={BILLING_COUNTRY.find((o) => {
                      return o.name === values.billing_address.billing_country;
                    })}
                    onSelectData={(country: any) => {
                      setFieldValue(
                        "billing_address.billing_country",
                        country.name
                      );
                    }}
                  />
                </div>
                <Input
                  label="Address 1"
                  value={values.billing_address.address_1}
                  onChange={handleChange}
                  name="billing_address.address_1"
                  placeholder="Address Line 1"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <Input
                  label="Address 2"
                  value={values.billing_address.address_2}
                  name="billing_address.address_2"
                  onChange={handleChange}
                  placeholder="Address Line 2 (Optional)"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <Input
                  label="City"
                  value={values.billing_address.city}
                  placeholder="City"
                  onChange={handleChange}
                  name="billing_address.city"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <Input
                  label="State / Province / Region"
                  value={values.billing_address.state}
                  name="billing_address.state"
                  onChange={handleChange}
                  placeholder="State / Province / Region"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <Input
                  label="Zip Code"
                  value={values.billing_address.zip_code}
                  name="billing_address.zip_code"
                  onChange={handleChange}
                  placeholder="Zip Code"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <Text size="sm" weight="semibold" color="primary">
                  Status
                </Text>
                <RadioGroup
                  className="flex"
                  value={values.status}
                  onValueChange={(value) => setFieldValue("status", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="ACTIVE" value="ACTIVE" />
                    <Text size="sm" color="secondary">
                      Active
                    </Text>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="DISABLED" value="DISABLED" />
                    <Text size="sm" color="secondary">
                      Disabled
                    </Text>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex justify-between gap-3 pt-4">
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Add Workspace
                  </Button>
                </div>
                <DialogClose asChild>
                  <Button>Cancel</Button>
                </DialogClose>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkspaceSheet;
