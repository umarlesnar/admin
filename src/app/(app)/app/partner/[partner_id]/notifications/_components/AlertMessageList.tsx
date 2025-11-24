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
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { EditIcon } from "@/components/ui/icons/EditIcone";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { useAlertMessageQuery } from "@/framework/alert-message/get-alert-message";
import { useAlertMessageMutation } from "@/framework/alert-message/alert-message-mutation";
import AddAlertMessageSheet from "./AddAlertMessageSheet";
import EditAlertMessageSheet from "./EditAlertMessageSheet";
import { usePartnerAlertMessageQuery } from "@/framework/partner/get-partner-alert-message";
import { usePartnerAlertMessageMutation } from "@/framework/partner/partner-alert-message-muatation";

const TYPE = [
  { value: "", name: "All" },
  { value: "alert", name: "Alert" },
  { value: "Info", name: "Info" },
  { value: "Warning", name: "Warning" },
];

const STATUS = [
  { value: "", name: "All" },
  { value: "ENABLE", name: "Enable" },
  { value: "DISABLE", name: "Disable" },
];

type Props = {};

export const AlertMessageList = (props: Props) => {
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
        type: "",
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

  const { data, isLoading, refetch } = usePartnerAlertMessageQuery(queryPage);
  const { mutateAsync } = usePartnerAlertMessageMutation();

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
      id: "title",
      header: "Name",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.title ? row?.original?.title : "----"}</Text>
          </div>
        );
      },
    },
    {
      id: "type",
      header: "Type",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{`${
              row?.original?.type ? row?.original?.type : "----"
            }`}</Text>
          </div>
        );
      },
    },
    {
      id: "body",
      header: "Description",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{`${row?.original?.body ? row?.original?.body: "----"}`}</Text>
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
            row.getValue("status") === "ENABLE"
              ? "bg-[#def6e8]"
              : "bg-[#eaebed]"
          } max-w-[75px] rounded-sm text-center py-1.5`}
        >
          <p
            className={`text-[13.5px] ${
              row.getValue("status") === "ENABLE"
                ? "text-[#28C76F]"
                : "text-[#898a93]"
            } font-medium`}
          >
            {row.getValue("status") === "ENABLE" ? "Enable" : "Disable"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Last update",
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
    {
      id: "action",
      header: "Actions",
      cell: ({ row }: any) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-4">
            <EditAlertMessageSheet data={product}>
              <EditIcon className="w-4 h-4 cursor-pointer text-green-600" />
            </EditAlertMessageSheet>
            <>
              <Alert
                icon={<AlertIcon className="w-[50px] h-[50px] text-red-500" />}
                description={`Do you want to remove this ${row?.original?.title} notification ?`}
                onRightButton={async () => {
                  const loadingToast = toast.loading("Loading...");
                  try {
                    await mutateAsync({
                      method: "DELETE",
                      alert_message_id: row?.original?._id,
                    });
                    toast.success(`Message Deleted Successfully`, {
                      id: loadingToast,
                    });
                  } catch (error) {
                    toast.error(`Failed to delete Message`, {
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
        <div className="w-[50%] flex items-center gap-3">
          <div className="w-full mt-5">
            <SearchBox
              className="w-52"
              placeholder="Search by Name"
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
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">Type</Text>
            <Listbox
              options={TYPE}
              selectedOption={TYPE?.find((o) => {
                return o.value == queryPage?.filter?.type;
              })}
              onSelectData={(value: any) => {
                setQueryPage((prev: any) => {
                  return {
                    ...prev,
                    page: 1,
                    filter: {
                      ...prev?.filter,
                      type: value.value,
                    },
                  };
                });
              }}
              buttonClassname={`w-32`}
            />
          </div>
          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">Status</Text>
            <Listbox
              options={STATUS}
              selectedOption={STATUS?.find((o) => {
                return o.value == queryPage?.filter?.status;
              })}
              onSelectData={(value: any) => {
                setQueryPage((prev: any) => {
                  return {
                    ...prev,
                    page: 1,
                    filter: {
                      ...prev?.filter,
                      status: value.value,
                    },
                  };
                });
              }}
              buttonClassname={`w-32`}
            />
          </div>
          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">Sort</Text>
            <Listbox
              buttonClassname={`h-9 w-32`}
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
          <div className="mt-5">
          <RefreshButton
            onClick={() => {
              refetch();
            }}
          />
          </div>
          
        </div>
        <div className="flex items-center">
          <AddAlertMessageSheet>
            <Button
              size="sm"
              className=" w-[145px] h-[38px]"
              leftIcon={<PlusIcon className="w-[14px] h-[14px] mr-2" />}
            >
              Add Message
            </Button>
          </AddAlertMessageSheet>{" "}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isLoading &&
        items.length == 0 &&
        queryPage.q == "" &&
        queryPage.page == 1 ? (
          <>
            <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
              <AlertIcon className="w-12 h-12 text-primary" />
              <Text
                size="2xl"
                weight="semibold"
              >{`No Notification Found`}</Text>
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
          />
        )}
      </div>
    </div>
  );
};
