"use client";
import AsyncTable from "@/components/table/AsyncTable";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
// import CustomTooltip from "@/components/ui/CustomTooltip";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { AuthendicationIcon } from "@/components/ui/icons/AuthendicationIcon";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
// import { ErrorInfoIcon } from "@/components/ui/icons/ErrorInfoIcon";
import { EyeIcon } from "@/components/ui/icons/EyeIcon";
import { MarketingIcon } from "@/components/ui/icons/MarketingIcon";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { TemplateIcon } from "@/components/ui/icons/TemplateIcon";
import { UtilityIcon } from "@/components/ui/icons/UtilityIcon";
import { Listbox } from "@/components/ui/listbox";
import RefreshButton from "@/components/ui/RefreshBotton";
import { SearchBox } from "@/components/ui/SearchBox";
import Text from "@/components/ui/text";
import { useIndustries } from "@/framework/industries/get-industries";
import { useTemplateQuery } from "@/framework/template/get-template";
import { useTemplateMutation } from "@/framework/template/template-mutation";
import { useUsecaseApi } from "@/framework/usecase/get-usecase";
// import { useTemplateMutation } from "@/framework/template/template-mutation";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
type Props = {};

export const TemplateList = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const { data: industriesData } = useIndustries({});
  const { data: useCasesData } = useUsecaseApi({});

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
        category: "",
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

  const { data, isLoading, refetch } = useTemplateQuery(queryPage);
  const { mutateAsync } = useTemplateMutation();

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
      accessorKey: "industry_id",
      header: "Industry",
      cell: ({ row }: any) => {
        const industryId = row.getValue("industry_id");

        // Find the industry name from industriesData
        const industry = industriesData?.items?.find(
          (ind: any) => ind._id === industryId
        );

        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{industry?.name || "Unknown"}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: "use_case_id", // Using accessorKey for use_case_id
      header: "Usecase",
      cell: ({ row }: any) => {
        // Find matching use case name from useCasesData
        const useCase = useCasesData?.items?.find(
          (uc: { _id: any }) => uc._id === row.getValue("use_case_id")
        );
        return (
          <div className="flex items-center gap-2 font-medium text-text-secondary">
            <Text>{useCase ? useCase.name : "Unknown"}</Text>
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
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <EyeIcon
            className="w-5 h-5 text-blue-500 cursor-pointer"
            onClick={() => {
              router.push(`/app/library/template/${row?.original?._id}/view`);
            }}
          />
          {row?.original?.status !== "PENDING" ? (
            <>
              <EditIcon
                className="w-4 h-4 text-green-500 cursor-pointer"
                onClick={() => {
                  router.push(
                    `/app/library/template/${row?.original?._id}/edit`
                  );
                }}
              />
              <Alert
                icon={<AlertIcon className="w-[50px] h-[50px] text-red-500" />}
                description={`Do you want to remove this ${row?.original?.name} template ?`}
                onRightButton={async () => {
                  const loadingToast = toast.loading("Loading...");
                  try {
                    await mutateAsync({
                      method: "DELETE",
                      template_id: row?.original?._id,
                    });
                    toast.success(`Template Deleted Successfully`, {
                      id: loadingToast,
                    });
                  } catch (error) {
                    toast.error(`Failed to delete template`, {
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
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full p-1 flex flex-col space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="w-5/6 flex items-center gap-3">
          <div className="mt-6">
            <SearchBox
              className="w-52"
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
          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Category
            </Text>
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
              buttonClassname={`w-32`}
            />
          </div>

          {/* <Listbox
            options={INDUSTRY}
            selectedOption={INDUSTRY?.find((o) => {
              return o.value == queryPage?.filter?.industry;
            })}
            placeholder={"All"}
            onSelectData={(value: any) => {
              setQueryPage((prev: any) => {
                return {
                  ...prev,
                  page: 1,
                  filter: {
                    ...prev?.filter,
                    industry: value.value,
                  },
                };
              });
            }}
            buttonClassname={`w-44`}
          />
          <Listbox
            options={USE_CASE}
            selectedOption={USE_CASE?.find((o) => {
              return o.value == queryPage?.filter?.use_case;
            })}
            placeholder={"All"}
            onSelectData={(value: any) => {
              setQueryPage((prev: any) => {
                return {
                  ...prev,
                  page: 1,
                  filter: {
                    ...prev?.filter,
                    use_case: value.value,
                  },
                };
              });
            }}
            buttonClassname={`w-44`}
          /> */}
          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Industries
            </Text>
            <Listbox
              options={industriesData?.items?.filter(
                (item: any) => item.status === "ENABLE"
              )}
              placeholder={"All"}
              selectedOption={TEMPLATE_STATUS?.find((o) => {
                return o.value == queryPage?.filter?.industry;
              })}
              onSelectData={(value: any) => {
                setSelectedIndustry(value._id);
                setQueryPage((prev: any) => {
                  return {
                    ...prev,
                    page: 1,
                    filter: {
                      ...prev?.filter,
                      industry: value.name,
                    },
                  };
                });
              }}
              buttonClassname={`w-32`}
            />
          </div>

          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">
              Status
            </Text>
            <Listbox
              options={useCasesData?.items?.filter(
                (item: any) => item.status === "ENABLE"
              )}
              placeholder={"All"}
              selectedOption={TEMPLATE_STATUS?.find((o) => {
                return o.value == queryPage?.filter?.use_case;
              })}
              onSelectData={(value: any) => {
                setQueryPage((prev: any) => {
                  return {
                    ...prev,
                    page: 1,
                    filter: {
                      ...prev?.filter,
                      use_case: value.name,
                    },
                  };
                });
              }}
              buttonClassname={`w-32`}
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

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              router.push("/app/library/template/create");
            }}
          >
            Create Template
          </Button>
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
              <TemplateIcon className="w-12 h-12 text-primary" />
              <Text
                size="2xl"
                weight="semibold"
              >{`Start with a Blank Template`}</Text>
              <Text
                size="sm"
                weight="regular"
                color="teritary"
                className="w-[350px] text-center"
              >{`Create your template from scratch. After completing your template, submit it for review.`}</Text>
              <Button
                leftIcon={<PlusIcon className={`w-4 h-4 mr-2`} />}
                onClick={() => {
                  router.push("/app/library/template/create");
                }}
              >
                Create new template
              </Button>
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
