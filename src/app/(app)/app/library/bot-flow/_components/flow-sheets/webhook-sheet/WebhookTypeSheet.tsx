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
import { ErrorMessage, Formik } from "formik";
import React, { ReactElement, useState } from "react";
import useStore from "../../store";
import { Listbox } from "@/components/ui/listbox";
import { CustomComponentInput } from "@/components/ui/CustomComponentInput";
import Text from "@/components/ui/text";
import WebHookTypeHeader from "./WebHookTypeHeader";
import WebHookTypeBody from "./WebhookTypeBody";
import WebHookTypeTestRequest from "./WebhookTypeTestRequest";
import WebHookTypeResponseVariable from "./WebhookTypeResponseVariable";
import WebHookTypeStatusCode from "./WebhookTypeStatusCode";
import { UiYupWebhookSchema } from "@/validation-schema/ui/UiYupWebhookSchema";

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const options = [
  { id: 1, name: "GET" },
  { id: 2, name: "POST" },
  { id: 3, name: "PUT" },
  { id: 4, name: "DELETE" },
];

const WebhookTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  return (
    <Formik
      initialValues={{
        body: "",
        method_type: "",
        url: "",
        headers: [],
        test_variable: [],
        response_variable: [],
        expected_status_code: [],
        isHeaderEnable: false,
        isBodyEnable: false,
        isTestEnable: false,
        isResponseEnable: false,
        isStatusEnable: false,
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
      validationSchema={UiYupWebhookSchema}
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
                  Webhook
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 overflow-auto bg-scroll space-y-2">
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    URL & Method
                  </Text>
                  <CustomComponentInput
                    name="url"
                    placeholder="https://"
                    onChange={handleChange}
                    value={values?.url}
                    className="p-0"
                    leftComponent={
                      <Listbox
                        options={options}
                        selectedOption={options.find((o: any) => {
                          return o.name == values.method_type;
                        })}
                        buttonClassname={
                          "h-7 w-24 outline-none border-none mx-1"
                        }
                        dropdownClassname={"w-full h-auto"}
                        onSelectData={(data: any) => {
                          setFieldValue("method_type", data.name);
                        }}
                      />
                    }
                  />{" "}
                  <ErrorMessage
                    component={"p"}
                    name="url"
                    className="test-sm font-normal text-red-500"
                  />
                  <ErrorMessage
                    component={"p"}
                    name="url"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
                <WebHookTypeHeader />
                <WebHookTypeBody />
                <WebHookTypeTestRequest />
                <WebHookTypeResponseVariable />
                <WebHookTypeStatusCode />
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

export default WebhookTypeSheet;
