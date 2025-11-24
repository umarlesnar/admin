import { Button } from "@/components/ui/button";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { ImportIcon } from "@/components/ui/icons/ImportIcon";
import { useBotFlowLibraryMutation } from "@/framework/bot-flow-library/bot-flow-library-mutation";
// import { method } from "lodash";
import React from "react";
import { toast } from "sonner";

type Props = {};

const FlowImportButton = (props: Props) => {
  const FlowUpload: any = React.useRef<HTMLInputElement>(null);
  const { mutateAsync } = useBotFlowLibraryMutation();
  const changeHandler = async (event: any) => {
    event.preventDefault();

    const file = event.target.files[0];

    if (file) {
      const fileName = event.target.files[0]?.name.split(".")[0];

      var anyData: any;

      const fileReader = new FileReader();
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = async (e: any) => {
        if (e.target.result) {
          const loadingToast = toast.loading("please wait");

          try {
            const data = JSON.stringify(e.target.result);
            const fData = JSON.parse(data);
            const parseData = JSON.parse(fData);
            const response = await mutateAsync({
              method: "POST",
              payload: {
                name: fileName,
                nodes: parseData.nodes,
                edges: parseData.edges,
              },
            });

            toast.success(`Flow import Successfully`, {
              id: loadingToast,
            });
          } catch (error: any) {
            toast.error(`Failed to Import Flow 1`, {
              id: loadingToast,
            });
          }
        }
      };
    }
  };

  const handleFileSelectClick = () => {
    if (FlowUpload) {
      FlowUpload?.current.click();
    }
  };
  return (
    <>
      <form>
        <input
          type="file"
          name="file"
          ref={FlowUpload}
          onChange={changeHandler}
          style={{ display: "none" }}
          accept={"application/json"}
        />
      </form>
      <CustomTooltip value={"Import a flow"}>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            handleFileSelectClick();
          }}
        >
          <ImportIcon className="w- h-5 text-icon-secondary" />
        </Button>
      </CustomTooltip>
    </>
  );
};

export default FlowImportButton;
