import { Link, Star, Swords, Shield } from 'lucide-react';
import Image from 'next/image';

import { CardImage } from '@/components/card-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { snakeCaseToCapitalized } from '@/lib/utils';
import { Card } from '@/types/cards';

interface CardSheetProps {
  card: Card;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CardSheet({ card, open, onOpenChange }: CardSheetProps) {
  function handleOpenChange(open: boolean) {
    onOpenChange(open);
  }

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
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
