import { ColumnDef } from '@tanstack/react-table';
import { BadgeEuro, Minus, Plus, Shield, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { removeIssuesAction } from '@/actions/platform/library/remove-issues';
import { updateIssueQuantityAction } from '@/actions/platform/library/update-issue-quantity';
import { updateIssuesStatusAction } from '@/actions/platform/library/update-issues-status';
import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { FlagIcon } from '@/components/flag-icon';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useAction } from '@/hooks/use-action';
import { useLibrary } from '@/hooks/use-library';
import { codeToRarityName, formatDateFromNow } from '@/lib/utils';
import { LibraryCardIssue } from '@/types/card';

export const columns: ColumnDef<LibraryCardIssue>[] = [
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
    accessorKey: 'set.set_code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Set code' />
    ),
    cell: (cell) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{cell.row.original.set.setCode}</span>
        </TooltipTrigger>
        <TooltipContent>{cell.row.original.set.setName}</TooltipContent>
      </Tooltip>
    ),
    filterFn: (row, id, value) => row.original.set.setCode.includes(value),
    meta: {
      filterVariant: 'text',
    },
  },
  {
    accessorKey: 'rarity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rarity' />
    ),
    cell: (cell) => (
      <div className='max-w-32 truncate'>
        {codeToRarityName(cell.row.original.rarity)}
      </div>
    ),
    filterFn: (row, id, value) => {
      if (value === 'all') return true;

      return row.original.rarity === value;
    },
    meta: {
      filterVariant: 'select',
    },
  },
  {
    accessorKey: 'language',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Language' />
    ),
    cell: (cell) => (
      <div className='flex justify-center items-center'>
        <FlagIcon locale={cell.row.original.language} />
      </div>
    ),
    filterFn: (row, id, value) => {
      if (value === 'all') return true;

      return row.original.language === value;
    },
    meta: {
      filterVariant: 'select',
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: (cell) => (
      <QuantityButtonsGroup
        issueId={cell.row.original.id}
        quantity={cell.row.original.quantity}
      />
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'tradeable',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tradeable' />
    ),
    cell: (cell) => (
      <div className='flex justify-center items-center'>
        {cell.row.original.tradeable && (
          <BadgeEuro className='h-6 w-6 text-emerald-400' />
        )}
      </div>
    ),
    filterFn: (row, id, value) => !!row.original.tradeable === !!value,
    meta: {
      filterVariant: 'boolean',
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Added' />
    ),
    cell: (cell) => formatDateFromNow(cell.row.original.createdAt),
    meta: {
      filterVariant: 'date',
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated' />
    ),
    cell: (cell) => formatDateFromNow(cell.row.original.updatedAt),
    meta: {
      filterVariant: 'date',
    },
  },
];

interface LibraryCardIssuesTableProps {
  cardId: string;
  issues: LibraryCardIssue[];
  onRemoveLastIssue: () => void;
}

export function LibraryCardIssuesTable({
  cardId,
  issues,
  onRemoveLastIssue,
}: LibraryCardIssuesTableProps) {
  const { refreshLibrary } = useLibrary();
  const { execute: removeIssues, loading: removingIssues } = useAction(
    removeIssuesAction,
    {
      onError: toast.error,
      onSuccess: ({ success, removed }) => {
        toast.success(success);
        refreshLibrary();
        if (removed) {
          onRemoveLastIssue();
        }
      },
    },
  );

  const { execute: updateIssuesStatus, loading: updatingIssuesStatus } =
    useAction(updateIssuesStatusAction, {
      onError: toast.error,
      onSuccess: ({ success }) => {
        toast.success(success);
        refreshLibrary();
      },
    });

  function handleChangeIssuesStatus(
    issues: LibraryCardIssue[],
    status: boolean,
  ) {
    if (!issues.length) return;

    const issueIds = issues.map((issue) => issue.id);

    updateIssuesStatus({
      cardId,
      issueIds,
      status,
    });
  }

  function handleChangeIssueStatus(issue: LibraryCardIssue, status: boolean) {
    handleChangeIssuesStatus([issue], status);
  }

  function handleRemoveIssues(issues: LibraryCardIssue[]) {
    if (!issues.length) return;

    const issueIds = issues.map((issue) => issue.id);

    removeIssues({
      cardId,
      issueIds,
    });
  }

  function handleRemoveIssue(issue: LibraryCardIssue) {
    handleRemoveIssues([issue]);
  }

  return (
    <DataTable
      columns={columns}
      data={issues}
      pagination
      filtering
      defaultPageSize={3}
      batchActions={[
        {
          label: 'Mark as tradeable',
          icon: <BadgeEuro className='h-4 w-4' />,
          loading: updatingIssuesStatus,
          action: (issues) => handleChangeIssuesStatus(issues, true),
        },
        {
          label: 'Mark as not tradeable',
          icon: <Shield className='h-4 w-4' />,
          loading: updatingIssuesStatus,
          action: (issues) => handleChangeIssuesStatus(issues, false),
        },
        {
          label: 'Remove issues',
          icon: <Trash2 className='h-4 w-4' />,
          destructive: true,
          loading: removingIssues,
          action: handleRemoveIssues,
        },
      ]}
      rowActions={[
        {
          label: 'Mark as tradeable',
          icon: <BadgeEuro className='h-4 w-4' />,
          loading: updatingIssuesStatus,
          action: (issue) => handleChangeIssueStatus(issue, true),
        },
        {
          label: 'Mark as not tradeable',
          icon: <Shield className='h-4 w-4' />,
          loading: updatingIssuesStatus,
          action: (issue) => handleChangeIssueStatus(issue, false),
        },
        {
          label: 'Remove issue',
          icon: <Trash2 className='h-4 w-4' />,
          destructive: true,
          loading: removingIssues,
          action: handleRemoveIssue,
        },
      ]}
    />
  );
}

interface QuantityButtonsGroupProps {
  issueId: string;
  quantity: number;
}

export function QuantityButtonsGroup({
  issueId,
  quantity,
}: QuantityButtonsGroupProps) {
  const [quantityValue, setQuantityValue] = useState<number>(quantity);
  const { getIssueCardId, refreshLibrary } = useLibrary();

  const cardId = getIssueCardId(issueId);

  const { execute: updateIssueQuantity, loading: updatingCard } = useAction(
    updateIssueQuantityAction,
    {
      onError: toast.error,
      onSuccess: ({ success }) => {
        toast.success(success);
        refreshLibrary();
      },
    },
  );

  function handleChangeQuantity(value: number) {
    setQuantityValue(value);
  }

  useEffect(() => {
    if (!cardId) return;

    if (quantityValue !== quantity) {
      updateIssueQuantity({
        cardId,
        issueId,
        quantity: quantityValue,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId, issueId, quantity, quantityValue]);

  return (
    <div className='rounded-md border flex justify-between items-center overflow-hidden h-7'>
      <Button
        variant='ghost'
        size='iconSm'
        className='border-r rounded-none flex-1 focus-visible:ring-none h-8 w-8'
        disabled={updatingCard || quantity === 1}
        onClick={() => handleChangeQuantity(quantity - 1)}
      >
        <Minus className='h-4 w-4' />
      </Button>
      <div className='flex-1 flex justify-center items-center cursor-default min-w-8'>
        {quantity}
      </div>
      <Button
        variant='ghost'
        size='iconSm'
        className='border-l rounded-none flex-1 focus-visible:ring-none h-8 w-8'
        disabled={updatingCard}
        onClick={() => handleChangeQuantity(quantity + 1)}
      >
        <Plus className='h-4 w-4' />
      </Button>
    </div>
  );
}
