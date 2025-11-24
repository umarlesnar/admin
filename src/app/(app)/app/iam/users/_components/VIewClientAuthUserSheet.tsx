import { Alert } from "@/components/ui/alert";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Text from "@/components/ui/text";
import { useClientAuthUser } from "@/framework/iam/users/client-auth-mutation";
import { useClientAuthUserByIdQuery } from "@/framework/iam/users/get-client-auth-user-by-id";
import { format } from "date-fns";
import { Form, Formik } from "formik";
import React, { ReactElement, useState } from "react";
import { toast } from "sonner";

type Props = {
  children: ReactElement;
  data?: any;
  user_id?: any;
};

const ViewUserSheet = ({ children, user_id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const { data, refetch } = useClientAuthUserByIdQuery(user_id);
  const { mutateAsync } = useClientAuthUser();

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        _id: "",
        platform: "",
        created_at: "",
        ...data,
      }}
      onSubmit={(values) => console.log(values)}
      enableReinitialize
    >
      {({}: any) => {
        return (
          <Sheet
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent
              className="w-[400px] sm:w-[500px] h-screen flex flex-col p-5 overflow-y-scroll"
              onOpenAutoFocus={preventFocus}
            >
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Client Session
                </SheetTitle>
              </SheetHeader>

              <Form className="flex flex-1 flex-col justify-between ">
                <div className="flex-1 flex-col gap-4 space-y-5 overflow-y-scroll">
                  <div className="flex-1 flex-col gap-4 space-y-5">
                    <div className="flex-1 flex-col gap-4 space-y-5 overflow-y-scroll">
                      {data?.ClientAuth?.length > 0 ? (
                        data.ClientAuth.map((auth: any, index: any) => (
                          <div
                            key={index}
                            className="border p-3 rounded-md space-y-3"
                          >
                            <Text className="text-lg font-semibold">
                              Client session {index + 1}
                            </Text>
                            <div className="flex items-center justify-between gap-2">
                              <div className="w-full space-y-1">
                                <label className="font-semibold">
                                  Platform
                                </label>
                                <Text size="sm" weight="medium">
                                  {auth?.platform || ""}
                                </Text>
                              </div>

                              <div className="w-full space-y-1">
                                <label className="font-semibold">
                                  Created At
                                </label>
                                <Text size="sm" weight="medium">
                                  {auth?.created_at
                                    ? format(
                                        new Date(auth.created_at),
                                        "dd/MM/yyyy"
                                      )
                                    : ""}
                                </Text>
                              </div>
                              <Alert
                                icon={
                                  <AlertIcon className="w-[50px] h-[50px] text-red-500" />
                                }
                                description={`Do you want to remove this Client Auth Session from users ?`}
                                onRightButton={async () => {
                                    try {
                                      if (!user_id) {
                                        toast.error("User ID is missing");
                                        return;
                                      }
                                
                                      await mutateAsync({ user_id, auth_id: auth?._id });
                                      toast.success("Client session deleted successfully");
                                      refetch();
                                    } catch (error) {
                                      toast.error("Failed to delete client session");
                                    }
                                }}
                                rightButtonProps={{
                                  variant: "destructive",
                                }}
                              >
                                <DeleteIcon className="w-12 h-12 cursor-pointer text-red-600" />
                              </Alert>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Text className="text-gray-500 text-lg">
                            No ClientAuth records found
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            </SheetContent>
          </Sheet>
        );
      }}
    </Formik>
  );
};

export default ViewUserSheet;
