import { Metadata } from "next";
import AlertPageHeader from "./_components/AlertMessagePageHeader";
import { AlertMessageList } from "./_components/AlertMessageList";
import SettingsSideNavBar from "../settings/_components/SettingsSideNavBar";

export const metadata: Metadata = {
  title: "Notification",
};

export default function AlertMessagePage() {
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
             <AlertPageHeader />
              <div className="flex flex-1 gap-2 w-full h-full mt-1 mr-auto overflow-auto bg-scroll">
                <SettingsSideNavBar />
                <div className="w-[70%] flex-1 h-full bg-white rounded-md p-4">
                <AlertMessageList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
