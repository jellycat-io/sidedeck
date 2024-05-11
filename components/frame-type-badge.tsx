import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getFrametypeColors, snakeCaseToCapitalized } from '@/lib/utils';
import { LibraryCard } from '@/types/card';

interface FrameTypeBadgeProps {
  card: Pick<LibraryCard, 'slug' | 'frameType' | 'type'>;
  withLabel?: boolean;
}

export function FrameTypeBadge({ card, withLabel }: FrameTypeBadgeProps) {
  return (
    <>
      {withLabel ? (
        <Badge
          className='bg-[hsl(var(--frame))] hover:bg-[hsl(var(--frame))]/80 text-[hsl(var(--frame-foreground))] max-w-32 truncate'
          style={{
            // @ts-ignore
            '--frame': getFrametypeColors(card).bg,
            '--frame-foreground': getFrametypeColors(card).text,
          }}
        >
          {snakeCaseToCapitalized(card.type)}
        </Badge>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className='bg-[hsl(var(--frame))] h-4 w-4 rounded-full'
              style={{
                // @ts-ignore
                '--frame': getFrametypeColors(card).bg,
              }}
            />
          </TooltipTrigger>
          <TooltipContent>{snakeCaseToCapitalized(card.type)}</TooltipContent>
        </Tooltip>
      )}
    </>
  );
}
