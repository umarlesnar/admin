"use client";
import AsyncTable from "@/components/table/AsyncTable";
import Text from "@/components/ui/text";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/ui/SearchBox";
import { Checkbox } from "@/components/ui/Checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import { Alert } from "@/components/ui/alert";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { toast } from "sonner";
import RefreshButton from "@/components/ui/RefreshBotton";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import AddBusinessPoliciesSheet from "./AddBusinessPolicySheet";
import { PolicyIcon } from "@/components/ui/icons/PolicyIcon";
import { useIamBusinessPoliciesMutation } from "@/framework/partner/iam/policies/policy-by-id-mutation";
import { useIamPolicyByIdQuery } from "@/framework/partner/iam/policies/get-policy-by-id";

type Props = {};

const BusinessPoliciesList = (props: Props) => {
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
    per_page: Number(searchParams.get("per_page") || "50"),
    total_page: 0,
    total_result: 0,
    current_page: Number(searchParams.get("page") || "1"),
  });

  const [items, setItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  const { mutateAsync } = useIamBusinessPoliciesMutation();

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(queryPage).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "sort" || key === "filter") {
          params.set(key, JSON.stringify(value));
        } else if (value !== 0 && value !== "") {
          params.set(key, String(value));
        }
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [queryPage, pathname, router]);

  const { policy_id }: any = useParams();
  const { data, isLoading, refetch } = useIamPolicyByIdQuery(policy_id);

  useEffect(() => {
    if (data) {
      const formattedItems = data.business_accounts.map((business: any) => ({
        business_id: business.business_id,
        name: business.name,
        policy: data.policy,
      }));

      setItems(formattedItems);

      setPagination({
        per_page: data.per_page || 20,
        total_page: data.total_page || 1,
        total_result: data.total_result || formattedItems.length,
        current_page: data.current_page || 1,
      });

      setQueryPage((prevState: any) => ({
        ...prevState,
        per_page: data.per_page || 20,
        page: data.current_page || 1,
        q: prevState.q,
      }));
    }
  }, [data]);
  const handleDeletePolicy = async (
    policy123_id: string,
    business_id: string
  ) => {
    const loadingToast = toast.loading("Loading...");
    try {
      await mutateAsync({
        method: "DELETE",
        policy_id: policy_id,
        payload: {
          business_id: business_id,
        },
      });

      toast.success(`Attach Policy deleted successfully`, {
        id: loadingToast,
      });

      refetch();
    } catch (error) {
      toast.error(`Failed to delete Attach policy`, {
        id: loadingToast,
      });
      console.error("Error deleting policy:", error);
    }
  };
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
    // {
    //     id: "business_id",
    //     header: () => (
    //       <Text weight="semibold" color="secondary">
    //        Business Id
    //       </Text>
    //     ),
    //     cell: ({ row }) => {
    //       const business_id = row?.original?.business_id?.trim();
    //       return (
    //         <div className="flex items-center gap-2 ">
    //           <Text weight="semibold" color="secondary">
    //             {business_id}
    //           </Text>
    //         </div>
    //       );
    //     },
    //   },
    {
      id: "name",
      header: () => (
        <Text weight="semibold" color="secondary">
          Business Name
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
      id: "actions",
      header: () => (
        <Text weight="semibold" color="secondary">
          Actions
        </Text>
      ),
      cell: ({ row }) => {
        const policy = row.original;
        return (
          <div className="flex gap-3 space-x-2">
            <Alert
              icon={<AlertIcon className="w-[50px] h-[50px] text-red-500" />}
              description={`Do you want to remove this Attach Policy?`}
              onRightButton={() =>
                handleDeletePolicy(policy.policy_id, policy.business_id)
              }
              rightButtonProps={{
                variant: "destructive",
              }}
            >
              <DeleteIcon className="w-4 h-4 cursor-pointer text-red-600" />
            </Alert>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-3 w-full h-full flex flex-col">
      <div className="flex flex-wrap w-full justify-between">
        <div className="w-[50%] flex items-center gap-2">
          <div className="flex-1">
            <Text tag={"h1"} size={"xl"} weight="bold">
              Attach Policy
            </Text>
          </div>
        </div>
        <div className="flex items-center">
          <AddBusinessPoliciesSheet refreshTable={refetch}>
            <Button
              size="sm"
              className=" w-[138px] h-[38px]  "
              leftIcon={<PlusIcon className="w-[14px] h-[14px] mr-2" />}
            >
              Attach Policy
            </Button>
          </AddBusinessPoliciesSheet>
        </div>
      </div>
      <div className=" flex items-start justify-between">
        <div className="flex items-center gap-2">
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
          <RefreshButton
            onClick={() => {
              refetch();
            }}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden pb-2">
        {!isLoading &&
        items.length == 0 &&
        queryPage.q == "" &&
        queryPage.page == 1 ? (
          <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white ">
            <PolicyIcon className="w-16 h-16 text-primary" />
            <Text
              size="2xl"
              weight="semibold"
            >{`No Attach Policies found!`}</Text>
            <Text
              size="sm"
              weight="regular"
              color="teritary"
              className="w-[350px] text-center"
            >{`No Attach Policies found, try search with another keywords or create a new Attach Policies`}</Text>
            <AddBusinessPoliciesSheet refreshTable={refetch}>
              <Button leftIcon={<PlusIcon className={`w-4 h-4 mr-2`} />}>
                Add new Attach Policy
              </Button>
            </AddBusinessPoliciesSheet>
          </div>
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

export default BusinessPoliciesList;
