"use client";
import AsyncTable from "@/components/table/AsyncTable";
import { SearchBox } from "@/components/ui/SearchBox";
import Text from "@/components/ui/text";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { PartnerIcon } from "@/components/ui/icons/PartnerIcon";
import AddPartnerSheet from "./AddPartnerSheets";
import { usePartnerMutation } from "@/framework/partner/partner-mutation";
import moment from "moment";
import { usePartnerQuery } from "@/framework/partner/get-partner";
import { EyeIcon } from "@/components/ui/icons/EyeIcon";
import RefreshButton from "@/components/ui/RefreshBotton";

type Props = {};

export const PartnerLists = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Safe JSON parse function
  const safeJSONParse = (jsonString: string | null, defaultValue: any) => {
    try {
      return jsonString ? JSON.parse(jsonString) : defaultValue;
    } catch (error) {
      console.error("JSON parse error:", error);
      return defaultValue;
    }
  };

  const [queryPage, setQueryPage] = useState(() => ({
    per_page: Number(searchParams.get("per_page") ?? "20"),
    page: Number(searchParams.get("page") ?? "1"),
    q: searchParams.get("q") ?? "",
    filter: safeJSONParse(searchParams.get("filter"), {
      status: "",
      type: "",
    }),
    sort: safeJSONParse(searchParams.get("sort"), { created_at: "-1" }),
  }));

  const [pagination, setPagination] = useState({
    per_page: Number(searchParams.get("per_page") ?? "20"),
    total_page: 0,
    total_result: 0,
    current_page: Number(searchParams.get("page") ?? "1"),
  });

  const [items, setItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(queryPage).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        try {
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
        } catch (error) {
          console.error(`Error processing key ${key}:`, error);
        }
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [queryPage, pathname, router]);

  const { data, isLoading, refetch } = usePartnerQuery(queryPage);
  const { mutateAsync } = usePartnerMutation();

  useEffect(() => {
    if (data) {
      setItems(data.items);
      setPagination({
        per_page: data.per_page,
        total_page: data.total_page,
        total_result: data.total_result,
        current_page: data.current_page,
      });
    }
  }, [data]);

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        cell: ({ row }: any) => (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.name || "----"}</Text>
          </div>
        ),
      },
      {
        id: "domain",
        header: "Domain",
        cell: ({ row }: any) => (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.domain}</Text>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: () => (
          <Text size="sm" weight="semibold" textColor="text-[5A5A5A]">
            Status
          </Text>
        ),
        cell: ({ row }: any) => {
          const isEnabled = row.getValue("status") === "ENABLE";
          return (
            <div
              className={`${
                isEnabled ? "bg-[#def6e8]" : "bg-[#eaebed]"
              } max-w-[75px] rounded-sm text-center py-1.5`}
            >
              <p
                className={`text-[13.5px] ${
                  isEnabled ? "text-[#28C76F]" : "text-[#898a93]"
                } font-medium`}
              >
                {isEnabled ? "Enable" : "Disable"}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Last Update",
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
        cell: ({ row }: any) => (
          <div className="flex items-center gap-4">
            <EyeIcon
              className="w-5 h-5 text-blue-500 cursor-pointer"
              onClick={() => {
                router.push(`/app/partner/${row?.original?._id}/workspace`);
              }}
            />
          </div>
        ),
      },
    ],
    [router]
  );

  return (
    <div className="w-full h-full p-1 flex flex-col space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="w-[50%] flex items-center gap-3">
          <SearchBox
            className="w-52"
            placeholder="Search by Name"
            onChange={(e) =>
              setQueryPage((prev) => ({
                ...prev,
                page: 1,
                q: e.target.value,
              }))
            }
          />
          <RefreshButton onClick={() => refetch()} />
        </div>
        <div className="flex items-center">
          <AddPartnerSheet>
            <Button
              size="sm"
              className="w-[145px] h-[38px]"
              leftIcon={<PlusIcon className="w-[14px] h-[14px] mr-2" />}
            >
              Add Partner
            </Button>
          </AddPartnerSheet>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isLoading &&
        items.length === 0 &&
        queryPage.q === "" &&
        queryPage.page === 1 ? (
          <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
            <PartnerIcon className="w-12 h-12" />
            <Text size="2xl" weight="semibold">
              No Partner Found
            </Text>
          </div>
        ) : (
          <AsyncTable
            className="w-full table-auto"
            data={items}
            columns={columns}
            isLoading={isLoading}
            placeholder={`No result for "${queryPage.q}"`}
            pageCount={pagination.total_page}
            fetchData={(pageIndex: number, pageSize: number) => {
              setQueryPage((prev) => ({
                ...prev,
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
          />
        )}
      </div>
    </div>
  );
};
