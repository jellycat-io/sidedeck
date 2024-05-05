'use client';

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DataTableBatchActions } from './data-table-batch-actions';
import { DataTableFilterOptions } from './data-table-filter-options';
import { DataTableFilters } from './data-table-filters';
import { DataTablePagination } from './data-table-pagination';
import { DataTableRowActions } from './data-table-row-actions';
import { DataTableViewOptions } from './data-table-view-options';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'select' | 'date' | 'number' | 'range' | 'boolean';
  }
}

export type BatchAction<TData> = {
  label: string;
  destructive?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  action: (rows: TData[]) => void;
};

export type RowAction<TData> = {
  label: string;
  destructive?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  action: (row: TData) => void;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: boolean;
  filtering?: boolean;
  defaultPageSize?: number;
  loading?: boolean;
  onRowClick?: (row: TData) => void;
  batchActions?: BatchAction<TData>[];
  rowActions?: RowAction<TData>[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  filtering,
  defaultPageSize,
  loading,
  onRowClick,
  batchActions,
  rowActions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [paginationState, setPaginationState] = useState({
    pageSize: defaultPageSize ?? 10,
    pageIndex: 0,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [filters, setFilters] = useState<
    Record<Column<TData, TValue>['id'], boolean>
  >({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPaginationState,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    state: {
      sorting,
      columnVisibility,
      pagination: paginationState,
      rowSelection,
      columnFilters,
    },
  });

  if (loading) {
    return (
      <div className='flex flex-col gap-y-4'>
        <Skeleton className='h-8' />
        <Skeleton className='h-[353px]' />
        <Skeleton className='h-8' />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex justify-between items-center'>
        {batchActions?.length && (
          <DataTableBatchActions table={table} actions={batchActions} />
        )}
        <div className='flex gap-x-2 items-center'>
          {filtering && (
            <DataTableFilterOptions
              table={table}
              filters={filters}
              onFilterChange={setFilters}
            />
          )}
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <DataTableFilters table={table} filters={filters} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
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
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={(e) => {
                    if (
                      !e.currentTarget.tagName
                        .toLowerCase()
                        .match(/button|a|input/i)
                    ) {
                      onRowClick?.(row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='py-3'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  {rowActions?.length && (
                    <TableCell className='py-3'>
                      <DataTableRowActions
                        item={row.original}
                        actions={rowActions}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <DataTablePagination table={table} defaultPageSize={defaultPageSize} />
      )}
    </div>
  );
}
