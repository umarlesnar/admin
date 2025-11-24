
import IamPageHeader from "../_components/IamPageHeader";
import IamSideNavBar from "../_components/IamSideNavBar";

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="w-full px-5 py-3">
        <IamPageHeader />
      </div>

      {/* Sidebar & Main Content */}
      <div className="flex flex-1">
        <div className="pl-5 py-2">
          <IamSideNavBar />
        </div>

        {/* Main Content */}
        <main className="min-w-0 flex-1 flex flex-col bg-[#eef1ee] h-[94vh]">
          {/* <Alerts /> */}
          <div className="flex-1 overflow-y-hidden">{children}</div>
        </main>
      </div>
    </div>
  );
}
