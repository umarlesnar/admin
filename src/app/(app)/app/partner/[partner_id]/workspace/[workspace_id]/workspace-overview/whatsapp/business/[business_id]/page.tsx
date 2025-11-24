import Text from "@/components/ui/text";
import { Metadata } from "next";
import BusinessViewHeader from "./_components/BusinessViewHeader";
import BusinessViewSideNavBar from "./_components/BusinessViewSideNavBar";

export const metadata: Metadata = {
  title: "Channel",
};

const PageHeader = () => {
  return (
    <div className="flex flex-wrap mb-3">
      <div className="mr-auto pr-3 align-middle">
        <div className="text-nowrap inline-block">
          <Text tag={"h1"} size={"xl"} weight="bold">
          Channel
          </Text>
        </div>
      </div>
    </div>
  );
};

export default function BusinessPage() {
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
              <BusinessViewHeader />
              <div className="flex flex-1 gap-2 w-full h-full mt-5 mr-auto overflow-auto bg-scroll">
                <BusinessViewSideNavBar />
                <div className="w-full flex-1 h-full bg-white rounded-md p-4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
