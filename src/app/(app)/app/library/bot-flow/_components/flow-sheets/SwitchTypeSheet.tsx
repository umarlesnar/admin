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
import { FieldArray, Formik } from "formik";
import React, { ReactElement, useState } from "react";
import useStore from "../store";
import { Input } from "@/components/ui/input";
import { Listbox } from "@/components/ui/listbox";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { UiYupSwitchConditionSchema } from "@/validation-schema/ui/UiYupSwitchConditionSchema";
import { VariableSuggestionInput } from "@/components/ui/variable-suggestion-input";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const options = [
  { id: 1, name: "Equal to" },
  { id: 2, name: "Not Equal to" },
  { id: 3, name: "Contains" },
  { id: 4, name: "Does not contains" },
  { id: 5, name: "Start with" },
  { id: 6, name: "Does not start with" },
  { id: 7, name: "Greater than" },
  { id: 8, name: "Less than" },
];

const SwitchTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  return (
    <Formik
      initialValues={{
        input_variable: "",

        switch_conditions: [
          {
            id: Math.random().toString(20).slice(2),
            rule: 1,
            type: 1,
            text: "",
          },
        ],
        default_condition: {
          id: "default",
          rule: 0,
          type: 0,
          text: "Default",
        },
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
      validationSchema={UiYupSwitchConditionSchema}
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
                  Switch Condition
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 overflow-auto bg-scroll space-y-4">
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Variable
                  </Text>
                  <VariableSuggestionInput
                    name="input_variable"
                    value={values?.input_variable}
                    onChange={(e: any) => {
                      setFieldValue("input_variable", e.target.value);
                    }}
                    className="w-full"
                    placeholder="@value"
                  />
                </div>

                <FieldArray name="switch_conditions">
                  {({ insert, remove, push }: any) => (
                    <div>
                      <div className="w-full flex items-center justify-between">
                        <Text size="base" weight="semibold">
                          Add Variant
                        </Text>
                        <Button
                          size="icon"
                          className="rounded-full h-8 w-8"
                          onClick={() =>
                            push({
                              id: Math.random().toString(20).slice(2),
                              rule: 1,
                              type: 1,
                              text: "",
                            })
                          }
                        >
                          <PlusIcon />
                        </Button>
                      </div>
                      <div className="space-y-2 my-4">
                        {values.switch_conditions.length > 0 &&
                          values.switch_conditions.map(
                            (value: any, index: number) => (
                              <div
                                className="flex justify-between items-center gap-2 "
                                key={index}
                              >
                                <Listbox
                                  options={options}
                                  selectedOption={options.find(
                                    (item: any, index: number) =>
                                      item.id == value.rule
                                  )}
                                  buttonClassname={"w-44"}
                                  handleData={(value: any) => {
                                    setFieldValue(
                                      `switch_conditions.${index}.rule`,
                                      value.id
                                    );
                                  }}
                                />
                                <div className="flex-1">
                                  <Input
                                    name={`switch_conditions.${index}.text`}
                                    placeholder="Answer"
                                    type="text"
                                    value={value.text}
                                    onChange={handleChange}
                                    errorKey={
                                      errors?.switch_conditions?.length > 0 &&
                                      errors?.switch_conditions[index]?.text
                                    }
                                  />
                                </div>

                                {values.switch_conditions.length > 1 ? (
                                  <div
                                    className="w-10 h-10 p-1 rounded-md bg-red-100 flex justify-center items-center cursor-pointer"
                                    onClick={() => remove(index)}
                                  >
                                    <DeleteIcon className="w-5 h-5 text-red-400  " />
                                  </div>
                                ) : null}
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  )}
                </FieldArray>
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

export default SwitchTypeSheet;
