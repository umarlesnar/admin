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
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { VariableSuggestionInput } from "@/components/ui/variable-suggestion-input";
import useWorkflowStore from "../WorkflowStore";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const WorkflowTransformTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useWorkflowStore();
  return (
    <Formik
      initialValues={{
        node_input:"@USER_MESSAGE_INPUT",
        code: "",
        args: ["@var1", "@var2"],
        result_variable: "@result",
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
                  Transform
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 py-2 overflow-auto bg-scroll space-y-3">
              <div className="space-y-2">
                  <Text size="sm" weight="medium">
                   User Input
                  </Text>
                  <VariableSuggestionInput
                      name="node_input"
                      value={values?.node_input}
                      onChange={(e: any) => {
                        setFieldValue("node_input", e.target.value);
                      }}
                      className="w-full"
                      placeholder="@value"
                     />
                </div>
                <div style={{ border: "1px solid #ddd", marginBottom: "10px" }}>
                  <CodeMirror
                    value={values.code}
                    height="300px"
                    theme="dark"
                    extensions={[javascript()]}
                    onChange={(value) => setFieldValue("code", value)}
                  />
                </div>

                <Input
                  label="Result Variable"
                  name="result_variable"
                  onChange={handleChange}
                  errorKey={errors?.result_variable}
                  value={values.result_variable}
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

export default WorkflowTransformTypeSheet;
