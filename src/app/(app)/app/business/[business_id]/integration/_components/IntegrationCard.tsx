"use client";
import { IntegrationIcon } from "@/components/ui/icons/IntegrationIcon";
import RefreshButton from "@/components/ui/RefreshBotton";
import Text from "@/components/ui/text";
import { useInstallationAppsQuery } from "@/framework/integration/get-installation-apps";
import { useEffect, useState } from "react";

const InstallationApps = () => {
  const { data, isLoading, isFetching, refetch } = useInstallationAppsQuery();
  const [apps, setApps] = useState(data ?? []);

  useEffect(() => {
    if (data) {
      setApps(data);
    }
  }, [data]);

  return (
    <div className="w-full xs:mx-16 lg:mx-0 md:mx-0 xl:mx-0 h-full">
      <div className="flex justify-end mb-5">
        <RefreshButton
          onClick={() => refetch()}
        />
      </div>
      <div className="overflow-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 m-4 ">
        {isLoading || isFetching ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="p-6 border border-[#DEE2E1] shadow-lg rounded-2xl bg-neutral-20 animate-pulse h-[160px] flex flex-col justify-center items-center"
            >
              <div className="bg-neutral-40 rounded-xl animate-pulse w-16 h-16 mb-2"></div>
              <div className="bg-neutral-40 rounded-xl animate-pulse w-32 h-4 mb-1"></div>
              <div className="bg-neutral-40 rounded-xl animate-pulse w-24 h-3"></div>
            </div>
          ))
        ) : apps?.length === 0 ? (
          <div className="col-span-full">
            <div className="flex flex-col items-center justify-center space-y-4 h-[700px]">
              <IntegrationIcon className="w-12 h-12 text-primary" />
              <Text size="2xl" weight="semibold">
                No Integration found!
              </Text>
              <Text
                size="sm"
                weight="regular"
                color="teritary"
                className="w-full max-w-sm text-center"
              >
                No integrations found, try searching with another keyword or
                create a new integration.
              </Text>
            </div>
          </div>
        ) : (
          apps.map((app: any, index: number) => (
            <div
              key={index}
              className="p-6 border border-[#DEE2E1] shadow-lg rounded-2xl bg-white"
            >
              <img
                src={app?.image_url}
                alt="Integration Icon"
                className="xl:w-10 lg:w-14 md:w-14 sm:w-12  xl:h-10 lg:h-14 md:h-14 sm:h-12 rounded-md"
              />
              <div className="">
                <Text tag="h1" size="base" weight="medium" className="my-1">
                  {app?.name}
                </Text>
                <Text color="secondary" size="xs" className="leading-5">
                  {app?.description}
                </Text>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InstallationApps;
