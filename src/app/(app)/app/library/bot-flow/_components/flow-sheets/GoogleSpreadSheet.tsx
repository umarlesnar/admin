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
import { ErrorMessage, FieldArray, Formik } from "formik";
import React, { ReactElement, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import useStore from "../store";
// import { useGoogleSpreadSheetQuery } from "@/framework/integration/google-sheet/get-spreadsheet";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
// import { useGoogleSheetAccountsQuery } from "@/framework/integration/google-sheet/get-google-sheet-accounts-query";
import { Combobox } from "@/components/ui/combobox";

type Props = {
  children: ReactElement;
  sheetData?: any;
  id?: any;
};

const GoogleSpreadSheet = ({ children, sheetData, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  const [options, setOptions] = useState([]);
  const [credentialId, setCredentialId] = useState(
    sheetData?.configuration?.credential_id || ""
  );
  // const accounts = useGoogleSheetAccountsQuery();

  // const { data, isLoading } = useGoogleSpreadSheetQuery(credentialId);

  // useEffect(() => {
  //   if (data?.data?.files) {
  //     setOptions(data?.data?.files);
  //   }
  // }, [data]);

  return (
    <Formik
      initialValues={{
        access_token: "",
        configuration: {
          credential_id: "",
          spreadsheet_id: "",
          action: "ADD_ROW",
          columns: [
            {
              id: 0,
              name: "",
              value: "",
            },
          ],
        },
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
      {({
        values,
        errors,
        handleChange,
        handleSubmit,
        resetForm,
        setFieldValue,
      }) => {
        return (
          <Sheet
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              resetForm({});
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-[390px] sm:w-[500px] h-screen flex flex-col p-5">
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Google Spread Sheet
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 overflow-auto bg-scroll space-y-4">
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Google Accounts
                  </Text>
                  <Combobox
                    // options={accounts?.data?.data || []}
                    buttonClassname={`w-full`}
                    // selectedOption={accounts?.data?.data?.find((o: any) => {
                    //   return o._id == values?.configuration.credential_id;
                    // })}
                    placeholder={
                      // accounts?.isLoading ? "Loading..." : 
                      "Select account"
                    }
                    onSelectData={(selected: any) => {
                      setCredentialId(selected._id);
                      setFieldValue(
                        `configuration.credential_id`,
                        selected._id
                      );
                    }}
                  />
                  <ErrorMessage
                    component={"p"}
                    name="configuration.integration_id"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
                {values?.configuration?.credential_id ? (
                  <>
                    <div className="space-y-2">
                      <Text size="sm" weight="medium">
                        Spread Sheets
                        {/* <span className="text-sm text-red-500 ml-[2px]">*</span> */}
                      </Text>
                      <Combobox
                        options={options || []}
                        buttonClassname={`w-full`}
                        // placeholder={
                        //   isLoading ? "Loading..." : "Select Spreadsheet"
                        // }
                        selectedOption={options.find((o: any) => {
                          return o.id == values?.configuration.spreadsheet_id;
                        })}
                        onSelectData={(selected: any) => {
                          setFieldValue(
                            `configuration.spreadsheet_id`,
                            selected.id
                          );
                        }}
                      />
                      <ErrorMessage
                        component={"p"}
                        name="configuration.spreadsheet_id"
                        className="test-sm font-normal text-red-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Text size="sm" weight="medium">
                        Save Answers in a variable
                      </Text>

                      <FieldArray name="configuration.columns">
                        {({ remove, push }: any) => {
                          return (
                            <div className="w-full flex-1 space-y-2">
                              {values.configuration?.columns?.length > 0 &&
                                values.configuration?.columns?.map(
                                  (column: any, index: number) => {
                                    return (
                                      <div
                                        key={index}
                                        className="w-full flex items-center gap-2"
                                      >
                                        <div className="flex-1">
                                          <Input
                                            name={`configuration.columns.${index}.name`}
                                            placeholder="name"
                                            onChange={handleChange}
                                            value={column?.name}
                                            errorKey={
                                              errors &&
                                              //@ts-ignore
                                              errors?.configuration?.columns[
                                                index
                                              ]?.name
                                            }
                                            className="w-full"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <Input
                                            name={`configuration.columns.${index}.value`}
                                            placeholder="value"
                                            onChange={handleChange}
                                            value={column?.value}
                                            errorKey={
                                              errors &&
                                              //@ts-ignore
                                              errors?.configuration?.columns[
                                                index
                                              ]?.value
                                            }
                                            className="w-full"
                                          />
                                        </div>
                                        <Button
                                          size="icon"
                                          variant="destructive"
                                          onClick={() => {
                                            remove(index);
                                          }}
                                        >
                                          <DeleteIcon className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    );
                                  }
                                )}
                              <div className="flex items-center justify-end my-3">
                                <Button
                                  onClick={() => {
                                    push({
                                      id: values.configuration.columns?.length,
                                      name: "",
                                      value: "",
                                    });
                                  }}
                                >
                                  Add Column
                                </Button>
                              </div>
                            </div>
                          );
                        }}
                      </FieldArray>
                    </div>
                  </>
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

export default GoogleSpreadSheet;
