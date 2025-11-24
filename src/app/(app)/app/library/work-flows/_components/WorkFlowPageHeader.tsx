"use client";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import Text from "@/components/ui/text";
import { useParams, useRouter } from "next/navigation";

const WorkFlowPageHeader = () => {
  const router = useRouter();
  const { work_flow_id } = useParams();
  return (
    <div className="flex flex-wrap mb-3 ">
      <div className="mr-auto pr-3 align-middle">
        <div className="text-nowrap flex items-center gap-1">
          <div className="w-8 h-6 flex items-center justify-center">
            <ArrowIcon
              className=" text-icon-primary  cursor-pointer"
              onClick={() => {
                router.push("/app/library/work-flows");
              }}
            />
          </div>
          <Text tag={"h1"} size={"xl"} weight="bold">
            {work_flow_id ? "Update Workflow" : "Create Workflow"}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default WorkFlowPageHeader;
