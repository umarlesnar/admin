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
import { Formik } from "formik";
import React, { ReactElement, useEffect, useState } from "react";
import useStore from "../store";
// import { useActiveSequenceQuery } from "@/framework/automation/sequence/get-active-sequence";
import { Combobox } from "@/components/ui/combobox";

type Props = {
  children: ReactElement;
  sheetData?: any;
  id?: any;
};

const SequenceTypeSheet = ({ children, sheetData, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  // const { data } = useActiveSequenceQuery();

  return (
    <Formik
      initialValues={{
        sequence_id: "",
        ...sheetData,
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
      {({ values, setFieldValue, handleSubmit, resetForm, handleChange }) => {
        return (
          <Sheet
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              // resetForm(data?.flow_replies);
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-[390px] sm:w-[400px] h-screen flex flex-col p-5">
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Assign Sequence
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 py-6 overflow-auto bg-scroll space-y-2">
                <Combobox
                  label="Sequence"
                  name="sequence"
                  placeholder="Select Sequence"
                  value={values.sequence || ""}
                  // options={data || []}
                  // selectedOption={data?.find((o: any) => {
                  //   return o._id == values.sequence_id;
                  // })}
                  onSelectData={(value: any) => {
                    setFieldValue("sequence_id", value._id);
                  }}
                />
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

export default SequenceTypeSheet;
