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
  ColumnResizeMode,
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
  { name: 5, value: 5 },
  { name: 10, value: 10 },
  { name: 20, value: 20 },
  { name: 30, value: 30 },
  { name: 40, value: 40 },
  { name: 50, value: 50 },
];

export default function AsyncTable({
  data,
  columns,
  fetchData,
  pageCount,
  onRowSelected,
  current_page,
  placeholder = "Items Not Found",
  perPage = 5,
  isLoading = false,
  defaultSelectedRows = [],
  options = paginationOptions,
  stickyFirstColumn = false,
  enableColumnResizing = false,
  columnResizeMode = "onChange",
  tableLayout = "fixed",
  enableMultiRowSelection = true,
}: any) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState(() =>
    Object.fromEntries(defaultSelectedRows.map((id: string) => [id, true]))
  );
  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: current_page,
    pageSize: perPage,
  });

  React.useEffect(() => {
    if (typeof fetchData === "function") {
      fetchData(pageIndex, pageSize);
    }
  }, [pageIndex, pageSize]);

  const pagination = React.useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize]
  );

  const defaultData = React.useMemo(() => [], []);

  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    pageCount: pageCount,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    enableMultiRowSelection: enableMultiRowSelection,
    enableColumnResizing: enableColumnResizing,
    columnResizeMode: columnResizeMode as ColumnResizeMode,
    manualPagination: true,
    getRowId: (row: any, index) => row._id || index,
    state: {
      pagination,
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  React.useEffect(() => {
    if (typeof onRowSelected === "function") {
      const selectedRows = table.getSelectedRowModel().rows;
      const _row = selectedRows.map((row) => row.original);
      onRowSelected(_row);
    }
  }, [table.getState().rowSelection]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex-1 overflow-auto">
        <Table
          className="w-full relative min-w-[1200px]"
          style={{
            width: "100%",
            tableLayout: tableLayout || "auto",
          }}
        >
          <TableHeader className="z-20 bg-neutral-20 sticky top-0">
            {table.getHeaderGroups().map((headerGroup, index) => (
              <TableRow key={index}>
                {headerGroup.headers.map((header, headerIndex) => {
                  const isFirstColumn = stickyFirstColumn && headerIndex === 0;
                  return (
                    <TableHead
                      key={"head_" + headerIndex}
                      className={`${header.id === "select" ? "w-[50px]" : ""} ${
                        isFirstColumn
                          ? "bg-neutral-20 z-30 border-r shadow-sm relative"
                          : "relative"
                      }`}
                      style={{
                        ...(isFirstColumn
                          ? {
                              minWidth: "200px",
                              position: "sticky",
                              left: 0,
                            }
                          : {}),
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {enableColumnResizing && header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-gray-400 hover:bg-blue-500 ${
                            header.column.getIsResizing() ? "bg-blue-500" : ""
                          }`}
                        />
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
                table.getRowModel().rows.map((row, rowIndex) => (
                  <TableRow
                    key={"body_" + rowIndex}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      const isFirstColumn =
                        stickyFirstColumn && cellIndex === 0;
                      return (
                        <TableCell
                          key={"cell_" + cellIndex}
                          className={`${
                            cell.column.id === "select" ? "w-[50px]" : ""
                          } ${
                            isFirstColumn
                              ? "bg-white z-20 border-r shadow-sm"
                              : ""
                          }`}
                          style={{
                            ...(isFirstColumn
                              ? {
                                  minWidth: "200px",
                                  position: "sticky",
                                  left: 0,
                                }
                              : {}),
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
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
                  <div className="h-8 w-full bg-neutral-20 rounded-xl animate-pulse" />
                  <div className="h-8 w-full bg-neutral-20 rounded-xl animate-pulse" />
                  <div className="h-8 w-full bg-neutral-20 rounded-xl animate-pulse" />
                  <div className="h-8 w-full bg-neutral-20 rounded-xl animate-pulse" />
                  <div className="h-8 w-full bg-neutral-20 rounded-xl animate-pulse" />
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-4">
        <div className="flex-1 text-sm text-muted-foreground"></div>
        <div className="space-x-4 flex items-center">
          <span className="text-sm text-muted-foreground">
            Page {pageIndex + 1} of {table.getPageCount()}
          </span>
          <Listbox
            options={options}
            selectedOption={options.find(
              (o: any) => o.name === parseInt(perPage)
            )}
            onSelectData={(value: any) => {
              table.setPageSize(Number(value.name));
            }}
            buttonClassname={`w-20 h-8`}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
