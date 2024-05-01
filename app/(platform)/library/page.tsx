'use client';

import { useLibrary } from '@/hooks/use-library';

import { LibraryTable } from './_components/library-table';

export default function DashboardPage() {
  const { cards, loading } = useLibrary();

  return (
    <div className='space-y-8'>
      <h1 className='text-2xl'>Library</h1>
      <LibraryTable data={cards} loading={loading} />
    </div>
  );
}
