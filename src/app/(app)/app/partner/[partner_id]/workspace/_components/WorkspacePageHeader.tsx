"use client";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import Text from "@/components/ui/text";
import { WorkspaceComboBox } from "@/components/ui/WorkpsaceComboBox";
import { useApplication } from "@/contexts/application/application.context";
import { useWorkspaceQuery } from "@/framework/workspace/get-workspace";
import { useWorkspaceByIdQuery } from "@/framework/workspace/get-workspace-by-id";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const WorkspacePageHeader = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const { setUserParams } = useApplication();
  const workspace_id = params?.workspace_id as string;
  const partner_id = params?.partner_id as string;

  const safeJSONParse = (jsonString: string | null, defaultValue: any) => {
    try {
      return jsonString ? JSON.parse(jsonString) : defaultValue;
    } catch (error) {
      console.error("JSON parse error:", error);
      return defaultValue;
    }
  };

  const [queryPage, setQueryPage] = useState(() => ({
    per_page: Number(searchParams.get("per_page") || "20"),
    page: Number(searchParams.get("page") || "1"),
    q: searchParams.get("q") || "",
    filter: safeJSONParse(searchParams.get("filter"), {
      status: "",
      partner_id,
    }),
    sort: safeJSONParse(searchParams.get("sort"), { created_at: "-1" }),
  }));

  const { data, isLoading } = useWorkspaceByIdQuery(workspace_id);
  const { data: workspaceData } = useWorkspaceQuery(queryPage);

  const selectedWorkspace = workspaceData?.items?.find(
    (item: any) => item._id === workspace_id
  );

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
                router?.push(`/app/partner/${partner_id}/workspace`);
              }}
            />
            {!isLoading ? (
              <Text size="lg" weight="semibold" color="primary">
                {selectedWorkspace?.name || data?.name || "Workspace"}
              </Text>
            ) : (
              <div className="bg-neutral-50/50 w-60 h-9 rounded-lg animate-pulse"></div>
            )}
          </div>
          {!isLoading ? (
            <div className="w-[23%]">
              <WorkspaceComboBox
                options={
                  workspaceData?.items.map((item: any) => ({
                    name: item.name,
                    value: item._id,
                  })) || []
                }
                img_data={
                  selectedWorkspace?.workspace_logo_url ||
                  data?.workspace_logo_url
                }
                workspace_data={selectedWorkspace?.name || data?.name}
                imgUrl={`https://static.kwic.in${
                  selectedWorkspace?.workspace_logo_url ||
                  data?.workspace_logo_url
                }`}
                buttonClassname="w-full"
                dropdownClassname="p-2 w-[100%]"
                placeholder={
                  selectedWorkspace?.name || data?.name || "Select Workspace"
                }
                onSelectData={(workspace: any) => {
                  router.replace(
                    `/app/partner/${partner_id}/workspace/${workspace.value}/workspace-overview`
                  );
                }}
                selectedValue={workspace_id}
                onSearch={(searchText: string) =>
                  setQueryPage((prev: any) => ({
                    ...prev,
                    q: searchText,
                    page: 1,
                  }))
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

export default WorkspacePageHeader;
