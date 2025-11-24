import Text from "@/components/ui/text";
import { Metadata } from "next";
import WorkFlowLogsList from "./_components/WorkflowLogsList";
import LibrarySideNavBar from "../../../_components/LibrarySidenavbar";

export const metadata: Metadata = {
  title: "Flows",
};
const PageHeader = () => {
  return (
    <div className="flex flex-wrap mb-3">
      <div className="mr-auto pr-3 align-middle">
        <div className="text-nowrap inline-block">
          <Text tag={"h1"} size={"xl"} weight="bold">
            Automations
          </Text>
        </div>
      </div>
    </div>
  );
};

export default function WorkflowLogsPage() {
  return (
    <>
      {/* Primary column */}
      <section
        aria-labelledby="primary-heading"
        className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
      >
        <div className="flex-grow overflow-hidden h-screen bg-scroll">
          <div className="w-full h-full flex flex-col max-w-full self-center space-y-3 py-3 md:px-4 lg:px-3 @container min-h-full">
            <div className="w-full h-full flex-1 flex flex-col max-w-full self-center ">
              <PageHeader />
              <div className="flex flex-1 gap-2 w-full h-full mr-auto overflow-auto bg-scroll">
                <LibrarySideNavBar />
                <div className="w-full flex-1 h-full bg-white rounded-md">
                  <WorkFlowLogsList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
