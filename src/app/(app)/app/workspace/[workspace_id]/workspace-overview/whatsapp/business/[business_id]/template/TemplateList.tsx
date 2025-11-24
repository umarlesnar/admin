"use client";
import Text from "@/components/ui/text";
import { useApplication } from "@/contexts/application/application.context";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import AsyncTable from "@/components/table/AsyncTable";
import { EyeIcon } from "@/components/ui/icons/EyeIcon";
import { Listbox } from "@/components/ui/listbox";
import RefreshButton from "@/components/ui/RefreshBotton";
import { SearchBox } from "@/components/ui/SearchBox";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { MarketingIcon } from "@/components/ui/icons/MarketingIcon";
import { UtilityIcon } from "@/components/ui/icons/UtilityIcon";
import { AuthendicationIcon } from "@/components/ui/icons/AuthendicationIcon";
import { useBusinessTemplateByIdQuery } from "@/framework/business/overview/get-business-template";
import { Badge } from "@/components/ui/badge";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { ErrorInfoIcon } from "@/components/ui/icons/ErrorInfoIcon";
import { TemplateIcon2 } from "@/components/ui/icons/TemplateIcon2";

type Props = {};
const TEMPLATE_LANGUAGES = [
  { value: "bn", name: "BENGALI" },
  { value: "en_US", name: "ENGLISH US" },
  { value: "en", name: "ENGLISH" },
  { value: "gu", name: "GUJARATI" },
  { value: "hi", name: "HINDI" },
  { value: "kn", name: "KANNADA" },
  { value: "ml", name: "MALAYALAM" },
  { value: "mr", name: "MARATHI" },
  { value: "pa", name: "PUNJABI" },
  { value: "ta", name: "TAMIL" },
  { value: "te", name: "TELUGU" },
];

const TEMPLATE_CATEGORY = [
  { value: "", name: "All" },
  { value: "MARKETING", name: "Marketing" },
  { value: "UTILITY", name: "Utility" },
  { value: "AUTHENTICATION", name: "Authentication" },
];

const TEMPLATE_STATUS = [
  { value: "", name: "All" },
  { value: "APPROVED", name: "Approved" },
  { value: "PENDING", name: "Pending" },
  { value: "REJECTED", name: "Rejected" },
];

const BusinessTemplateList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { setUserParams } = useApplication();
  const { business_id ,workspace_id} = useParams<{ business_id: string ,workspace_id: string}>();

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

    // Update URL without page reload
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [queryPage, pathname, router]);

  const { data, isLoading, refetch } = useBusinessTemplateByIdQuery(queryPage);

  // useEffect(() => {
  //   if (data) {
  //     setItems(data?.items);
  //     setPagination({
  //       per_page: data?.per_page,
  //       total_page: data?.total_page,
  //       total_result: data?.total_result,
  //       current_page: data?.current_page,
  //     });
  //     setQueryPage((prestate: any) => {
  //       return {
  //         ...prestate,
  //         per_page: data?.per_page,
  //         page: data?.current_page,
  //         q: queryPage.q,
  //       };
  //     });
  //   }
  // }, [data]);

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
      accessorKey: "name", // Using accessorKey for first name
      header: "Template Name",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{row.getValue("name")}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <div className="font-medium text-text-secondary">
          {row.original?.status == "APPROVED" ? (
            <Badge className="bg-green-500 hover:bg-green-400 cursor-pointer">
              Approved
            </Badge>
          ) : row.original?.status == "PENDING" ? (
            <Badge className="bg-yellow-500 hover:bg-yellow-400 cursor-pointer">
              Pending
            </Badge>
          ) : (
            <Badge className="bg-red-500 gap-2 hover:bg-red-400 cursor-pointer">
              Rejected{" "}
              <CustomTooltip value={row.original?.reason}>
                <ErrorInfoIcon className="w-4 h-4" />
              </CustomTooltip>
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }: any) => {
        const category = row.getValue("category");

        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            {category == "MARKETING" ? (
              <MarketingIcon className="w-4 h-4 text-icon-primary" />
            ) : null}
            {category == "UTILITY" ? (
              <UtilityIcon className="w-4 h-4 text-icon-primary" />
            ) : null}
            {category == "AUTHENTICATION" ? (
              <AuthendicationIcon className="w-4 h-4 text-icon-primary" />
            ) : null}
            <Text>{category}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "language",
      header: "Language",
      cell: ({ row }: any) => {
        const language: any = TEMPLATE_LANGUAGES.find((o) => {
          return o.value == row.getValue("language");
        });

        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text className="text-center">{language?.name || ""}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: "Last Update",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text className="text-center">
              {moment(row.getValue("updated_at")).format("DD-MM-YYYY")}
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
              router.push(
                `/app/workspace/${workspace_id}/workspace-overview/whatsapp/business/${business_id}/template/${row?.original?._id}/view`
              );
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full p-1 flex flex-col space-y-3">
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="w-[40%] flex items-center gap-3">
          <div className="w-full">
            <SearchBox
              className="w-full"
              placeholder="Search template by name"
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
          
          <Listbox
            options={TEMPLATE_STATUS}
            selectedOption={TEMPLATE_STATUS?.find((o) => {
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
           <Listbox
            options={TEMPLATE_CATEGORY}
            selectedOption={TEMPLATE_CATEGORY?.find((o) => {
              return o.value == queryPage?.filter?.category;
            })}
            onSelectData={(value: any) => {
              setQueryPage((prev: any) => {
                return {
                  ...prev,
                  page: 1,
                  filter: {
                    ...prev?.filter,
                    category: value.value,
                  },
                };
              });
            }}
            buttonClassname={`w-52`}
          />
          
          <Listbox
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
          />
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
            {" "}
            <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
              <TemplateIcon2 className="w-12 h-12 text-primary" />
              <Text size="2xl" weight="semibold">{`No Template Lists`}</Text>
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

export default BusinessTemplateList;
