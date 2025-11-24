"use client";

import AsyncTable from "@/components/table/AsyncTable";
import Text from "@/components/ui/text";
import React, { useEffect, useState } from "react";
import { SearchBox } from "@/components/ui/SearchBox";
import moment from "moment";
import { ColumnDef } from "@tanstack/react-table";
import { Listbox } from "@/components/ui/listbox";
import RefreshButton from "@/components/ui/RefreshBotton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SubscriptionIcon } from "@/components/ui/icons/SubscriptionIcon";
import { usePartnerSubscriptionQuery } from "@/framework/partner/get-patner-subscriptions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Props = {};

const STATUS = [
  { value: "", name: "All" },
  { value: "active", name: "Active" },
  { value: "completed", name: "Completed" },
  { value: "cancelled", name: "Cancelled" },
];

const RENEWALSTATUS = [
  { value: "", name: "All" },
  { value: true, name: "Enabled" },
  { value: false, name: "Disabled" },
];

const SORTOPTIONS = [
  { name: "Latest", value: -1 },
  { name: "Oldest", value: 1 },
];

const PLANTYPE = [
  { name: "All", value: "" },
  { name: "Free", value: "free" },
  { name: "Trail", value: "trail" },
  { name: "Standard", value: "standard" },
  { name: "Paug", value: "paug" },
];

const DATERANGES = [
  {
    name: "All",
    value: {
      start: "",
      end: "",
    },
  },
  {
    name: "Next 7 Days",
    value: {
      start: moment().startOf("day").unix(),
      end: moment().add(7, "days").endOf("day").unix(),
    },
  },
  {
    name: "Next 30 Days",
    value: {
      start: moment().startOf("day").unix(),
      end: moment().add(30, "days").endOf("day").unix(),
    },
  },
  {
    name: "Next 60 Days",
    value: {
      start: moment().startOf("day").unix(),
      end: moment().add(60, "days").endOf("day").unix(),
    },
  },
];

const SubscriptionList = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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
        auto_renew: "",
        plan_type: "",
        start: "",
        end: "",
        subscription_status: searchParams.get("tab") || "all",
      }),
      sort: safeJSONParse(searchParams.get("sort"), { r_end_at: "-1" }),
    };
  });

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all");
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
    params.set("tab", activeTab);

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
  }, [queryPage, activeTab, pathname, router]);

  const { data, isLoading, refetch }: any =
    usePartnerSubscriptionQuery(queryPage);

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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setQueryPage((prev: any) => ({
      ...prev,
      page: 1,
      filter: {
        ...prev.filter,
        subscription_status: value,
      },
    }));
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "workspace",
      header: "Workspace",
      enableResizing: false,
      size: 220,
      cell: ({ row }: any) => {
        const workspace = row?.original?.workspace;
        return (
          <div className="flex flex-col gap-1 py-1">
            <Text size="sm" weight="medium" className="truncate">
              {workspace?.name || "---"}
            </Text>
            <div className="flex items-center gap-2">
              <Text size="xs" textColor="text-gray-500" className="truncate">
                {workspace?.country || "---"}
              </Text>
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  workspace?.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "notification",
      header: "Contact",
      size: 180,
      cell: ({ row }: any) => {
        const notification = row?.original?.workspace?.notification;
        return (
          <div className="flex flex-col gap-1 py-1">
            {notification?.email_id && (
              <Text size="xs" textColor="text-blue-600" className="truncate">
                {notification.email_id}
              </Text>
            )}
            {notification?.phone_number && (
              <Text size="xs" textColor="text-green-600">
                {notification.phone_number}
              </Text>
            )}
            {!notification && (
              <Text size="xs" textColor="text-gray-400">
                ---
              </Text>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "plan_name",
      header: "Plan",
      size: 140,
      cell: ({ row }: any) => (
        <div className="flex flex-col gap-1">
          <div className=" w-fit rounded-md py-1 px-2 bg-gray-100">
          
            <Text size="sm" weight="medium" className="truncate">
              {row?.original?.plan_name || "---"}
            </Text>
            {row?.original?.payment_gateway === "razorpay" &&
              row?.original?.r_subscription_id && (
                <Text size="xs" textColor="text-gray-500">
                  {row.original.r_subscription_id}
                </Text>
              )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "Amount",
      size: 120,
      cell: ({ row }: any) => (
        <div className="flex flex-col gap-1">
          <Text size="sm" weight="semibold" textColor="text-gray-900">
            ₹{row?.original?.total_amount?.toLocaleString() || "0"}
          </Text>
          <Text size="xs" textColor="text-blue-600" className="font-medium">
            Incl. GST
          </Text>
        </div>
      ),
    },
    {
      accessorKey: "plan_type",
      header: "Type",
      size: 100,
      cell: ({ row }: any) => (
        <Text size="xs" weight="medium" className="capitalize">
          {row?.original?.plan_type || "---"}
        </Text>
      ),
    },
    {
      accessorKey: "auto_renew",
      header: "Auto Renew",
      size: 110,
      cell: ({ row }: any) => (
        <div
          className={`flex w-fit rounded-full py-1 px-2 items-center justify-center ${
            row.original.auto_renew ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <Text
            size="xs"
            weight="medium"
            textColor={
              row.original.auto_renew ? "text-green-700" : "text-red-700"
            }
          >
            {row.original.auto_renew ? "Yes" : "No"}
          </Text>
        </div>
      ),
    },
    {
      accessorKey: "r_current_start_at",
      header: "Start Date",
      size: 110,
      cell: ({ row }: any) => (
        <Text size="sm" textColor="text-gray-700">
          {row.original.r_current_start_at ? moment.unix(row?.original?.r_current_start_at).format("DD MMM YYYY") : "---"}
        </Text>
      ),
     },
     {
      accessorKey: "r_current_end_at",
      header: "End Date",
      size: 130,
      cell: ({ row }: any) => {
        const endAt = row?.original?.r_current_end_at;
    
        if (!endAt) {
          return (
            <Text size="sm" textColor="text-gray-700">
              ---
            </Text>
          );
        }
    
        const endDate = moment.unix(endAt).startOf("day");
        const today = moment().startOf("day");
    
        let daysDiff = endDate.diff(today, "days") + 1;
    
        const isExpired = daysDiff <= 0; 
        const isToday = daysDiff === 1;
    
        return (
          <div className="flex flex-col gap-1 py-1">
            <Text size="sm" textColor="text-gray-700">
              {endDate.format("DD MMM YYYY")}
            </Text>
    
            <Text
              size="xs"
              textColor={
                isExpired
                  ? "text-red-600"
                  : isToday
                  ? "text-orange-600"
                  : daysDiff <= 7
                  ? "text-yellow-600"
                  : "text-green-600"
              }
              className="font-medium"
            >
              {isExpired
                ? "Expired"
                : isToday
                ? "Expires today"
                : `${daysDiff} days left`}
            </Text>
          </div>
        );
      },
    },  
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
      cell: ({ row }) => (
        <div
          className={`flex w-fit rounded-full py-1 px-3 items-center justify-center ${
            row.original.status === "completed"
              ? "bg-green-100"
              : row.original.status === "active"
              ? "bg-blue-100"
              : "bg-red-100"
          }`}
        >
          <Text
            size="xs"
            weight="medium"
            textColor={
              row.original.status === "completed"
                ? "text-green-700"
                : row.original.status === "active"
                ? "text-blue-700"
                : "text-red-700"
            }
            className="capitalize"
          >
            {row.original.status}
          </Text>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col space-y-2 min-w-0">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-fit">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <div className="flex items-center justify-between mb-2">
          <div className="w-[50%] flex items-center gap-3 pt-2">
            <SearchBox
              className="w-full"
              placeholder="Search by plan name or workspace name"
              value={queryPage.q}
              onChange={(e) => {
                setQueryPage((prev: any) => ({
                  ...prev,
                  page: 1,
                  q: e.target.value,
                }));
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="mt-6">
              <RefreshButton onClick={() => refetch()} />
            </div>

            {/* Show all filters for "all" tab */}
            {activeTab === "all" && (
              <>
                <div>
                  <Text
                    size="sm"
                    weight="medium"
                    className="text-gray-600 mb-1"
                  >
                    Status
                  </Text>
                  <Listbox
                    options={STATUS}
                    selectedOption={STATUS?.find(
                      (o) => o.value == queryPage?.filter?.status
                    )}
                    onSelectData={(value: any) => {
                      setQueryPage((prev: any) => ({
                        ...prev,
                        page: 1,
                        filter: { ...prev?.filter, status: value.value },
                      }));
                    }}
                    buttonClassname="w-32"
                  />
                </div>
                <div>
                  <Text
                    size="sm"
                    weight="medium"
                    className="text-gray-600 mb-1"
                  >
                    Renewal
                  </Text>
                  <Listbox
                    options={RENEWALSTATUS}
                    selectedOption={RENEWALSTATUS?.find(
                      (o) => o.value == queryPage?.filter?.auto_renew
                    )}
                    onSelectData={(value: any) => {
                      setQueryPage((prev: any) => ({
                        ...prev,
                        page: 1,
                        filter: { ...prev?.filter, auto_renew: value.value },
                      }));
                    }}
                    buttonClassname="w-32"
                  />
                </div>
                <div>
                  <Text
                    size="sm"
                    weight="medium"
                    className="text-gray-600 mb-1"
                  >
                    Plan
                  </Text>
                  <Listbox
                    options={PLANTYPE}
                    selectedOption={PLANTYPE?.find(
                      (o) => o.value == queryPage?.filter?.plan_type
                    )}
                    onSelectData={(value: any) => {
                      setQueryPage((prev: any) => ({
                        ...prev,
                        page: 1,
                        filter: { ...prev?.filter, plan_type: value.value },
                      }));
                    }}
                    buttonClassname="w-32"
                  />
                </div>
                <div>
                  <Text
                    size="sm"
                    weight="medium"
                    className="text-gray-600 mb-1"
                  >
                    Sort
                  </Text>
                  <Listbox
                    options={SORTOPTIONS}
                    selectedOption={SORTOPTIONS?.find(
                      (o) => o.value == queryPage?.sort?.r_end_at
                    )}
                    onSelectData={(value: any) => {
                      setQueryPage((prev: any) => ({
                        ...prev,
                        page: 1,
                        sort: { ...prev?.sort, r_end_at: value.value },
                      }));
                    }}
                    buttonClassname="w-32"
                  />
                </div>
                <div>
                  <Text
                    size="sm"
                    weight="medium"
                    className="text-gray-600 mb-1"
                  >
                    Days
                  </Text>
                  <Listbox
                    options={DATERANGES}
                    placeholder="All"
                    onSelectData={(value: any) => {
                      setQueryPage((prev) => ({
                        ...prev,
                        filter: { ...prev.filter, ...value.value },
                      }));
                    }}
                  />
                </div>
              </>
            )}

            {/* Show limited filters for "active" tab */}
            {activeTab === "active" && (
              <>
                <div>
                  <Text
                    size="sm"
                    weight="medium"
                    className="text-gray-600 mb-1"
                  >
                    Plan
                  </Text>
                  <Listbox
                    options={PLANTYPE}
                    selectedOption={PLANTYPE?.find(
                      (o) => o.value == queryPage?.filter?.plan_type
                    )}
                    onSelectData={(value: any) => {
                      setQueryPage((prev: any) => ({
                        ...prev,
                        page: 1,
                        filter: { ...prev?.filter, plan_type: value.value },
                      }));
                    }}
                    buttonClassname="w-32"
                  />
                </div>
                <div>
                  <Text
                    size="sm"
                    weight="medium"
                    className="text-gray-600 mb-1"
                  >
                    Sort
                  </Text>
                  <Listbox
                    options={SORTOPTIONS}
                    selectedOption={SORTOPTIONS?.find(
                      (o) => o.value == queryPage?.sort?.r_end_at
                    )}
                    onSelectData={(value: any) => {
                      setQueryPage((prev: any) => ({
                        ...prev,
                        page: 1,
                        sort: { ...prev?.sort, r_end_at: value.value },
                      }));
                    }}
                    buttonClassname="w-32"
                  />
                </div>
                <div>
                  <Text
                    size="sm"
                    weight="medium"
                    className="text-gray-600 mb-1"
                  >
                    Days
                  </Text>
                  <Listbox
                    options={DATERANGES}
                    placeholder="All"
                    onSelectData={(value: any) => {
                      setQueryPage((prev) => ({
                        ...prev,
                        filter: { ...prev.filter, ...value.value },
                      }));
                    }}
                  />
                </div>
              </>
            )}

            {/* Show limited filters for "expired" tab */}
            {activeTab === "expired" && (
              <>
                <div>
                  <Text
                    size="sm"
                    weight="medium"
                    className="text-gray-600 mb-1"
                  >
                    Plan
                  </Text>
                  <Listbox
                    options={PLANTYPE}
                    selectedOption={PLANTYPE?.find(
                      (o) => o.value == queryPage?.filter?.plan_type
                    )}
                    onSelectData={(value: any) => {
                      setQueryPage((prev: any) => ({
                        ...prev,
                        page: 1,
                        filter: { ...prev?.filter, plan_type: value.value },
                      }));
                    }}
                    buttonClassname="w-32"
                  />
                </div>
                <div>
                  <Text
                    size="sm"
                    weight="medium"
                    className="text-gray-600 mb-1"
                  >
                    Sort
                  </Text>
                  <Listbox
                    options={SORTOPTIONS}
                    selectedOption={SORTOPTIONS?.find(
                      (o) => o.value == queryPage?.sort?.r_end_at
                    )}
                    onSelectData={(value: any) => {
                      setQueryPage((prev: any) => ({
                        ...prev,
                        page: 1,
                        sort: { ...prev?.sort, r_end_at: value.value },
                      }));
                    }}
                    buttonClassname="w-32"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <TabsContent
          value={activeTab}
          className="flex-1 flex flex-col overflow-hidden mt-0"
        >
          {!isLoading &&
          items.length == 0 &&
          queryPage.q == "" &&
          queryPage.page == 1 ? (
            <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
              <SubscriptionIcon className="w-12 h-12 text-primary" />
              <Text size="2xl" weight="semibold">
                No subscription Lists
              </Text>
            </div>
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
                setSelectedRow(row.map((item: any) => item._id));
              }}
              defaultSelectedRows={selectedRow}
              enableColumnResizing={true}
              columnResizeMode="onChange"
              stickyFirstColumn={true}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionList;
