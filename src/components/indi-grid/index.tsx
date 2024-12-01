"use client";

import { useState, useMemo } from "react";
import {
  ColumnFiltersState,
  ColumnResizeMode,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDownIcon, ChevronDown } from "lucide-react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GridSkeleton } from "./grid-skeleton";

export interface GridDataParams {
  gridId: string;
  page: number;
  limit: number;
  searchCriterias?: {
    columnName: string;
    columnOperator: string;
    columnValue: string | number;
  }[];
  sortCriterias?: { columnName: string; columnOrder: "asc" | "desc" }[];
  select?: string;
}

const fetcher = (url: string, params: any) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  }).then((res) => res.json());

export function IndiGrid({ columns, gridUrl, options = {} }: any) {
  // Pagination state
  const [page, setPage] = useState(options?.page || 1);
  const [limit, setLimit] = useState(options?.limit || 10);
  const [searchText, setSearchText] = useState("");
  // Sorting and filtering state
  const [sortCriterias, setSortCriterias] = useState<
    GridDataParams["sortCriterias"]
  >(options.sortCriterias || []);
  const [searchCriterias, setSearchCriterias] = useState<
    GridDataParams["searchCriterias"]
  >([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnResizeMode, setColumnResizeMode] =
    useState<ColumnResizeMode>("onChange");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      // Initialize column visibility based on the 'show' property
      const initialVisibility: VisibilityState = {};
      columns.forEach((column: any) => {
        if (typeof column.accessorKey === "string") {
          initialVisibility[column.accessorKey] = column.show !== false;
        }
      });
      return initialVisibility;
    }
  );

  // SWR for data fetching
  const {
    data: gridData,
    error,
    isLoading,
  } = useSWR(
    [
      gridUrl,
      {
        gridId: options.gridId,
        dbName: options.dbName,
        tableName: options.tableName,
        page,
        limit,
        sortCriterias,
        searchCriterias,
      },
    ],
    ([url, params]) => fetcher(url, params),
    {
      revalidateOnFocus: false, // Disable auto-fetching on tab focus
      dedupingInterval: 5000, // Cache duration in ms
    }
  );

  const onSortingChange = (
    updaterOrValue: SortingState | ((old: SortingState) => SortingState)
  ) => {
    const newSorting =
      typeof updaterOrValue === "function"
        ? updaterOrValue(sorting)
        : updaterOrValue;
    setSorting(newSorting);
    setSortCriterias(
      newSorting.map((sort) => ({
        columnName: sort.id,
        columnOrder: sort.desc ? "desc" : "asc",
      }))
    );
  };

  const handlePageSizeChange = (value: string) => {
    setLimit(Number(value));
    setPage(1); // Reset to first page when changing page size
  };

  const onChangeSearchText = (e: any) => {
    setSearchText(e.target.value);
  };

  const onKeyDownSearchText = (e: any) => {
    if (e.key === "Enter") {
      const searchColumns = columns.filter((column: any) => column.accessorKey);
      const finalCriterias: any = [];
      searchColumns.forEach((column: any) => {
        if (!column.accessorKey) return;
        if (column.dataType === "string" && searchText) {
          finalCriterias.push({
            columnName: column.accessorKey,
            columnOperator: "contains",
            columnValue: searchText,
            isOrCondition: true,
          });
        }
      });

      setSearchCriterias(finalCriterias);
    }
  };

  const docs = gridData?.docs || [];
  // Memoize columns and data
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedDocs = useMemo(() => docs, [docs]);

  const table = useReactTable({
    data: memoizedDocs,
    columns: memoizedColumns,
    manualPagination: true, // Pagination handled remotely
    pageCount: gridData?.pagination?.totalPages || 1, // Total pages from server
    manualSorting: true, // Sorting handled remotely
    manualFiltering: true, // Filtering handled remotely
    columnResizeMode,
    defaultColumn: {
      size: 150,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page - 1, // React Table is zero-indexed
        pageSize: limit,
      },
    },
    onSortingChange: onSortingChange,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  if (isLoading) {
    return <GridSkeleton />;
  }
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter records..."
          value={searchText}
          onChange={onChangeSearchText}
          onKeyDown={onKeyDownSearchText}
          className="max-w-sm"
        />
        <div className="space-x-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">Export</Button>
        </div>
      </div>
      <ScrollArea className="w-full rounded-md border overflow-x-auto">
        <div className="w-max min-w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isSortable = header.column.getCanSort();
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width: `${header.getSize()}px`,
                          minWidth: `${header.getSize()}px`,
                          position: "relative",
                        }}
                      >
                        <div
                          className={`flex items-center ${
                            isSortable ? "cursor-pointer select-none" : ""
                          }`}
                          onClick={
                            isSortable
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {isSortable && (
                            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                          )}
                        </div>
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-0.5 cursor-col-resize select-none touch-none ${
                            header.column.getIsResizing()
                              ? "bg-primary"
                              : "bg-border"
                          }`}
                        />
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: `${cell.column.getSize()}px`,
                          minWidth: `${cell.column.getSize()}px`,
                        }}
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing page {page}/{gridData?.pagination?.totalPages || 1} (
          {gridData?.pagination?.total} total records)
        </div>
        <div>
          <Select value={limit.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select records per page" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} records per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((oldPage: any) => Math.max(1, oldPage - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={
              !gridData?.pagination || page >= gridData?.pagination?.totalPages
            }
            onClick={() => setPage((oldPage: any) => oldPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
