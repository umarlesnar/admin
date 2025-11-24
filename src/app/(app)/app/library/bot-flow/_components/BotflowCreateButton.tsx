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
import { useBotFlowLibraryMutation } from "@/framework/bot-flow-library/bot-flow-library-mutation";
import { useIndustries } from "@/framework/industries/get-industries";
import { useUsecaseApi } from "@/framework/usecase/get-usecase";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useStore from "./store";
import { Combobox } from "@/components/ui/combobox";

export function BotFlowCreateButton() {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync, isPending } = useBotFlowLibraryMutation();
  const router = useRouter();
  const [industries, setIndustries] = useState<string | null>(null);
  const [industryId, setIndustryId] = useState<string | null>(null);
  const [useCase, setUseCase] = useState<string | null>(null);
  const { nodes, edges, industry, use_case }: any =
    useStore();

  const { data: industriesData } = useIndustries({});

  const { data: useCasesData } = useUsecaseApi({
    industries_id: industryId,
  });

  useEffect(() => {
    setIndustries(industry);
    setUseCase(use_case);
  }, [industry, use_case]);

  return (
    <Formik
      initialValues={{
        name: "Untitled",
        nodes: [],
        edges: [],
        description: "",
        use_case: "",
        industry: "",
      }}
      onSubmit={async (values) => {
        const loadingToast = toast.loading("Loading...");
        try {
          const res = await mutateAsync({
            method: "POST",
            payload: {
              name: values.name,
              nodes: nodes,
              edges: edges,
              description: values.description,
              industry: industries || "UTILITY", 
              use_case: useCase || "UTILITY", 
            },
          });
          toast.success(`Bot flow created successfully`, {
            id: loadingToast,
          });
          setOpen(false);
        } catch (error) {
          toast.error(`Failed to create Bot flow`, {
            id: loadingToast,
          });
          console.log("error", error);
        }
      }}
    >
      {({
        handleChange,
        handleSubmit,
        resetForm,
      }) => (
        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>Create Bot Flow</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div className="flex flex-row items-center justify-between  border-b border-neutral-60 p-4 px-6">
              <DialogHeader>
                <DialogTitle>Bot Flow</DialogTitle>
              </DialogHeader>
            </div>
            <Form onSubmit={handleSubmit} className="py-1 space-y-4 pb-6 px-6">
              <div className="w-full">
                <Input
                  name="name"
                  label="Bot Flow Name"
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
                <Text weight="semibold" color="primary">
                  Description
                </Text>
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
              <div className="w-full space-y-1">
                <Combobox
                  options={industriesData?.items?.filter(
                    (item: any) => item.status === "ENABLE"
                  )}
                  buttonClassname="w-full"
                  dropdownClassname={`p-2 text-sm`}
                  placeholder={"Select Industry"}
                  selectedOption={industriesData?.items?.find((o: any) => {
                    return o?.name == industries; // Use local state for display
                  })}
                  onSelectData={(selectedIndustry: any) => {
                    setIndustries(selectedIndustry?.name);
                    setIndustryId(selectedIndustry?._id);
                  }}
                />
              </div>

              <div className="w-full space-y-1">
                <Combobox
                  options={useCasesData?.items || []}
                  buttonClassname="w-full"
                  dropdownClassname={`p-2`}
                  placeholder={"Select Usecase"}
                  selectedOption={useCasesData?.items?.find((o: any) => {
                    return o.name == useCase; // Use local state for display
                  })}
                  onSelectData={(selectedUseCase: any) => {
                    setUseCase(selectedUseCase.name);
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
