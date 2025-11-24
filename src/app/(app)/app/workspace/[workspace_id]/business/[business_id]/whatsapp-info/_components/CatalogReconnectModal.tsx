import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import { Input } from "@/components/ui/input";
import { useApplication } from "@/contexts/application/application.context";
import { useBusinessUpdateMutation } from "@/framework/business/business-update-mutation";
import { Formik } from "formik";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  children: React.ReactNode;
};

const CatalogReconnectModal = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useBusinessUpdateMutation();
  const { business } = useApplication();
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[500px] h-auto flex flex-col overflow-hidden">
        <DialogHeader className="space-y-2">
          <div className="flex flex-row items-center justify-between">
            <DialogTitle>Connect Catalog</DialogTitle>
            <CloseIcon
              className="w-4 h-4 text-icon-primary cursor-pointer"
              onClick={() => {
                setOpen(false);
              }}
            />
          </div>
        </DialogHeader>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Formik
            initialValues={{
              catalog_id: business?.catalog_settings?.catalog_id || "",
            }}
            onSubmit={async (values) => {
              const loadingToast = toast.loading("Loading...");
              try {
                await mutateAsync({
                  "catalog_settings.catalog_id": values.catalog_id,
                });
                toast.success("Catalog Id Updated Successfully", {
                  id: loadingToast,
                });
                setOpen(false);
              } catch (error) {
                console.log("error", error);

                toast.error("Fail to update catelog Id", {
                  id: loadingToast,
                });
              }
            }}
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize
          >
            {({
              values,
              errors,
              handleChange,
              handleSubmit,
              setFieldValue,
            }: any) => (
              <>
                <div className="p-2">
                  <Input
                    label="Catalog Id"
                    name="catalog_id"
                    onChange={handleChange}
                    value={values?.catalog_id}
                    placeholder="Enter catalog id"
                  />
                  <div className="pt-10 flex justify-end">
                    <Button
                      type="button"
                      onClick={() => {
                        handleSubmit();
                      }}
                      className="w-[130px]"
                      disabled={isPending || !values?.catalog_id}
                      loading={isPending}
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Formik>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogReconnectModal;
