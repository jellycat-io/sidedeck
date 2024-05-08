'use client';

import { Archive, Gauge, LibraryBig, PencilRuler } from 'lucide-react';

import { Accordion } from '@/components/ui/accordion';
import { useDecks } from '@/hooks/use-decks';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Routes } from '@/routes';

import { SidebarBlock } from './sidebar-block';
import { SidebarLink } from './sidebar-link';

type ExpandedState = Record<string, boolean>;

interface SidebarProps {
  storageKey?: string;
}

export function Sidebar({ storageKey = 'sd-sidebar-state' }: SidebarProps) {
  const [expanded, setExpanded] = useLocalStorage<ExpandedState>(
    storageKey,
    {},
  );

  const { decks } = useDecks();

  const defaultAccordionValues: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }

      return acc;
    },
    [],
  );

  const onExpand = (id: string) => {
    setExpanded((curr) => ({
      ...curr,
      [id]: !curr[id],
    }));
  };

  return (
    <>
      <div className='font-medium text-xs flex items-center mb-1'>
        <SidebarLink
          href={Routes.platform.dashboard}
          icon={<Gauge className='h-4 w-4' />}
        >
          Dashboard
        </SidebarLink>
      </div>
      <div className='font-medium text-xs flex items-center mb-1'>
        <SidebarLink
          href={Routes.platform.library}
          icon={<LibraryBig className='h-4 w-4' />}
        >
          My Library
        </SidebarLink>
      </div>
      <Accordion
        type='multiple'
        defaultValue={defaultAccordionValues}
        className='space-y-2'
      >
        <SidebarBlock
          id='my-decks'
          label='My decks'
          icon={<Archive className='h-4 w-4' />}
          isExpanded={expanded['decks']}
          onExpand={onExpand}
          items={[
            ...decks.map((deck) => ({
              label: deck.title,
              href: Routes.platform.deck.edit(deck.id),
            })),
            {
              label: 'Build a Deck',
              icon: <PencilRuler className='h-4 w-4' />,
              href: Routes.platform.deck.create,
            },
          ]}
        />
      </Accordion>
    </>
  );
}
