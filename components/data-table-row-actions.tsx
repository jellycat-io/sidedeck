'use client';
import { LoaderCircle, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { RowAction } from './data-table';

interface DataTableRowActionsProps<TData> {
  item: TData;
  actions?: RowAction<TData>[];
}

export function DataTableRowActions<TData>({
  item,
  actions,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='iconSm'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {actions?.map(({ label, action, icon, loading, destructive }) => (
          <DropdownMenuItem
            key={label}
            onClick={(e) => {
              e.stopPropagation();
              action(item);
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
