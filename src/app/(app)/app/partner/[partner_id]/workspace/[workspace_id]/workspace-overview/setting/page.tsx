// src/app/(app)/app/partner/[partner_id]/workspace/[workspace_id]/workspace-overview/setting/page.tsx

import Text from "@/components/ui/text";
import { Metadata } from "next";
import WorkspacePageHeader from "../../../_components/WorkspacePageHeader";
import WorkspaceSideNavBar from "../_components/WorkspaceSideNavBar";
import WorkspaceSettingsCardsList from "./WorkspaceSettingCard";

export const metadata: Metadata = {
  title: "Workspace | Setting",
};

export default function WorkspaceSettingPage() {
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
                <div className="w-full flex-1 h-full bg-white overflow-auto rounded-md p-4 space-y-4">
               <WorkspaceSettingsCardsList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}