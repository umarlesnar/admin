"use client";
import AsyncTable from "@/components/table/AsyncTable";
import { Alert } from "@/components/ui/alert";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { Listbox } from "@/components/ui/listbox";
import RefreshButton from "@/components/ui/RefreshBotton";
import { SearchBox } from "@/components/ui/SearchBox";
import Text from "@/components/ui/text";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { EditIcon } from "@/components/ui/icons/EditIcone";
import { ModulesIcon } from "@/components/ui/icons/ModulesIcon";
import { useModulesQuery } from "@/framework/modules/get-modules";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { useMasterModulesMutation } from "@/framework/modules/modules-mutation";
import AddModuleSheet from "./AddModuleSheet";
import EditModuleSheet from "./EditModuleSheet";
import moment from "moment";

const STATUS = [
  { value: "", name: "All" },
  { value: "true", name: "True" },
  { value: "false", name: "False" },
];

type Props = {};

export const MasterLists = (props: Props) => {
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
        is_active:"",
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

    // Update URL without page reload
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [queryPage, pathname, router]);

  const { data, isLoading, refetch } = useModulesQuery(queryPage);
  const { mutateAsync } = useMasterModulesMutation();

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
      id: "module_id",
      header: "Module Id",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.module_id || "-"}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
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
      accessorKey: "category",
      header: "Category",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.category || "-"}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.description || "-"}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "sort_order",
      header: "Orders",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.sort_order || "0"}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "default_permission",
      header: "Permissions",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>
              {Array.isArray(row?.original?.default_permission) ? (
                <div className="flex flex-wrap gap-1">
                  {row.original.default_permission.map(
                    (permission: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                      >
                        {permission}
                      </span>
                    )
                  )}
                </div>
              ) : (
                "-"
              )}
            </Text>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: () => (
        <Text weight="semibold" color="secondary">
          Created on
        </Text>
      ),

      cell: ({ row }) => (
        <Text color="secondary">
          {moment(row.getValue("created_at")).format("DD MMM YYYY")}
        </Text>
      ),
    },
    {
      accessorKey: "is_active",
      header: () => (
        <Text
          size="sm"
          weight="semibold"
          textColor="text-[5A5A5A]"
          className=""
        >
          Active
        </Text>
      ),
      cell: ({ row }) => (
        <div
          className={`${
            row.getValue("is_active") === true ? "bg-[#def6e8]" : "bg-red-100"
          } max-w-[75px] rounded-sm text-center py-1.5`}
        >
          <p
            className={`text-[13.5px] ${
              row.getValue("is_active") === true
                ? "text-[#28C76F]"
                : "text-red-500"
            } font-medium`}
          >
            {row.getValue("is_active") === true ? "True" : "False"}
          </p>
        </div>
      ),
    },
    {
      id: "action",
      header: "Actions",
      cell: ({ row }: any) => {
        const moduleData = row.original;
        return (
          <div className="flex items-center gap-4">
            <EditModuleSheet data={moduleData}>
              <EditIcon className="w-4 h-4 cursor-pointer text-green-600" />
            </EditModuleSheet>
            <>
              <Alert
                icon={<AlertIcon className="w-[50px] h-[50px] text-red-500" />}
                description={`Do you want to remove this ${row?.original?.module_id} Module ?`}
                onRightButton={async () => {
                  const loadingToast = toast.loading("Loading...");
                  try {
                    await mutateAsync({
                      method: "DELETE",
                      modules_id: row?.original?._id,
                    });
                    toast.success(`Module Deleted Successfully`, {
                      id: loadingToast,
                    });
                  } catch (error) {
                    toast.error(`Failed to delete module`, {
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

  return (
    <div className="w-full h-full p-1 flex flex-col space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="w-[40%] flex items-center gap-3">
          <div className="">
            <SearchBox
              className="w-full"
              placeholder="Search by Modules Name"
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
        </div>
        <div className="flex items-center gap-2">
          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Status
            </Text>
            <Listbox
              options={STATUS}
              selectedOption={STATUS?.find((o) => {
                return o.value == queryPage?.filter?.is_active;
              })}
              onSelectData={(value: any) => {
                setQueryPage((prev: any) => {
                  return {
                    ...prev,
                    page: 1,
                    filter: {
                      ...prev?.filter,
                      is_active: value.value,
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
          <div className="flex items-center mt-6">
            <AddModuleSheet>
              <Button
                size="sm"
                className=" w-[145px] h-[38px]  "
                leftIcon={<PlusIcon className="w-[14px] h-[14px] mr-2" />}
              >
                Add Modules
              </Button>
            </AddModuleSheet>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isLoading &&
        items.length == 0 &&
        queryPage.q == "" &&
        queryPage.page == 1 ? (
          <>
            <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
              <ModulesIcon className="w-12 h-12 text-primary" />
              <Text size="2xl" weight="semibold">{`No Modules Lists`}</Text>
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
