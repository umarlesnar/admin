"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useWorkFlowMutation } from "@/framework/workflow-library/workflow-mutation";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function WorkFlowCreateButton() {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync, isPending } = useWorkFlowMutation();
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        type: "workflow",
        platform: "whatsapp",
        name: "",
        description:"",
        secret_key: "",
        tags: [],
        nodes: [],
        edges: [],
        status: "ACTIVE",
      }}
      onSubmit={async (values) => {
        const loadingToast = toast.loading("Loading...");
        try {
          const res = await mutateAsync({
            method: "POST",
            payload: values,
          });
          toast.success(`Work flow created successfully`, {
            id: loadingToast,
          });
          setOpen(false);
          // router.push(
          //   "/app/automation/work-flows/edit/" + res?.data?.data?._id
          // );
        } catch (error) {
          toast.error(`Failed to create work flow`, {
            id: loadingToast,
          });
          console.log("error", error);
        }
      }}
    >
      {({ values, errors, handleChange, handleSubmit, resetForm }) => (
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>Create Work Flow</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div className="flex flex-row items-center justify-between  border-b border-neutral-60 p-4 px-6">
              <DialogHeader>
                <DialogTitle>Work Flow</DialogTitle>
              </DialogHeader>
            </div>
            <Form onSubmit={handleSubmit} className="py-1 space-y-4 pb-6 px-6">
              <div className="w-full">
                <Input
                  name="name"
                  label="Work Flow Name"
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
              </div>
              <div className="space-y-1">
                <Text weight="semibold" color="primary">Description</Text>
                <Textarea
                  name="description"
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending} loading={isPending}>
                  Create
                </Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </Formik>
  );
}
