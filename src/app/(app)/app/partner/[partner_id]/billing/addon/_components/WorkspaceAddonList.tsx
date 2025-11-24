"use client";
import AsyncTable from "@/components/table/AsyncTable";
import Text from "@/components/ui/text";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/ui/SearchBox";
import { Checkbox } from "@/components/ui/Checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcone";
import { Alert } from "@/components/ui/alert";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { toast } from "sonner";
import RefreshButton from "@/components/ui/RefreshBotton";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { PlanIcon } from "@/components/ui/icons/PlanIcon";
import { useWorkspaceAddonQuery } from "@/framework/workspace-addon/get-workspace-addon";
import { useWorkspaceAddonMutation } from "@/framework/workspace-addon/workspace-addon-mutation";
import EditWorkspaceAddonSheet from "./EditWorkspaceAddonSheet";
import AddWorkspaceAddonSheet from "./AddWorkspaceAddonSheet";
import moment from "moment";

type Props = {};

const WorkspaceAddonList = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initial state with defaults and search params parsing
  const [queryPage, setQueryPage] = useState(() => ({
    per_page: Number(searchParams.get("per_page") || "50"),
    page: Number(searchParams.get("page") || "1"),
    q: searchParams.get("q") || "",
    sort: JSON.parse(searchParams.get("sort") || '{"profile.name": 1}'),
    tag: searchParams.get("tag")
      ? JSON.parse(searchParams.get("tag") || "[]")
      : [],
    isIn: searchParams.get("isIn") || "in",
    sms: 0,
    broadcast: 0,
  }));

  const [pagination, setPagination] = useState({
    per_page: Number(searchParams.get("per_page") || "50"),
    total_page: 0,
    total_result: 0,
    current_page: Number(searchParams.get("page") || "1"),
  });

  const [items, setItems] = useState([]);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState([]);

  const { mutateAsync } = useWorkspaceAddonMutation();

  // Update search params whenever queryPage changes
  useEffect(() => {
    const params = new URLSearchParams();

    // Add each queryPage property to search params
    Object.entries(queryPage).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "sort" || key === "tag") {
          // Stringify objects/arrays
          params.set(key, JSON.stringify(value));
        } else if (value !== 0 && value !== "") {
          params.set(key, String(value));
        }
      }
    });

    // Update URL without page reload
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [queryPage, pathname, router]);

  const { data, isLoading, refetch } = useWorkspaceAddonQuery(queryPage);

  useEffect(() => {
    if (data) {
      setItems(data.items || []);

      setPagination({
        per_page: data.per_page,
        total_page: data.total_page,
        total_result: data.total_result,
        current_page: data.current_page,
      });

      setQueryPage((prestate: any) => {
        return {
          ...prestate,
          per_page: data.per_page,
          page: data.current_page,
          q: queryPage.q,
        };
      });
    }
  }, [data]);

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      id: "workspace_id.name",
      header: () => (
        <Text weight="semibold" color="secondary">
          Workspace Name
        </Text>
      ),
      cell: ({ row }) => {
        const name = row?.original?.workspace_id?.name?.trim();
        return (
          <div className="flex items-center gap-2 ">
            <Text weight="semibold" color="secondary">
              {name}
            </Text>
          </div>
        );
      },
    },
    {
      id: "addon_id.name",
      header: () => (
        <Text weight="semibold" color="secondary">
          Addon Name
        </Text>
      ),
      cell: ({ row }) => {
        const name = row?.original?.addon_id?.name?.trim();
        return (
          <div className="flex items-center gap-2 ">
            <Text weight="semibold" color="secondary">
              {name}
            </Text>
          </div>
        );
      },
    },
    {
      accessorKey: "activated_at",
      header: "Activated at",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text className="text-center">
              {moment(row.getValue("activated_at")).format("DD-MM-YYYY")}
            </Text>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <Text weight="semibold" color="secondary">
          Actions
        </Text>
      ),
      cell: ({ row }) => {
        const workspace_addon = row.original;

        return (
          <div className="flex gap-3 space-x-2">
            <EditWorkspaceAddonSheet data={workspace_addon}>
              <EditIcon className="w-4 h-4 cursor-pointer text-green-600" />
            </EditWorkspaceAddonSheet>
            <Alert
              icon={<AlertIcon className="w-[50px] h-[50px] text-red-500" />}
              description={`Do you want to remove this ${row?.original?.name} Workspace Addon ?`}
              onRightButton={async () => {
                const loadingToast = toast.loading("Loading...");
                try {
                  await mutateAsync({
                    method: "DELETE",
                    workspace_addon_id: workspace_addon._id,
                  });
                  toast.success(`WorkspaceAddon Deleted Successfully`, {
                    id: loadingToast,
                  });
                } catch (error) {
                  toast.error(`Failed to delete Workspace Addon`, {
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

  return (
    <div className="space-y-3 w-full h-full   flex flex-col">
      <div className="flex flex-wrap w-full justify-between">
        <div className="w-[50%] flex items-center gap-2">
          <div className="flex-1">
            <Text tag={"h1"} size={"xl"} weight="bold">
              Workspace Addons
            </Text>
          </div>
        </div>
        <div className="flex items-center ">
          <AddWorkspaceAddonSheet>
            <Button
              size="sm"
              className=" w-[138px] h-[38px]  "
              leftIcon={<PlusIcon className="w-[14px] h-[14px] mr-2" />}
            >
              Add Addon
            </Button>
          </AddWorkspaceAddonSheet>
        </div>
      </div>
      <div className=" flex items-start justify-between">
        <div className="flex items-center gap-2">
          <SearchBox
            placeholder="Search by name"
            className="w-52"
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
          <RefreshButton
            onClick={() => {
              refetch();
            }}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden pb-2">
        {!isLoading &&
        items.length == 0 &&
        queryPage.q == "" &&
        queryPage.page == 1 ? (
          <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
            <PlanIcon className="w-12 h-12 text-primary" />
            <Text size="2xl" weight="semibold">{`No Addon found!`}</Text>
            <Text
              size="sm"
              weight="regular"
              color="teritary"
              className="w-[350px] text-center"
            >{`No Addon found, try search with another keywordsor create a new Addon`}</Text>
            <AddWorkspaceAddonSheet>
              <Button leftIcon={<PlusIcon className={`w-4 h-4 mr-2`} />}>
                Add new Addon
              </Button>
            </AddWorkspaceAddonSheet>
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
          />
        )}
      </div>
    </div>
  );
};

export default WorkspaceAddonList;
