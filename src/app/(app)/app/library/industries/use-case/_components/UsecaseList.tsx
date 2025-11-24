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
import { Switch } from "@/components/ui/switch";
import DropdownTagFilter from "@/components/ui/filter-drop-down";
import RefreshButton from "@/components/ui/RefreshBotton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AddUsecaseSheet from "./AddUsecaseSheets";
import { useUsecaseApi } from "@/framework/usecase/get-usecase";
import EditUsecaseSheet from "./EditUsecaseSheets";
import { useUsecaseMutation } from "@/framework/usecase/usecase-mutation";
import { UsecaseIcon } from "@/components/ui/icons/usecase";

type Props = {};

const sortOptions = [
  { id: 1, name: "Name", value: { name: 1 } },
  { id: 2, name: "Create Date", value: { created_at: -1 } },
  { id: 3, name: "Last Update", value: { updated_at: 1 } },
];

const UsecaseList = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initial state with defaults and search params parsing
  const [queryPage, setQueryPage] = useState(() => ({
    per_page: Number(searchParams.get("per_page") || "50"),
    page: Number(searchParams.get("page") || "1"),
    q: searchParams.get("q") || "",
    sort: JSON.parse(searchParams.get("sort") || '{"profile.name": 1}'),
    tag: searchParams.get("tag")
      ? JSON.parse(searchParams.get("tag") || "[]")
      : [],
    isIn: searchParams.get("isIn") || "in",
    sms: 0,
    broadcast: 0,
  }));

  const [pagination, setPagination] = useState({
    per_page: Number(searchParams.get("per_page") || "50"),
    total_page: 0,
    total_result: 0,
    current_page: Number(searchParams.get("page") || "1"),
  });

  const [items, setItems] = useState([]);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState([]);

  const { mutateAsync } = useUsecaseMutation();

  // Update search params whenever queryPage changes
  useEffect(() => {
    const params = new URLSearchParams();

    // Add each queryPage property to search params
    Object.entries(queryPage).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "sort" || key === "tag") {
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

  const { data, isLoading, refetch } = useUsecaseApi(queryPage);

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
      accessorKey: "status",
      header: () => (
        <Text size="sm" weight="semibold" textColor="text-[5A5A5A]">
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
      id: "actions",
      header: () => (
        <Text weight="semibold" color="secondary">
          Actions
        </Text>
      ),
      cell: ({ row }) => {
        const usecase = row.original;

        return (
          <div className="flex gap-3 space-x-2">
            <EditUsecaseSheet data={usecase}>
              <EditIcon className="w-4 h-4 cursor-pointer text-green-600" />
            </EditUsecaseSheet>
            <Alert
              icon={<AlertIcon className="w-[50px] h-[50px] text-red-500" />}
              description={`Do you want to remove this ${row?.original?.name} Usecase ?`}
              onRightButton={async () => {
                const loadingToast = toast.loading("Loading...");
                try {
                  await mutateAsync({
                    method: "DELETE",
                    usecase_id: usecase._id,
                  });
                  toast.success(`Usecase Deleted Successfully`, {
                    id: loadingToast,
                  });
                } catch (error) {
                  toast.error(`Failed to delete Usecase`, {
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
              Usecase
            </Text>
          </div>
        </div>
        <div className="flex items-center ">
          <AddUsecaseSheet>
            <Button
              size="sm"
              className=" w-[138px] h-[38px]  "
              leftIcon={<PlusIcon className="w-[14px] h-[14px] mr-2" />}
            >
              Add Usecase
            </Button>
          </AddUsecaseSheet>
        </div>
      </div>
      <div className=" flex items-start justify-between">
        <DropdownTagFilter
          label={"Tags"}
          options={options}
          onSelectData={(array: any) => {
            setQueryPage((prev: any) => {
              return {
                ...prev,
                page: 1,
                tag: array,
              };
            });
          }}
          selectedOptions={queryPage?.tag}
          headerComponent={
            <div className="flex items-center space-x-2 p-2">
              <Switch
                id="isIn"
                checked={queryPage.isIn == "in" ? true : false}
                onCheckedChange={(value) => {
                  if (value) {
                    setQueryPage((prev: any) => {
                      return {
                        ...prev,
                        isIn: "in",
                        page: 1,
                      };
                    });
                  } else {
                    setQueryPage((prev: any) => {
                      return {
                        ...prev,
                        isIn: "not_in",
                        page: 1,
                      };
                    });
                  }
                }}
              />
              <Text
                tag="label"
                size="sm"
                weight="medium"
                htmlFor="isIn"
                className="cursor-pointer select-none"
              >
                {queryPage.isIn == "in" ? "Include" : "Exclude"}
              </Text>
            </div>
          }
        ></DropdownTagFilter>
        <div className="flex items-center gap-2">
          <div>
            <Text size="sm" weight="medium" className="text-gray-600 mb-1">Sort</Text>
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
          <div className="mt-6">
          <RefreshButton
            onClick={() => {
              refetch();
            }}
          />
          </div>
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
          
        </div>
      </div>
      {/* <div className="bg-white border border-[#DEE2E1] w-full h-[70px] rounded-lg flex items-center justify-between p-4">
        <div className="flex items-center gap-1">
          <Text size="sm" weight="regular" textColor="text-text-primary">
            Total Usecase
          </Text>
          <Text size="sm" weight="semibold" textColor="text-text-primary">
            {`: ${data?.total_result || ""}`}
          </Text>
        </div>
      </div> */}
      <div className="flex-1 flex flex-col overflow-hidden pb-2">
        {!isLoading &&
        items.length == 0 &&
        queryPage.q == "" &&
        queryPage.page == 1 ? (
          <div className="w-full h-full flex items-center justify-center flex-col space-y-3 bg-white">
            <UsecaseIcon className="w-16 h-16 text-primary" />
            <Text size="2xl" weight="semibold">{`No Usecase found!`}</Text>
            <Text
              size="sm"
              weight="regular"
              color="teritary"
              className="w-[350px] text-center"
            >{`No Usecase found, try search with another keywordsor create a new Usecase`}</Text>
            <AddUsecaseSheet>
              <Button leftIcon={<PlusIcon className={`w-4 h-4 mr-2`} />}>
                Add new Usecase
              </Button>
            </AddUsecaseSheet>
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
            placeholder={"Usecase Not Found"}
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
            options={[
              { name: 50, value: 50 },
              { name: 100, value: 100 },
              { name: 200, value: 200 },
              { name: 300, value: 300 },
              { name: 400, value: 400 },
              { name: 500, value: 500 },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default UsecaseList;
