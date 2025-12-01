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
import useStore from "../store";
import Text from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import * as yup from "yup";

const flowRepliesSchema = yup.object({
  flow_replies: yup.object({
    header_text: yup.string(),
    body_text: yup.string().required("Body is required field"),
    footer_text: yup.string(),
    url: yup.string().url().required("Button URL is required field"),
    button_text: yup.string().required("Button text is required field"),
  }),
});

type Props = {
  children: ReactElement;
  data?: any;
  id?: any;
};

const WebViewTypeSheet = ({ children, data, id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData } = useStore();
  return (
    <Formik
      initialValues={{
        flow_replies: {
          header_text: "",
          body_text: "",
          footer_text: "",
          url: "",
          button_text: "",
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
      validationSchema={flowRepliesSchema}
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
                  Webview
                </SheetTitle>
              </SheetHeader>

              {/* form body */}
              <div className="flex flex-1 flex-col px-1 overflow-auto bg-scroll space-y-4">
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Header
                  </Text>
                  <Input
                    name="flow_replies.header_text"
                    value={values?.flow_replies?.header_text}
                    placeholder={"Header text"}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    component={"p"}
                    name="flow_replies.header_text"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Body
                    <span className="text-sm text-red-500 ml-[2px]">*</span>
                  </Text>
                  <Textarea
                    name="flow_replies.body_text"
                    placeholder="What do you think?"
                    onChange={handleChange}
                    value={values?.flow_replies?.body_text}
                  />
                  <ErrorMessage
                    component={"p"}
                    name="flow_replies.body_text"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Text size="sm" weight="medium">
                    Footer
                  </Text>
                  <Input
                    name="flow_replies.footer_text"
                    value={values?.flow_replies?.footer_text}
                    placeholder={"Footer text"}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    component={"p"}
                    name="flow_replies.footer_text"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="w-full flex ">
                    <Text size="sm" weight="medium">
                      Button Text
                    </Text>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <Input
                    name="flow_replies.button_text"
                    value={values?.flow_replies?.button_text}
                    placeholder={"Button text"}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    component={"p"}
                    name="flow_replies.action.parameters.display_text"
                    className="test-sm font-normal text-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="w-full flex ">
                    <Text size="sm" weight="medium">
                      Button URL
                    </Text>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <Input
                    name="flow_replies.url"
                    value={values?.flow_replies?.url}
                    placeholder={"Button URL"}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    component={"p"}
                    name="flow_replies.url"
                    className="test-sm font-normal text-red-500"
                  />
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

export default WebViewTypeSheet;
