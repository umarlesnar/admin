import Text from "@/components/ui/text";
import { Metadata } from "next";
import WorkspacePageHeader from "../../../_components/WorkspacePageHeader";
import WorkspaceSideNavBar from "../_components/WorkspaceSideNavBar";
import WalletCard from "./_components/WalletCard";
import { TransactionList } from "./_components/TransactionList";

export const metadata: Metadata = {
  title: "Workspace | Wallet",
};

const PageHeader = () => {
  return (
    <div className="flex flex-wrap mb-3">
      <div className="mr-auto pr-3 align-middle">
        <div className="text-nowrap inline-block">
          <Text tag={"h1"} size={"xl"} weight="bold">
            Wallet
          </Text>
        </div>
      </div>
    </div>
  );
};

export default function WalletPage() {
  return (
    <>
      {/* Primary column */}
      <section
        aria-labelledby="primary-heading"
        className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
      >
        <div className="flex-grow overflow-hidden h-screen bg-scroll">
          <div className="w-full h-full flex flex-col max-w-full self-center space-y-3 py-2  sm:px-3.5 md:px-4 lg:px-5 @container min-h-full">
            <div className="w-full h-full flex-1 flex flex-col max-w-full self-center">
              <WorkspacePageHeader />
              <div className="flex flex-1 gap-2 w-full h-full mt-5 mr-auto overflow-hidden  bg-scroll">
                <WorkspaceSideNavBar />
                <div className="w-full flex-1 h-full lg:overflow-hidden overflow-auto rounded-md p-4 space-y-5">
                  <WalletCard />
                  <div className="w-full h-full lg:h-[60vh] overflow-y-auto pb-20 flex-1">
                  <TransactionList />
                  </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

