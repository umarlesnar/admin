"use client";
import AsyncTable from "@/components/table/AsyncTable";
import { Listbox } from "@/components/ui/listbox";
import RefreshButton from "@/components/ui/RefreshBotton";
import { SearchBox } from "@/components/ui/SearchBox";
import Text from "@/components/ui/text";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { UserRoleIcon } from "@/components/ui/icons/UserRoleIcon";
import { useUserRolesQuery } from "@/framework/iam/system-roles/get-roles";


type Props = {};

const STATUS = [
  { value: "", name: "All" },
  { value: "true", name: "True" },
  { value: "false", name: "False" },
];
export const RolesLists = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initial state with defaults and search params parsing
  const [queryPage, setQueryPage] = useState(() => {
    // Safe JSON parse function
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
      sort: safeJSONParse(searchParams.get("sort"), { created_at: "-1" }),
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

    // Add each queryPage property to search params
    Object.entries(queryPage).forEach(([key, value]) => {
      try {
        if (value !== undefined && value !== null) {
          if (
            (key === "sort" || key === "filter") &&
            typeof value === "object"
          ) {
            // Safely stringify objects
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

  const { data, isLoading, refetch } = useUserRolesQuery(queryPage);

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

  const columns: ColumnDef<any>[] = [
    {
      id: "name",
      header: "Name",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.name || "-"}</Text>
          </div>
        );
      },
    },
    {
        id: "slug",
        header: "Slug",
        cell: ({ row }: any) => {
          return (
            <div className="flex items-center gap-2 font-medium text-text-secondary">
              <Text>{row?.original?.slug || "-"}</Text>
            </div>
          );
        },
      },
    {
      accessorKey: "is_visible",
      header: () => (
        <Text
          size="sm"
          weight="semibold"
          textColor="text-[5A5A5A]"
          className=""
        >
          Visible
        </Text>
      ),
      cell: ({ row }) => (
        <div
          className={`${
            row.getValue("is_visible") === true ? "bg-[#def6e8]" : "bg-red-100"
          } max-w-[75px] rounded-sm text-center py-1.5`}
        >
          <p
            className={`text-[13.5px] ${
              row.getValue("is_visible") === true
                ? "text-[#28C76F]"
                : "text-red-500"
            } font-medium`}
          >
            {row.getValue("is_visible") === true ? "True" : "False"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created at",
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
      <div className="flex items-center space-x-3">
        <div className="mt-6">
          <SearchBox
            className="flex-1 w-52"
            placeholder="Search by name"
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
        </div>
        <div>
          <Text size="sm" weight="medium" className="text-gray-600 mb-1">
            Status
          </Text>
          <Listbox
            options={STATUS}
            selectedOption={STATUS?.find((o) => {
              return o.value == queryPage?.filter?.is_visible;
            })}
            onSelectData={(value: any) => {
              setQueryPage((prev: any) => {
                return {
                  ...prev,
                  page: 1,
                  filter: {
                    ...prev?.filter,
                    is_visible: value.value,
                  },
                };
              });
            }}
            buttonClassname={`w-32`}
          />
        </div>
        <div>
          <Text size="sm" weight="medium" className="text-gray-600 mb-1">
            Sort
          </Text>
          <Listbox
            buttonClassname={`w-32`}
            options={[
              {
                name: "Latest",
                value: -1,
              },
              {
                name: "Oldest",
                value: 1,
              },
            ]}
            placeholder={"Latest"}
            onSelectData={(value: any) => {
              setQueryPage((prev: any) => {
                return {
                  ...prev,
                  page: 1,
                  sort: {
                    created_at: value.value,
                  },
                };
              });
            }}
          />
        </div>
        <div className="mt-6">
          <RefreshButton
            onClick={() => {
              refetch();
            }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isLoading &&
        items.length == 0 &&
        queryPage.q == "" &&
        queryPage.page == 1 ? (
          <>
            <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
              <UserRoleIcon className="w-12 h-12 text-primary" />
              <Text size="2xl" weight="semibold">{`No Role Found`}</Text>
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
