"use client";
import AsyncTable from "@/components/table/AsyncTable";
import { EditIcon } from "@/components/ui/icons/EditIcone";
import RefreshButton from "@/components/ui/RefreshBotton";
import { SearchBox } from "@/components/ui/SearchBox";
import Text from "@/components/ui/text";
import { ColumnDef } from "@tanstack/react-table";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { ModulesIcon } from "@/components/ui/icons/ModulesIcon";
import { useWorkspaceModulesQuery } from "@/framework/partner/workspace/modules/get-modules";
import EditModuleStatusSheet from "./EditModulesStatusSheet";
import AddWorkspaceModuleSheet from "./AddModuleSheet";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import moment from "moment";
import { Alert } from "@/components/ui/alert";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { toast } from "sonner";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { useWorkspaceModuleMutation } from "@/framework/partner/workspace/modules/module-status-mutation";
import { Listbox } from "@/components/ui/listbox";

const STATUS = [
  { value: "", name: "All" },
  { value: "true", name: "True" },
  { value: "false", name: "False" },
];
const VISIBILITY = [
  { value: "", name: "All" },
  { value: "true", name: "True" },
  { value: "false", name: "False" },
];

export const ModulesList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const workspaceId = params?.workspace_id as string;

  const [activeTab, setActiveTab] = useState("plan");

  const [queryPage, setQueryPage] = useState(() => {
    const safeJSONParse = (jsonString: string | null, defaultValue: any) => {
      try {
        return jsonString ? JSON.parse(jsonString) : defaultValue;
      } catch (error) {
        console.error("JSON parse error:", error);
        return defaultValue;
      }
    };

    return {
      per_page: Number(searchParams.get("per_page") || "20"),
      page: Number(searchParams.get("page") || "1"),
      q: searchParams.get("q") || "",
      filter: safeJSONParse(searchParams.get("filter"), {
        status: "",
        is_visibility: "",
        enabled:"",
      }),
      sort: safeJSONParse(searchParams.get("sort"), { _id: -1}),
    };
  });

  const [pagination, setPagination] = useState({
    per_page: Number(searchParams.get("per_page") || "20"),
    total_page: 0,
    total_result: 0,
    current_page: Number(searchParams.get("page") || "1"),
  });

  const [items, setItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(queryPage).forEach(([key, value]) => {
      try {
        if (value !== undefined && value !== null) {
          if (
            (key === "sort" || key === "filter") &&
            typeof value === "object"
          ) {
            const stringValue = JSON.stringify(value);
            if (stringValue !== "{}") {
              params.set(key, stringValue);
            }
          } else if (value !== 0 && value !== "") {
            params.set(key, String(value));
          }
        }
      } catch (error) {
        console.error(`Error processing key ${key}:`, error);
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [queryPage, pathname, router]);

  const { data, isLoading, refetch } = useWorkspaceModulesQuery(queryPage);
  const { mutateAsync } = useWorkspaceModuleMutation();

  useEffect(() => {
    if (data) {
      setItems(data?.items || []);
      setPagination({
        per_page: data?.per_page,
        total_page: data?.total_page,
        total_result: data?.total_result,
        current_page: data?.current_page,
      });
      setQueryPage((prestate: any) => {
        return {
          ...prestate,
          per_page: data?.per_page,
          page: data?.current_page,
          q: queryPage.q,
        };
      });
    }
  }, [data]);

  const filteredItems = useMemo(() => {
    return items.filter((item: any) => item.source === activeTab);
  }, [items, activeTab]);

  const tabs = [
    { id: "plan", label: "Plan", color: "bg-orange-100 text-orange-700" },
    { id: "trial", label: "Trial", color: "bg-blue-100 text-blue-700" },
    { id: "addon", label: "Addon", color: "bg-purple-100 text-purple-700" },
  ];

  const columns: ColumnDef<any>[] = useMemo(() => {
    const baseColumns: ColumnDef<any>[] = [
      {
        accessorKey: "module_id",
        header: "Module Id",
        cell: ({ row }: any) => (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.module_id || "-"}</Text>
          </div>
        ),
      },
      {
        accessorKey: "source",
        header: "Source",
        cell: ({ row }: any) => {
          const source = row?.original?.source;
          const sourceStyles = {
            trial: "bg-blue-100",
            addon: "bg-purple-100",
            plan: "bg-orange-100",
          };
  
          return (
            <div className="flex items-center gap-2 font-medium">
              <Text
                className={`${
                  sourceStyles[source as keyof typeof sourceStyles]
                } px-2 py-1 rounded`}
              >
                {source || "-"}
              </Text>
            </div>
          );
        },
      },
    ];
  
    if (activeTab !== "plan") {
      baseColumns.push({
        accessorKey: "expired_at",
        header: "Expired At",
        cell: ({ row }: any) => {
          const expiredDateTime = row?.original?.expired_at;
  
          return (
            <div className="flex flex-col">
              <Text
                size="xs"
                weight="medium"
                className={`${
                  expiredDateTime ? "bg-gray-100 rounded" : ""
                } px-2 py-1 w-fit`}
              >
                {expiredDateTime
                  ? moment(expiredDateTime).format("DD-MM-YYYY HH:mm")
                  : "-"}
              </Text>
            </div>
          );
        },
      });
    }
  
    baseColumns.push(
      {
        accessorKey: "enabled",
        header: "Status",
        cell: ({ row }) => (
          <div
            className={`${
              row.getValue("enabled") === true ? "bg-[#def6e8]" : "bg-red-100"
            } max-w-[75px] rounded-sm text-center py-1.5`}
          >
            <p
              className={`text-[13.5px] ${
                row.getValue("enabled") === true
                  ? "text-[#28C76F]"
                  : "text-red-500"
              } font-medium`}
            >
              {row.getValue("enabled") === true ? "True" : "False"}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "is_visibility",
        header: "Visibility",
        cell: ({ row }) => (
          <div
            className={`${
              row.getValue("is_visibility") === true ? "bg-[#def6e8]" : "bg-red-100"
            } max-w-[75px] rounded-sm text-center py-1.5`}
          >
            <p
              className={`text-[13.5px] ${
                row.getValue("is_visibility") === true
                  ? "text-[#28C76F]"
                  : "text-red-500"
              } font-medium`}
            >
              {row.getValue("is_visibility") === true ? "True" : "False"}
            </p>
          </div>
        ),
      },
      {
        id: "action",
        header: "Actions",
        cell: ({ row }: any) => {
          const modules = row.original;
          return (
            <div className="flex items-center gap-4">
              <EditModuleStatusSheet data={modules}>
                <EditIcon className="w-4 h-4 cursor-pointer text-green-600" />
              </EditModuleStatusSheet>
              <>
                <Alert
                  icon={<AlertIcon className="w-[50px] h-[50px] text-red-500" />}
                  description={`Do you want to remove this ${row?.original?.module_id} Module ?`}
                  onRightButton={async () => {
                    const loadingToast = toast.loading("Loading...");
                    try {
                      await mutateAsync({
                        method: "DELETE",
                        modules_id: row?.original?._id,
                      });
                      toast.success(`Module Deleted Successfully`, {
                        id: loadingToast,
                      });
                    } catch (error) {
                      toast.error(`Failed to delete module`, {
                        id: loadingToast,
                      });
                    }
                  }}
                  rightButtonProps={{
                    variant: "destructive",
                  }}
                >
                  <DeleteIcon className="w-4 h-4 cursor-pointer text-red-600" />
                </Alert>
              </>
            </div>
          );
        },
      }
    );
  
    return baseColumns;
  }, [activeTab, mutateAsync]);
  
  

  return (
    <div className="w-full h-full p-1 flex flex-col space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="w-[40%] flex items-center gap-3">
          <SearchBox
            className="w-full"
            placeholder="Search by module"
            onChange={(e) => {
              setQueryPage((prev) => ({
                ...prev,
                page: 1,
                q: e.target.value,
              }));
            }}
          />
        </div>
        <div className="flex items-center gap-2">
        <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Visibility
            </Text>
            <Listbox
              options={VISIBILITY}
              selectedOption={VISIBILITY?.find((o) => {
                return o.value == queryPage?.filter?.is_visibility;
              })}
              onSelectData={(value: any) => {
                setQueryPage((prev: any) => {
                  return {
                    ...prev,
                    page: 1,
                    filter: {
                      ...prev?.filter,
                      is_visibility: value.value,
                    },
                  };
                });
              }}
              buttonClassname={`w-28`}
            />
          </div>
          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Status
            </Text>
            <Listbox
              options={STATUS}
              selectedOption={STATUS?.find((o) => {
                return o.value == queryPage?.filter?.enabled;
              })}
              onSelectData={(value: any) => {
                setQueryPage((prev: any) => {
                  return {
                    ...prev,
                    page: 1,
                    filter: {
                      ...prev?.filter,
                      enabled: value.value,
                    },
                  };
                });
              }}
              buttonClassname={`w-28`}
            />
          </div>
          <div className="mt-6">
            <RefreshButton onClick={() => refetch()} />
          </div>
          <div className="mt-6">
            <AddWorkspaceModuleSheet>
              <Button
                size="sm"
                className=" w-[145px] h-[38px]  "
                leftIcon={<PlusIcon className="w-[14px] h-[14px] mr-2" />}
              >
                Add Module
              </Button>
            </AddWorkspaceModuleSheet>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isLoading &&
        filteredItems?.length === 0 &&
        queryPage.q === "" &&
        queryPage.page === 1 ? (
          <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
            <ModulesIcon className="w-12 h-12 text-primary" />
            <Text size="2xl" weight="semibold">
              No {activeTab} Modules
            </Text>
          </div>
        ) : (
          <AsyncTable
            className="w-full table-auto"
            data={filteredItems}
            columns={columns}
            isLoading={isLoading}
            placeholder={`No result for "${queryPage?.q}"`}
            pageCount={Math.ceil(filteredItems.length / pagination.per_page)}
            fetchData={(pageIndex: number, pageSize: number) => {
              setQueryPage((prestate: any) => ({
                ...prestate,
                per_page: pageSize,
                page: pageIndex + 1,
              }));
            }}
            current_page={pagination.current_page - 1}
            perPage={pagination.per_page}
            onRowSelected={(row: any) => {
              setSelectedRow(
                row.map((item: any) => {
                  return item._id;
                })
              );
            }}
            defaultSelectedRows={selectedRow}
          />
        )}
      </div>
    </div>
  );
};
