"use client";
import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Text from "@/components/ui/text";
import { useAddInvoiceMutation } from "@/framework/partner/billing-invoice/add-invoice-mutation";
import { usePartnerWorkspace } from "@/framework/partner/workspace/get-partner-workspace";
import { usePartnerProductQuery } from "@/framework/partner/get-partner-product";
import { ErrorMessage, Form, Formik } from "formik";
import React, { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { Combobox } from "@/components/ui/combobox";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import moment from "moment";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const validationSchema = Yup.object().shape({
  workspace_id: Yup.string().required("Workspace is required"),
  plan: Yup.string().required("Plan is required"),
  base_price: Yup.number().required("Base price is required"),
  invoice_number: Yup.string().optional(),
  paid_at: Yup.number().when("status", {
    is: "paid",
    then: (schema) => schema.required("Paid date is required when status is paid"),
    otherwise: (schema) => schema.optional(),
  }),
});

const AddInvoiceSheet = ({ isOpen, onClose }: Props) => {
  const { mutate: addInvoice, isPending } = useAddInvoiceMutation();
  const { data: workspaceData } = usePartnerWorkspace({
    per_page: 1000,
    page: 1,
    sort: {},
    filter: {},
  });

  const { data: productData } = usePartnerProductQuery({
    per_page: 1000,
    page: 1,
    sort: {},
    filter: {},
  });

  const workspaceOptions = (workspaceData?.items || []).map((ws: any) => ({
    value: ws._id,
    name: ws.name,
  }));

  const planOptions = (productData?.items || []).map((plan: any) => ({
    value: plan.name,
    name: plan.name,
  }));

  const typeOptions = [
    { value: "subscription", name: "Subscription" },
    { value: "free", name: "Free" },
    { value: "trial", name: "Trial" },
    { value: "standard", name: "Standard" },
    { value: "paug", name: "PAUG" },
    { value: "wallet", name: "Wallet" },
  ];

  const paymentMethodOptions = [
    { value: "online", name: "Online" },
    { value: "upi", name: "UPI" },
    { value: "Manual", name: "Manual" },
  ];

  const statusOptions = [
    { value: "paid", name: "Paid" },
    { value: "not paid", name: "Not Paid" },
  ];

  const handleSubmit = (values: any, { resetForm }: any) => {
    const loadingToast = toast.loading("Adding invoice...");
    addInvoice(values, {
      onSuccess: () => {
        toast.success("Invoice added successfully", { id: loadingToast });
        resetForm();
        onClose();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to add invoice", {
          id: loadingToast,
        });
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md h-screen flex flex-col p-5">
        <SheetHeader className="flex flex-row items-center gap-4">
          <SheetClose asChild>
            <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
          </SheetClose>
          <SheetTitle className="h-full text-text-primary text-xl font-semibold">
            Add Invoice
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              workspace_id: "",
              plan: "",
              type: "subscription",
              payment_method: "online",
              currency: "USD",
              total_price: "",
              total_tax: "",
              status: "not paid",
              quantity: "1",
              base_price: "",
              discount: "",
              invoice_number: "",
              paid_at: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, handleChange, isSubmitting, resetForm, setFieldValue }) => {
              const calculateTotalPrice = () => {
                const base = parseFloat(values.base_price) || 0;
                const tax = parseFloat(values.total_tax) || 0;
                const discount = parseFloat(values.discount) || 0;
                return Math.max(0, base + tax - discount);
              };

              React.useEffect(() => {
                setFieldValue("total_price", calculateTotalPrice());
              }, [values.base_price, values.total_tax, values.discount, setFieldValue]);

              return (
                <Form className="w-full h-full flex flex-col px-1 space-y-4 mt-4">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Workspace *
                      </Text>
                      <Combobox
                        options={workspaceOptions}
                        buttonClassname="w-full"
                        dropdownClassname="p-2"
                        placeholder="Select Workspace"
                        selectedOption={workspaceOptions.find(
                          (o) => o.value === values.workspace_id
                        )}
                        onSelectData={(option: any) => {
                          setFieldValue("workspace_id", option.value);
                        }}
                      />
                      <ErrorMessage
                        name="workspace_id"
                        component="p"
                        className="text-xs text-red-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Plan *
                      </Text>
                      <Combobox
                        options={planOptions}
                        buttonClassname="w-full"
                        dropdownClassname="p-2"
                        placeholder="Select Plan"
                        selectedOption={planOptions.find(
                          (o) => o.value === values.plan
                        )}
                        onSelectData={(option: any) => {
                          setFieldValue("plan", option.value);
                        }}
                      />
                      <ErrorMessage
                        name="plan"
                        component="p"
                        className="text-xs text-red-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Invoice Number
                      </Text>
                      <input
                        type="text"
                        name="invoice_number"
                        placeholder="Optional"
                        value={values.invoice_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Type
                      </Text>
                      <Combobox
                        options={typeOptions}
                        buttonClassname="w-full"
                        dropdownClassname="p-2"
                        placeholder="Select Type"
                        selectedOption={typeOptions.find(
                          (o) => o.value === values.type
                        )}
                        onSelectData={(option: any) => {
                          setFieldValue("type", option.value);
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Payment Method
                      </Text>
                      <Combobox
                        options={paymentMethodOptions}
                        buttonClassname="w-full"
                        dropdownClassname="p-2"
                        placeholder="Select Payment Method"
                        selectedOption={paymentMethodOptions.find(
                          (o) => o.value === values.payment_method
                        )}
                        onSelectData={(option: any) => {
                          setFieldValue("payment_method", option.value);
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Currency
                      </Text>
                      <input
                        type="text"
                        name="currency"
                        placeholder="e.g., USD, INR"
                        value={values.currency}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Text size="sm" tag="label" weight="medium">
                          Base Price *
                        </Text>
                        <input
                          type="number"
                          name="base_price"
                          step="0.01"
                          placeholder="0.00"
                          value={values.base_price}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <ErrorMessage
                          name="base_price"
                          component="p"
                          className="text-xs text-red-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <Text size="sm" tag="label" weight="medium">
                          Discount
                        </Text>
                        <input
                          type="number"
                          name="discount"
                          step="0.01"
                          placeholder="0.00"
                          value={values.discount}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Text size="sm" tag="label" weight="medium">
                          Tax
                        </Text>
                        <input
                          type="number"
                          name="total_tax"
                          step="0.01"
                          placeholder="0.00"
                          value={values.total_tax}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <Text size="sm" tag="label" weight="medium">
                          Total Price (Auto-calculated)
                        </Text>
                        <input
                          type="number"
                          name="total_price"
                          step="0.01"
                          value={values.total_price}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Quantity
                      </Text>
                      <input
                        type="number"
                        name="quantity"
                        placeholder="1"
                        value={values.quantity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Status
                      </Text>
                      <Combobox
                        options={statusOptions}
                        buttonClassname="w-full"
                        dropdownClassname="p-2"
                        placeholder="Select Status"
                        selectedOption={statusOptions.find(
                          (o) => o.value === values.status
                        )}
                        onSelectData={(option: any) => {
                          setFieldValue("status", option.value);
                        }}
                      />
                    </div>

                    {values.status === "paid" && (
                      <div className="space-y-2">
                        <div>
                          <DatePicker
                            label="Paid Date"
                            isRequired
                            selected={values.paid_at ? Math.floor(Number(values.paid_at) / 1000) : undefined}
                            onSelected={(date: Date) => {
                              const timestamp = Math.floor(date.getTime() / 1000);
                              setFieldValue("paid_at", timestamp * 1000);
                            }}
                            placeholder="Select date"
                          />
                        </div>
                        <div>
                          <Text size="sm" tag="label" weight="medium">
                            Paid Time
                          </Text>
                          <TimePicker
                            value={values.paid_at ? moment.unix(Math.floor(Number(values.paid_at) / 1000)).format("HH:mm") : ""}
                            onChange={(date: any) => {
                              if (date && date[0]) {
                                const time = moment(date[0]).format("HH:mm");
                                const existingDate = values.paid_at ? moment.unix(Math.floor(Number(values.paid_at) / 1000)) : moment();
                                const newDateTime = existingDate.format("YYYY-MM-DD") + " " + time;
                                const timestamp = Math.floor(moment(newDateTime, "YYYY-MM-DD HH:mm").toDate().getTime() / 1000);
                                setFieldValue("paid_at", timestamp * 1000);
                              }
                            }}
                            disabled={!values.paid_at}
                          />
                        </div>
                        <ErrorMessage
                          name="paid_at"
                          component="p"
                          className="text-xs text-red-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pb-1 pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add Invoice"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        onClose();
                        resetForm();
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

export default AddInvoiceSheet;
