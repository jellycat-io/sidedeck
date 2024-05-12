'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { removeLibraryCardAction } from '@/actions/platform/library/remove-library-card';
import { CardTooltip } from '@/components/card-tooltip';
import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { FrameTypeBadge } from '@/components/frame-type-badge';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAction } from '@/hooks/use-action';
import { useCurrentUserId } from '@/hooks/use-current-user';
import { useLibrary } from '@/hooks/use-library';
import { dateRangeFilterFn, formatDateFromNow } from '@/lib/utils';
import { LibraryCard } from '@/types/card';

export const columns: ColumnDef<LibraryCard>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex justify-center items-center'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex justify-center items-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Name</DataTableColumnHeader>
    ),
    cell: (cell) => <CardTooltip card={cell.row.original} />,
    filterFn: (row, id, value) =>
      row.original.name.toLowerCase().includes(value.toLowerCase()),
    meta: {
      filterVariant: 'text',
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Type</DataTableColumnHeader>
    ),
    cell: (cell) => <FrameTypeBadge card={cell.row.original} withLabel />,
    filterFn: (row, id, value) => {
      if (value === 'all') return true;

      return row.original.type === value;
    },
    meta: {
      filterVariant: 'select',
    },
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Quantity</DataTableColumnHeader>
    ),
    cell: (cell) => (
      <Badge variant='outline'>x {cell.row.original.quantity}</Badge>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Added</DataTableColumnHeader>
    ),
    cell: (cell) => formatDateFromNow(cell.row.original.createdAt),
    filterFn: dateRangeFilterFn,
    meta: {
      filterVariant: 'date',
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Updated</DataTableColumnHeader>
    ),
    cell: (cell) => formatDateFromNow(cell.row.original.updatedAt),
    filterFn: dateRangeFilterFn,
    meta: {
      filterVariant: 'date',
    },
  },
];

interface LibraryTableProps {
  data: LibraryCard[];
  loading?: boolean;
  onCardClick: (card: LibraryCard) => void;
}

export function LibraryTable({
  data,
  loading,
  onCardClick,
}: LibraryTableProps) {
  const userId = useCurrentUserId();
  const { refreshLibrary } = useLibrary();
  const { execute: removeCards, loading: removingCards } = useAction(
    removeLibraryCardAction,
    {
      onError: toast.error,
      onSuccess: ({ success }) => {
        toast.success(success);
        refreshLibrary();
      },
    },
  );

  function handleRemoveCards(cards: LibraryCard[]) {
    if (!userId || !cards.length) return;

    const cardIds = cards.map((card) => card.id);

    removeCards({
      userId,
      cardIds,
    });
  }

  function handleRemoveCard(card: LibraryCard) {
    handleRemoveCards([card]);
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        pagination
        filtering
        noDataMessage='No cards found. Use the Card Finder to add cards to your library.'
        onRowClick={(card) => {
          onCardClick(card);
        }}
        batchActions={[
          {
            label: 'Remove cards',
            icon: <Trash2 className='h-4 w-4' />,
            destructive: true,
            loading: removingCards,
            action: handleRemoveCards,
          },
        ]}
        rowActions={[
          {
            label: 'Remove card',
            icon: <Trash2 className='h-4 w-4' />,
            destructive: true,
            loading: removingCards,
            action: handleRemoveCard,
          },
        ]}
      />
    </>
  );
}
