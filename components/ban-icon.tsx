import { Ban } from 'lucide-react';

import { cn } from '@/lib/utils';
import { BanStatus } from '@/types/card';

interface BanIconProps {
  status: BanStatus;
  className?: string;
}

export function BanIcon({ status, className }: BanIconProps) {
  return (
    <div
      className={cn(
        'flex justify-center items-center rounded-full bg-destructive h-6 w-6 text-destructive-foreground font-mono',
        className,
      )}
    >
      {status === 'Banned' ? (
        <Ban className='h-5 w-5 text-destructive-foreground' />
      ) : status === 'Limited' ? (
        <span>1</span>
      ) : status === 'Semi-Limited' ? (
        <span>2</span>
      ) : null}
    </div>
  );
}
