import { Badge } from '@/components/ui/badge';
import { getFrametypeColors, snakeCaseToCapitalized } from '@/lib/utils';
import { LibraryCard } from '@/types/cards';

interface FrameTypeBadgeProps {
  card: Pick<LibraryCard, 'slug' | 'frameType' | 'type'>;
}

export function FrameTypeBadge({ card }: FrameTypeBadgeProps) {
  return (
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
  );
}
