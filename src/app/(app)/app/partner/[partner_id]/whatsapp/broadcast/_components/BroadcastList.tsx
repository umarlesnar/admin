"use client";
import AsyncTable from "@/components/table/AsyncTable";
import RefreshButton from "@/components/ui/RefreshBotton";
import { SearchBox } from "@/components/ui/SearchBox";
import Text from "@/components/ui/text";
import { Listbox } from "@/components/ui/listbox";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import { usePartnerBroadcastQuery } from "@/framework/partner/broadcast/get-broadcast-list";
import { CampaignIcon } from "@/components/ui/icons/CampaignIcon";
import { Alert } from "@/components/ui/alert";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { toast } from "sonner";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { useBroadcastMutation } from "@/framework/partner/broadcast/broadcast-delete-mutation";
import "react-day-picker/dist/style.css";
import DateRangePicker from "@/components/ui/DateRangePicker";

type Props = {};

const STATUS_OPTIONS = [
  { value: "", name: "All Status" },
  { value: "COMPLETED", name: "Completed" },
  { value: "FAILED", name: "Failed" },
  { value: "PENDING", name: "Pending" },
];

const SORT_OPTIONS = [
  { name: "Latest Created", value: { created_at: -1 } },
  { name: "Oldest Created", value: { created_at: 1 } },
  { name: "Latest Updated", value: { updated_at: -1 } },
  { name: "Oldest Updated", value: { updated_at: 1 } },
];

const DATE_RANGES = [
  {
    name: "All Time",
    value: { start: "", end: "" },
  },
  {
    name: "Last 7 Days",
    value: {
      start: moment().subtract(7, "days").startOf("day").toISOString(),
      end: moment().endOf("day").toISOString(),
    },
  },
  {
    name: "Last 30 Days",
    value: {
      start: moment().subtract(30, "days").startOf("day").toISOString(),
      end: moment().endOf("day").toISOString(),
    },
  },
  {
    name: "Last 90 Days",
    value: {
      start: moment().subtract(90, "days").startOf("day").toISOString(),
      end: moment().endOf("day").toISOString(),
    },
  },
  {
    name: "Custom",
    value: { start: "custom", end: "custom" },
  },
];

export const BroadcastList = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const partnerId = params?.partner_id as string;
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

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
        created_start: "",
        created_end: "",
        updated_start: "",
        updated_end: "",
      }),
      sort: safeJSONParse(searchParams.get("sort"), { created_at: -1 }),
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

  const { data, isLoading, refetch } = usePartnerBroadcastQuery(queryPage);
  const { mutateAsync } = useBroadcastMutation();

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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "workspace.name",
      header: "Workspace Name",
      cell: ({ row }: any) => {
        return (
          <Text weight="regular" color="primary">
            {row?.original?.workspace?.name || "-"}
          </Text>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.name}</Text>
          </div>
        );
      },
    },

    {
      accessorKey: "template_name",
      header: "Template Name",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.template_name}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "schedule_datetime",
      header: "Schedule",
      cell: ({ row }: any) => {
        const scheduleType = row?.original?.schedule_type;
        const scheduleDateTime = row?.original?.schedule_datetime;
        
        return (
          <div className="flex flex-col">
            <Text>{scheduleType}</Text>
            {scheduleType === "SCHEDULED" && scheduleDateTime && (
              <Text className="mt-1" size="xs" weight="bold">
                {moment(scheduleDateTime).format("DD-MM-YYYY HH:mm")}
              </Text>
            )}
          </div>
        );
      },
    },
    
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div
          className={`${
            row.getValue("status") === "COMPLETED"
              ? "bg-[#def6e8]"
              : row.getValue("status") === "FAILED"
              ? "bg-red-100"
              : row.getValue("status") === "PENDING"
              ? "bg-[#feeee0]"
              : "bg-[#FF4C5129]"
          } max-w-[75px] rounded-sm text-center py-1.5`}
        >
          <p
            className={`text-[13.5px] ${
              row.getValue("status") === "COMPLETED"
                ? "text-[#28C76F]"
                : row.getValue("status") === "FAILED"
                ? "text-red-500"
                : row.getValue("status") === "PENDING"
                ? "text-[#FF9F43]"
                : "text-[#FF4C51]"
            } font-medium`}
          >
            {row.getValue("status") === "COMPLETED"
              ? "Completed"
              : row.getValue("status") === "FAILED"
              ? "Failed"
              : row.getValue("status") === "PENDING"
              ? "Pending"
              : "Suspended"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text className="text-center">
              {moment(row.getValue("created_at")).format("DD-MM-YYYY")}
            </Text>
          </div>
        );
      },
    },
    {
      id: "action",
      header: "Actions",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-3">
            <>
              <Alert
                icon={<AlertIcon className="w-[50px] h-[50px] text-red-500" />}
                description={`Do you want to remove this ${row?.original?.name} broadcast?`}
                onRightButton={async () => {
                  const loadingToast = toast.loading("Loading...");
                  try {
                    await mutateAsync({
                      method: "DELETE",
                      broadcast_id: row?.original?._id,
                    });
                    toast.success(`Broadcast Deleted Successfully`, {
                      id: loadingToast,
                    });
                  } catch (error) {
                    toast.error(`Failed to delete Broadcast`, {
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
    },
  ];

  const getCurrentDateRange = () => {
    const { created_start, created_end } = queryPage.filter;
    if (!created_start || !created_end) return undefined;
    return {
      from: new Date(created_start),
      to: new Date(created_end),
    };
  };

  const getSelectedDateOption = () => {
    const { created_start, created_end } = queryPage.filter;
    if (!created_start && !created_end) return DATE_RANGES[0]; // All Time

    // Check if it matches any predefined range
    const matchedRange = DATE_RANGES.find(
      (range) =>
        range.value.start === created_start && range.value.end === created_end
    );

    if (matchedRange && matchedRange.name !== "Custom") {
      return matchedRange;
    }

    // If dates exist but don't match predefined ranges, it's custom
    if (created_start && created_end) {
      return DATE_RANGES.find((range) => range.name === "Custom");
    }

    return DATE_RANGES[0]; // Default to All Time
  };

  return (
    <div className="w-full h-full p-1 flex flex-col space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="w-[40%] flex items-center gap-3">
          <SearchBox
            className="w-52"
            placeholder="Search workspace or name"
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

          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Status
            </Text>
            <Listbox
              options={STATUS_OPTIONS}
              selectedOption={STATUS_OPTIONS?.find(
                (o) => o.value === queryPage?.filter?.status
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
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Sort
            </Text>
            <Listbox
              options={SORT_OPTIONS}
              selectedOption={SORT_OPTIONS?.find((o) => {
                const sortKey = Object.keys(queryPage?.sort || {})[0];
                const sortValue = queryPage?.sort?.[sortKey];
                return (
                  Object.keys(o.value)[0] === sortKey &&
                  Object.values(o.value)[0] === sortValue
                );
              })}
              onSelectData={(value: any) => {
                setQueryPage((prev: any) => ({
                  ...prev,
                  page: 1,
                  sort: value.value,
                }));
              }}
              buttonClassname="w-36"
            />
          </div>
          <div>
          
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Date Range
            </Text>
            
            <Listbox
              options={DATE_RANGES}
              selectedOption={getSelectedDateOption()}
              onSelectData={(value: any) => {
                if (value.name === "Custom") {
                  setShowCustomDatePicker(true);
                } else {
                  setShowCustomDatePicker(false);
                  setQueryPage((prev: any) => ({
                    ...prev,
                    page: 1,
                    filter: {
                      ...prev.filter,
                      created_start: value.value.start,
                      created_end: value.value.end,
                    },
                  }));
                }
              }}
              buttonClassname="w-32"
            />
          </div>
          {showCustomDatePicker && (
            <div>
              <Text size="sm" weight="medium" className="text-gray-600 mb-1">
                Custom Range
              </Text>
              <DateRangePicker
                selectedRange={getCurrentDateRange()}
                onDateRangeChange={(dateRange: any) => {
                  setQueryPage((prev: any) => ({
                    ...prev,
                    page: 1,
                    filter: {
                      ...prev.filter,
                      created_start: dateRange.start,
                      created_end: dateRange.end,
                    },
                  }));
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isLoading &&
        items?.length == 0 &&
        queryPage.q == "" &&
        queryPage.page == 1 ? (
          <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
            <CampaignIcon className="w-12 h-12 text-primary" />
            <Text size="2xl" weight="semibold">{`No Broadcast List`}</Text>
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
