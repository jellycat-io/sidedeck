'use client';

import { Link, Star, Swords, Shield, Plus, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { addLibraryCardAction } from '@/actions/platform/library/add-library-card';
import { ActionButton } from '@/components/action-button';
import { CardImage } from '@/components/card-image';
import { FlagIcon } from '@/components/flag-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetClose, SheetContent } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAction } from '@/hooks/use-action';
import { useCurrentUserId } from '@/hooks/use-current-user';
import { useLibrary } from '@/hooks/use-library';
import {
  cn,
  codeToRarityName,
  keyToLanguage,
  rarityNameToCode,
  sanitizeRarityCode,
  snakeCaseToCapitalized,
} from '@/lib/utils';
import { Routes } from '@/routes';
import {
  ApiCard,
  ApiCardSet,
  CARD_LANGUAGES,
  CardLanguage,
  CardRarityName,
} from '@/types/cards';

import { LinkButton } from '../link-button';

interface CardSheetProps {
  card: ApiCard;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRedirect: () => void;
}

export function CardSheet({
  card,
  open,
  onOpenChange,
  onRedirect,
}: CardSheetProps) {
  const [mounted, setMounted] = useState(false);
  const userId = useCurrentUserId();
  const { cards, refreshLibrary } = useLibrary();

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleOpenChange(open: boolean) {
    onOpenChange(open);
  }

  if (!userId || !mounted) {
    return null;
  }

  const libraryCard = cards.find(
    (libraryCard) => libraryCard.cardId === card.id,
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side='bottom' className='pr-8 flex flex-col gap-5'>
        <div className='flex items-start gap-6'>
          <div className='hidden md:block shrink-0'>
            <CardImage src={card.imageUrl} alt={card.name} />
          </div>
          <div className='flex flex-col space-y-4 w-full'>
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
            {card.cardSets.length && (
              <div className='flex flex-col items-start space-y-2'>
                <h4 className='text-md font-semibold'>Issues</h4>
                <div
                  className={cn(
                    'w-full rounded-md border max-h-[226px] overflow-y-auto',
                  )}
                >
                  <CardIssuesTable
                    userId={userId}
                    card={card}
                    onAdd={() => refreshLibrary()}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {!!libraryCard && (
          <div className='border rounded-lg'>
            <div className='flex justify-between items-center px-4 py-1 border-b'>
              <p className=''>{libraryCard.quantity} in library</p>
              <SheetClose asChild>
                <LinkButton
                  href={Routes.platform.library}
                  onClick={() => onRedirect()}
                >
                  Browse library
                </LinkButton>
              </SheetClose>
            </div>
            <Table>
              <TableBody>
                {libraryCard.issues.map((issue, i) => (
                  <TableRow key={i} className='[&>td]:py-2'>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{issue.set.setCode}</span>
                        </TooltipTrigger>
                        <TooltipContent>{issue.set.setName}</TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className='max-w-32 truncate'>
                      {codeToRarityName(issue.rarity)}
                    </TableCell>
                    <TableCell className='w-32'>
                      <Badge variant='outline'>x {issue.quantity}</Badge>
                    </TableCell>
                    <TableCell>
                      <FlagIcon locale={issue.language} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

type AddCardFormData = {
  language: CardLanguage;
  quantity: number;
};

interface CardIssuesTableProps {
  userId: string;
  card: ApiCard;
  onAdd: () => void;
}

function CardIssuesTable({ userId, card, onAdd }: CardIssuesTableProps) {
  const form = useForm<AddCardFormData>({
    defaultValues: {
      language: 'en',
      quantity: 1,
    },
  });

  const { handleSubmit, control, reset } = form;

  const { execute: addLibraryCard, loading: addingCard } = useAction(
    addLibraryCardAction,
    {
      onError: (error) => {
        toast.error(error);
      },
      onSuccess: ({ success }) => {
        onAdd();
        toast.success(success);
      },
    },
  );

  function onAddCard(data: AddCardFormData, set: ApiCardSet) {
    const rarityCode = set.set_rarity_code
      ? sanitizeRarityCode(set.set_rarity_code)
      : rarityNameToCode(set.set_rarity as CardRarityName);

    addLibraryCard({
      card: {
        id: card.id,
        name: card.name,
      },
      userId,
      issue: {
        language: data.language,
        quantity: Number(data.quantity),
        rarity: rarityCode,
        set: {
          setCode: set.set_code,
          setName: set.set_name,
          setPrice: set.set_price,
        },
      },
    });
  }

  const handleOpenChange = () => {
    reset();
  };

  return (
    <Table>
      <TableBody>
        {card.cardSets.map((set, i) => (
          <TableRow key={`${set.set_code}-${i}`} className='[&>td]:py-1'>
            <TableCell>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{set.set_code}</span>
                </TooltipTrigger>
                <TooltipContent>{set.set_name}</TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell className='max-w-32 truncate'>
              {set.set_rarity}
            </TableCell>
            <TableCell className='w-32'>
              <Badge variant='outline'>
                {Number(set.set_price) ? `€ ${set.set_price}` : 'N/A'}
              </Badge>
            </TableCell>
            <TableCell className='w-10'>
              <Popover onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                  <Button
                    variant='ghost'
                    size='iconSm'
                    className='hover:-translate-y-0'
                  >
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Form key={`${set.set_code}-${i}`} {...form}>
                    <form
                      onSubmit={handleSubmit((data) => onAddCard(data, set))}
                      className='flex flex-col space-y-4'
                    >
                      <FormField
                        name='language'
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                disabled={addingCard}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    defaultValue={'en'}
                                    placeholder='Select a language'
                                  >
                                    {keyToLanguage(field.value)}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {CARD_LANGUAGES.map((language) => (
                                      <SelectItem
                                        key={language}
                                        value={language}
                                      >
                                        {keyToLanguage(language)}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name='quantity'
                        control={control}
                        defaultValue={1}
                        disabled={addingCard}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input {...field} type='number' />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <ActionButton
                        type='submit'
                        loading={addingCard}
                        icon={<Plus className='h-4 w-4' />}
                      >
                        Add to library
                      </ActionButton>
                    </form>
                  </Form>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
