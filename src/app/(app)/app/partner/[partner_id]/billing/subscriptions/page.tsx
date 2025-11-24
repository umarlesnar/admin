import Text from "@/components/ui/text";
import { Metadata } from "next";
import SubscriptionList from "./_components/SubscriptionList";
import SettingsSideNavBar from "../../settings/_components/SettingsSideNavBar";
import SubscriptionPageHeader from "./_components/SubsciptionPageHeader";

export const metadata: Metadata = {
  title: "Billing | Subscription",
};

const PageHeader = () => {
  return (
    <div className="flex flex-wrap mb-3">
      <div className="mr-auto pr-3 align-middle">
        <div className="text-nowrap inline-block">
          <Text tag={"h1"} size={"xl"} weight="bold">
            Subscription
          </Text>
        </div>
      </div>
    </div>
  );
};

export default function SubscriptionPage() {
  return (
    <>
      <section
        aria-labelledby="primary-heading"
        className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
      >
        <div className="flex-grow overflow-hidden h-screen bg-scroll">
          <div className="w-full h-full flex flex-col max-w-full self-center space-y-2 py-2 sm:px-2 md:px-3 lg:px-4 @container min-h-full">
            <div className="w-full h-full flex-1 flex flex-col max-w-full self-center">
              <SubscriptionPageHeader />
              <div className="flex flex-1 gap-2 w-full h-full mt-1 mr-auto overflow-hidden bg-scroll">
                <SettingsSideNavBar />
                <div className="w-[70%] flex-1 h-full bg-white rounded-md p-2 overflow-x-auto min-w-0">
                  <SubscriptionList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
