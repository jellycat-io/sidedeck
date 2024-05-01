import { Link, Star, Swords, Shield, Plus, Archive } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { addLibraryCardAction } from '@/actions/platform/library/add-library-card';
import { CardImage } from '@/components/card-image';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { useAction } from '@/hooks/use-action';
import { useCurrentUserId } from '@/hooks/use-current-user';
import { useLibrary } from '@/hooks/use-library';
import { snakeCaseToCapitalized } from '@/lib/utils';
import { Card } from '@/types/cards';

import { ActionButton } from './action-button';

interface CardSheetProps {
  card: Card;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CardSheet({ card, open, onOpenChange }: CardSheetProps) {
  const [mounted, setMounted] = useState(false);
  const userId = useCurrentUserId();
  const { cards, refreshLibrary } = useLibrary();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { execute: addLibraryCard, loading: addingCard } = useAction(
    addLibraryCardAction,
    {
      onError: (error) => {
        toast.error(error);
      },
      onSuccess: ({ success }) => {
        refreshLibrary();
        toast.success(success);
      },
    },
  );

  function handleOpenChange(open: boolean) {
    onOpenChange(open);
  }

  function handleLibraryAdd() {
    addLibraryCard({
      cardId: card.id,
      userId,
    });
  }

  if (!mounted) {
    return null;
  }

  const libraryCard = cards.find((libraryCard) => libraryCard.id === card.id);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side='bottom'>
        <div className='flex items-start md:space-x-6'>
          <div className='hidden md:block'>
            <CardImage src={card.imageUrl} alt={card.name} width={250} />
          </div>
          <div className='flex flex-col space-y-4 w-2/3'>
            <div className='flex flex-col space-y-3'>
              <div>
                <div className='flex items-center space-x-2'>
                  <h3 className='text-xl font-semibold'>{card.name}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {`ID: ${card.id}`}
                  </p>
                  {libraryCard && (
                    <Badge
                      variant='outline'
                      className='flex items-center gap-x-2 py-2'
                    >
                      <Archive className='h-4 w-4' />
                      Owned
                      <div className='bg-primary text-primary-foreground flex justify-center items-center rounded-full h-4 w-4'>
                        {libraryCard.quantity}
                      </div>
                    </Badge>
                  )}
                </div>
                <p>{snakeCaseToCapitalized(card.type)}</p>
              </div>
              <div className='flex space-x-3'>
                {card.attribute && (
                  <div className='flex items-center gap-x-1.5 text-sm'>
                    <div className='h-5 w-5 rounded-full overflow-hidden'>
                      <Image
                        src={`/icons/attributes/${card.attribute}.svg`}
                        alt={card.attribute}
                        width={24}
                        height={24}
                      />
                    </div>
                    <span>{snakeCaseToCapitalized(card.attribute)}</span>
                  </div>
                )}
                {card.race && (
                  <div className='flex items-center gap-x-1.5 text-sm'>
                    <div className='h-5 w-5 rounded-full overflow-hidden'>
                      <Image
                        src={`/icons/races/${card.race}.svg`}
                        alt={card.type}
                        width={24}
                        height={24}
                      />
                    </div>
                    <span>{snakeCaseToCapitalized(card.race)}</span>
                  </div>
                )}
                {card.linkval && (
                  <p className='flex items-center gap-x-1.5 text-sm'>
                    <Link className='h-5 w-5 text-sky-800' />
                    {card.linkval}
                  </p>
                )}
                {card.level && (
                  <p className='flex items-center gap-x-1.5 text-sm'>
                    <Star className='h-5 w-5 text-amber-400 fill-amber-400' />
                    {card.level}
                  </p>
                )}
                {card.atk !== undefined && (
                  <p className='flex items-center gap-x-1.5 text-sm'>
                    <Swords className='h-5 w-5 fill-foreground' />
                    {card.atk}
                  </p>
                )}
                {card.atk !== undefined && (
                  <p className='flex items-center gap-x-1.5 text-sm'>
                    <Shield className='h-5 w-5 fill-foreground' />
                    {card.def}
                  </p>
                )}
              </div>
            </div>
            <div className='space-y-1'>
              <h4 className='text-md font-semibold'>Description</h4>
              <p className='text-sm'>{card.desc}</p>
            </div>
            {card.archetype && (
              <div className='space-y-1'>
                <h4 className='text-md font-semibold'>Archetype</h4>
                <p className='text-sm'>{card.archetype}</p>
              </div>
            )}
            {card.cardPrices.length > 0 && (
              <div className='flex flex-col items-start space-y-1'>
                <h4 className='text-md font-semibold'>Prices</h4>
                {card.cardPrices.map((price, i) => (
                  <div
                    key={`price-${i}`}
                    className='flex flex-col lg:flex-row items-start lg:items-center space-y-1 lg:space-x-2'
                  >
                    {Object.entries(price).map(([key, value]) => (
                      <>
                        {value !== '0.00' && (
                          <div key={key} className='flex space-x-2'>
                            <p className='text-sm'>
                              {snakeCaseToCapitalized(key.split('_')[0])}
                            </p>
                            <Badge variant='outline'>{`€ ${value}`}</Badge>
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <SheetFooter className='pt-4'>
          <ActionButton
            onClick={() => handleLibraryAdd()}
            loading={addingCard}
            icon={<Plus className='h-4 w-4' />}
          >
            Add to library
          </ActionButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
