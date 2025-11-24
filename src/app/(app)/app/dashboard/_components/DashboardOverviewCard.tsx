"use client";
import Text from "@/components/ui/text";
import { useOverviewQuery } from "@/framework/dashboard/get-dashboard-overview";
import UserLoginActivity from "./UserLoginActivityLists";
import BusinessAccountLists from "./BusinessAccountLists";
import OnboardingUserLists from "./OnboardingUserLists";
import DashboardPageHeader from "./DashboardPageHeader";
import { useUserLoginQuery } from "@/framework/dashboard/recent/get-user-login-activity";
import { useBusinessAccountQuery } from "@/framework/dashboard/recent/get-business-account";
import { useOnboardingUserQuery } from "@/framework/dashboard/recent/get-onboarding-user";
import { sub } from "date-fns";

const formatNumber = (num: number) => (num ? num.toLocaleString() : "0");
const DashboardOverviewCard = () => {
  const { data, isLoading, refetch } = useOverviewQuery({});
  const { refetch: refetchUserLogin } = useUserLoginQuery({});
  const { refetch: refetchBusinessAccount } = useBusinessAccountQuery({});
  const { refetch: refetchOnboardingUsers } = useOnboardingUserQuery({});

  const handleRefetch = () => {
    refetch();
    refetchUserLogin();
    refetchBusinessAccount();
    refetchOnboardingUsers();
  };
  const MessageCount = [
    {
      subtitle:"( This Month )",
      title: "Incoming",
      value: formatNumber(data?.incomming),
    },
    {
      subtitle:"( This Month )",
      title: "Outgoing",
      value: formatNumber(data?.outgoing),
    },
    {
      subtitle:"( Last Month )",
      title: "Incoming",
      value: formatNumber(data?.lastMonthIncomming),
    },
    {
      subtitle:"( Last Month )",
      title: "Outgoing",
      value: formatNumber(data?.lastMonthOutgoing),
    },
  ];

  const items = [
    {
      title: "Active Business",
      value: formatNumber(data?.activeBusiness),
    },
    {
      title: "Inactive Business",
      value: formatNumber(data?.inactiveBusiness),
    },
    {
      title: "Onboarding Users",
      value: formatNumber(data?.onboardingUsers),
    },
    {
      title: "Contacts",
      value: formatNumber(data?.contacts),
    },
    {
      title: "Ongoing Broadcasts",
      value: formatNumber(data?.onboardingBroadcasts),
    },
  ];
  const items2 = [
    {
      title: "Botflows",
      value: formatNumber(data?.flows),
    },
    {
      title: "Botflow Tiggers",
      value: formatNumber(data?.flowSessions),
    },
    {
      title: "Workflows",
      value: formatNumber(data?.workflows),
    },
    {
      title: "Workflow Tiggers",
      value: formatNumber(data?.workflowLogs),
    },
  ];

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="p-2">
        <DashboardPageHeader refetch={handleRefetch} />
      </div>
      <div className="p-4">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gird-cols-1 gap-4 mb-5">
          {MessageCount.map((item, index) => (
            <div
              key={index}
              className={`w-full h-full p-6 rounded-lg border border-border-tertiary flex flex-col gap-2 transition-colors duration-300
              ${isLoading ? "bg-gray-100" : "bg-white"}`}
            >
              {isLoading ? (
                <div className="flex flex-col gap-4 justify-between">
                  <div className="flex justify-start">
                    <div className="flex gap-1 items-center">
                      <Text
                        size="xl"
                        weight="regular"
                        textColor="text-text-primary"
                      >
                        {item.title}
                      </Text>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-4">
                    <div>
                      <Text
                        size="xs"
                        weight="regular"
                        textColor="text-text-primary"
                      >
                        {item.subtitle}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                    <div className="flex gap-1 items-center">
                      <Text
                        size="lg"
                        weight="regular"
                        textColor="text-text-primary"
                      >
                        {item.title}
                      </Text>
                    </div>
                    <Text
                      size="2xl"
                      weight="semibold"
                      textColor="text-text-primary"
                    >
                      {item.value}
                    </Text>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-5 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 text-center">
          {items.map((item, index) => (
            <div
              key={index}
              className={`w-full h-full p-6 rounded-lg border border-border-tertiary flex flex-col gap-2 transition-colors duration-300
              ${isLoading ? "bg-gray-100" : "bg-white"}`}
            >
              {isLoading ? (
                <div className="flex flex-col gap-6 items-center justify-center">
                  <div className="flex justify-start">
                    <div className="flex gap-1 items-center">
                      <Text
                        size="xl"
                        weight="regular"
                        textColor="text-text-primary"
                      >
                        {item.title}
                      </Text>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="h-8 w-8  border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center gap-6">
                  <div className="flex gap-1 items-center">
                    <Text
                      size="lg"
                      weight="regular"
                      textColor="text-text-primary"
                    >
                      {item.title}
                    </Text>
                  </div>
                  <Text
                    size="2xl"
                    weight="semibold"
                    textColor="text-text-primary"
                  >
                    {item.value}
                  </Text>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gird-cols-1 gap-4 mt-5">
          {items2.map((item, index) => (
            <div
              key={index}
              className={`w-full h-full p-6 rounded-lg border border-border-tertiary flex flex-col gap-2 transition-colors duration-300
              ${isLoading ? "bg-gray-100" : "bg-white"}`}
            >
              {isLoading ? (
                <div className="flex flex-col gap-6 items-center justify-center">
                  <div className="flex justify-start">
                    <div className="flex gap-1 items-center">
                      <Text
                        size="xl"
                        weight="regular"
                        textColor="text-text-primary"
                      >
                        {item.title}
                      </Text>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col justify-center items-center gap-6">
                    <div className="flex gap-1 items-center">
                      <Text
                        size="lg"
                        weight="regular"
                        textColor="text-text-primary"
                      >
                        {item.title}
                      </Text>
                    </div>
                    <Text
                      size="2xl"
                      weight="semibold"
                      textColor="text-text-primary"
                    >
                      {item.value}
                    </Text>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-5">
          <div>
            <UserLoginActivity />
          </div>
          <div>
            <BusinessAccountLists />
          </div>
        </div>
        <div className="mt-5">
          <OnboardingUserLists />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewCard;
