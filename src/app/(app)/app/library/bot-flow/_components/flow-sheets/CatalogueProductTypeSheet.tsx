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
import { Listbox } from "@/components/ui/listbox";
// import { useCatalogProductsQuery } from "@/framework/catalog/get-catalog-products";

type Props = {
  children: ReactElement;
  sheetData?: any;
  id?: any;
};

const CatalogueProductTypeSheet = ({ children, sheetData, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  // const { data } = useCatalogProductsQuery({});

  return (
    <Formik
      initialValues={{
        catalog_id: "",
        product_id: "",
        name: "",
        image_url: "",
        retailer_id: "",
        product_price: "",
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
                  Set Catalogue Product
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 py-1 overflow-auto bg-scroll space-y-2">
                <Listbox
                  // options={data?.items || []}
                  // selectedOption={data?.items?.find((o: any) => {
                  //   return o.id == values?.product_id;
                  // })}
                  buttonClassname={"w-full h-10"}
                  dropdownClassname={"w-full h-auto"}
                  onSelectData={(data: any) => {
                    setFieldValue("name", data?.name);
                    setFieldValue("product_id", data?.product_id);
                    setFieldValue("catalog_id", data?.catalog_id);
                    setFieldValue("retailer_id", data?.retailer_id);
                    setFieldValue("image_url", data?.image_url);
                    setFieldValue("product_price", data?.product_price);
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

export default CatalogueProductTypeSheet;
