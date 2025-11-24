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
import { ProductIcon } from "@/components/ui/icons/ProductIcon";
import { usePartnerBillingInvoiceQuery } from "@/framework/partner/billing-invoice/get-billing-invoice";
import { NotesIcon } from "@/components/ui/icons/NotesIcon";
import { BillingInvoiceIcon } from "@/components/ui/icons/BillingInvoice";

const STATUS = [
  { value: "", name: "All" },
  { value: "paid", name: "Paid" },
  { value: "not paid", name: "Not Paid" },
];

const PAYMENT_METHOD = [
  { value: "", name: "All" },
  { value: "upi", name: "UPI" },
  { value: "Manual", name: "manual" },
];

const TYPE = [
  { value: "", name: "All" },
  { value: "free", name: "free" },
  { value: "trial", name: "trial" },
  { value: "standard", name: "standard" },
  { value: "paug", name: "paug" },
  { value: "wallet", name: "wallet" },
];
const SORTOPTIONS = [
  { name: "Latest", value: -1 },
  { name: "Oldest", value: 1 },
];

type Props = {};

export const BillingInvoiceList = (props: Props) => {
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
        payment_method:"",
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

  const { data, isLoading, refetch } = usePartnerBillingInvoiceQuery(queryPage);

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
      accessorKey: "workspace",
      header: "Workspace",
      enableResizing: false,
      size: 220,
      cell: ({ row }: any) => {
        const workspace = row?.original?.workspace;
        return (
          <div className="flex flex-col gap-1 py-1">
            <Text size="sm" weight="medium" className="truncate">
              {workspace?.name || "---"}
            </Text>
            <div className="flex items-center gap-2">
              <Text size="xs" textColor="text-gray-500" className="truncate">
                {workspace?.country || "---"}
              </Text>
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  workspace?.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
          </div>
        );
      },
    },
    {
      id: "plan",
      header: "Plan",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{`${row?.original?.plan}`}</Text>
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
            <Text>{`${row?.original?.type}`}</Text>
          </div>
        );
      },
    },
    {
      id: "payment_method",
      header: "Payment Method",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{`${row?.original?.payment_method}`}</Text>
          </div>
        );
      },
    },
    {
      id: "total_price",
      header: "Price",
      cell: ({ row }: any) => {
        const getCurrencyFormat = (total_price: number, currency: string) => {
          const currencyFormatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
          });
          return currencyFormatter.format(total_price);
        };
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>
              {getCurrencyFormat(
                row?.original?.total_price,
                row?.original?.currency
              )}
            </Text>
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
          } max-w-[75px] rounded-full text-center py-1 px-3`}
        >
          <p
            className={`text-[13.5px] ${
              row.getValue("status") === "paid"
                ? "text-[#28C76F]"
                : "text-[#898a93]"
            } font-medium`}
          >
            {row.getValue("status") === "paid" ? "Paid" : "Not Paid"}
          </p>
        </div>
      ),
    },

    {
      accessorKey: "created_at",
      header: "Created on",
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
        <div className="w-[50%] flex items-center gap-1">
          <div className="mt-5">
            <SearchBox
              className="w-40"
              placeholder="Search by workspace Name and plan"
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
              buttonClassname={`w-28`}
            />
          </div>

          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Type
            </Text>
            <Listbox
              options={TYPE}
              selectedOption={TYPE?.find((o) => {
                return o.value == (queryPage?.filter?.type || "");
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
              buttonClassname={`w-28`}
            />
          </div>
          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Method
            </Text>
            <Listbox
              options={PAYMENT_METHOD}
              selectedOption={PAYMENT_METHOD?.find((o) => {
                return o.value == queryPage?.filter?.payment_method;
              })}
              onSelectData={(value: any) => {
                setQueryPage((prev: any) => {
                  return {
                    ...prev,
                    page: 1,
                    filter: {
                      ...prev?.filter,
                      payment_method: value.value,
                    },
                  };
                });
              }}
              buttonClassname={`w-28`}
            />
          </div>
          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Sort
            </Text>
            <Listbox
              options={SORTOPTIONS}
              selectedOption={SORTOPTIONS?.find(
                (o) => o.value == queryPage?.sort?.created_at
              )}
              onSelectData={(value: any) => {
                setQueryPage((prev: any) => ({
                  ...prev,
                  page: 1,
                  sort: { ...prev?.sort, created_at: value.value },
                }));
              }}
              buttonClassname="w-32"
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
            <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
              <BillingInvoiceIcon className="w-12 h-12 text-primary" />
              <Text
                size="2xl"
                weight="semibold"
              >{`No Billing Invoice Found`}</Text>
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
