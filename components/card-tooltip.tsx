'use client';

import { CardImage } from '@/components/card-image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LibraryCard } from '@/types/cards';

interface CardTooltipProps {
  card: LibraryCard;
}

export function CardTooltip({ card }: CardTooltipProps) {
  return (
    <>
      {card && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{card.name}</span>
            </TooltipTrigger>
            <TooltipContent className='p-0 bg-transparent'>
              <CardImage src={card.imageUrl} alt={card.name} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}
