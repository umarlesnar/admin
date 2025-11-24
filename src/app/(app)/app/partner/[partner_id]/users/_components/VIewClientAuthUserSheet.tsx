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
import { Form, Formik } from "formik";
import { format } from "date-fns";
import React, { ReactElement, useState } from "react";
import { toast } from "sonner";
import { usePartnerWorkspaceUsers } from "@/framework/partner/users/workspace-user/get-workspace-users";

type Props = {
  children: ReactElement;
  user_id?: any;
};

const ViewUserForm = ({
  user_id,
  onSheetClose,
}: {
  user_id?: any;
  onSheetClose: (val: boolean) => void;
}) => {
  const { data, refetch } = useClientAuthUserByIdQuery(user_id);
  const { mutateAsync } = useClientAuthUser();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        _id: "",
        platform: "",
        created_at: "",
        ...data,
      }}
      onSubmit={() => {}}
    >
      {() => (
        <Form className="flex flex-1 flex-col justify-between">
          <div className="flex-1 flex-col gap-4 space-y-5 overflow-y-scroll">
            {data?.ClientAuth?.length > 0 ? (
              data.ClientAuth.map((auth: any, index: number) => (
                <div
                  key={index}
                  className="border p-3 rounded-md space-y-3"
                >
                  <Text className="text-lg font-semibold">
                    Client session {index + 1}
                  </Text>
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-full space-y-1">
                      <label className="font-semibold">Platform</label>
                      <Text size="sm" weight="medium">
                        {auth?.platform || ""}
                      </Text>
                    </div>

                    <div className="w-full space-y-1">
                      <label className="font-semibold">Created At</label>
                      <Text size="sm" weight="medium">
                        {auth?.created_at
                          ? format(new Date(auth.created_at), "dd/MM/yyyy")
                          : ""}
                      </Text>
                    </div>

                    <Alert
                      icon={
                        <AlertIcon className="w-[50px] h-[50px] text-red-500" />
                      }
                      description={`Do you want to remove this Client Auth Session from user?`}
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
                      rightButtonProps={{ variant: "destructive" }}
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
        </Form>
      )}
    </Formik>
  );
};

const ViewUserSheet = ({ children, user_id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => setOpen(value)}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[500px] h-screen flex flex-col p-5 overflow-y-scroll">
        <SheetHeader className="flex flex-row items-center gap-4">
          <SheetClose asChild>
            <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
          </SheetClose>
          <SheetTitle className="h-full text-text-primary text-xl font-semibold">
            Client Session
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1">
          {open && (
            <ViewUserForm user_id={user_id} onSheetClose={setOpen} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ViewUserSheet;

