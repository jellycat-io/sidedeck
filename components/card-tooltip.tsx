'use client';

import { useMemo } from 'react';

import { getCardAction } from '@/actions/platform/get-card';
import { CardImage } from '@/components/card-image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFetch } from '@/hooks/use-fetch';
import { Card } from '@/types/cards';

interface CardTooltipProps {
  card: Card;
}

export function CardTooltip({ card }: CardTooltipProps) {
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
