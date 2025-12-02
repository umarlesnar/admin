"use client";
import AsyncTable from "@/components/table/AsyncTable";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "@/components/ui/icons/EyeIcon";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { Listbox } from "@/components/ui/listbox";
import RefreshButton from "@/components/ui/RefreshBotton";
import { SearchBox } from "@/components/ui/SearchBox";
import Text from "@/components/ui/text";
import { ColumnDef } from "@tanstack/react-table";
import { BriefcaseBusiness } from "lucide-react";
import moment from "moment";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import { usePartnerOnboardWorkspace } from "@/framework/partner/workspace/get-partner-onboard-workspace";
import AddSubscriptionSheet from "../../[workspace_id]/workspace-overview/subscription/_components/AddSubscriptionSheet";
import AddWorkspaceSheet from "../../_components/AddWorkspaceSheet";
import { Alert } from "@/components/ui/alert";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { toast } from "sonner";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { useOnboardWorkspaceMutation } from "@/framework/partner/workspace/onboard-workspace-mutation";
import Link from "next/link";

const STATUS = [
  { value: "", name: "All" },
  { value: "ACTIVE", name: "Active" },
  { value: "DISABLE", name: "Disable" },
];

const DATESORT = [
  {
    name: "Latest",
    value: -1,
  },
  {
    name: "Oldest",
    value: 1,
  },
];

type Props = {};

export const OnboardWorkspaceLists = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { partner_id } = useParams();

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
        partner_id: partner_id,
      }),
      sort: safeJSONParse(searchParams.get("sort"), { created_at: "-1" }),
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
            // Safely stringify objects

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

  const { data, isLoading, refetch } = usePartnerOnboardWorkspace(queryPage);
  const { mutateAsync } = useOnboardWorkspaceMutation();

  useEffect(() => {
    if (data) {
      setItems(data?.items);
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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Workspace",
      enableResizing: false,
      size: 180,
      cell: ({ row }: any) => (
        <div className="w-44 truncate">
          <Text className="truncate">{row?.original?.name || "---"}</Text>
        </div>
      ),
    },
    {
      accessorKey: "owner_profile",
      header: "Given Name",
      cell: ({ row }: any) => (
        <div className="w-72">
          <Text className="text-sm truncate">
            {row?.original?.owner_profile?.first_name || "---"}
          </Text>
        </div>
      ),
    },
    {
      accessorKey: "owner_username",
      header: "Contact Info",
      size: 240,
      cell: ({ row }: any) => (
        <div className="w-72">
          <Text className="text-sm truncate">
            {row?.original?.owner_username || "---"}
          </Text>
          {row?.original?.owner_phone && (
            <Text className="text-xs text-gray-500 truncate">
              {row?.original?.owner_phone}
            </Text>
          )}
        </div>
      ),
    },
    {
      accessorKey: "owner_auth_type",
      header: "Registered Via",
      size: 120,
      cell: ({ row }: any) => {
        const authType = row?.original?.owner_auth_type;
        const getAuthDisplay = (type: number) => {
          switch (type) {
            case 1:
              return { text: "Standard", icon: "🔐", color: "text-blue-600" };
            case 2:
              return { text: "Facebook", icon: "📘", color: "text-blue-800" };
            case 3:
              return { text: "Google", icon: "🔍", color: "text-red-600" };
            default:
              return { text: "Unknown", icon: "❓", color: "text-gray-600" };
          }
        };

        const authDisplay = getAuthDisplay(authType);

        return (
          <div className="w-28 flex items-center gap-2">
            <span className="text-sm">{authDisplay.icon}</span>
            <Text className={`text-sm ${authDisplay.color}`}>
              {authDisplay.text}
            </Text>
          </div>
        );
      },
    },
    {
      accessorKey: "plan_type",
      header: "Plan",
      cell: ({ row }: any) => (
        <div className="w-24">
          {row?.original?.plan_type ? (
            <Text className="capitalize text-sm">
              {row?.original?.plan_type}
            </Text>
          ) : (
            <AddSubscriptionSheet workspace_id={row?.original?._id}>
              <Button size="sm" className="text-xs px-2 py-1">
                Add Plan
              </Button>
            </AddSubscriptionSheet>
          )}
        </div>
      ),
    },
    {
      accessorKey: "subscription_days_remaining",
      header: "Days",
      cell: ({ row }: any) => {
        const daysLeft = row?.original?.subscription_days_remaining;
        return (
          <div className="w-16">
            {daysLeft !== null ? (
              <Text
                className={`text-sm ${
                  daysLeft <= 7
                    ? "text-red-500"
                    : daysLeft <= 30
                    ? "text-orange-500"
                    : ""
                }`}
              >
                {daysLeft}d
              </Text>
            ) : (
              <Text className="text-sm">---</Text>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      size: 80,
      header: "Status",
      cell: ({ row }) => (
        <div
          className={`${
            row.getValue("status") === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : row.getValue("status") === "DISABLE"
              ? "bg-gray-100 text-gray-700"
              : "bg-red-100 text-red-700"
          } px-2 py-1 rounded text-xs font-medium w-fit`}
        >
          {row.getValue("status") === "ACTIVE"
            ? "Active"
            : row.getValue("status") === "DISABLE"
            ? "Disabled"
            : "Inactive"}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      size: 80,
      header: "Created",
      cell: ({ row }: any) => (
        <div className="w-20">
          <Text className="text-sm">
            {moment(row.getValue("created_at")).format("DD/MM/YY")}
          </Text>
        </div>
      ),
    },
    {
      id: "action",
      header: "Action",
      size: 80,
      cell: ({ row }: any) => {
        return(
          <div className="flex items-center gap-3">
            <Link href={`/app/partner/${partner_id}/workspace/${row?.original?._id}/workspace-overview`}>
            <EyeIcon
              className="w-4 h-4 text-blue-500 cursor-pointer"
            />
            </Link>
            <>
              <Alert
                icon={<AlertIcon className="w-[50px] h-[50px] text-red-500" />}
                description={`Do you want to remove this ${row?.original?.owner_profile?.first_name} Onboarding Worksapce?`}
                onRightButton={async () => {
                  const loadingToast = toast.loading("Loading...");
                  try {
                    await mutateAsync({
                      method: "DELETE",
                      onboard_id: row?.original?._id,
                    });
                    toast.success(`Onboarding Worksapce Deleted Successfully`, {
                      id: loadingToast,
                    });
                  } catch (error) {
                    toast.error(`Failed to delete Onboarding worksapce`, {
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
        )     
        },
    },
  ];

  return (
    <div className="w-full h-full p-1 flex flex-col space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="w-[50%] flex items-center gap-3">
          <div className="">
            <SearchBox
              className="w-52"
              placeholder="Search Workspace by name"
              onChange={(e) => {
                setQueryPage((prev: any) => {
                  return {
                    ...prev,
                    page: 1,
                    q: e.target.value,
                  };
                });
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="mt-6">
          <RefreshButton
            onClick={() => {
              refetch();
            }}
          />
          </div>
        
          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Sort
            </Text>
            <Listbox
            options={DATESORT}
            placeholder={"Latest"}
            onSelectData={(value: any) => {
              setQueryPage((prev: any) => {
                return {
                  ...prev,
                  page: 1,
                  sort: {
                    created_at: value.value,
                  },
                };
              });
            }}
            buttonClassname={`w-32`}
          />
          </div>
         <div>
         <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Status
            </Text>
            <Listbox
            options={STATUS}
            selectedOption={STATUS?.find((o) => {
              return o.value == queryPage?.filter?.status;
            })}
            onSelectData={(value: any) => {
              setQueryPage((prev: any) => {
                return {
                  ...prev,
                  page: 1,
                  filter: {
                    ...prev?.filter,
                    status: value.value,
                  },
                };
              });
            }}
            buttonClassname={`w-32`}
          />
         </div>
         <div className="mt-6">
         <AddWorkspaceSheet>
            <Button
              size="sm"
              className=" w-[145px] h-[38px]  "
              leftIcon={<PlusIcon className="w-[14px] h-[14px] mr-2" />}
            >
              Add Workspace
            </Button>
          </AddWorkspaceSheet>
         </div>
          
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isLoading &&
        items.length == 0 &&
        queryPage.q == "" &&
        queryPage.page == 1 ? (
          <>
            {" "}
            <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
              <BriefcaseBusiness className="w-12 h-12 text-primary" />
              <Text size="2xl" weight="semibold">{`No Workspace Lists`}</Text>
            </div>
          </>
        ) : (
          <AsyncTable
            className="w-full table-auto"
            data={items}
            columns={columns}
            isLoading={isLoading}
            placeholder={`No result for "${queryPage?.q}"`}
            pageCount={pagination.total_page}
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
            enableColumnResizing={true}
            stickyFirstColumn={true}
          />
        )}
      </div>
    </div>
  );
};
