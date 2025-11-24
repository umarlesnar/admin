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
import { Listbox } from "@/components/ui/listbox";
// import { useCatalogSetsQuery } from "@/framework/catalog/get-catalog-sets";

type Props = {
  children: ReactElement;
  sheetData?: any;
  id?: any;
};

const CatalogueSetTypeSheet = ({ children, sheetData, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  // const { data } = useCatalogSetsQuery();

  return (
    <Formik
      initialValues={{
        name: "",
        catalog_id: "",
        set_id: "",
        product_count: 0,
        products: [],
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
              resetForm(sheetData?.flow_replies);
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-[390px] sm:w-[500px] h-screen flex flex-col p-5">
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Set Catalogue Set
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 py-1 overflow-auto bg-scroll space-y-2">
                <Listbox
                  // options={data || []}
                  // selectedOption={data?.find((o: any) => {
                  //   return o.set_id == values?.set_id;
                  // })}
                  buttonClassname={"w-full h-10"}
                  dropdownClassname={"w-full h-auto"}
                  placeholder={"Selecte Product Sets"}
                  onSelectData={(data: any) => {
                    setFieldValue("name", data?.name);
                    setFieldValue("set_id", data?.set_id);
                    setFieldValue("catalog_id", data?.catalog_id);
                    setFieldValue("products", data?.products);
                    setFieldValue("product_count", data?.product_count);
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

export default CatalogueSetTypeSheet;
