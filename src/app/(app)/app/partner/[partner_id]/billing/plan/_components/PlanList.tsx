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
import { EditIcon } from "@/components/ui/icons/EditIcone";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { ProductIcon } from "@/components/ui/icons/ProductIcon";
import AddPlanSheet from "./AddPlanSheet";
import EditPlanSheet from "./EditPlanSheet";
import { usePartnerProductQuery } from "@/framework/partner/get-partner-product";
import { usePartnerProductMutation } from "@/framework/partner/partner-product-mutation";
import AddPaugSheet from "./Addpaugsheet";
import EditPaugSheet from "./EditPaugSheet";
import { Badge } from "@/components/ui/badge";
import { AccessIcon } from "@/components/ui/icons/AccessIcon";
import PlanNodeAccessSheet from "./PlanNodeAccessSheet";

const STATUS = [
  { value: "", name: "All" },
  { value: "ENABLE", name: "Enable" },
  { value: "DISABLE", name: "Disable" },
];

const TYPE = [
  { value: "", name: "All" },
  { value: "annual", name: "Annual" },
  { value: "month", name: "Month" },
];

const PLAN_TYPE = [
  { value: "", name: "All" },
  { value: "free", name: "free" },
  { value: "trial", name: "trial" },
  { value: "standard", name: "standard" },
  { value: "paug", name: "paug" },
];
const VISIBILITY = [
  { value: "", name: "All" },
  { value: "true", name: "true" },
  { value: "false", name: "false" },
];

type Props = {};

export const PlanList = (props: Props) => {
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

  const { data, isLoading, refetch } = usePartnerProductQuery(queryPage);
  const { mutateAsync } = usePartnerProductMutation();

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
      id: "name_with_type",
      header: "Name & Type",
      cell: ({ row }: any) => {
        const name = row?.original?.name || "----";
        const type = row?.original?.type?.toLowerCase() || "----";

        const badgeClass =
          type === "annual"
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : type === "month"
            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200";

        return (
          <div className="flex gap-2">
            <div className="font-medium text-text-secondary">{name}</div>
            <Badge className={badgeClass} variant="default">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          </div>
        );
      },
    },

    {
      id: "plan_type",
      header: "Plan",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{`${row?.original?.plan_type}`}</Text>
          </div>
        );
      },
    },
    {
      id: "price",
      header: "Price",
      cell: ({ row }: any) => {
        const getCurrencyFormat = (price: number, currency_code: string) => {
          const currencyFormatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency_code,
          });
          return currencyFormatter.format(price);
        };
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>
              {getCurrencyFormat(
                row?.original?.price,
                row?.original?.currency_code
              )}
            </Text>
          </div>
        );
      },
    },
    {
      accessorKey: "visibility",
      header: () => (
        <Text
          size="sm"
          weight="semibold"
          textColor="text-[5A5A5A]"
          className=""
        >
          Visibility
        </Text>
      ),
      cell: ({ row }) => (
        <div
          className={`${
            row.getValue("visibility") === true
              ? "bg-[#def6e8]"
              : "bg-[#eaebed]"
          } max-w-[75px] rounded-full text-center py-0.5`}
        >
          <p
            className={`text-[13.5px] ${
              row.getValue("visibility") === true
                ? "text-[#28C76F]"
                : "text-[#898a93]"
            } font-medium`}
          >
            {row.getValue("visibility") === true ? "True" : "False"}
          </p>
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
            row.getValue("status") === "ENABLE"
              ? "bg-[#def6e8]"
              : "bg-[#eaebed]"
          } max-w-[75px] rounded-full text-center py-1 px-3`}
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
    {
      id: "action",
      header: "Actions",
      cell: ({ row }: any) => {
        const plan = row.original;
        return (
          <div className="flex items-center gap-4">
            {plan?.plan_type === "paug" ? (
              <EditPaugSheet data={plan}>
                <EditIcon className="w-4 h-4 cursor-pointer text-green-600" />
              </EditPaugSheet>
            ) : (
              <EditPlanSheet data={plan}>
                <EditIcon className="w-4 h-4 cursor-pointer text-green-600" />
              </EditPlanSheet>
            )}
            
            <PlanNodeAccessSheet data={plan}>
                <AccessIcon className="w-5 h-5 cursor-pointer text-gray-500 hover:text-primary-500" />
            </PlanNodeAccessSheet>
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
              Plan
            </Text>
            <Listbox
              options={PLAN_TYPE}
              selectedOption={PLAN_TYPE?.find((o) => {
                return o.value == (queryPage?.filter?.plan_type || "");
              })}
              onSelectData={(value: any) => {
                setQueryPage((prev: any) => {
                  return {
                    ...prev,
                    page: 1,
                    filter: {
                      ...prev?.filter,
                      plan_type: value.value,
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
              buttonClassname={`w-28`}
            />
          </div>
          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Visibility
            </Text>
            <Listbox
              options={VISIBILITY}
              selectedOption={VISIBILITY?.find((o) => {
                return o.value == (queryPage?.filter?.visibility || "");
              })}
              onSelectData={(value: any) => {
                setQueryPage((prev: any) => {
                  return {
                    ...prev,
                    page: 1,
                    filter: {
                      ...prev?.filter,
                      visibility: value.value,
                    },
                  };
                });
              }}
              buttonClassname={`w-28`}
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
        <div className="flex items-center gap-2 pl-3">
          <AddPaugSheet>
            <Button
              size="sm"
              className=" w-auto h-[38px]"
              variant="outline"
              leftIcon={<PlusIcon className="w-[13px] h-[13px] mr-2" />}
            >
              Paug
            </Button>
          </AddPaugSheet>{" "}
          <AddPlanSheet>
            <Button
              size="sm"
              className=" w-auto h-[38px]"
              leftIcon={<PlusIcon className="w-[14px] h-[14px] mr-2" />}
            >
              Add Plan
            </Button>
          </AddPlanSheet>{" "}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isLoading &&
        items.length == 0 &&
        queryPage.q == "" &&
        queryPage.page == 1 ? (
          <>
            <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
              <ProductIcon className="w-12 h-12 text-primary" />
              <Text size="2xl" weight="semibold">{`No Plan Found`}</Text>
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