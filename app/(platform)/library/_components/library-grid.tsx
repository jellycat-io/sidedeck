'use client';

import {
  ChevronsLeft,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRight,
  Filter,
  Eraser,
  ChevronRight,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { CardImage } from '@/components/card-image';
import { DatePicker } from '@/components/date-picker';
import { DebouncedInput } from '@/components/debounced-input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { camelCasetoCapitalized, snakeCaseToCapitalized } from '@/lib/utils';
import { CARD_TYPES, LibraryCard } from '@/types/card';

type Filter = {
  key: string;
  filterVariant: 'date' | 'boolean' | 'text' | 'number' | 'select';
  filterFn: (card: LibraryCard, value: any) => boolean;
  filterOptions?: string[];
};

const filters: Filter[] = [
  {
    key: 'name',
    filterVariant: 'text',
    filterFn: (card: LibraryCard, value: string) =>
      card.name.toLowerCase().includes(value.toLowerCase()),
  },
  {
    key: 'type',
    filterVariant: 'select',
    filterFn: (card: LibraryCard, value: string) => {
      if (value === 'all') {
        return true;
      }

      return card.type === value;
    },
    filterOptions: CARD_TYPES,
  },
  {
    key: 'createdAt',
    filterVariant: 'date',
    filterFn: (card, value) => dateRangeFilterFn(card, value),
  },
  {
    key: 'updatedAt',
    filterVariant: 'date',
    filterFn: (card, value) => dateRangeFilterFn(card, value),
  },
];

type AppliedFilter = {
  visible: boolean;
  value: any;
};

type AppliedFilters = Record<string, AppliedFilter>;

const initialFilters: AppliedFilters = {
  name: { visible: false, value: '' },
  type: { visible: false, value: 'all' },
  createdAt: { visible: false, value: { start: '', end: '' } },
  updatedAt: { visible: false, value: { start: '', end: '' } },
};

interface LibraryGridProps {
  cards: LibraryCard[];
  loading?: boolean;
  onCardClick: (card: LibraryCard) => void;
}

export function LibraryGrid({ cards, loading, onCardClick }: LibraryGridProps) {
  const [page, setPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(10);

  const offset = useMemo(() => page * cardsPerPage, [page, cardsPerPage]);

  const [appliedFilters, setAppliedFilters] =
    useState<AppliedFilters>(initialFilters);

  function applyFilters(card: LibraryCard) {
    return filters.every((filter) => {
      const appliedFilter = appliedFilters[filter.key];
      if (!appliedFilter || !appliedFilter.visible) {
        // Filter is not applied or visible, so it doesn't affect this card
        return true;
      }

      const filterValue = appliedFilter.value;
      const filterFn = filter.filterFn;

      // Apply the filter function to the card with the filter value
      return filterFn(card, filterValue);
    });
  }

  const filteredCards = cards.filter((card) => applyFilters(card));

  const paginatedCards = filteredCards.slice(offset, offset + cardsPerPage);

  const totalPageCount = Math.ceil(filteredCards.length / cardsPerPage);

  function handleNextPage() {
    setPage(page + 1);
  }

  function handlePreviousPage() {
    setPage(page - 1);
  }

  function handleFirstPage() {
    setPage(0);
  }

  function handleLastPage() {
    setPage(totalPageCount - 1);
  }

  function canGetPreviousPage() {
    return page > 0;
  }

  function canGetNextPage() {
    return page < totalPageCount - 1;
  }

  const isAllFiltersHidden = Object.values(appliedFilters).every(
    (filter) => !filter.visible,
  );

  if (loading && !cards.length) {
    return (
      <div className='pr-4 flex flex-wrap justify-center gap-3'>
        {[...Array(cardsPerPage)].map((_, index) => (
          <Skeleton key={index} className='w-[175px] h-[255px]' />
        ))}
      </div>
    );
  }

  // TODO: Fix hydration
  return (
    <>
      <div className='flex justify-end'>
        <LibraryGridFilterOptions
          filters={filters}
          appliedFilters={appliedFilters}
          onFilterVisible={setAppliedFilters}
        />
      </div>
      {!isAllFiltersHidden && (
        <LibraryGridFilters
          filters={filters}
          appliedFilters={appliedFilters}
          onFilterChange={setAppliedFilters}
        />
      )}
      {!!cards.length ? (
        <ScrollArea className='h-[524px]'>
          <div className='pr-4 flex flex-wrap justify-center gap-3'>
            {paginatedCards.map((card) => (
              <CardImage
                key={card.id}
                onClick={() => onCardClick(card)}
                src={card.imageUrl}
                alt={card.name}
                banStatus={card.banlistInfo?.ban_tcg}
                size='sm'
                className='shrink-0'
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className='flex justify-center items-center h-[524px]'>
          No cards found. Use the Card Finder to add cards to your library.
        </div>
      )}
      <div className='flex items-center justify-between'>
        <div className='flex-1 text-sm text-muted-foreground'>
          Showing {paginatedCards.length} of {filteredCards.length} card(s).
        </div>
        <div className='flex items-center space-x-6 lg:space-x-8'>
          <div className='flex items-center space-x-2'>
            <p className='text-sm font-medium'>Cards per page</p>
            <Select
              value={`${cardsPerPage}`}
              onValueChange={(value) => {
                setCardsPerPage(Number(value));
              }}
            >
              <SelectTrigger className='h-8 w-[70px]'>
                <SelectValue placeholder={cardsPerPage.toString()} />
              </SelectTrigger>
              <SelectContent side='top'>
                {[10, 20, 30, 40, 50]
                  .filter(Boolean)
                  .sort((a, b) => a! - b!)
                  .map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
            Page {page + 1} of {totalPageCount}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => handleFirstPage()}
              disabled={!canGetPreviousPage()}
            >
              <span className='sr-only'>Go to first page</span>
              <ChevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => handlePreviousPage()}
              disabled={!canGetPreviousPage()}
            >
              <span className='sr-only'>Go to previous page</span>
              <ChevronLeftIcon className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => handleNextPage()}
              disabled={!canGetNextPage()}
            >
              <span className='sr-only'>Go to next page</span>
              <ChevronRightIcon className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => handleLastPage()}
              disabled={!canGetNextPage()}
            >
              <span className='sr-only'>Go to last page</span>
              <ChevronsRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

interface LibraryGridFilterOptionsProps {
  filters: Filter[];
  appliedFilters: AppliedFilters;
  onFilterVisible: (filters: AppliedFilters) => void;
}

function LibraryGridFilterOptions({
  filters,
  appliedFilters,
  onFilterVisible,
}: LibraryGridFilterOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='hidden h-8 lg:flex'>
          <Filter className='mr-2 h-4 w-4' />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[150px]'>
        <DropdownMenuLabel>Toggle filters</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filters.map((filter) => (
          <DropdownMenuCheckboxItem
            key={filter.key}
            checked={appliedFilters[filter.key].visible}
            onCheckedChange={(value) =>
              onFilterVisible({
                ...appliedFilters,
                [filter.key]: {
                  ...appliedFilters[filter.key],
                  visible: !!value,
                },
              })
            }
          >
            {camelCasetoCapitalized(filter.key)}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onFilterVisible(initialFilters)}>
          <Eraser className='mr-2 h-4 w-4' />
          Clear filters
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type FilterGroups = Record<string, { key: string; filter: AppliedFilter }[]>;

interface LibraryGridFiltersProps {
  filters: Filter[];
  appliedFilters: AppliedFilters;
  onFilterChange: (filters: AppliedFilters) => void;
}

function LibraryGridFilters({
  filters,
  appliedFilters,
  onFilterChange,
}: LibraryGridFiltersProps) {
  const filterGroups: FilterGroups = useMemo(() => {
    const groupedColumns: FilterGroups = {
      date: [],
      other: [],
    };

    filters.forEach((filter) => {
      const filterVariant = filter.filterVariant;
      if (!appliedFilters[filter.key].visible) return;

      if (filterVariant === 'date') {
        groupedColumns.date.push({
          key: filter.key,
          filter: appliedFilters[filter.key],
        });
      } else {
        groupedColumns.other.push({
          key: filter.key,
          filter: appliedFilters[filter.key],
        });
      }
    });

    return groupedColumns;
  }, [filters, appliedFilters]);

  return (
    <div className='border rounded-md p-4 flex flex-col space-y-4'>
      {!!filterGroups.other.length && (
        <div className='grid grid-cols-3 gap-4'>
          {filterGroups.other.map((filter) => (
            <div key={filter.key} className='flex flex-col gap-2'>
              <Label htmlFor={filter.key}>
                {camelCasetoCapitalized(filter.key)}
              </Label>
              <FilterInput
                filter={filters.find((f) => f.key === filter.key)!}
                value={filter.filter.value}
                onFilterChange={(key, value) => {
                  onFilterChange({
                    ...appliedFilters,
                    [key]: {
                      ...appliedFilters[key],
                      value,
                    },
                  });
                }}
              />
            </div>
          ))}
        </div>
      )}
      {!!filterGroups.date.length && (
        <div className='grid grid-cols-2 gap-4'>
          {filterGroups.date.map((filter) => (
            <div key={filter.key} className='flex flex-col gap-2'>
              <Label htmlFor={filter.key}>
                {camelCasetoCapitalized(filter.key)}
              </Label>
              <FilterInput
                filter={filters.find((f) => f.key === filter.key)!}
                value={filter.filter.value}
                onFilterChange={(key, value) => {
                  onFilterChange({
                    ...appliedFilters,
                    [key]: {
                      ...appliedFilters[key],
                      value,
                    },
                  });
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type DateRangeFilterValue = {
  start: Date;
  end: Date;
};

interface FilterInputProps {
  filter: Filter;
  value: any;
  onFilterChange: (key: string, value: any) => void;
}

function FilterInput({ filter, value, onFilterChange }: FilterInputProps) {
  function handleChange(value: any) {
    onFilterChange(filter.key, value);
  }

  return (
    <>
      {filter.filterVariant === 'date' ? (
        <div className='flex items-center gap-x-2'>
          <DatePicker
            value={(value as DateRangeFilterValue)?.start}
            onChange={(newValue) => {
              handleChange({
                start: newValue?.toISOString(),
                end: value?.end ? value?.end : newValue?.toISOString(),
              });
            }}
            className='h-8'
          />
          <ChevronRight className='h-4 w-4 shrink-0' />
          <DatePicker
            value={(value as DateRangeFilterValue)?.end}
            onChange={(newValue) => {
              handleChange({
                start: value?.start ? value?.start : newValue?.toISOString(),
                end: newValue?.toISOString(),
              });
            }}
            className='h-8'
          />
        </div>
      ) : filter.filterVariant === 'text' ? (
        <DebouncedInput
          type='text'
          value={value}
          onChange={handleChange}
          placeholder={`Search...`}
          className='w-auto h-8'
        />
      ) : filter.filterVariant === 'number' ? (
        <DebouncedInput
          type='number'
          value={value}
          onChange={handleChange}
          placeholder={`Search...`}
          className='w-auto h-8'
        />
      ) : filter.filterVariant === 'select' ? (
        <Select defaultValue='all' onValueChange={handleChange}>
          <SelectTrigger className='h-8'>
            <SelectValue>{snakeCaseToCapitalized(value)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            {filter.filterOptions?.map((option: string) => (
              <SelectItem key={option} value={option}>
                {snakeCaseToCapitalized(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
    </>
  );
}

function isDateInRange(value: string | Date, start: string, end: string) {
  const date = new Date(value).getDate();
  const startDate = new Date(start).getDate();
  const endDate = new Date(end).getDate();

  return date >= startDate && date <= endDate;
}

export function dateRangeFilterFn(card: LibraryCard, filterValue: any) {
  if (!filterValue.start && !filterValue.end) return true;

  const endDateString = filterValue.end ?? new Date().toISOString();

  return isDateInRange(card.createdAt, filterValue.start, endDateString);
}
