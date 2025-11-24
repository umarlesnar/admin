"use client";
import { BusinessComboBox } from "@/components/ui/BusinessComboBox";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import Text from "@/components/ui/text";
import { useApplication } from "@/contexts/application/application.context";
import { useBusinessAccountsQuery } from "@/framework/business/get-business-accounts";
import { useBusinessByIdQuery } from "@/framework/business/get-business-by-id";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {};

const BusinessPageHeader = (props: Props) => {
  const router = useRouter();
  const params = useParams();
  const { setUserParams } = useApplication();
  const business_id = params?.business_id;

  const [queryFilter, setQueryFilter] = useState({ search: "" });

  const { data, isLoading } = useBusinessByIdQuery(business_id);

  const BusinessData = useBusinessAccountsQuery(queryFilter);

  useEffect(() => {
    if (data) {
      setUserParams({
        business: data,
      });
    }
  }, [data]);

  return (
    <div className="w-full flex flex-wrap">
      <div className="w-full mr-auto pr-6 align-middle">
        <div className="w-full text-nowrap flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowIcon
              className="w-5 cursor-pointer text-icon-primary"
              onClick={() => {
                router?.back();
              }}
            />
            {!isLoading ? (
              <Text size="lg" weight="semibold" color="primary">
                {data?.name}
              </Text>
            ) : (
              <div className="bg-neutral-50/50 w-60 h-9 rounded-lg animate-pulse"></div>
            )}
          </div>
          {!isLoading ? (
            <div className="w-[23%]">
              <BusinessComboBox
                options={
                  BusinessData?.data?.items.map((item: any) => ({
                    name: item.name,
                    value: item._id,
                  })) || []
                }
                img_data={data?.business_logo_url}
                business_data={data?.name}
                imgUrl={`https://static.kwic.in${data?.business_logo_url}`}
                buttonClassname="w-full"
                dropdownClassname="p-2 w-[100%]"
                placeholder={data?.name || "Select Channel"}
                onSelectData={(business: any) => {
                  router.replace(`/app/workspace/${params?.workspace_id}/workspace-overview/whatsapp/business/${business.value}/overview`);
                }}
                selectedValue={business_id}
                onSearch={(searchText: string) =>
                  setQueryFilter({ search: searchText })
                }
              />
            </div>
          ) : (
            <div className="bg-neutral-50/50 w-[23%] h-9 rounded-lg animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessPageHeader;
