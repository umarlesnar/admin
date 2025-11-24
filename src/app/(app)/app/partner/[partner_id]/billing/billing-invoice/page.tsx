import Text from "@/components/ui/text";
import { Metadata } from "next";
import SettingsSideNavBar from "../../settings/_components/SettingsSideNavBar";
import BillingInvoicePageHeader from "./_components/BillingInvoicePageHeader";
import { BillingInvoiceList } from "./_components/BillingInvoiceList";

export const metadata: Metadata = {
  title: "Billing Invoice",
};

const PageHeader = () => {
  return (
    <div className="flex flex-wrap mb-3">
      <div className="mr-auto pr-3 align-middle">
        <div className="text-nowrap inline-block">
          <Text tag={"h1"} size={"xl"} weight="bold">
            Billing Invoice
          </Text>
        </div>
      </div>
    </div>
  );
};

export default function BillingInvoicePage() {
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
              <BillingInvoicePageHeader />
              <div className="flex flex-1 gap-2 w-full h-full mt-1 mr-auto overflow-auto bg-scroll">
                <SettingsSideNavBar />
                <div className="w-[70%] flex-1 h-full bg-white rounded-md p-4">
                  <BillingInvoiceList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
