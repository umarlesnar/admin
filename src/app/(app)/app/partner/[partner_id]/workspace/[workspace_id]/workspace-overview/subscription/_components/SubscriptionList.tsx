"use client";
import AsyncTable from "@/components/table/AsyncTable";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { SubscriptionIcon } from "@/components/ui/icons/SubscriptionIcon";
import { Listbox } from "@/components/ui/listbox";
import RefreshButton from "@/components/ui/RefreshBotton";
import { SearchBox } from "@/components/ui/SearchBox";
import Text from "@/components/ui/text";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import AddSubscriptionSheet from "./AddSubscriptionSheet";
import { toast } from "sonner";
import { useSubcriptionQuery } from "@/framework/partner/workspace/subscription/get-subscription";
import { useWorkspaceSubscriptionCancelMutation } from "@/framework/partner/workspace/subscription/subscription-cancel-mutation";
import { EditIcon } from "@/components/ui/icons/EditIcone";
import EditSubscriptionDateSheet from "./EditDateForm";
import RenewSubscriptionSheet from "./RenewSubscriptionSheet";
import UpgradeSubscriptionSheet from "./UpgradeSubscriptionSheet";
import { CURRENCY_CODES } from "@/constants/currency";

const STATUS = [
  { value: "", name: "All" },
  { value: "active", name: "Active" },
  { value: "completed", name: "Completed" },
  { value: "cancelled", name: "Cancelled" },
  { value: "scheduled", name: "Scheduled" },
];

type Props = {};

export const SubscriptionList = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { workspace_id } = useParams();

  const { mutateAsync, isPending } = useWorkspaceSubscriptionCancelMutation();

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
        currency_code: "",
      }),
      sort: safeJSONParse(searchParams.get("sort"), { _id: -1 }),
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

  const { data, isLoading, refetch }: any = useSubcriptionQuery(queryPage);

  useEffect(() => {
    if (data) {
      setItems(data?.items);
      setPagination({
        per_page: data?.per_page,
        total_page: data?.total_page,
        total_result: data?.total_result,
        current_page: data?.current_page,
      });
      setQueryPage((prestate: any) => ({
        ...prestate,
        per_page: data?.per_page,
        page: data?.current_page,
      }));
    }
  }, [data, queryPage.q]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "plan_name",
      header: "Plan Name",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>
              {row?.original?.plan_name ? row?.original?.plan_name : "---"}
            </Text>
          </div>
        );
      },
    },
    {
      accessorKey: "payment_gateway",
      header: "Payment Gateway",
      size: 220,
      cell: ({ row }: any) => {
        return (
          <div className="flex flex-col gap-1 font-medium text-text-secondary">
            <Text>{row?.original?.payment_gateway}</Text>
            {row?.original?.payment_gateway === "razorpay" && (
              <div className="flex flex-col gap-1.5">
                <Text size="xs" textColor="text-blue-500">
                  {row?.original?.r_subscription_id}
                </Text>
                <Text size="xs" textColor="text-purple-700">
                  {row?.original?.r_plan_id}
                </Text>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "plan_type",
      header: "Plan Type",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.plan_type}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "auto_renew",
      header: "Auto Renewal",
      cell: ({ row }: any) => {
        return (
          <div
            className={`flex w-fit rounded-full py-1 px-3 items-center justify-center ${
              row.original.auto_renew ? "bg-green-200" : "bg-red-200"
            }`}
          >
            <Text
              size="xs"
              textColor={
                row.original.auto_renew ? "text-green-500" : "text-red-500"
              }
              className="mb-[2px]"
            >
              {row.original.auto_renew ? "Enabled" : "Disabled"}
            </Text>
          </div>
        );
      },
    },
    {
      accessorKey: "r_current_start_at",
      header: "Start Date",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>
              {row?.original?.r_current_start_at
                ? moment
                    .unix(row?.original?.r_current_start_at)
                    .format("DD-MM-YYYY")
                : "---"}
            </Text>
          </div>
        );
      },
    },
    {
      accessorKey: "r_current_end_at",
      header: "End Date",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>
              {row?.original?.r_current_end_at
                ? moment
                    .unix(row?.original?.r_current_end_at)
                    .format("DD-MM-YYYY")
                : "---"}
            </Text>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <Text
          size="sm"
          weight="semibold"
          textColor="text-[5A5A5A]"
          className=""
        >
          Status
        </Text>
      ),
      cell: ({ row }) => (
        <div
          className={`flex w-fit rounded-full py-1 px-3 items-center justify-center ${
            row.original.status == "completed"
              ? "bg-green-200"
              : row.original.status == "active"
              ? "bg-blue-200"
              : "bg-red-200"
          }`}
        >
          <Text
            size="xs"
            textColor={
              row.original.status == "completed"
                ? "text-green-500"
                : row.original.status == "active"
                ? "text-blue-500"
                : "text-red-500"
            }
            className="mb-[2px]"
          >
            {row.original.status}
          </Text>
        </div>
      ),
    },
    {
      id: "action",
      header: "Actions",
      cell: ({ row }: any) => {
        const subscription = row.original;
        
        // Logic for Renewal Button Visibility
        const isExpired = subscription.status === "expired";
        const isCompleted = subscription.status === "completed";
        const isActiveButExpired = 
          subscription.status === "active" && 
          subscription.r_current_end_at &&
          moment.unix(subscription.r_current_end_at).isBefore(moment());

        const showRenewButton = isExpired || isCompleted || isActiveButExpired;

        return (
          <div className="flex items-center gap-3">
            {/* Edit Date - Explicit Wrapper to ensure visibility */}
            <EditSubscriptionDateSheet data={row?.original}>
              <div className="cursor-pointer p-1 rounded-full hover:bg-gray-100">
                <EditIcon className="w-4 h-4 text-green-600" />
              </div>
            </EditSubscriptionDateSheet>

            {/* UPGRADE BUTTON: Only for Active Subscriptions */}
            {!isActiveButExpired && row.original.status === "active" && (
              <UpgradeSubscriptionSheet subscription={row.original}>
                <Button size="sm" variant="default">
                  Upgrade
                </Button>
              </UpgradeSubscriptionSheet>
            )}

            {/* RENEW BUTTON: Show based on updated logic */}
            {showRenewButton && (
              <RenewSubscriptionSheet subscription={row.original}>
                <Button size="sm">Renew</Button>
              </RenewSubscriptionSheet>
            )}

            {/* Cancel Button */}
            {row.original.status == "active" && (
              <Button
                size="sm"
                variant="destructive"
                disabled={row?.original?.status !== "active" || isPending}
                onClick={async () => {
                  const loadingToast = toast.loading("Loading...");
                  try {
                    const res = await mutateAsync(row?.original?._id);
                    toast.success(`Subscription cancelled successfully`, {
                      id: loadingToast,
                    });
                  } catch (error) {
                    console.log("Subscription cancel error", error);

                    toast.error(`Failed to cancel subscription`, {
                      id: loadingToast,
                    });
                  }
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full h-full p-1 flex flex-col space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="w-[50%] flex items-center gap-3">
          <div className="w-[50%]">
            <SearchBox
              className="w-full"
              placeholder="Search by plan name"
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
        <div>
          <div className="flex items-center w-full gap-2">
            <div className="mt-6">
              <RefreshButton
                onClick={() => {
                  refetch();
                }}
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
            <div>
              <Text size="sm" weight="medium" className="text-gray-600 mb-1">
                Currency
              </Text>
              <Listbox
                options={[{ value: "", name: "All" }, ...CURRENCY_CODES]}
                selectedOption={[{ value: "", name: "All" }, ...CURRENCY_CODES]?.find((o) => {
                  return o.value == queryPage?.filter?.currency_code;
                })}
                onSelectData={(value: any) => {
                  setQueryPage((prev: any) => {
                    return {
                      ...prev,
                      page: 1,
                      filter: {
                        ...prev?.filter,
                        currency_code: value.value,
                      },
                    };
                  });
                }}
                buttonClassname={`w-32`}
              />
            </div>
            <div className="mt-6">
              <AddSubscriptionSheet workspace_id={workspace_id}>
                <Button
                  size="sm"
                  leftIcon={<PlusIcon className="w-[14px] h-[14px] mr-2" />}
                >
                  Create Subscription
                </Button>
              </AddSubscriptionSheet>
            </div>
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
              <SubscriptionIcon className="w-12 h-12 text-primary" />
              <Text
                size="2xl"
                weight="semibold"
              >{`No subscription Lists`}</Text>
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
          />
        )}
      </div>
    </div>
  );
};
