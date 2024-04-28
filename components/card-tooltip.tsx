'use client';

import { useMemo } from 'react';

import { CardImage } from '@/components/card-image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCards } from '@/hooks/use-cards';

interface CardTooltipProps {
  id: string;
}

export function CardTooltip({ id }: CardTooltipProps) {
  const { getCard } = useCards();

  const card = useMemo(() => getCard(id), [id, getCard]);

  return (
    <>
      {card && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{card.name}</TooltipTrigger>
            <TooltipContent className='p-0 bg-transparent'>
              <CardImage src={card.imageUrl} alt={card.name} width={250} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}
