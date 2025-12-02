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
import React, { ReactElement, useState, useEffect } from "react";
import { Combobox } from "@/components/ui/combobox";
import Text from "@/components/ui/text";
import { VariableSuggestionInput } from "@/components/ui/variable-suggestion-input";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import useWorkflowStore from "../WorkflowStore";
import { Input } from "@/components/ui/input";

type Props = {
  children: ReactElement;
  sheetData?: any;
  id?: any;
};

type CustomParam = {
  key: string;
  value: string;
};

const CustomAttributeTypeSheet = ({ children, sheetData, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useWorkflowStore();
  // const { data } = useAvailableAttributeQuery();
  const [selectedAttributes, setSelectedAttributes] = useState<any[]>([]);

  const getInitialValues = () => {
    let initial = {
      wa_id: sheetData?.wa_id || "",   
      custom_params: [{ key: "", value: "" }],
    };
  
    if (sheetData?.custom_params) {
      if (Array.isArray(sheetData.custom_params)) {
        initial.custom_params = sheetData.custom_params.map((param: CustomParam) => ({
          key: param.key || "",
          value: param.value || "",
        }));
      } else if (typeof sheetData.custom_params === "object" && sheetData.custom_params.key) {
        initial.custom_params = [
          {
            key: sheetData.custom_params.key || "",
            value: sheetData.custom_params.value || "",
          },
        ];
      }
    }
  
    return initial;
  };
  

  // useEffect(() => {
  //   if (sheetData?.custom_params && data) {
  //     let paramsArray: CustomParam[] = [];
      
  //     // Handle both array and object formats
  //     if (Array.isArray(sheetData.custom_params)) {
  //       paramsArray = sheetData.custom_params;
  //     } else if (typeof sheetData.custom_params === 'object' && sheetData.custom_params.key) {
  //       paramsArray = [sheetData.custom_params];
  //     }
      
  //     const foundAttributes = paramsArray.map((param: CustomParam) => {
  //       return data.find((item: any) => 
  //         item.value === param.key || item.name === param.key
  //       ) || null;
  //     });
  //     setSelectedAttributes(foundAttributes);
  //   } else {
  //     setSelectedAttributes([null]); 
  //   }
  // }, [sheetData, data, open]);

  const addField = (values: any, setFieldValue: any) => {
    const newParams = [...values.custom_params, { key: "", value: "" }];
    setFieldValue("custom_params", newParams);
    setSelectedAttributes([...selectedAttributes, null]);
  };

  const removeField = (index: number, values: any, setFieldValue: any) => {
    if (values.custom_params.length <= 1) return; 
    
    const newParams = values.custom_params.filter((_: any, i: number) => i !== index);
    setFieldValue("custom_params", newParams);
    
    const newSelectedAttributes = selectedAttributes.filter((_, i) => i !== index);
    setSelectedAttributes(newSelectedAttributes);
  };

  const hasValidData = (values: any) => {
    return values.custom_params.some((param: CustomParam) => param.key && param.value);
  };

  return (
    <Formik
      initialValues={getInitialValues()}
      validate={(values) => {
        const errors: any = {};
        if (!values.wa_id) errors.wa_id = "WA ID is required";

        
        values.custom_params.forEach((param: CustomParam, index: number) => {
          if (!param.key) {
            errors[`custom_params_${index}_key`] = "Attribute is required";
          }
          if (!param.value) {
            errors[`custom_params_${index}_value`] = "Value is required";
          }
        });
        
        return errors;
      }}
      onSubmit={(values) => {
        if (typeof updateNodeData == "function") {
          const filteredParams = values.custom_params.filter((param: CustomParam) => 
            param.key && param.value
          );
          
          updateNodeData(id, {
            ...values,
            custom_params: filteredParams,
          });
        }
      }}
      enableReinitialize
    >
      {({
        values,
        setFieldValue,
        handleSubmit,
        resetForm,
        handleChange,
        errors,
      }) => {
        return (
          <Sheet
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              if (!value) {
                resetForm();
                setSelectedAttributes([]);
              }
            }}
          >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-[390px] sm:w-[450px] h-screen flex flex-col p-5">
              <SheetHeader className="flex flex-row items-center gap-4">
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
                <SheetTitle className="h-full text-text-primary text-xl font-semibold">
                  Update Attributes
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 py-6 overflow-auto bg-scroll space-y-4">
              <Input
                  name="wa_id"
                  label="Phone Number"
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  value={values?.wa_id}
                  errorKey={errors && errors.wa_id}
                  isRequired
                />
                <div className="flex justify-between items-center">
                  <Text size="sm" weight="semibold" textColor="text-primary-900">
                    Attributes
                  </Text>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addField(values, setFieldValue)}
                  >
                    <PlusIcon className="w-3 h-3" />
                  </Button>
                </div>

                {values.custom_params.map((param: CustomParam, index: number) => (
                  <div key={index} className="flex items-center gap-2 relative">
                    <Combobox
                      name={`custom_params.${index}.key`}
                      placeholder="Select Attribute"
                      value={param.key || ""}
                      // options={data || []}
                      selectedOption={selectedAttributes[index]}
                      onSelectData={(value: any) => {
                        const newSelectedAttributes = [...selectedAttributes];
                        newSelectedAttributes[index] = value;
                        setSelectedAttributes(newSelectedAttributes);
                        
                        setFieldValue(
                          `custom_params.${index}.key`,
                          value.value || value.name
                        );
                      }}
                      buttonClassname="w-[150px]"
                    />

                    <div className="flex-1">
                      <VariableSuggestionInput
                        name={`custom_params.${index}.value`}
                        value={param.value || ""}
                        onChange={(e: any) => {
                          setFieldValue(`custom_params.${index}.value`, e.target.value);
                        }}
                        className="w-full"
                        placeholder="@value"
                      />
                    </div>

                    {values.custom_params.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => removeField(index, values, setFieldValue)}
                      >
                        <DeleteIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="w-full flex items-center gap-2">
                <SheetClose asChild>
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </SheetClose>

                <Button
                  type="submit"
                  className="w-full"
                  onClick={() => {
                    handleSubmit();
                    const hasErrors = Object.keys(errors).length > 0;
                    if (!hasErrors && hasValidData(values)) {
                      setOpen(false);
                    }
                  }}
                  disabled={!hasValidData(values)}
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

export default CustomAttributeTypeSheet;