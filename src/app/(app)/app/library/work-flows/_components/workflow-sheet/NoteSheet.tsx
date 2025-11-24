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
import Text from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import useWorkflowStore from "../WorkflowStore";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const NoteTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useWorkflowStore();
  return (
    <Formik
      initialValues={{
        text: "",
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
        errors,
        setFieldValue,
        handleSubmit,
        resetForm,
        handleChange,
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
                  Note
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 py-2 overflow-auto bg-scroll space-y-3">
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Text
                    <span className="text-sm text-red-500 ml-[2px]">*</span>
                  </Text>
                  <Textarea
                    name="text"
                    onChange={handleChange}
                    placeholder="Enter Your Text"
                    value={values?.text}
                    style={{ minHeight: "400px" }}
                  />

                  <ErrorMessage
                    component={"p"}
                    name="text"
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

export default NoteTypeSheet;
