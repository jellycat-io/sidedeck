'use client';

import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
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
import { DataTablePagination } from './data-table-pagination';
import { DataTableRowActions } from './data-table-row-actions';
import { DataTableViewOptions } from './data-table-view-options';

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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPaginationState,
    state: {
      sorting,
      columnVisibility,
      pagination: paginationState,
      rowSelection,
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
      <div className='flex justify-end items-center gap-x-2'>
        {batchActions?.length && (
          <DataTableBatchActions table={table} actions={batchActions} />
        )}
        <DataTableViewOptions table={table} />
      </div>
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
