'use client';

import { CardImage } from '@/components/card-image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getFrametypeColors } from '@/lib/utils';
import { ApiCard, LibraryCard } from '@/types/card';

interface CardTooltipProps {
  card: LibraryCard | ApiCard;
  isColorCoded?: boolean;
  className?: string;
}

export function CardTooltip({
  card,
  isColorCoded,
  className,
}: CardTooltipProps) {
  return (
    <>
      {card && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  className,
                  isColorCoded && 'text-[hsl(var(--frame))] font-medium',
                )}
                style={{
                  // @ts-ignore
                  '--frame': getFrametypeColors(card).bg,
                }}
              >
                {card.name}
              </span>
            </TooltipTrigger>
            <TooltipContent className='p-0 bg-transparent'>
              <CardImage
                src={card.imageUrl}
                banStatus={card.banlistInfo?.ban_tcg}
                alt={card.name}
              />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}
