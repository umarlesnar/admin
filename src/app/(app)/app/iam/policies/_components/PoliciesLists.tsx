"use client";
import AsyncTable from "@/components/table/AsyncTable";
import Text from "@/components/ui/text";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/ui/SearchBox";
import { Checkbox } from "@/components/ui/Checkbox";
import moment from "moment";
import { ColumnDef } from "@tanstack/react-table";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { Listbox } from "@/components/ui/listbox";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { EditIcon } from "@/components/ui/icons/EditIcone";
import { Alert } from "@/components/ui/alert";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { toast } from "sonner";
import RefreshButton from "@/components/ui/RefreshBotton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { usePoliciesApi } from "@/framework/iam/policies/get-policies";
import { usePoliciesMutation } from "@/framework/iam/policies/policy-mutation";
import AddPoliciesSheet from "./AddPoliciesSheet";
import { EyeIcon } from "@/components/ui/icons/EyeIcon";
import EditPoliciesSheet from "./EditPolicySheet";
import { PolicyIcon } from "@/components/ui/icons/PolicyIcon";
import { CopyLinkIcon } from "@/components/ui/icons/CopyLinkIcon";
import CopyPoliciesSheet from "./CopyPolicySheet";

type Props = {};

const sortOptions = [
  { id: 2, name: "Create Date", value: { created_at: -1 } },
  { id: 3, name: "Last Update", value: { updated_at: 1 } },
];
const STATUS = [
  { value: "", name: "All" },
  { value: "ACTIVE", name: "Active" },
  { value: "DISABLED", name: "Disabled" },
];

const PoliciesList = (props: Props) => {
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
  const [options, setOptions] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState([]);

  const { mutateAsync } = usePoliciesMutation();

  // Update search params whenever queryPage changes
  useEffect(() => {
    const params = new URLSearchParams();

    // Add each queryPage property to search params
    Object.entries(queryPage).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "sort" || key === "filter") {
          // Stringify objects/arrays
          params.set(key, JSON.stringify(value));
        } else if (value !== 0 && value !== "") {
          params.set(key, String(value));
        }
      }
    });

    // Update URL without page reload
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [queryPage, pathname, router]);

  const { data, isLoading, refetch } = usePoliciesApi(queryPage);

  useEffect(() => {
    if (data) {
      setItems(data.items || []);

      setPagination({
        per_page: data.per_page,
        total_page: data.total_page,
        total_result: data.total_result,
        current_page: data.current_page,
      });

      setQueryPage((prestate: any) => {
        return {
          ...prestate,
          per_page: data.per_page,
          page: data.current_page,
          q: queryPage.q,
        };
      });
    }
  }, [data]);

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "name",
      header: () => (
        <Text weight="semibold" color="secondary">
          Name
        </Text>
      ),
      cell: ({ row }) => {
        const name = row?.original?.name?.trim();
        return (
          <div className="flex items-center gap-2 ">
            <Text weight="semibold" color="secondary">
              {name}
            </Text>
          </div>
        );
      },
    },
    {
      id: "description",
      header: () => (
        <Text weight="semibold" color="secondary">
          Description
        </Text>
      ),
      cell: ({ row }) => {
        const description = row?.original?.description?.trim();
        return (
          <div className="flex items-center gap-2 ">
            <Text weight="semibold" color="secondary">
              {description}
            </Text>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <Text size="sm" weight="semibold" textColor="text-[5A5A5A]">
          Status
        </Text>
      ),
      cell: ({ row }) => (
        <div
          className={`${
            row.getValue("status") === "ACTIVE"
              ? "bg-[#def6e8]"
              : "bg-[#eaebed]"
          } max-w-[75px] rounded-sm text-center py-1.5`}
        >
          <p
            className={`text-[13.5px] ${
              row.getValue("status") === "ACTIVE"
                ? "text-[#28C76F]"
                : "text-[#898a93]"
            } font-medium`}
          >
            {row.getValue("status") === "ACTIVE" ? "Active" : "Disabled"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => (
        <Text weight="semibold" color="secondary">
          Activated at
        </Text>
      ),

      cell: ({ row }) => (
        <Text color="secondary">
          {moment(row.getValue("created_at")).format("DD MMM YYYY")}
        </Text>
      ),
    },
    {
      id: "actions",
      header: () => (
        <Text weight="semibold" color="secondary">
          Actions
        </Text>
      ),
      cell: ({ row }) => {
        const policies = row.original;

        return (
          <div className="flex gap-3 space-x-2">
            <EyeIcon
              className="w-5 h-5 text-blue-500 cursor-pointer"
              onClick={() => {
                router.push(`/app/iam/policies/${row?.original?._id}/attach`);
              }}
            />
            <EditPoliciesSheet data={policies}>
              <EditIcon className="w-4 h-4 cursor-pointer text-green-600" />
            </EditPoliciesSheet>
            <Alert
              icon={<AlertIcon className="w-[50px] h-[50px] text-red-500" />}
              description={`Do you want to remove this Policy ?`}
              onRightButton={async () => {
                const loadingToast = toast.loading("Loading...");
                try {
                  await mutateAsync({
                    method: "DELETE",
                    policy_id: policies._id,
                  });
                  toast.success(`Policy Deleted Successfully`, {
                    id: loadingToast,
                  });
                } catch (error) {
                  toast.error(`Failed to Policy delete`, {
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
            <CopyPoliciesSheet data={policies}>
              <CopyLinkIcon className="w-4 h-4 cursor-pointer hover:text-green-600" />
            </CopyPoliciesSheet>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-3 w-full h-full   flex flex-col">
      <div className="flex flex-wrap w-full justify-between">
        <div className="w-[50%] flex items-center gap-2">
          <div className="flex-1">
            <Text tag={"h1"} size={"xl"} weight="bold">
              Policies
            </Text>
          </div>
        </div>
        <div className="flex items-center ">
          <AddPoliciesSheet>
            <Button
              size="sm"
              className=" w-[138px] h-[38px]  "
              leftIcon={<PlusIcon className="w-[14px] h-[14px] mr-2" />}
            >
              Add Policy
            </Button>
          </AddPoliciesSheet>
        </div>
      </div>
      <div className=" flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="mt-6">
            <SearchBox
              placeholder="Search by name"
              className="w-52"
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
            <Listbox
              placeholder="Sort by: Name"
              buttonClassname="text-text-primary h-9"
              options={sortOptions}
              onSelectData={(data: any) => {
                setQueryPage((prev: any) => {
                  return {
                    ...prev,
                    page: 1,
                    sort: data?.value,
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
          <div className="mt-6">
            <RefreshButton
              onClick={() => {
                refetch();
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden pb-2">
        {!isLoading &&
        items.length == 0 &&
        queryPage.q == "" &&
        queryPage.page == 1 ? (
          <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
            <PolicyIcon className="w-16 h-16 text-primary" />
            <Text size="2xl" weight="semibold">{`No Policies found!`}</Text>
            <Text
              size="sm"
              weight="regular"
              color="teritary"
              className="w-[350px] text-center"
            >{`No Policies found, try search with another keywords or create a new Policies`}</Text>
            <AddPoliciesSheet>
              <Button leftIcon={<PlusIcon className={`w-4 h-4 mr-2`} />}>
                Add new Policy
              </Button>
            </AddPoliciesSheet>
          </div>
        ) : (
          <AsyncTable
            data={items}
            columns={columns}
            isLoading={isLoading}
            className="scroll"
            fetchData={(pageIndex: number, pageSize: number) => {
              setQueryPage((prestate: any) => {
                return {
                  ...prestate,
                  per_page: pageSize,
                  page: pageIndex + 1,
                };
              });
            }}
            placeholder={"Policy Not Found"}
            pageCount={pagination.total_page}
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

export default PoliciesList;
