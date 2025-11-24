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
import React, { ReactElement, useState } from "react";
import useStore from "../store";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Listbox } from "@/components/ui/listbox";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { UiYupConditionSchema } from "@/validation-schema/ui/UiYupConditionSchema";
import { VariableSuggestionInput } from "@/components/ui/variable-suggestion-input";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const options = [
  { id: "1", name: "OR" },
  { id: "0", name: "AND" },
];

const conditions = [
  { id: 1, name: "Equal to" },
  { id: 2, name: "Not Equal to" },
  { id: 3, name: "Contains" },
  { id: 4, name: "Does not contains" },
  { id: 5, name: "Start with" },
  { id: 6, name: "Does not start with" },
  { id: 7, name: "Greater than" },
  { id: 8, name: "Less than" },
];

const ConditionTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  return (
    <Formik
      initialValues={{
        condition_result: {
          y_result_node_id: "",
          n_result_node_id: "",
        },
        condition_operator: 1,
        flow_node_conditions: [
          {
            id: "as",
            flow_condition_type: 1,
            variable: "@ans",
            value: "Yes",
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
        setOpen(false);
      }}
      enableReinitialize
      validationSchema={UiYupConditionSchema}
    >
      {({
        values,
        errors,
        handleChange,
        setFieldValue,
        handleSubmit,
        resetForm,
      }: any) => {
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
                  Set a Condition
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 overflow-auto bg-scroll space-y-4">
                <div className="space-y-3">
                  <Text size="base" weight="medium" color="secondary">
                    Conditions
                  </Text>
                  <div className="space-y-4">
                    <FieldArray name="flow_node_conditions">
                      {({ insert, remove, push }: any) => (
                        <>
                          {values.flow_node_conditions.length > 0 &&
                            values.flow_node_conditions.map(
                              (friend: any, index: number) => (
                                <div key={index}>
                                  {index == 1 ? (
                                    <div className="space-y-3 flex items-center justify-center pb-4 ">
                                      <div>
                                        <RadioGroup
                                          defaultValue={JSON.stringify(
                                            values.condition_operator
                                          )}
                                          onValueChange={(value) => {
                                            setFieldValue(
                                              "condition_operator",
                                              parseInt(value)
                                            );
                                          }}
                                          className="w-full flex  items-center gap-4"
                                        >
                                          {options?.map(
                                            (item: any, index: any) => {
                                              return (
                                                <div
                                                  className="flex items-center space-x-2"
                                                  key={index}
                                                >
                                                  <RadioGroupItem
                                                    value={item.id}
                                                    id={item.id}
                                                    className="w-4 h-4"
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
                                            }
                                          )}
                                        </RadioGroup>
                                      </div>
                                    </div>
                                  ) : null}
                                  <div className=" bg-primary-100 rounded-md p-4 space-y-2">
                                    <div className="w-full space-y-1">
                                      <VariableSuggestionInput
                                        name={`flow_node_conditions.${index}.variable`}
                                        value={friend.variable}
                                        label="IF"
                                        onChange={(e: any) => {
                                          setFieldValue(
                                            `flow_node_conditions.${index}.variable`,
                                            e.target.value
                                          );
                                        }}
                                        className="w-full"
                                        placeholder="@variable"
                                      />
                                      <ErrorMessage
                                        name={`flow_node_conditions.${index}.variable`}
                                        component={"p"}
                                        className="text-xs font-normal text-red-500"
                                      />
                                    </div>
                                    <div className="w-full">
                                      <Listbox
                                        options={conditions}
                                        selectedOption={conditions.find(
                                          (item: any) =>
                                            item.id ==
                                            friend.flow_condition_type
                                        )}
                                        buttonClassname={"w-full"}
                                        dropDownClass={"w-full"}
                                        buttoncolor={"bg-white"}
                                        onSelectData={(value: any) => {
                                          setFieldValue(
                                            `flow_node_conditions.${index}.flow_condition_type`,
                                            value.id
                                          );
                                        }}
                                      />
                                    </div>

                                    <Input
                                      name={`flow_node_conditions.${index}.value`}
                                      placeholder="Type a Value"
                                      onChange={handleChange}
                                      value={friend.value}
                                      errorKey={
                                        errors?.flow_node_conditions?.length >
                                          0 &&
                                        errors?.flow_node_conditions[0]?.value
                                      }
                                    />
                                    {index == 1 ? (
                                      <Button
                                        className="w-full"
                                        variant="destructive"
                                        leftIcon={
                                          <DeleteIcon className="w-4 h-4 mr-2" />
                                        }
                                        onClick={() => {
                                          remove(index);
                                          setFieldValue(
                                            "condition_operator",
                                            0
                                          );
                                        }}
                                      >
                                        Delete Condition
                                      </Button>
                                    ) : null}
                                  </div>
                                </div>
                              )
                            )}

                          {values.flow_node_conditions.length < 2 ? (
                            <div className="flex items-center justify-end my-2">
                              <Button
                                size="icon"
                                className="rounded-full"
                                onClick={() => push({})}
                              >
                                <PlusIcon />
                              </Button>
                            </div>
                          ) : null}
                        </>
                      )}
                    </FieldArray>
                  </div>
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

export default ConditionTypeSheet;
