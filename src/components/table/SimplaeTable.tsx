"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Listbox } from "../ui/listbox";

const paginationOptions = [
  { name: 10, value: 10 },
  { name: 20, value: 20 },
  { name: 30, value: 30 },
  { name: 40, value: 40 },
  { name: 50, value: 50 },
];

export default function SimpleTable({
  data,
  columns,
  pageCount: totalPageCount,
  onRowSelected,
  current_page = 1,
  placeholder = "Items Not Found",
  perPage = 10,
  isLoading = false,
  defaultSelectedRows = [],
  options = paginationOptions,
}: any) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Initialize row selection with default selected rows
  const [rowSelection, setRowSelection] = React.useState(() =>
    Object.fromEntries(defaultSelectedRows.map((id: string) => [id, true]))
  );

  // Manage pagination state with current_page and perPage
  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: current_page - 1, // Convert to zero-based index
    pageSize: perPage,
  });

  const [isAllSelected, setIsAllSelected] = React.useState(false);

  // Memoize pagination to prevent unnecessary re-renders
  const pagination = React.useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize]
  );

  const defaultData = React.useMemo(() => [], []);

  // Calculate page count if not provided
  const calculatedPageCount = React.useMemo(() => {
    return totalPageCount || Math.ceil((data?.length || 0) / pageSize);
  }, [data, pageSize, totalPageCount]);

  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    pageCount: calculatedPageCount,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getRowId: (row: any, index) => row._id || index,
    state: {
      pagination,
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  // Handle Select All checkbox logic
  const handleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all rows
      setRowSelection({});
      setIsAllSelected(false);
    } else {
      // Select all rows across all pages
      const allRowIds = data.map((row: any) => row._id);
      const newRowSelection = Object.fromEntries(
        allRowIds.map((id: any) => [id, true])
      );
      setRowSelection(newRowSelection);
      setIsAllSelected(true);
    }
  };

  // Handle selected rows
  React.useEffect(() => {
    if (typeof onRowSelected === "function") {
      const selectedRows = table.getSelectedRowModel().rows;
      const _row = selectedRows.map((row) => row.original);
      onRowSelected(_row);
    }
  }, [table.getState().rowSelection]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Table container with scroll */}
      <div className="w-full flex-1 overflow-y-auto">
        <Table className="w-full relative">
          <TableHeader className="z-10 bg-neutral-20">
            {table.getHeaderGroups().map((headerGroup, index) => (
              <TableRow key={index}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={"head_" + index}
                      className={header.id === "select" ? "w-[50px]" : ""}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {!isLoading ? (
            <TableBody className="z-10 bg-white">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={"body_" + index}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={"cell_" + index}
                        className={
                          cell.column.id === "select" ? "w-[50px]" : ""
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {placeholder}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ) : (
            <TableBody className="bg-white">
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-full space-y-4"
                >
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      className="h-8 w-full bg-neutral-20 rounded-xl animate-pulse"
                      key={`loading_${item}`}
                    ></div>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </div>

      {/* Pagination and Selection Footer */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-4 flex items-center">
          <Listbox
            options={options}
            selectedOption={
              options.find((o: any) => o.value === pageSize) ?? options[0]
            }
            onSelectData={(value: any) => {
              table.setPageSize(Number(value.name));
            }}
            buttonClassname="w-20"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={pageIndex <= 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={pageIndex + 1 >= calculatedPageCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
