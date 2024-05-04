'use client';
import { Table } from '@tanstack/react-table';
import { Layers, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { BatchAction } from './data-table';

interface DataTableBatchActionsProps<TData> {
  table: Table<TData>;
  actions?: BatchAction<TData>[];
}

export function DataTableBatchActions<TData>({
  table,
  actions,
}: DataTableBatchActionsProps<TData>) {
  function handleBatchAction(action: BatchAction<TData>['action']) {
    const selectedRows = table
      .getRowModel()
      .rows.filter((row) => row.getIsSelected());

    action(selectedRows.map((row) => row.original));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='h-8'
          disabled={!table.getIsSomeRowsSelected()}
        >
          <Layers className='mr-2 h-4 w-4' />
          Batch actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {actions?.map(({ label, icon, loading, action, destructive }) => (
          <DropdownMenuItem
            key={label}
            onClick={(e) => {
              e.stopPropagation();
              handleBatchAction(action);
            }}
          >
            <div
              className={cn(
                'flex items-center gap-x-2',
                destructive && 'text-destructive',
              )}
            >
              {loading ? <LoaderCircle className='h-4 w-4' /> : icon}
              {label}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
