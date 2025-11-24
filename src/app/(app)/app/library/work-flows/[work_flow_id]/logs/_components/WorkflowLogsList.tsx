"use client";
import AsyncTable from "@/components/table/AsyncTable";
import { Checkbox } from "@/components/ui/Checkbox";
import RefreshButton from "@/components/ui/RefreshBotton";
import Text from "@/components/ui/text";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Listbox } from "@/components/ui/listbox";
import { Badge } from "@/components/ui/badge";
import { useWorkFlowLogsQuery } from "@/framework/workflow-library/get-workflow_logs";

type Props = {};

const SORT_OPTIONS = [
  { name: "Latest", value: -1 },
  { name: "Oldest", value: 1 },
];

const WorkFlowLogsList = (props: Props) => {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [queryPage, setQueryPage] = useState<any>({
    per_page: 20,
    page: 1,
    q: "",
    filter: {
      status: "",
    },
    sort: {
      created_at: -1,
    },
  });
  const [pagination, setPagination] = useState<any>({
    per_page: 20,
    total_page: 0,
    total_result: 0,
    current_page: 1,
  });

  const { data, isLoading, refetch } = useWorkFlowLogsQuery(queryPage);

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

  const columns: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "response_type",
        header: () => (
          <Text size="sm" weight="semibold" textColor="text-[5A5A5A]">
            Response Type
          </Text>
        ),
        cell: ({ row }) => (
          <Text size="sm" textColor="text-[5A5A5A]">
            {row.getValue("response_type")}
          </Text>
        ),
      },
      {
        accessorKey: "status",
        header: () => (
          <Text size="sm" weight="semibold" textColor="text-[5A5A5A]">
            Status
          </Text>
        ),
        cell: ({ row }) => {
          const status: any = row.getValue("status");
          return (
            <>
              {status == "ACTIVE" ? (
                <Badge>Active</Badge>
              ) : status == "COMPLETED" ? (
                <Badge>Completed</Badge>
              ) : status == "PENDING" ? (
                <Badge className="bg-yellow-500 hover:bg-yellow-500">
                  Pending
                </Badge>
              ) : (
                <Badge className="bg-red-500 hover:bg-red-500">Disable</Badge>
              )}
            </>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: () => (
          <Text size="sm" weight="semibold" textColor="text-[5A5A5A]">
            Recived at
          </Text>
        ),
        cell: ({ row }) => {
          const created_at: any = row.getValue("created_at");
          return (
            <Text size="sm" textColor="text-[5A5A5A]">
              {moment(created_at).format("LLL")}
            </Text>
          );
        },
      },
    ];
  }, []);

  return (
    <div className="w-full h-full bg-white rounded-md p-3 flex flex-col space-y-4">
      <div className="flex items-center gap-10 w-full">
        <div className="w-full">
          <Text size="xl" weight="semibold">
            Work Flow Logs
          </Text>
        </div>

        <div className="flex items-center gap-2">
          {/* <FlowImportButton /> */}
          <RefreshButton
            onClick={() => {
              refetch();
            }}
          />
          <Listbox
            options={SORT_OPTIONS}
            selectedOption={SORT_OPTIONS.find((o: any) => {
              return o.value == queryPage.sort.created_at;
            })}
            buttonClassname={`w-28`}
            onSelectData={(value: any) => {
              setQueryPage((prev: any) => {
                return {
                  ...prev,
                  page: 1,
                  sort: {
                    created_at: value?.value,
                  },
                };
              });
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-scroll pb-2">
        <AsyncTable
          data={items}
          columns={columns}
          isLoading={isLoading}
          fetchData={(pageIndex: number, pageSize: number) => {
            setQueryPage((prestate: any) => {
              return {
                ...prestate,
                per_page: pageSize,
                page: pageIndex + 1,
              };
            });
          }}
          placeholder={"Flow Not Found"}
          pageCount={pagination.total_page}
          current_page={pagination.current_page - 1}
          perPage={pagination.per_page}
          onRowSelected={(row: any) => {}}
          defaultSelectedRows={[]}
        />
      </div>
    </div>
  );
};

export default WorkFlowLogsList;
