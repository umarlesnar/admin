import EditFlowBuilder from "./_components/EditFlowBuilder";
import { Metadata } from "next";
import FlowPageHeader from "../../_components/FlowPageHeader";

export const metadata: Metadata = {
  title: "Flows",
};

export default function MyFlowPage() {
  return (
    <>
      {/* Primary column */}
      <section
        aria-labelledby="primary-heading"
        className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
      >
        <div className="flex-grow overflow-hidden h-screen bg-scroll">
          <div className="w-full h-full flex flex-col max-w-full self-center space-y-3 py-3 sm:px-3.5 md:px-4 lg:px-5 @container min-h-full">
            <div className="w-full h-full flex-1 flex flex-col max-w-full self-center py-1">
              <FlowPageHeader />
              <div className="flex flex-1 gap-4 w-full h-full mr-auto ">
                <EditFlowBuilder />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
