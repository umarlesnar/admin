"use client";
import AsyncTable from "@/components/table/AsyncTable";
import { Checkbox } from "@/components/ui/Checkbox";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import RefreshButton from "@/components/ui/RefreshBotton";
import { SearchBox } from "@/components/ui/SearchBox";
import Text from "@/components/ui/text";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import FlowImportButton from "./FlowImportButton";
import { Alert } from "@/components/ui/alert";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { toast } from "sonner";
import useStore from "./store";
import { useBotFlowLibrary } from "@/framework/bot-flow-library/get-bot-flow-library";
import { useBotFlowLibraryMutation } from "@/framework/bot-flow-library/bot-flow-library-mutation";
import { BotFlowCreateButton } from "./BotflowCreateButton";
import { Badge } from "@/components/ui/badge";

type Props = {};

const FlowListPage = (props: Props) => {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);

  const [queryPage, setQueryPage] = useState<any>({
    per_page: 20,
    page: 1,
    q: "",
    filter: JSON.stringify({}),
  });
  const [pagination, setPagination] = useState<any>({
    per_page: 20,
    total_page: 0,
    total_result: 0,
    current_page: 1,
  });

  const { data, isLoading, refetch } = useBotFlowLibrary(queryPage);
  const { mutateAsync } = useBotFlowLibraryMutation();

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
        accessorKey: "name",
        header: () => (
          <Text size="sm" weight="semibold" textColor="text-[5A5A5A]">
            Flow Name
          </Text>
        ),
        cell: ({ row }) => (
          <Text size="sm" textColor="text-[5A5A5A]">
            {row.getValue("name")}
          </Text>
        ),
      },
      {
        accessorKey: "description",
        header: () => (
          <Text weight="semibold" color="secondary">
            Description
          </Text>
        ),
        cell: ({ row }) => {
          const description = row?.original?.description?.trim();
          return (
            <div className="flex items-center gap-2 ">
              <Text weight="semibold" color="secondary">
                {description}
              </Text>
            </div>
          );
        },
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
              {status == "ENABLED" ? (
                <Badge className="bg-[#D1FAE5] text-[#065F46] hover:bg-[#d1fae5] cursor-pointer">
                  Enabled
                </Badge>
              ) : (
                <Badge className="bg-[#FEE2E2] gap-2 hover:bg-[#FEE2E2] text-[#991B1B] cursor-pointer">
                  Disable
                </Badge>
              )}
            </>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: () => (
          <Text size="sm" weight="semibold" textColor="text-[5A5A5A]">
            Modified On
          </Text>
        ),
        cell: ({ row }) => {
          const created_at: any = row.getValue("created_at");
          return (
            <Text size="sm" textColor="text-[5A5A5A]">
              {moment(created_at).format("DD MMM YYYY")}
            </Text>
          );
        },
      },
      {
        id: "actions",
        header: () => (
          <Text size="sm" weight="semibold" textColor="text-[5A5A5A]">
            Actions
          </Text>
        ),
        cell: ({ row }) => {
          const flow = row.original;
          return (
            <div className="flex items-center gap-6">
              <EditIcon
                className="w-4 h-4 text-icon-primary cursor-pointer"
                onClick={() => {
                  router.push("/app/library/bot-flow/Edit/" + flow._id);
                }}
              />

              <Alert
                icon={<AlertIcon className="w-[50px] h-[50px] text-red-500" />}
                description={`Do you want to remove this flow ?`}
                onRightButton={async () => {
                  const loadingToast = toast.loading("Loading...");
                  try {
                    await mutateAsync({
                      flow_id: flow._id,
                      method: "DELETE",
                    });
                    toast.success(`Flow Deleted Successfully`, {
                      id: loadingToast,
                    });
                  } catch (error) {
                    toast.error(`Failed to Flow delete`, {
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
            </div>
          );
        },
      },
    ];
  }, []);
  const { setInitialNode } = useStore();

  // if (
  //   !isLoading &&
  //   items.length == 0 &&
  //   queryPage.q == "" &&
  //   queryPage.page == 1
  // ) {
  //   return <FlowEmptyPlaceholder />;
  // }

  return (
    <div className="w-full h-full bg-white rounded-md p-3 flex flex-col space-y-4">
      <div className="flex items-center gap-10 w-full">
        <div className="min-w-fit">
          <Text size="xl" weight="semibold">
            Bot Flows
          </Text>
        </div>

        <div className="w-full flex items-center gap-4 justify-center">
          <div className="w-[50%]">
            <SearchBox
              className="w-full"
              placeholder="Search Flows by Name"
              onChange={(e: any) => {
                if (e.target.value != "") {
                  setQueryPage({
                    per_page: pagination.per_page,
                    page: 1,
                    q: e.target.value,
                  });
                } else {
                  setQueryPage({
                    per_page: pagination.per_page,
                    page: 1,
                    q: "",
                  });
                }
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FlowImportButton />
          <RefreshButton
            onClick={() => {
              refetch();
            }}
          />
          <BotFlowCreateButton />
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

export default FlowListPage;
