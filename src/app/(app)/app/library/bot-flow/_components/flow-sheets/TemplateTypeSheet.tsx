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
import { FieldArray, Formik } from "formik";
import React, { ReactElement, useState } from "react";
import useStore from "../store";
import { Input } from "@/components/ui/input";
// import { useBroadcastTemplateQuery } from "@/framework/broadcast/get-broadcast-template";
import { keyBy } from "lodash";
import { Combobox } from "@/components/ui/combobox";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const TemplateTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  // const Templates = useBroadcastTemplateQuery();
  return (
    <Formik
      initialValues={{
        type: "wb_template",
        templeate_name: "",
        template_id: "",
        wba_variables: [
          {
            key: "",
            value: "",
          },
          {
            key: "",
            value: "",
          },
        ],
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
            <SheetContent className="w-[390px] sm:w-[500px] h-screen flex flex-col p-5">
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Templates
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 py-2 overflow-auto bg-scroll space-y-2">
                {/* {!Templates.isLoading ? ( */}
                  <Combobox
                    // options={Templates?.data?.data || []}
                    buttonClassname="w-full"
                    dropdownClassname={`p-2`}
                    placeholder={"Select Template"}
                    // selectedOption={Templates?.data?.data?.find((o: any) => {
                    //   return o._id == values.template_id;
                    // })}
                    onSelectData={(template: any) => {
                      setFieldValue("template_name", template.name);
                      setFieldValue("template_id", template._id);
                      const fb_variable_object = keyBy(
                        template.wba_variables,
                        "custom_variable"
                      );
                      const finalOutput = Object.keys(fb_variable_object).map(
                        (key: any, index: number) => {
                          return {
                            name: key,
                            value: "",
                          };
                        }
                      );
                      setFieldValue("wba_variables", finalOutput);
                    }}
                  />
                {/* ) : null} */}
                {values.wba_variables.length !== 0 ? (
                  <FieldArray name="wba_variables">
                    {({ insert, remove, push }: any) => (
                      <div className="my-5 w-full">
                        <div className="flex justify-around mb-2">
                          <div className="text-base font-semibold text-base-primary w-3/4">
                            variables
                          </div>
                          <div className="flex justify-end items-center w-1/4"></div>
                        </div>
                        <div className="space-y-3">
                          {values.wba_variables?.length > 0 &&
                            values.wba_variables.map(
                              (variables: any, index: number) => (
                                <div key={index}>
                                  <div className="flex justify-start items-center gap-3 ">
                                    <Input
                                      name={`wba_variables.${index}.name`}
                                      placeholder="Key"
                                      value={variables.name}
                                      onChange={handleChange}
                                      className="w-full"
                                    />
                                    <Input
                                      name={`wba_variables.${index}.value`}
                                      placeholder="Value"
                                      value={variables.value}
                                      onChange={handleChange}
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                              )
                            )}
                        </div>
                      </div>
                    )}
                  </FieldArray>
                ) : null}
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

export default TemplateTypeSheet;
