'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { formatDate } from 'date-fns';
import { BadgeEuro } from 'lucide-react';

import { CardTooltip } from '@/components/card-tooltip';
import { FrameTypeBadge } from '@/components/frame-type-badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LibraryCard } from '@/types/cards';

import { LibraryTableActions } from './library-table-actions';

export const columns: ColumnDef<LibraryCard>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (cell) => <CardTooltip card={cell.row.original} />,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: (cell) => <FrameTypeBadge card={cell.row.original} />,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: (cell) => (
      <div className='text-center'>{cell.row.original.quantity}</div>
    ),
  },
  {
    accessorKey: 'tradeable',
    header: 'Tradeable',
    cell: (cell) =>
      cell.row.original.tradeable && (
        <div className='flex justify-center items-center'>
          <BadgeEuro className='h-5 w-5 text-emerald-400' />
        </div>
      ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Added at',
    cell: (cell) => (
      <div className='text-center'>
        {formatDate(cell.row.original.createdAt, 'dd/MM/yyyy')}
      </div>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated at',
    cell: (cell) => (
      <div className='text-center'>
        {formatDate(cell.row.original.updatedAt, 'dd/MM/yyyy')}
      </div>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: (cell) => <LibraryTableActions card={cell.row.original} />,
  },
];

interface LibraryTableProps {
  data: LibraryCard[];
}

export function LibraryTable({ data }: LibraryTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data.length) {
    return <Skeleton className='h-[580px]' />;
  }

  return (
    <div className='rounded-md border w-full'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
