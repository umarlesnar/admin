"use client";
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
import React, { ReactElement, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { useBusinessPoliciesMutation } from "@/framework/iam/policies/policy-by-id-mutation";
import { useBusinessAccountsQuery } from "@/framework/business/get-business-accounts";
import { useParams } from "next/navigation";
import { Combobox } from "@/components/ui/combobox";
import { useIamBusinessPoliciesMutation } from "@/framework/partner/iam/policies/policy-by-id-mutation";

type Props = {
  children: ReactElement;
  data?: any;
  refreshTable: () => void;
};

const AddBusinessPoliciesSheet = ({ children, data ,refreshTable }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = useIamBusinessPoliciesMutation();
  const params = useParams();
  const policy_id = params?.policy_id;
  const [queryFilter, setQueryFilter] = useState({ search: "" });

  const {
    data: businessData,
    isLoading,
  } = useBusinessAccountsQuery(queryFilter);

  return (
    <Sheet open={open} onOpenChange={(value) => {
      setOpen(value);
    }}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[500px] h-screen flex flex-col p-5">
        <SheetHeader className="flex flex-row items-center gap-4">
          <SheetClose asChild>
            <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
          </SheetClose>
          <SheetTitle className="h-full text-text-primary text-xl font-semibold">
            Add Attach Policy
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1">
          <Formik
            initialValues={{
              business_id: "",
              policy_id: policy_id || "",
            }}
           
            onSubmit={async (values, { setErrors }) => {
              const loadingToast = toast.loading("Loading...");
              try {
               const response= await mutateAsync({
                  policy_id: `${values.policy_id}`,
                  method: "POST",
                  payload: { business_id: values.business_id },
                });
                toast.success(`Attach Policy Added Successfully`, {
                  id: loadingToast,
                });
                refreshTable();
                setOpen(false);
              } catch (error: any) {
                toast.error(`Failed to Add Attach Policy`, {
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
            {({ values, errors, setFieldValue, isSubmitting, isValid }) => (
              <Form className="w-full h-full flex flex-col">
                <div className="flex-1  gap-4 space-y-5">
                  <div className="w-full space-y-1">
                    <Combobox
                      options={
                        isLoading
                          ? []
                          : businessData?.items.map((business: any) => ({
                              name: business.name,
                              value: business._id,
                            })) || []
                      }
                      placeholder={
                        isLoading ? "Loading Channels..." : "Select Channel"
                      }
                      selectedValue={values.business_id}
                      onSelectData={(business: any) =>
                        setFieldValue("business_id", business.value)
                      }
                      onSearch={(searchText: string) =>
                        setQueryFilter({ search: searchText })
                      }
                      disabled={isLoading}
                    
                    />
                    {errors.business_id && (
                      <p className="text-red-500 text-sm">
                        {errors.business_id}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Attach"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setOpen(false)}
                    disabled={isLoading}
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

export default AddBusinessPoliciesSheet;
