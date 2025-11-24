import { Metadata } from "next";
import DashboardPageHeader from "./_components/DashboardPageHeader";
import DashboardOverviewCard from "./_components/DashboardOverviewCard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <>
      {/* Primary column */}
      <section
        aria-labelledby="primary-heading"
        className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
      >
        <div className="flex-grow overflow-hidden h-screen bg-scroll">
          <div className="w-full h-full flex flex-col max-w-full self-center space-y-3 py-3  sm:px-3.5 md:px-4 lg:px-3 @container min-h-full">
            <div className="w-full h-full flex-1 flex flex-col max-w-full self-center">
              <div className=" gap-2 w-full h-full mr-auto overflow-auto bg-scroll">
                <div className="w-full flex-1 h-full rounded-md">
                  <DashboardOverviewCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

