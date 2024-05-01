'use client';

import { useSession } from 'next-auth/react';

// import { useLibrary } from '@/hooks/use-library';

import { LibraryTable } from './_components/library-table';

export default function DashboardPage() {
  const session = useSession();

  if (!session.data?.user.id) {
    return null;
  }

  // const { cards, loading } = useLibrary();

  return (
    <div className='space-y-12'>
      <h1 className='text-2xl'>Library</h1>
      <LibraryTable />
    </div>
  );
}
