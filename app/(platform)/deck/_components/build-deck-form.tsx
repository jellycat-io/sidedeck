'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PencilRuler, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createDeckAction } from '@/actions/platform/deck/create-deck';
import { removeDeckAction } from '@/actions/platform/deck/remove-deck';
import { updateDeckAction } from '@/actions/platform/deck/update-deck';
import { ActionButton } from '@/components/action-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAction } from '@/hooks/use-action';
import { useDecks } from '@/hooks/use-decks';
import { cn, snakeCaseToCapitalized } from '@/lib/utils';
import { Routes } from '@/routes';
import { DeckInputSchema } from '@/schemas/deck';
import { DECK_TYPES, Deck } from '@/types/deck';

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
  mainCardIds: [],
  extraCardIds: [],
  sideCardIds: [],
};

export function BuildDeckForm({ userId, deck }: BuildDeckFormProps) {
  const router = useRouter();
  const [slug, setSlug] = useState(deck?.slug ?? '');

  const { refreshDecks } = useDecks();

  const form = useForm<z.infer<typeof DeckInputSchema>>({
    resolver: zodResolver(DeckInputSchema),
    defaultValues: deck ? deck : initialState,
  });

  const { control, handleSubmit, formState } = form;

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
      ? updateDeck({ deckId: deck.id, values })
      : createDeck({ userId, values: { ...values, slug } });
  }

  function onRemove() {
    removeDeck({ deckId: deck?.id });
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-6'>
        <div className='flex flex-col gap-y-4 border rounded-md p-4'>
          <p className='font-medium'>Informations</p>
          <div className='grid grid-cols-2 gap-x-4'>
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
                        setSlug(value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
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
        <div className={cn('flex', deck ? 'justify-between' : 'justify-end')}>
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
          <ActionButton
            icon={<PencilRuler className='h-4 w-4' />}
            disabled={
              creatingDeck ||
              updatingDeck ||
              !formState.isValid ||
              !formState.isDirty
            }
            loading={creatingDeck || updatingDeck}
            type='submit'
            className='justify-self-end'
          >
            {deck ? 'Update Deck' : 'Create Deck'}
          </ActionButton>
        </div>
      </form>
    </Form>
  );
}
