"use client";
import AsyncTable from "@/components/table/AsyncTable";
import { EditIcon } from "@/components/ui/icons/EditIcone";
import { UserIcon } from "@/components/ui/icons/userIcon";
import RefreshButton from "@/components/ui/RefreshBotton";
import { SearchBox } from "@/components/ui/SearchBox";
import Text from "@/components/ui/text";
import { useManageUserQuery } from "@/framework/partner/workspace/manage-user/get-manage-user";
import { useWorkspaceUserQuery } from "@/framework/workspace/manage-user/get-workspace-users";
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
import EditManageUserSheet from "./EditManageUserSheet";
import { AgentsIcon } from "@/components/ui/icons/AgentsIcon";

export const ManageUserList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const workspaceId = params?.workspace_id as string;

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
      }),
      sort: safeJSONParse(searchParams.get("sort"), { _id: "-1" }),
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

  const { data, isLoading, refetch } = useManageUserQuery(queryPage);

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
      accessorKey: "first_name",
      header: "User Name",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 font-medium text-text-secondary">
          <Text>
            {row?.original?.first_name
              ? `${row.original.first_name} ${row.original.last_name}`
              : "-"}
          </Text>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 font-medium text-text-secondary">
          <Text>{row?.original?.role}</Text>
        </div>
      ),
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
            row.getValue("status") === "ACTIVE"
              ? "bg-[#def6e8]"
              : row.getValue("status") === "DISABLE"
              ? "bg-[#eaebed]"
              : row.getValue("status") === "SUSPENDED"
              ? "bg-[#feeee0]"
              : "bg-[#FF4C5129]"
          } max-w-[75px] rounded-sm text-center py-1.5`}
        >
          <p
            className={`text-[13.5px] ${
              row.getValue("status") === "ACTIVE"
                ? "text-[#28C76F]"
                : row.getValue("status") === "DISABLE"
                ? "text-[#898a93]"
                : row.getValue("status") === "SUSPENDED"
                ? "text-[#FF9F43]"
                : "text-[#FF4C51]"
            } font-medium`}
          >
            {row.getValue("status") === "ACTIVE"
              ? "Active"
              : row.getValue("status") === "DISABLE"
              ? "Disable"
              : row.getValue("status") === "SUSPENDED"
              ? "Suspended"
              : "Delete"}   
          </p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 font-medium text-text-secondary">
          <Text className="text-center">
            {moment(row.getValue("created_at")).format("DD-MM-YYYY")}
          </Text>
        </div>
      ),
    },
    {
      id: "action",
      header: "Actions",
      cell: ({ row }: any) => {
        const manage_user = row.original;
        return (
          <div className="flex items-center gap-4">
            <EditManageUserSheet data={manage_user}>
              <EditIcon className="w-4 h-4 cursor-pointer text-green-600" />
            </EditManageUserSheet>
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
            className="w-full"
            placeholder="Search by name"
            onChange={(e) => {
              setQueryPage((prev) => ({
                ...prev,
                page: 1,
                q: e.target.value,
              }));
            }}
          />
        </div>
        <RefreshButton onClick={() => refetch()} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isLoading &&
        items?.length === 0 &&
        queryPage.q === "" &&
        queryPage.page === 1 ? (
          <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
            <AgentsIcon className="w-12 h-12 text-primary" />
            <Text size="2xl" weight="semibold">
              No Manage User Lists
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
