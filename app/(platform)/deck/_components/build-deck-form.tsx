'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  LoaderCircle,
  Minus,
  MoreHorizontal,
  PencilRuler,
  Plus,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createDeckAction } from '@/actions/platform/deck/create-deck';
import { removeDeckAction } from '@/actions/platform/deck/remove-deck';
import { updateDeckAction } from '@/actions/platform/deck/update-deck';
import { ActionButton } from '@/components/action-button';
import { BanIcon } from '@/components/ban-icon';
import { CardTooltip } from '@/components/card-tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAction } from '@/hooks/use-action';
import { useCards } from '@/hooks/use-cards';
import { useDebounce } from '@/hooks/use-debounce';
import { useDecks } from '@/hooks/use-decks';
import { useLibrary } from '@/hooks/use-library';
import { cn, snakeCaseToCapitalized } from '@/lib/utils';
import { Routes } from '@/routes';
import { DeckInputSchema } from '@/schemas/deck';
import { ApiCard, CardType } from '@/types/card';
import { DECK_TYPES, Deck, DeckCard } from '@/types/deck';

const EXTRA_DECK_LIMIT = 15;
const SIDE_DECK_LIMIT = 15;

type DeckList = 'main' | 'extra' | 'side';

interface BuildDeckFormProps {
  userId: string;
  deck?: Deck;
}

const initialState = {
  title: '',
  slug: '',
  description: '',
  type: undefined,
  valid: false,
  mainCards: [],
  extraCards: [],
  sideCards: [],
};

export function BuildDeckForm({ userId, deck }: BuildDeckFormProps) {
  const [expandMeta, setExpandMeta] = useState(!deck);
  const [slug, setSlug] = useState(deck?.slug ?? '');
  const [mainCards, setMainCards] = useState(deck?.mainCards ?? []);
  const [extraCards, setExtraCards] = useState(deck?.extraCards ?? []);
  const [sideCards, setSideCards] = useState(deck?.sideCards ?? []);

  const router = useRouter();
  const { refreshDecks } = useDecks();
  const { cards } = useCards();

  const form = useForm<z.infer<typeof DeckInputSchema>>({
    resolver: zodResolver(DeckInputSchema),
    defaultValues: deck ? deck : initialState,
  });

  const { control, handleSubmit } = form;

  const { execute: createDeck, loading: creatingDeck } = useAction(
    createDeckAction,
    {
      onError: toast.error,
      onSuccess: ({ success, deckId }) => {
        toast.success(success);
        form.reset();
        refreshDecks();
        !deck && router.push(Routes.platform.deck.edit(deckId));
      },
    },
  );

  const { execute: updateDeck, loading: updatingDeck } = useAction(
    updateDeckAction,
    {
      onError: toast.error,
      onSuccess: ({ success }) => {
        refreshDecks();
        toast.success(success);
      },
    },
  );

  const { execute: removeDeck, loading: removingDeck } = useAction(
    removeDeckAction,
    {
      onError: toast.error,
      onSuccess: ({ success }) => {
        refreshDecks();
        toast.success(success);
        router.push(Routes.platform.dashboard);
      },
    },
  );

  function onSubmit(values: z.infer<typeof DeckInputSchema>) {
    deck
      ? updateDeck({
          deckId: deck.id,
          values: { ...values, slug },
          mainCards,
          extraCards,
          sideCards,
          valid: isDeckValid,
        })
      : createDeck({
          userId,
          values: { ...values, slug },
          mainCards,
          extraCards,
          sideCards,
          valid: isDeckValid,
        });
  }

  function onRemove() {
    removeDeck({ deckId: deck?.id });
  }

  function handleAddCard(card: ApiCard, list: DeckList) {
    switch (list) {
      case 'main':
        setMainCards([...mainCards, { id: card.id, quantity: 1 }]);
        break;
      case 'extra':
        setExtraCards([...extraCards, { id: card.id, quantity: 1 }]);
        break;
      case 'side':
        setSideCards([...sideCards, { id: card.id, quantity: 1 }]);
        break;
    }
  }

  function handleRemoveCard(cardId: string, list: DeckList) {
    switch (list) {
      case 'main':
        setMainCards((prev) => prev.filter((card) => card.id !== cardId));
        break;
      case 'extra':
        setExtraCards((prev) => prev.filter((card) => card.id !== cardId));
        break;
      case 'side':
        setSideCards((prev) => prev.filter((card) => card.id !== cardId));
        break;
    }
  }

  function handleChangeQuantity(
    cardId: string,
    type: DeckList,
    quantity: number,
  ) {
    switch (type) {
      case 'main':
        setMainCards((prev) =>
          prev.map((card) =>
            card.id === cardId ? { ...card, quantity } : card,
          ),
        );
        break;
      case 'extra':
        setExtraCards((prev) =>
          prev.map((card) =>
            card.id === cardId ? { ...card, quantity } : card,
          ),
        );
        break;
      case 'side':
        setSideCards((prev) =>
          prev.map((card) =>
            card.id === cardId ? { ...card, quantity } : card,
          ),
        );
        break;
    }
  }

  function handleCancel() {
    form.reset();
    setMainCards(deck ? deck.mainCards : []);
    setExtraCards(deck ? deck.extraCards : []);
    setSideCards(deck ? deck.sideCards : []);
  }

  function getApiCard(id: string) {
    return cards.find((card) => card.id === id)!;
  }

  const isDeckValid = useMemo(
    () =>
      form.formState.isValid &&
      computeCardQuantity(mainCards) >= 40 &&
      computeCardQuantity(mainCards) <= 60 &&
      computeCardQuantity(extraCards) <= EXTRA_DECK_LIMIT &&
      computeCardQuantity(sideCards) <= SIDE_DECK_LIMIT,
    [form.formState.isValid, mainCards, extraCards, sideCards],
  );

  const actionDisabled = useMemo(
    () =>
      !form.formState.isDirty &&
      (!mainCards.length || mainCards === deck?.mainCards) &&
      (!extraCards.length || extraCards === deck?.extraCards) &&
      (!sideCards.length || sideCards === deck?.sideCards),
    [form.formState.isDirty, mainCards, extraCards, sideCards, deck],
  );

  const mainPrice = useMemo(
    () => computeDeckPrice(mainCards, cards),
    [mainCards, cards],
  );
  const extraPrice = useMemo(
    () => computeDeckPrice(extraCards, cards),
    [extraCards, cards],
  );
  const sidePrice = useMemo(
    () => computeDeckPrice(sideCards, cards),
    [sideCards, cards],
  );

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-y-4'
        >
          <div
            className='flex flex-col gap-y-4 border rounded-md p-4 transition-all ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:h-[58px] data-[state=open]:h-[400px] overflow-hidden'
            data-state={expandMeta ? 'open' : 'closed'}
          >
            <div
              className='flex justify-between items-center'
              onClick={() => setExpandMeta((prev) => !prev)}
            >
              <p className='font-medium'>Metadata</p>
              {expandMeta ? (
                <ChevronUp className='h-4 w-4' />
              ) : (
                <ChevronDown className='h-4 w-4' />
              )}
            </div>
            <div className={cn('flex flex-col gap-y-4')}>
              <div className='grid grid-cols-2 gap-x-4 '>
                <FormField
                  name='title'
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(e);
                            setSlug(
                              value.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                            );
                          }}
                          disabled={creatingDeck || updatingDeck}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      name='slug'
                      value={slug}
                      disabled
                      className='font-mono'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
              <FormField
                name='description'
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        {...field}
                        disabled={creatingDeck || updatingDeck}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name='type'
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={creatingDeck || updatingDeck}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a type...'>
                            {snakeCaseToCapitalized(field.value ?? '')}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DECK_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {snakeCaseToCapitalized(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='flex flex-col lg:flex-row gap-4'>
            <div className='flex-1'>
              <CardSearch
                mainCards={mainCards}
                extraCards={extraCards}
                sideCards={sideCards}
                onAddCard={handleAddCard}
              />
            </div>
            <div className='flex-1 flex flex-col gap-4'>
              <div className='flex flex-col gap-2 border rounded-md p-4 h-64'>
                <div className='flex items-center justify-between'>
                  <p className='font-medium'>Main Deck</p>
                  <Badge>{`€ ${mainPrice}`}</Badge>
                </div>
                <div className='text-sm flex items-center space-x-4'>
                  <div className='flex items-center space-x-2'>
                    <p>Total</p>
                    <p
                      className={cn(
                        'font-semibold',
                        !checkMainCardQuantity(mainCards) && 'text-destructive',
                      )}
                    >
                      {computeCardQuantity(mainCards)}
                    </p>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <p>Monsters</p>
                    <p className='font-semibold'>
                      {computeCardQuantity(
                        mainCards.filter((c) => isMonster(getApiCard(c.id))),
                      )}
                    </p>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <p>Spells</p>
                    <p className='font-semibold'>
                      {computeCardQuantity(
                        mainCards.filter((c) => isSpell(getApiCard(c.id))),
                      )}
                    </p>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <p>Traps</p>
                    <p className='font-semibold'>
                      {computeCardQuantity(
                        mainCards.filter((c) => isTrap(getApiCard(c.id))),
                      )}
                    </p>
                  </div>
                </div>
                <ScrollArea className='max-h-[160px]'>
                  {mainCards.map((card) => (
                    <DeckCardItem
                      key={card.id}
                      deckCard={card}
                      deckList='main'
                      apiCard={getApiCard(card.id)}
                      isMaxCardQuantityReached={isMaxCardQuantityReached(
                        mainCards,
                        extraCards,
                        sideCards,
                        getApiCard(card.id),
                      )}
                      onChangeQuantity={handleChangeQuantity}
                      onRemoveCard={handleRemoveCard}
                    />
                  ))}
                </ScrollArea>
              </div>
              <div className='flex flex-col gap-2 border rounded-md p-4 h-64'>
                <div className='flex items-center justify-between'>
                  <p className='font-medium'>Extra Deck</p>
                  <Badge>{`€ ${extraPrice}`}</Badge>
                </div>
                <div className='flex items-center space-x-2 text-sm'>
                  <p>Total</p>
                  <p className='font-semibold'>
                    <span
                      className={cn(
                        isSizeLimitExceeded(extraCards, EXTRA_DECK_LIMIT) &&
                          'text-destructive',
                      )}
                    >
                      {computeCardQuantity(extraCards)}
                    </span>
                    {' / '}
                    <span>{EXTRA_DECK_LIMIT}</span>
                  </p>
                </div>
                <ScrollArea className='max-h-[160px]'>
                  {extraCards.map((card) => (
                    <DeckCardItem
                      key={card.id}
                      deckCard={card}
                      deckList='extra'
                      apiCard={getApiCard(card.id)}
                      isMaxCardQuantityReached={isMaxCardQuantityReached(
                        mainCards,
                        extraCards,
                        sideCards,
                        getApiCard(card.id),
                      )}
                      onChangeQuantity={handleChangeQuantity}
                      onRemoveCard={handleRemoveCard}
                    />
                  ))}
                </ScrollArea>
              </div>
              <div className='flex flex-col gap-2 border rounded-md p-4 h-64'>
                <div className='flex items-center justify-between'>
                  <p className='font-medium'>Side Deck</p>
                  <Badge>{`€ ${sidePrice}`}</Badge>
                </div>
                <div className='flex items-center space-x-2 text-sm'>
                  <p>Total</p>
                  <p className='font-semibold'>
                    <span
                      className={cn(
                        isSizeLimitExceeded(sideCards, SIDE_DECK_LIMIT) &&
                          'text-destructive',
                      )}
                    >
                      {computeCardQuantity(sideCards)}
                    </span>
                    {' / '}
                    <span>{SIDE_DECK_LIMIT}</span>
                  </p>
                </div>
                <ScrollArea className='max-h-[160px]'>
                  {sideCards.map((card) => (
                    <DeckCardItem
                      key={card.id}
                      deckCard={card}
                      deckList='side'
                      apiCard={getApiCard(card.id)}
                      isMaxCardQuantityReached={isMaxCardQuantityReached(
                        mainCards,
                        extraCards,
                        sideCards,
                        getApiCard(card.id),
                      )}
                      onChangeQuantity={handleChangeQuantity}
                      onRemoveCard={handleRemoveCard}
                    />
                  ))}
                </ScrollArea>
              </div>
            </div>
          </div>
          <div className='sticky bottom-0 w-full bg-background border rounded-md shadow-sm p-4 space-y-4'>
            <div className='flex items-center space-x-2'>
              <p>Total price</p>
              <Badge>{`€ ${Number((mainPrice + extraPrice + sidePrice).toFixed(2).padEnd(2, '0'))}`}</Badge>
            </div>
            {!isDeckValid && (
              <div className='flex items-center space-x-2 border p-4 rounded-md text-sm border-warning text-warning bg-warning/10 font-medium'>
                <TriangleAlert className='h-6 w-6' />
                <span>
                  This deck is not valid. Other duelists will not be able to see
                  it.
                </span>
              </div>
            )}
            <div
              className={cn('flex', deck ? 'justify-between' : 'justify-end')}
            >
              {deck && (
                <ActionButton
                  icon={<Trash2 className='h-4 w-4' />}
                  disabled={removingDeck}
                  loading={removingDeck}
                  onClick={onRemove}
                  className='bg-destructive text-destructive-foreground'
                >
                  Remove Deck
                </ActionButton>
              )}
              <div className='flex items-center space-x-4'>
                <Button
                  variant='ghost'
                  disabled={actionDisabled}
                  onClick={() => handleCancel()}
                >
                  Cancel
                </Button>
                <ActionButton
                  icon={<PencilRuler className='h-4 w-4' />}
                  disabled={!form.formState.isDirty && actionDisabled}
                  loading={creatingDeck || updatingDeck}
                  type='submit'
                  className='justify-self-end'
                >
                  {deck ? 'Update Deck' : 'Create Deck'}
                </ActionButton>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

interface CardSearchProps {
  mainCards: DeckCard[];
  extraCards: DeckCard[];
  sideCards: DeckCard[];
  onAddCard: (card: ApiCard, list: DeckList) => void;
}

function CardSearch({
  mainCards,
  extraCards,
  sideCards,
  onAddCard,
}: CardSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalQueryCount, setTotalQueryCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredCards, setFilteredCards] = useState<ApiCard[]>([]);
  const debouncedSearch = useDebounce(search, 500);

  const { cards: apiCards, getQueryCards } = useCards();

  const fetchCards = useCallback(
    async (pageNum: number, isInitial = false) => {
      setLoading(true);
      try {
        const { cards: fetchedCards, totalCount } = getQueryCards({
          query: debouncedSearch ?? 'blue-eyes white dragon',
          limit: 20,
          page: pageNum,
        });
        setTotalQueryCount(totalCount);
        setFilteredCards((prev) =>
          isInitial ? fetchedCards : [...prev, ...fetchedCards],
        );
        setHasMore(totalCount > (pageNum + 1) * 20);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, getQueryCards],
  );

  // Effect for initial fetch or on query change
  useEffect(() => {
    setPage(0);
    if (apiCards) {
      fetchCards(0, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, apiCards]);

  // Effect for loading more items
  useEffect(() => {
    if (page > 0) {
      fetchCards(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleSearchChange(value: string) {
    if (!open) {
      setOpen(true);
    }
    setSearch(value);
  }

  return (
    <div className='flex flex-col gap-4 border rounded-md'>
      <Command className='flex flex-col justify-between'>
        <CommandInput
          placeholder='Type a card name...'
          value={search}
          onValueChange={handleSearchChange}
        />
        <CommandList>
          {!totalQueryCount && !loading && (
            <CommandEmpty>No results found</CommandEmpty>
          )}
          <CommandGroup>
            <ScrollArea className='h-72'>
              {filteredCards.length &&
                filteredCards.map((card) => (
                  <CommandItem
                    key={card.id}
                    value={card.name}
                    className='flex items-center justify-between aria-selected:bg-background aria-selected:text-foreground py-0 min-h-8'
                  >
                    <div className='flex items-center space-x-2'>
                      {card.banlistInfo?.ban_tcg && (
                        <BanIcon
                          status={card.banlistInfo.ban_tcg}
                          className='h-4 w-4 text-xs'
                        />
                      )}
                      <CardTooltip card={card} isColorCoded />
                    </div>
                    {card.banlistInfo?.ban_tcg !== 'Banned' &&
                    !isMaxCardQuantityReached(
                      mainCards,
                      extraCards,
                      sideCards,
                      card,
                    ) ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            variant='ghost'
                            className='p-0 h-8 w-8'
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            disabled={
                              mainCards.some((c) => c.id === card.id) ||
                              !isMainDeckCard(card)
                            }
                            onClick={() => onAddCard(card, 'main')}
                          >
                            Add to main deck
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={
                              extraCards.some((c) => c.id === card.id) ||
                              !isExtraDeckCard(card)
                            }
                            onClick={() => onAddCard(card, 'extra')}
                          >
                            Add to extra deck
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={sideCards.some((c) => c.id === card.id)}
                            onClick={() => onAddCard(card, 'side')}
                          >
                            Add to side deck
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className='h-8 w-8 flex items-center justify-center'>
                            <Info className='h-4 w-4 text-warning' />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Max capacity reached for this card
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </CommandList>
        <CommandSeparator />
        <div className='border-t'>
          <div className='text-center text-sm text-muted-foreground py-2'>{`Showing ${filteredCards.length} of ${totalQueryCount} results`}</div>
          {loading ? (
            <div className='h-[40px] flex justify-center items-center'>
              <LoaderCircle className='mr-2 w-4 h-4 animate-spin' />
            </div>
          ) : (
            <Button
              variant='ghost'
              className='w-full rounded-none'
              onClick={(e) => {
                e.preventDefault();
                setPage((prev) => prev + 1);
              }}
              disabled={!hasMore}
            >
              Load more
            </Button>
          )}
        </div>
      </Command>
    </div>
  );
}

interface DeckCardItemProps {
  deckCard: DeckCard;
  apiCard: ApiCard;
  deckList: DeckList;
  isMaxCardQuantityReached: boolean;
  onChangeQuantity: (cardId: string, type: DeckList, quantity: number) => void;
  onRemoveCard: (cardId: string, type: DeckList) => void;
}

function DeckCardItem({
  deckCard,
  apiCard,
  deckList,
  isMaxCardQuantityReached,
  onChangeQuantity,
  onRemoveCard,
}: DeckCardItemProps) {
  const { checkLibraryCard } = useLibrary();

  const libraryStatus = checkLibraryCard(deckCard.id, deckCard.quantity);

  return (
    <div key={deckCard.id} className='flex justify-between items-center pr-4'>
      <div className='flex items-center space-x-2'>
        {!!libraryStatus.exists && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'h-4 w-4 flex justify-center items-center rounded-full',
                  libraryStatus.hasEnough
                    ? 'bg-success text-success-foreground'
                    : 'bg-warning text-warning-foreground',
                )}
              >
                {libraryStatus.hasEnough ? (
                  <Check className='h-3 w-3' />
                ) : (
                  <span className='text-xs'>!</span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {libraryStatus.hasEnough
                ? 'You have enough of this card in your library'
                : `You only have ${libraryStatus.quantity} cards out of ${deckCard.quantity} in your library`}
            </TooltipContent>
          </Tooltip>
        )}
        {apiCard.banlistInfo?.ban_tcg && (
          <BanIcon
            status={apiCard.banlistInfo?.ban_tcg}
            className='h-4 w-4 text-xs'
          />
        )}
        <CardTooltip
          card={apiCard}
          isColorCoded
          className='w-48 truncate text-sm'
        />
      </div>
      <div className='flex justify-end items-center space-x-2'>
        <div className='rounded-md border flex justify-between items-center overflow-hidden h-6 text-sm'>
          <Button
            variant='ghost'
            size='iconSm'
            className='border-r rounded-none flex-1 focus-visible:ring-none h-6 w-6'
            disabled={deckCard.quantity === 1}
            onClick={(e) => {
              e.preventDefault();
              onChangeQuantity(deckCard.id, deckList, deckCard.quantity - 1);
            }}
          >
            <Minus className='h-4 w-4' />
          </Button>
          <div className='flex-1 flex justify-center items-center cursor-default min-w-6'>
            {deckCard.quantity}
          </div>
          <Button
            variant='ghost'
            size='iconSm'
            className='border-l rounded-none flex-1 focus-visible:ring-none h-6 w-6'
            disabled={!!isMaxCardQuantityReached}
            onClick={(e) => {
              e.preventDefault();
              onChangeQuantity(deckCard.id, deckList, deckCard.quantity + 1);
            }}
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>
        <Button
          variant='ghostDestructive'
          className='px-0 py-0 h-8 w-8'
          onClick={(e) => {
            e.preventDefault();
            onRemoveCard(deckCard.id, deckList);
          }}
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}

function isMonster(card: ApiCard) {
  return !(['spell_card', 'trap_card'] as CardType[]).includes(card.type);
}

function isSpell(card: ApiCard) {
  return card.type === 'spell_card';
}

function isTrap(card: ApiCard) {
  return card.type === 'trap_card';
}

function isSizeLimitExceeded(cards: DeckCard[], limit: number) {
  return computeCardQuantity(cards) > limit;
}

function checkMainCardQuantity(cards: DeckCard[]) {
  return computeCardQuantity(cards) >= 40 && computeCardQuantity(cards) <= 60;
}

function computeCardQuantity(cards: DeckCard[]) {
  return cards.reduce((acc, card) => acc + card.quantity, 0);
}

// Only 3 cards of the same id are allowed in the global deck
function isMaxCardQuantityReached(
  mainDeck: DeckCard[],
  extraDeck: DeckCard[],
  sideDeck: DeckCard[],
  card: ApiCard,
): boolean {
  const mainDeckQuantity = computeCardQuantity(
    mainDeck.filter((c) => c.id === card.id),
  );
  const extraDeckQuantity = computeCardQuantity(
    extraDeck.filter((c) => c.id === card.id),
  );
  const sideDeckQuantity = computeCardQuantity(
    sideDeck.filter((c) => c.id === card.id),
  );

  const total = mainDeckQuantity + extraDeckQuantity + sideDeckQuantity;

  switch (card.banlistInfo?.ban_tcg) {
    case 'Limited':
      return total >= 1;
    case 'Semi-Limited':
      return total >= 2;
    default:
      return total >= 3;
  }
}

function computeDeckPrice(deck: DeckCard[], cards: ApiCard[]) {
  const totalPrice = deck.reduce((acc, card) => {
    const apiCard = cards.find((c) => c.id === card.id);
    const cardPrice = Number(apiCard?.cardPrices[0]?.cardmarket_price) ?? 0;
    const subtotal = cardPrice * card.quantity;
    return acc + subtotal;
  }, 0);

  // Round totalPrice to 2 decimal places
  return Number(totalPrice.toFixed(2).padEnd(2, '0'));
}

function isMainDeckCard(card: ApiCard) {
  return !(
    [
      'fusion_monster',
      'synchro_monster',
      'xyz_monster',
      'link_monster',
      'xyz_pendulum_effect_monster',
    ] as CardType[]
  ).includes(card.type);
}

function isExtraDeckCard(card: ApiCard) {
  return (
    [
      'fusion_monster',
      'synchro_monster',
      'xyz_monster',
      'link_monster',
      'xyz_pendulum_effect_monster',
    ] as CardType[]
  ).includes(card.type);
}
