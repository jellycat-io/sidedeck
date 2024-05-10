import { Ban } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { BanStatus } from '@/types/card';

interface BanIconProps {
  status?: BanStatus;
  className?: string;
}

export function BanIcon({ status, className }: BanIconProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'flex justify-center items-center rounded-full bg-destructive h-6 w-6 text-destructive-foreground font-mono',
            className,
          )}
        >
          {status === 'Banned' ? (
            <Ban className='h-4 w-4 text-destructive-foreground' />
          ) : status === 'Limited' ? (
            <span>1</span>
          ) : status === 'Semi-Limited' ? (
            <span>2</span>
          ) : null}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {`This card is ${status?.toLowerCase()} in the TCG.`}
      </TooltipContent>
    </Tooltip>
  );
}
