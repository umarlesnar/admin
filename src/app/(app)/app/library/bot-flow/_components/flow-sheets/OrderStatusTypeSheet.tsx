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
import React, { ReactElement, useState } from "react";
import useStore from "../store";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Text from "@/components/ui/text";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const options = [
  { id: "confirm", name: "Confirm" },
  { id: "pending", name: "Pending" },
  { id: "processing", name: "Processing" },
  { id: "delivered", name: "Delivered" },
  { id: "cancelled", name: "Cancelled" },
];

const OrderStatusTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  return (
    <Formik
      initialValues={{
        status: "",
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
      {({ values, setFieldValue, handleSubmit, resetForm, handleChange }) => {
        return (
          <Sheet
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              resetForm(data?.flow_replies);
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-[390px] h-screen flex flex-col p-5">
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Set Order Status
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 py-6 overflow-auto bg-scroll space-y-2">
                <RadioGroup
                  defaultValue={values.status}
                  onValueChange={(value) => {
                    setFieldValue("status", value);
                  }}
                  className="w-full px-4 space-y-2"
                >
                  {options?.map((item: any, index: any) => {
                    return (
                      <div className="flex items-center space-x-2" key={index}>
                        <RadioGroupItem
                          value={item.id}
                          id={item.id}
                          className="w-6 h-6"
                        />
                        <Text
                          size="base"
                          weight="medium"
                          htmlFor={item.id}
                          tag="label"
                          className="cursor-pointer"
                        >
                          {item.name}
                        </Text>
                      </div>
                    );
                  })}
                </RadioGroup>
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

export default OrderStatusTypeSheet;
