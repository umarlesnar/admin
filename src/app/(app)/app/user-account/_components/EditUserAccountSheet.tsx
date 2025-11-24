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
import { Switch } from "@/components/ui/switch";
import Text from "@/components/ui/text";
import { useUserAccountUpdateMutation } from "@/framework/user_account/useraccount-update-mutation";
import { Form, Formik } from "formik";
import React, { ReactElement, useState } from "react";
import { toast } from "sonner";

type Props = {
  children: ReactElement;
  data?: any;
};

const EditUserAccountSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = useUserAccountUpdateMutation();
  const preventFocus = (event: Event) => {
    event.preventDefault();
  };
  const sheetData = data;
  const user_account_id = sheetData?._id;

  return (
    <Formik
      initialValues={{
        check_in: {
          payment_status: true,
          wba_embedded_sign_up: false,
          account_activation_status: false,
        },
        ...sheetData,
      }}
      onSubmit={async (values) => {
        const loadingToast = toast.loading("Loading...");
        try {
          await mutateAsync({
            user_account_id,
            payload: {
              check_in: {
                payment_status: values?.check_in?.payment_status,
                wba_embedded_sign_up: values?.check_in?.wba_embedded_sign_up,
                account_activation_status:
                  values?.check_in?.account_activation_status,
              },
            },
          });
          toast.success("User Updated Successfully", {
            id: loadingToast,
          });
          setOpen(false);
        } catch (error) {
          console.log("error", error);

          toast.error("Fail to update User", {
            id: loadingToast,
          });
        }
      }}
      enableReinitialize
    >
      {({
        values,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        resetForm,
        isValid,
      }: any) => {
        return (
          <Sheet
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent
              className="w-[400px] sm:w-[500px] h-screen flex flex-col p-8"
              onOpenAutoFocus={preventFocus}
            >
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Update User
                </SheetTitle>
              </SheetHeader>

              <Form className="w-full h-full  flex flex-col overflow-y-scroll p-1">
                <div className="flex-1 gap-4 space-y-10 pb-8 pt-4 ">
                  <div className="flex items-center gap-8 justify-between pr-4">
                    <div>
                      <Text weight="semibold" size="lg" className="w-[250px]">
                        Payment Status
                      </Text>
                    </div>
                    <div className=" pt-1">
                      <Switch
                        checked={values.check_in?.payment_status}
                        onCheckedChange={(checked) =>
                          setFieldValue("check_in.payment_status", checked)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={!isValid || isSubmitting}
                  >
                    Update User
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
            </SheetContent>
          </Sheet>
        );
      }}
    </Formik>
  );
};

export default EditUserAccountSheet;
