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
import Text from "@/components/ui/text";
import { Form, Formik } from "formik";
import React, { ReactElement, useRef, useState } from "react";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSystemRoleMutation } from "@/framework/iam/system-roles/system-role-mutation";
import { UiyupUserRoleSchema } from "@/validation-schema/ui/UiYupUserRoleSchema";
import { useModulesQuery } from "@/framework/modules/get-modules";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  children: ReactElement;
  data?: any;
};

const EditUserRolesSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync } = useSystemRoleMutation();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const Modules = useModulesQuery({});

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  const filteredModules = (Modules?.data?.items || [])
    .filter((item: any) => item.is_active === true)
    .filter((module: any) =>
      module.module_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="w-[400px] sm:w-[500px] h-screen flex flex-col p-5"
        onOpenAutoFocus={preventFocus}
      >
        <SheetHeader className="flex flex-row items-center gap-4">
          <SheetClose asChild>
            <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
          </SheetClose>
          <SheetTitle className="h-full text-text-primary text-xl font-semibold">
            Update Role
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-scroll">
          <Formik
            initialValues={{
              name: "",
              permissions: {} as Record<string, string[]>,
              is_visible: false,
              ...data,
            }}
            onSubmit={async (values, { setErrors }) => {
              const loadingToast = toast.loading("Loading...");
              try {
                const response = await mutateAsync({
                  system_roles_id: data?._id,
                  method: "PUT",
                  payload: values,
                });

                toast.success(`Role Updated Successfully`, {
                  id: loadingToast,
                });

                setOpen(false);
              } catch (error: any) {
                console.log("error", error);

                toast.error(`Failed to Updated Role`, {
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
            validationSchema={UiyupUserRoleSchema}
            enableReinitialize
          >
            {({
              values,
              errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              resetForm,
              isValid,
            }) => {
              return (
                <Form className="w-full h-full  flex flex-col p-1">
                  <div className="flex-1 gap-4 space-y-5 pb-8">
                    <div className="w-full space-y-1">
                      <Input
                        name="name"
                        label="Name"
                        isRequired
                        placeholder="Enter a name"
                        onChange={handleChange}
                        value={values.name}
                        errorKey={errors?.name}
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Text size="sm" tag="label" weight="medium">
                        Module
                      </Text>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {Object.keys(values.permissions).length > 0
                              ? `${
                                  Object.keys(values.permissions).length
                                } modules selected`
                              : "Select Modules"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-auto min-w-[400px] max-w-[600px]">
                          <DialogHeader className="flex flex-row items-center justify-between">
                            <DialogTitle>Select Modules</DialogTitle>
                            <DialogClose asChild>
                              <Button variant="ghost" size="sm">
                                <CloseIcon className="w-4 h-4" />
                              </Button>
                            </DialogClose>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              placeholder="Search modules..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="max-h-80 overflow-y-auto p-2 space-y-4">
                              {filteredModules.map((module: any) => (
                                <div
                                  key={module.module_id}
                                  className="space-y-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={module.module_id}
                                      checked={values.permissions.hasOwnProperty(
                                        module.module_id
                                      )}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setFieldValue("permissions", {
                                            ...values.permissions,
                                            [module.module_id]:
                                              module.default_permission || [],
                                          });
                                        } else {
                                          const newPermissions = {
                                            ...values.permissions,
                                          };
                                          delete newPermissions[
                                            module.module_id
                                          ];
                                          setFieldValue(
                                            "permissions",
                                            newPermissions
                                          );
                                        }
                                      }}
                                      className="w-4 h-4 cursor-pointer"
                                    />
                                    <label
                                      htmlFor={module.module_id}
                                      className="text-sm font-medium"
                                    >
                                      {module.module_id}
                                    </label>
                                  </div>
                                  {values.permissions[module.module_id] && (
                                    <div className="ml-6 space-y-1">
                                      {(module.default_permission || []).map(
                                        (permission: string) => (
                                          <div
                                            key={permission}
                                            className="flex items-center space-x-2"
                                          >
                                            <input
                                              type="checkbox"
                                              id={`${module.module_id}-${permission}`}
                                              checked={values.permissions[
                                                module.module_id
                                              ]?.includes(permission)}
                                              onChange={(e) => {
                                                const currentPerms =
                                                  values.permissions[
                                                    module.module_id
                                                  ] || [];
                                                const newPerms = e.target
                                                  .checked
                                                  ? [
                                                      ...currentPerms,
                                                      permission,
                                                    ]
                                                  : currentPerms.filter(
                                                      (p:any) => p !== permission
                                                    );
                                                setFieldValue("permissions", {
                                                  ...values.permissions,
                                                  [module.module_id]: newPerms,
                                                });
                                              }}
                                              className="w-3 h-3 cursor-pointer"
                                            />
                                            <label
                                              htmlFor={`${module.module_id}-${permission}`}
                                              className="text-xs"
                                            >
                                              {permission}
                                            </label>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-end pt-4">
                            <DialogClose asChild>
                              <Button>Save</Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="w-full space-y-1 flex items-center justify-between">
                      <Text size="sm" tag="label" weight="medium">
                        Visible
                      </Text>
                      <Switch
                        checked={values.is_visible}
                        onCheckedChange={(checked) =>
                          setFieldValue("is_visible", checked)
                        }
                      />
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-white pt-2 flex items-center gap-2">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={!isValid || isSubmitting}
                    >
                      Update Role
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
              );
            }}
          </Formik>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditUserRolesSheet;
