"use client";
import AsyncTable from "@/components/table/AsyncTable";
import { Combobox } from "@/components/ui/combobox";
import { EyeIcon } from "@/components/ui/icons/EyeIcon";
import { Listbox } from "@/components/ui/listbox";
import RefreshButton from "@/components/ui/RefreshBotton";
import { SearchBox } from "@/components/ui/SearchBox";
import Text from "@/components/ui/text";
import { useBusinessAccountsQuery } from "@/framework/business/get-business-accounts";
import { useBusinessByIdQuery } from "@/framework/business/get-business-by-id";
import { useTemplateMutation } from "@/framework/template/template-mutation";
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

const STATUS = [
  { value: "", name: "All" },
  { value: "ACTIVE", name: "Active" },
  { value: "DISABLE", name: "Disable" },
  { value: "DELETE", name: "Delete"},
];

const DATESORT = [
  {
    name: "Latest",
    value: -1,
  },
  {
    name: "Oldest",
    value: 1,
  },
];

type Props = {};

export const BusinessLists = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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

  const { data, isLoading, refetch } = useBusinessAccountsQuery(queryPage);

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
      accessorKey: "name",
      header: "Business Name",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row.getValue("name")}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row?.original?.wb_status?.phone_number}</Text>
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
            row.getValue("status") === "ACTIVE"
              ? "bg-[#def6e8]"
              : row.getValue("status") === "DISABLE" ? "bg-[#eaebed]" : "bg-[#FF4C5129]"
          } max-w-[75px] rounded-sm text-center py-1.5`}
        >
          <p
            className={`text-[13.5px] ${
              row.getValue("status") === "ACTIVE"
                ? "text-[#28C76F]"
                : row.getValue("status") === "DISABLE" ? "text-[#898a93]" : "text-[#FF4C51]"
            } font-medium`}
          >
            {row.getValue("status") === "ACTIVE" ? "Active" : row.getValue("status") === "DISABLE" ? "Disable" : "Delete"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
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
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <EyeIcon
            className="w-5 h-5 text-blue-500 cursor-pointer"
            onClick={() => {
              router.push(`/app/business/${row?.original?._id}/overview`);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full p-1 flex flex-col space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="w-[40%] flex items-center gap-3">
          <div className="w-full">
            <SearchBox
              className="w-full"
              placeholder="Search business by name"
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
          <RefreshButton
            onClick={() => {
              refetch();
            }}
          />
          <Listbox
            options={DATESORT}
            // selectedOption={DATESORT?.find((o) => {
            //   return o.value == queryPage?.filter?.status;
            // })}
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
            buttonClassname={`w-52`}
          />
          {/* <Combobox
            buttonClassname={`h-9 w-44`}
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
          /> */}
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
            buttonClassname={`w-52`}
          />
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
              <BriefcaseBusiness className="w-12 h-12 text-primary" />
              <Text size="2xl" weight="semibold">{`No Business Lists`}</Text>
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
