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
import { usePartnerAutomationSessionQuery } from "@/framework/automation-session/get-automation-session-list";
import { Alert } from "@/components/ui/alert";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { toast } from "sonner";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { useAutomationSessionMutation } from "@/framework/automation-session/automation-session-delete-mutation";
import DateRangePicker from "@/components/ui/DateRangePicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SORT_OPTIONS = [
  { name: "Latest Created", value: { created_at: -1 } },
  { name: "Oldest Created", value: { created_at: 1 } },
  { name: "Latest Updated", value: { updated_at: -1 } },
  { name: "Oldest Updated", value: { updated_at: 1 } },
];

const DATE_RANGES = [
  { name: "All Time", value: { start: "", end: "" } },
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
  { name: "Custom", value: { start: "custom", end: "custom" } },
];

// Flow Variables Dialog Component
const FlowVariablesDialog = ({ session }: { session: any }) => {
  const renderVariables = (variables: any) => {
    if (!variables || typeof variables !== "object") {
      return (
        <div className="text-center py-4">
          <Text className="text-gray-400">No variables available</Text>
        </div>
      );
    }

    const entries = Object.entries(variables);
    if (entries.length === 0) {
      return (
        <div className="text-center py-4">
          <Text className="text-gray-400">No variables found</Text>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {entries.map(([key, value]) => (
          <div key={key} className="border rounded p-3 bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <Text weight="medium" className="text-sm text-blue-600">
                {key}
              </Text>
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                {typeof value}
              </span>
            </div>
            <div className="bg-white border rounded p-2">
              <Text className="text-sm font-mono break-all">
                {typeof value === "object"
                  ? JSON.stringify(value, null, 2)
                  : String(value) || "Empty"}
              </Text>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Session Details</DialogTitle>
        </DialogHeader>

        {/* Compact Flow Progress */}
        <div className="bg-green-50 rounded p-3 mb-3 border">
          <div className="grid grid-cols-3 gap-3 text-sm text-center">
            <div>
              <Text size="xs" className="text-gray-600">
                Current Node:
              </Text>
              <Text weight="medium" className="font-mono">
                {session?.flow_node_id || "N/A"}
              </Text>
            </div>
            <div>
              <Text size="xs" className="text-gray-600">
                Last Node:
              </Text>
              <Text weight="medium" className="font-mono">
                {session?.flow_last_node_id || "N/A"}
              </Text>
            </div>
            <div>
              <Text size="xs" className="text-gray-600">
                Retry Count:
              </Text>
              <Text weight="medium" className="text-lg">
                {session?.flow_retry_count || 0}
              </Text>
            </div>
          </div>
        </div>

        {/* Flow Variables - Takes Most Space */}
        <div className="flex-1 min-h-0 flex flex-col">
          <Text size="lg" weight="semibold" className="mb-2">
            Flow Variables
          </Text>
          <div className="flex-1 overflow-y-auto border rounded p-3 bg-gray-50">
            {renderVariables(session?.flow_variables)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const AutomationSessionList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const partnerId = params?.partner_id as string;
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // Add debounced search state
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("q") || ""
  );

  const [queryPage, setQueryPage] = useState(() => {
    const safeJSONParse = (jsonString: string | null, defaultValue: any) => {
      try {
        return jsonString ? JSON.parse(jsonString) : defaultValue;
      } catch (error) {
        return defaultValue;
      }
    };

    return {
      per_page: Number(searchParams.get("per_page") || "20"),
      page: Number(searchParams.get("page") || "1"),
      q: debouncedSearch, // Use debounced search
      filter: safeJSONParse(searchParams.get("filter"), {
        created_start: "",
        created_end: "",
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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Update queryPage when debounced search changes
  useEffect(() => {
    setQueryPage((prev: any) => ({
      ...prev,
      page: 1,
      q: debouncedSearch,
    }));
  }, [debouncedSearch]);

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

  const { data, isLoading, refetch } =
    usePartnerAutomationSessionQuery(queryPage);
  const { mutateAsync } = useAutomationSessionMutation();

  useEffect(() => {
    if (data) {
      setItems(data?.items || []);
      setPagination({
        per_page: data?.per_page,
        total_page: data?.total_page,
        total_result: data?.total_result,
        current_page: data?.current_page,
      });
    }
  }, [data]);

  // Add these helper functions after the existing useEffect hooks
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

    const matchedRange = DATE_RANGES.find(
      (range) =>
        range.value.start === created_start && range.value.end === created_end
    );

    if (matchedRange && matchedRange.name !== "Custom") {
      return matchedRange;
    }

    if (created_start && created_end) {
      return DATE_RANGES.find((range) => range.name === "Custom");
    }

    return DATE_RANGES[0]; // Default to All Time
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "workspace.name",
      header: "Workspace Name",
      cell: ({ row }: any) => (
        <Text weight="regular" color="primary">
          {row?.original?.workspace?.name || "-"}
        </Text>
      ),
    },
    {
      accessorKey: "chat_session.wa_id",
      header: "WhatsApp ID",
      cell: ({ row }: any) => (
        <Text>{row?.original?.chat_session?.wa_id || "-"}</Text>
      ),
    },
    {
      accessorKey: "flow.name",
      header: "Flow Name",
      cell: ({ row }: any) => <Text>{row?.original?.flow?.name || "-"}</Text>,
    },
    {
      accessorKey: "flow_node_id",
      header: "Current Node",
      cell: ({ row }: any) => (
        <Text className="text-sm font-mono">
          {row?.original?.flow_node_id || "-"}
        </Text>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }: any) => (
        <Text className="text-center">
          {moment(row.getValue("created_at")).format("DD-MM-YYYY HH:mm")}
        </Text>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <FlowVariablesDialog session={row.original} />
          <Alert
            icon={<AlertIcon className="w-[50px] h-[50px] text-red-500" />}
            description={`Do you want to remove this automation session?`}
            onRightButton={async () => {
              const loadingToast = toast.loading("Loading...");
              try {
                await mutateAsync({
                  method: "DELETE",
                  automation_session_id: row?.original?._id,
                });
                toast.success(`Automation Session Deleted Successfully`, {
                  id: loadingToast,
                });
              } catch (error) {
                toast.error(`Failed to delete Automation Session`, {
                  id: loadingToast,
                });
              }
            }}
            rightButtonProps={{ variant: "destructive" }}
          >
            <DeleteIcon className="w-4 h-4 cursor-pointer text-red-600" />
          </Alert>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full p-1 flex flex-col space-y-3">
      <div className="flex items-center justify-between mb-2">
        <SearchBox
          className="w-52"
          placeholder="Search workspace, wa_id, flow name"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />

        <div className="flex items-center gap-2">
          <div className="mt-6">
            <RefreshButton onClick={() => refetch()} />
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
        <AsyncTable
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
        />
      </div>
    </div>
  );
};
