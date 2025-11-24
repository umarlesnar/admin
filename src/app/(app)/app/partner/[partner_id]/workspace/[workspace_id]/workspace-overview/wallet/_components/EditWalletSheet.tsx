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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useParams } from "next/navigation";
import { useApplication } from "@/contexts/application/application.context";
import { useWalletMutation } from "@/framework/partner/workspace/wallet/wallet-mutation";
import { useWalletQuery } from "@/framework/partner/workspace/wallet/get-wallet";
import { UiyupWalletSchema } from "@/validation-schema/ui/UiYupWalletSchema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Text from "@/components/ui/text";

const WalletSheet = ({ children }: { children: React.ReactElement }) => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const { setUserParams } = useApplication();
  const workspace_id = Array.isArray(params?.workspace_id)
    ? params.workspace_id[0]
    : params?.workspace_id ?? "";
  const preventFocus = (event: Event) => event.preventDefault();
  const { mutateAsync } = useWalletMutation();

  const { data, isLoading } = useWalletQuery(workspace_id);
  const WalletData = Array.isArray(data) ? data[0] : data;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-lg"
        onOpenAutoFocus={preventFocus}
      >
        <DialogHeader className="flex justify-between mb-6">
          <div className="flex flex-row items-center justify-between ">
            <DialogTitle>Edit Wallet</DialogTitle>
            <CloseIcon
              className="w-4 h-4 text-icon-primary cursor-pointer"
              onClick={() => {
                setOpen(false);
              }}
            />
          </div>
        </DialogHeader>

        <Formik
          initialValues={{
            credit_balance: WalletData?.items?.[0]?.credit_balance,
            wallet_type: "CREDIT",
          }}
          validationSchema={UiyupWalletSchema}
          onSubmit={async (values, { setErrors, resetForm }) => {
            const loadingToast = toast.loading("Loading...");
            try {
              await mutateAsync({
                wallet_id: WalletData?.items?.[0]?._id,
                method: "PUT",
                payload: values,
              });
              toast.success(`Wallet Update Successfully`, {
                id: loadingToast,
              });

              setOpen(false);
            } catch (error: any) {
              console.log("error", error);

              toast.error(`Failed to Update Wallet`, {
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
            <Form className="space-y-6">
              <div className="space-y-2">
                <Text size="sm" weight="semibold">
                  Wallet Type
                </Text>
                <RadioGroup
                  value={values.wallet_type}
                  onValueChange={(val) => setFieldValue("wallet_type", val)}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="CREDIT" />
                    <Text size="sm">Credit</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="DEBIT" />
                    <Text size="sm">Debit</Text>
                  </div>
                </RadioGroup>
              </div>

              <Input
                label="Credit Balance"
                value={values.credit_balance}
                name="credit_balance"
                onChange={handleChange}
                placeholder="Credit Balance"
              />
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

export default WalletSheet;
