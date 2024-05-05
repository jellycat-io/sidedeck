'use client';

import { useLibrary } from '@/hooks/use-library';

import { LibraryTable } from './_components/library-table';

export default function DashboardPage() {
  const { cards } = useLibrary();

  return (
    <div className='flex flex-col gap-y-4'>
      <h1 className='text-xl font-semibold'>Library</h1>
      <LibraryTable data={cards} />
    </div>
  );
}
