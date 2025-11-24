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

export default function SimpleTable({
  data,
  columns,
  placeholder = "Items Not Found",
  isLoading = false,
  defaultSelectedRows = [], // Pass default selected row IDs
}: any) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState(() =>
    // Set default selected rows
    Object.fromEntries(defaultSelectedRows.map((id: string) => [id, true]))
  );

  const defaultData = React.useMemo(() => [], []);

  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true, // Enable row selection
    enableMultiRowSelection: true, // Enable multi-row selection
    manualPagination: true,
    getRowId: (row: any, index) => row._id || index, // Custom row ID logic
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

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
    </div>
  );
}
