import Text from "@/components/ui/text";
import { Metadata } from "next";
import WorkspacePageHeader from "../../../_components/WorkspacePageHeader";
import { NotificationList } from "./_components/NotificationList";
import WorkspaceSideNavBar from "../_components/WorkspaceSideNavBar";

export const metadata: Metadata = {
  title: "Workspace | Notifications",
};

const PageHeader = () => {
  return (
    <div className="flex flex-wrap mb-3">
      <div className="mr-auto pr-3 align-middle">
        <div className="text-nowrap inline-block">
          <Text tag={"h1"} size={"xl"} weight="bold">
            Notifications
          </Text>
        </div>
      </div>
    </div>
  );
};

export default function NotificationPage() {
  return (
    <>
      {/* Primary column */}
      <section
        aria-labelledby="primary-heading"
        className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
      >
        <div className="flex-grow overflow-hidden h-screen bg-scroll">
          <div className="w-full h-full flex flex-col max-w-full self-center space-y-3 py-3  sm:px-3.5 md:px-4 lg:px-5 @container min-h-full">
            <div className="w-full h-full flex-1 flex flex-col max-w-full self-center">
            <WorkspacePageHeader />
              <div className="flex flex-1 gap-2 w-full h-full mt-5 mr-auto overflow-hidden  bg-scroll">
                <WorkspaceSideNavBar />
                <div className="w-full flex-1 h-full overflow-auto rounded-md p-4">
               <NotificationList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
