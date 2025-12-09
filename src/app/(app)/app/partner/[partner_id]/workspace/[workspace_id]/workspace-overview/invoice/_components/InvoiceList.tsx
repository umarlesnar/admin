"use client";
import Text from "@/components/ui/text";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import AsyncTable from "@/components/table/AsyncTable";
import { Combobox } from "@/components/ui/combobox";
import RefreshButton from "@/components/ui/RefreshBotton";
import { SearchBox } from "@/components/ui/SearchBox";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { Alert } from "@/components/ui/alert";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { Listbox } from "@/components/ui/listbox";
import { InvoiceIcon } from "@/components/ui/icons/InvoiceIcon";
import { usePaymentInvoiceQuery } from "@/framework/partner/workspace/invoice/get-payment-invoice";
import { Button } from "@/components/ui/button";
import MarkInvoicePaidSheet from "./MarkInvoicePaidSheet";

type Props = {};
const STATUS = [
  { value: "", name: "All" },
  { value: "paid", name: "paid" },
  { value: "pending", name: "pending" },
];
const InvoiceList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const workspaceId = params?.workspace_id as string;

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

  // const { mutateAsync } = useUserMutation();
  const { data, isLoading, refetch } = usePaymentInvoiceQuery(queryPage);

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
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.plan}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.type}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "payment_method",
      header: "Payment Method",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.payment_method}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "currency",
      header: "Currency",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.currency}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "total_price",
      header: "Total Price",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.total_price}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.quantity}</Text>
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
            row.getValue("status") === "paid" ? "bg-[#def6e8]" : "bg-[#eaebed]"
          } max-w-[75px] rounded-sm text-center py-1.5`}
        >
          <p
            className={`text-[13.5px] ${
              row.getValue("status") === "paid"
                ? "text-[#28C76F]"
                : "text-[#0682d4]"
            } font-medium`}
          >
            {row.getValue("status") === "paid" ? "paid" : "pending"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Last Update",
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
      cell: ({ row }) => {
        const Invoice = row.original;

        return (
          <div className="flex gap-3 space-x-2 items-center">
            {Invoice.status === "pending" && (
                <MarkInvoicePaidSheet invoice={Invoice} refetch={refetch}>
                    <Button size="sm" variant="outline" className="h-7 text-xs border-green-500 text-green-600 hover:bg-green-50">
                        Mark Paid
                    </Button>
                </MarkInvoicePaidSheet>
            )}

          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full h-full p-1 flex flex-col space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="w-[50%] flex items-center gap-3">
          <div className="mt-6">
            <SearchBox
              className="w-52"
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
        </div>
        <div className="flex items-center gap-2">
          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Sort
            </Text>
            <Combobox
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
          <div className="mt-6">
            <RefreshButton
              onClick={() => {
                refetch();
              }}
            />
          </div>
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
              <InvoiceIcon className="w-12 h-12 text-primary" />
              <Text size="2xl" weight="semibold">{`No Invoice Lists`}</Text>
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

export default InvoiceList;