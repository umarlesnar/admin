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
import { ErrorMessage, Formik } from "formik";
import React, { ReactElement, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import useWorkflowStore from "../WorkflowStore";
// import { useShopifyAccountsQuery } from "@/framework/integration/shopify/get-shopify-accounts";
import Text from "@/components/ui/text";
import { Combobox } from "@/components/ui/combobox";
// import { shopifyEvents } from "@/constants/shopify-events";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const WorkflowShopifySheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useWorkflowStore();
  // const accounts = useShopifyAccountsQuery();

  return (
    <Formik
      initialValues={{
        store_admin_url: "",
        credential_id: "",
        type: "shopify",
        event_type: "",
        ...data,
      }}
      onSubmit={(values) => {
        if (typeof updateNodeData == "function") {
          updateNodeData(id, {
            ...values,
          });
        }
      }}
      enableReinitialize
    >
      {({
        values,
        setFieldValue,
        handleSubmit,
        resetForm,
        handleChange,
        errors,
      }) => {
        return (
          <Sheet
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              resetForm(data?.flow_replies);
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-[390px] sm:w-[500px] h-screen flex flex-col p-5">
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Shopify
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 py-2 overflow-auto bg-scroll space-y-3">
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Shopify Accounts
                  </Text>
                  <Combobox
                    // options={accounts?.data?.data || []}
                    buttonClassname={`w-full`}
                    // selectedOption={accounts?.data?.data?.find((o: any) => {
                    //   return o._id == values?.credential_id;
                    // })}
                    placeholder={
                      // accounts?.isLoading ? "Loading..." : "Select account"
                      "Select account"
                    }
                    onSelectData={(selected: any) => {
                      setFieldValue(`credential_id`, selected._id);
                      setFieldValue(`store_admin_url`, selected.name);
                    }}
                  />
                  <ErrorMessage
                    component={"p"}
                    name="credential_id"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Shopify Events
                  </Text>
                  <Combobox
                    // options={shopifyEvents || []}
                    buttonClassname={`w-full`}
                    // selectedOption={shopifyEvents?.find((o: any) => {
                    //   return o.value == values?.event_type;
                    // })}
                    onSelectData={(event: any) => {
                      setFieldValue(`event_type`, event.value);
                    }}
                  />
                  <ErrorMessage
                    component={"p"}
                    name="credential_id"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
              </div>

              <div className="w-full flex items-center gap-2 ">
                <SheetClose asChild>
                  <Button type="submit" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </SheetClose>

                <Button
                  type="submit"
                  className="w-full"
                  onClick={() => {
                    handleSubmit();
                    setOpen(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        );
      }}
    </Formik>
  );
};

export default WorkflowShopifySheet;
