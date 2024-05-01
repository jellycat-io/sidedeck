import { LoaderCircle, MoreHorizontal, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { removeLibraryCardAction } from '@/actions/platform/library/remove-library-card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { useAction } from '@/hooks/use-action';
import { useCurrentUserId } from '@/hooks/use-current-user';
import { useLibrary } from '@/hooks/use-library';
import { LibraryCard } from '@/types/cards';

interface LibraryTableActionsProps {
  card: LibraryCard;
}

export function LibraryTableActions({ card }: LibraryTableActionsProps) {
  const userId = useCurrentUserId();
  const { refreshLibrary } = useLibrary();

  const { execute: removeCard, loading: removingCard } = useAction(
    removeLibraryCardAction,
    {
      onError: (error) => {
        toast.error(error);
      },
      onSuccess: ({ success }) => {
        toast.success(success);
        refreshLibrary();
      },
    },
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='iconSm' className='hover:-translate-y-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => removeCard({ cardIds: [card.id], userId })}
          className='text-destructive'
        >
          {removingCard ? (
            <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <Trash2 className='mr-2 h-4 w-4' />
          )}
          Remove card
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
