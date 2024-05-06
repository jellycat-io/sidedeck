import { Column, Table } from '@tanstack/react-table';
import { Eraser, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { camelCasetoCapitalized } from '@/lib/utils';

interface DataTableFilterOptionsProps<TData, TValue> {
  table: Table<TData>;
  filters: Record<Column<TData, TValue>['id'], boolean>;
  onFilterChange: (
    filter: Record<Column<TData, TValue>['id'], boolean>,
  ) => void;
}

export function DataTableFilterOptions<TData, TValue>({
  table,
  filters,
  onFilterChange,
}: DataTableFilterOptionsProps<TData, TValue>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='hidden h-8 lg:flex'>
          <Filter className='mr-2 h-4 w-4' />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[150px]'>
        <DropdownMenuLabel>Toggle filters</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllFlatColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== undefined && column.getCanFilter(),
          )
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={!!filters[column.id]}
              onCheckedChange={(value) =>
                onFilterChange({
                  ...filters,
                  [column.id]: !!value,
                })
              }
            >
              {camelCasetoCapitalized(column.id)}
            </DropdownMenuCheckboxItem>
          ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onFilterChange({})}>
          <Eraser className='mr-2 h-4 w-4' />
          Clear filters
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
