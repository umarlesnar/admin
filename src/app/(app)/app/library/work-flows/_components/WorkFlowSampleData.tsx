import { Button } from "@/components/ui/button";
import { RefreshIcon } from "@/components/ui/icons/RefreshIcon";
import { WorkflowDataPlaceholder } from "@/components/ui/icons/WorkflowDataPlaceholder";
import Text from "@/components/ui/text";
import { useWorkFlowLogQuery } from "@/framework/workflow-library/get-work-flow-log";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";

type Props = {};

const WorkFlowSampleData = (props: Props) => {
  const { data, refetch, isLoading, isFetching } = useWorkFlowLogQuery();

  if (data) {
    return (
      <div className="w-full h-[100%] p-2  rounded-md overflow-y-auto bg-scroll space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mb-2">Workflow Sample Data</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              refetch();
            }}
            leftIcon={<RefreshIcon className="w-4 h-4 mr-2" />}
          >
            Refresh
          </Button>
        </div>
        <div className="h-[92%] overflow-y-auto ">
          <JSONPretty
            className="w-full h-full text-xs"
            data={data?.response_data}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full bg-white flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center w-[90%] space-y-3">
          <WorkflowDataPlaceholder />
          <Text size="xl" weight="semibold">
            Capture Workflow Data
          </Text>
          <Text size="sm" color="secondary" className="text-center w-[80%]">
            Make your workflows smarter by fetching real-time data to power
            automation and customer engagement.
          </Text>
          <Button
            className="w-[80%]"
            onClick={() => {
              refetch();
            }}
            disabled={isLoading || isFetching}
            loading={isLoading || isFetching}
          >
            Capture Data
          </Button>
        </div>
      </div>
    );
  }
};

export default WorkFlowSampleData;
