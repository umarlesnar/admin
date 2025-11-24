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
import { EyeIcon } from "@/components/ui/icons/EyeIcon";
import { AutomationIcon } from "@/components/ui/icons/AutomationIcon";
import { useIgAutomationQuery } from "@/framework/partner/automation/get-ig-automation";
import { useIgAutomationLogsQuery } from "@/framework/partner/automation-logs/get-automation-logs";

type Props = {};

const STATUS_OPTIONS = [
  { value: "", name: "All Status" },
  { value: "COMPLETED", name: "Completed" },
  { value: "FAILED", name: "Failed" },
];

const SORT_OPTIONS = [
  { name: "Latest Created", value: { created_at: -1 } },
  { name: "Oldest Created", value: { created_at: 1 } },
  { name: "Latest Updated", value: { updated_at: -1 } },
  { name: "Oldest Updated", value: { updated_at: 1 } },
];

export const AutomationLogsList = (props: Props) => {
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

  const { data, isLoading, refetch } = useIgAutomationLogsQuery(queryPage);

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
      accessorKey: "automation_id",
      header: "Automation ID",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.automation_id}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "IG Type",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.type}</Text>
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
          className={`${
            row.getValue("status") === "COMPLETED"
              ? "bg-[#def6e8]"
              : row.getValue("status") === "FAILED"
              ? "bg-[#eaebed]"
              : "bg-[#feeee0]"
          } max-w-[88px] rounded-sm text-center py-1.5 px-1`}
        >
          {/* "bg-[#feeee0]" */}
          <p
            className={`text-[13.5px] ${
              row.getValue("status") === "COMPLETED"
                ? "text-[#28C76F]"
                : row.getValue("status") === "FAILED"
                ? "text-[#898a93]"
                : "text-[#FF9F43]"
            } font-medium`}
          >
            {row.getValue("status") === "COMPLETED"
              ? "Completed"
              : row.getValue("status") === "FAILED"
              ? "Failed"
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
  ];

  return (
    <div className="w-full h-full p-1 flex flex-col space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="w-[40%] flex items-center gap-3">
          <SearchBox
            className="w-52"
            placeholder="Search workspace or type"
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
          <RefreshButton onClick={() => refetch()} />

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
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        {!isLoading &&
        items.length == 0 &&
        queryPage.q == "" &&
        queryPage.page == 1 ? (
          <>
            {" "}
            <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
              <AutomationIcon className="w-12 h-12 text-primary" />
              <Text size="2xl" weight="semibold">{`No Automation Logs Lists`}</Text>
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
