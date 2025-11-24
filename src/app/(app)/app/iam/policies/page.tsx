import Text from "@/components/ui/text";
import { Metadata } from "next";
import PoliciesFormPage from "./_components/PoliciesFormPage";

export const metadata: Metadata = {
  title: "Access Management",
};

const PageHeader = () => {
  return (
    <div className="flex flex-wrap mb-3">
      <div className="mr-auto pr-3 align-middle">
        <div className="text-nowrap inline-block">
          <Text tag={"h1"} size={"xl"} weight="bold">
          Access Management
          </Text>
        </div>
      </div>
    </div>
  );
};

export default function IamPage() {
  return (
    <>
      {/* Primary column */}
      <section
        aria-labelledby="primary-heading"
        className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
      >
        <div className="flex-grow overflow-hidden h-screen bg-scroll">
          <div className="w-full h-full flex flex-col max-w-full self-center space-y-3 py-2 sm:px-3.5 md:px-4 lg:px-2 @container min-h-full">
                <div className="w-full flex-1 bg-white rounded-md p-4">
                  <PoliciesFormPage />
                </div>
              </div>
            </div>
      </section>
    </>
  );
}