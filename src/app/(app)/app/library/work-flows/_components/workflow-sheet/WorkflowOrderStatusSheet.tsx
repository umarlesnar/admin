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
import React, { ReactElement, useState } from "react";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { UiYupOrderStatusSchema } from "@/validation-schema/ui/UiYupOrderStatusSchema";
import useWorkflowStore from "../WorkflowStore";

type Props = {
  children: ReactElement;
  sheetData?: any;
  id?: any;
};

const WorkflowOrderStatusSheet = ({ children, sheetData, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useWorkflowStore();

  return (
    <Formik
      initialValues={{
        body: "",
        reference_id: "",
        status: "",
        wa_id: "",
        ...sheetData,
      }}
      onSubmit={(values) => {
        if (typeof updateNodeData == "function") {
          updateNodeData(id, {
            ...values,
          });
        }
      }}
      validationSchema={UiYupOrderStatusSchema}
      enableReinitialize
    >
      {({ values, errors, handleSubmit, handleChange, resetForm }: any) => {
        return (
          <Sheet
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              resetForm({});
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-[390px] h-screen flex flex-col p-5">
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Setup Order Status Message
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 overflow-auto bg-scroll space-y-2">
                <div className="space-y-2">
                  <Input
                    label="Mobile Number"
                    name="wa_id"
                    placeholder="Enter Mobile Number"
                    onChange={handleChange}
                    errorKey={errors?.wa_id}
                    value={values?.wa_id}
                    isRequired
                  />
                </div>
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Body{" "}
                    <Text tag="label" size="sm" textColor="text-red-500">
                      *
                    </Text>
                  </Text>

                  <Textarea
                    name="body"
                    onChange={handleChange}
                    placeholder="Enter Your Body Text"
                    value={values?.body}
                  />

                  <ErrorMessage
                    component={"p"}
                    name="body"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    label="Status"
                    name="status"
                    placeholder="Enter status variable"
                    onChange={handleChange}
                    errorKey={errors?.status}
                    value={values?.status}
                    isRequired
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    label="Reference Id"
                    name="reference_id"
                    placeholder="Enter Reference Id"
                    onChange={handleChange}
                    errorKey={errors?.reference_id}
                    value={values?.reference_id}
                    isRequired
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

export default WorkflowOrderStatusSheet;
