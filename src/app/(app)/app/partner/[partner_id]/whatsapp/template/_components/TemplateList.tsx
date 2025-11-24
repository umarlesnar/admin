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
import { usePartnerWhatsappTemplateQuery } from "@/framework/partner/whatsapp/get-partner-whatsapp-template";
import DateRangePicker from "@/components/ui/DateRangePicker";
import { TemplateIcon } from "@/components/ui/icons/TemplateIcon";
import { EditIcon } from "@/components/ui/icons/EditIcone";
import EditTemplateSheet from "./EditTemplatePopup";

type Props = {};

const STATUS_OPTIONS = [
  { value: "", name: "All Status" },
  { value: "APPROVED", name: "Approved" },
  { value: "PENDING", name: "Pending" },
  { value: "REJECTED", name: "Rejected" },
  { value: "PAUSED" , name: "Paused"},
  { value: "DISABLED", name: "Disabled"},
  { value:"PENDING_DELETION", name: "Pending Deletion"},
];

const CATEGORY_OPTIONS = [
  { value: "", name: "All Categories" },
  { value: "UTILITY", name: "Utility" },
  { value: "MARKETING", name: "Marketing" },
  { value: "AUTHENTICATION", name: "Authentication" },
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

export const TemplateList = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const partnerId = params?.partner_id as string;

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
        category: "",
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
   const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

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
    usePartnerWhatsappTemplateQuery(queryPage);

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
      header: "Template Name",
      cell: ({ row }: any) => {
        return (
          <Text weight="regular" color="primary">
            {row?.original?.name}
          </Text>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }: any) => {
        return (
          <Text weight="regular" color="secondary">
            {row?.original?.category}
          </Text>
        );
      },
    },
    {
      accessorKey: "language",
      header: "Language",
      cell: ({ row }: any) => {
        return (
          <Text weight="regular" color="secondary">
            {row?.original?.language?.toUpperCase()}
          </Text>
        );
      },
    },
    {
      accessorKey: "quality_score",
      header: "Quality Score",
      cell: ({ row }: any) => {
        const score = row?.original?.quality_score;
        return (
          <div
            className={`${
              score === "GREEN"
                ? "bg-[#def6e8] text-[#28C76F]"
                : score === "YELLOW"
                ? "bg-[#feeee0] text-[#FF9F43]"
                : "bg-[#FF4C5129] text-[#FF4C51]"
            } max-w-[75px] rounded-sm text-center py-1.5`}
          >
            <p className="text-[13.5px] font-medium">{score || "UNKNOWN"}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "quality_score_updated_at",
      header: "Quality Updated",
      cell: ({ row }: any) => {
        const date = row?.original?.quality_score_updated_at;
        return (
          <Text className="text-center" color="secondary">
            {date ? moment(date).format("DD-MM-YYYY") : "-"}
          </Text>
        );
      },
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }: any) => {
        return (
          <Text weight="regular" color="secondary">
            {row?.original?.reason || "NONE"}
          </Text>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row?.original?.status;
        
        const getStatusStyle = (status: string) => {
          switch (status) {
            case "APPROVED":
              return "bg-[#def6e8] text-[#28C76F]";
            case "PENDING":
              return "bg-[#feeee0] text-[#FF9F43]";
            case "REJECTED":
              return "bg-[#FF4C5129] text-[#FF4C51]";
            case "PAUSED":
              return "bg-[#e3f2fd] text-[#2196f3]";
            case "DISABLED":
              return "bg-gray-200 text-gray-600";
            case "PENDING_DELETION":
              return "bg-[#fff3e0] text-[#ff9800]";
            default:
              return "bg-gray-100 text-gray-600";
          }
        };
    
        return (
          <div
            className={`${getStatusStyle(status)} max-w-[120px] rounded-sm text-center py-1.5`}
          >
            <p className="text-[13.5px] font-medium">{status?.replace('_', ' ')}</p>
          </div>
        );
      },
    },
    
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }: any) => {
        return (
          <Text className="text-center" color="secondary">
            {moment(row?.original?.created_at).format("DD-MM-YYYY")}
          </Text>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ row }: any) => {
        return (
          <Text className="text-center" color="secondary">
            {moment(row?.original?.updated_at).format("DD-MM-YYYY")}
          </Text>
        );
      },
    },
    {
      id: "action",
      header: "Actions",
      cell: ({ row }: any) => {
        const TemplateData = row.original;
        return (
          <div className="flex items-center gap-4">
            <EditTemplateSheet data={TemplateData}>
              <EditIcon className="w-4 h-4 cursor-pointer text-green-600" />
            </EditTemplateSheet>
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
    const matchedRange = DATE_RANGES.find(range => 
      range.value.start === created_start && range.value.end === created_end
    );
    
    if (matchedRange && matchedRange.name !== "Custom") {
      return matchedRange;
    }
    
    // If dates exist but don't match predefined ranges, it's custom
    if (created_start && created_end) {
      return DATE_RANGES.find(range => range.name === "Custom");
    }
    
    return DATE_RANGES[0]; // Default to All Time
  };
  
  return (
    <div className="w-full h-full p-1 flex flex-col space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="w-[40%] flex items-center gap-3">
          <SearchBox
            className="w-52"
            placeholder="Search template or workspace name"
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
          <div className="flex flex-col">
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
              Category
            </Text>
            <Listbox
              options={CATEGORY_OPTIONS}
              selectedOption={CATEGORY_OPTIONS?.find(
                (o) => o.value === queryPage?.filter?.category
              )}
              onSelectData={(value: any) => {
                setQueryPage((prev: any) => ({
                  ...prev,
                  page: 1,
                  filter: { ...prev?.filter, category: value.value },
                }));
              }}
              buttonClassname="w-36"
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
            <TemplateIcon className="w-12 h-12 text-primary" />
            <Text size="2xl" weight="semibold">{`No Templates Found`}</Text>
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
