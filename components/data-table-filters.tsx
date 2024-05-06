import { Column, Table } from '@tanstack/react-table';
import { ChevronRight } from 'lucide-react';
import { useEffect, useMemo } from 'react';

import { DatePicker } from '@/components/date-picker';
import { DebouncedInput } from '@/components/debounced-input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { camelCasetoCapitalized, snakeCaseToCapitalized } from '@/lib/utils';

type ColumnGroup<TData> = Record<string, Column<TData, unknown>[]>;

interface DataTableFiltersProps<TData, TValue> {
  table: Table<TData>;
  filters: Record<Column<TData, TValue>['id'], boolean>;
}

export function DataTableFilters<TData, TValue>({
  table,
  filters,
}: DataTableFiltersProps<TData, TValue>) {
  const columns = useMemo(
    () =>
      table
        .getVisibleFlatColumns()
        .filter(
          (c) =>
            c.getCanFilter() &&
            !!filters[c.id] &&
            c.columnDef.meta?.filterVariant,
        ),
    [table, filters],
  );

  const columnGroups: ColumnGroup<TData> = useMemo(() => {
    const groupedColumns: ColumnGroup<TData> = {
      date: [],
      boolean: [],
      other: [],
    };

    columns.forEach((column) => {
      const filterVariant = column.columnDef.meta?.filterVariant;
      if (filterVariant === 'date') {
        groupedColumns.date.push(column);
      } else if (filterVariant === 'boolean') {
        groupedColumns.boolean.push(column);
      } else {
        groupedColumns.other.push(column);
      }
    });

    return groupedColumns;
  }, [columns]);

  return (
    <>
      {columns.length > 0 && (
        <div className='border p-4 rounded-md space-y-4'>
          {columnGroups.boolean.length > 0 && (
            <div className='grid grid-cols-3 gap-4'>
              {columnGroups.boolean.map((column) => (
                <div key={column.id} className='flex items-center gap-2'>
                  <Filter table={table} column={column} />
                  <Label htmlFor={column.id}>
                    {camelCasetoCapitalized(column.id)}
                  </Label>
                </div>
              ))}
            </div>
          )}
          {columnGroups.other.length > 0 && (
            <div className='grid grid-cols-3 gap-4'>
              {columnGroups.other.map((column) => (
                <div key={column.id} className={'flex flex-col gap-2'}>
                  <Label htmlFor={column.id}>
                    {camelCasetoCapitalized(column.id)}
                  </Label>
                  <Filter table={table} column={column} />
                </div>
              ))}
            </div>
          )}
          {columnGroups.date.length > 0 && (
            <div className='grid grid-cols-2 gap-4'>
              {columnGroups.date.map((column) => (
                <div key={column.id} className='flex flex-col gap-y-2'>
                  <Label htmlFor={column.id}>
                    {camelCasetoCapitalized(column.id)}
                  </Label>
                  <Filter table={table} column={column} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

type DateRangeFilterValue = {
  start: Date;
  end: Date;
};

interface FilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  table: Table<TData>;
}

function Filter<TData, TValue>({ column, table }: FilterProps<TData, TValue>) {
  const { filterVariant } = column.columnDef.meta ?? {};
  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      filterVariant === 'range'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    [filterVariant, column],
  );

  useEffect(() => {
    if (filterVariant === 'select') {
      const uniqueValues = Array.from(column.getFacetedUniqueValues().keys())
        .sort()
        .slice(0, 5000);
      sortedUniqueValues.length = 0;
      sortedUniqueValues.push(...uniqueValues);
    }
  }, [column, filterVariant, table, sortedUniqueValues]);

  return filterVariant === 'number' ? (
    <div>
      <DebouncedInput
        type='number'
        value={columnFilterValue as number}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
      />
    </div>
  ) : filterVariant === 'date' ? (
    <div className='flex items-center gap-x-2'>
      <DatePicker
        value={(columnFilterValue as DateRangeFilterValue)?.start}
        onChange={(value) => {
          column.setFilterValue((old: DateRangeFilterValue) => ({
            start: value?.toISOString(),
            end: old?.end,
          }));
        }}
        className='h-8'
      />
      <ChevronRight className='h-4 w-4 shrink-0' />
      <DatePicker
        value={(columnFilterValue as DateRangeFilterValue)?.end}
        onChange={(value) => {
          column.setFilterValue((old: DateRangeFilterValue) => ({
            start: old?.start,
            end: value?.toISOString(),
          }));
        }}
        className='h-8'
      />
    </div>
  ) : filterVariant === 'range' ? (
    <div>
      <div className='flex space-x-2'>
        <DebouncedInput
          type='number'
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0] !== undefined
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
          className='w-auto h-8'
        />
        <DebouncedInput
          type='number'
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ''
          }`}
          className='w-auto h-8'
        />
      </div>
    </div>
  ) : filterVariant === 'select' ? (
    <Select defaultValue='all' onValueChange={column.setFilterValue}>
      <SelectTrigger className='h-8'>
        <SelectValue className='capitalize'>
          {snakeCaseToCapitalized(columnFilterValue?.toString() ?? 'All')}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>All</SelectItem>
        {sortedUniqueValues.map((value) => (
          <SelectItem value={value} key={value}>
            {snakeCaseToCapitalized(value)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : filterVariant === 'boolean' ? (
    <Switch
      checked={columnFilterValue as boolean}
      onCheckedChange={(value) => column.setFilterValue(value)}
      aria-label={`Filter by ${column.id}`}
    />
  ) : (
    <DebouncedInput
      type='text'
      value={(columnFilterValue ?? '') as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      className='w-auto h-8'
    />
  );
}
