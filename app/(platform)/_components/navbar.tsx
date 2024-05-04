'use client';

import { Github } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { CardFinder } from '@/components/card-finder/card-finder';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/user-button';

import { MobileSidebar } from './mobile-sidebar';

export function Navbar() {
  const session = useSession();

  if (!session) {
    return null;
  }

  return (
    <nav className='fixed top-0 w-full z-50 h-14 px-4 border-b shadow-sm flex items-center bg-background'>
      <div className='flex items-center gap-x-4 w-full md:justify-between'>
        <MobileSidebar />
        <div className='hidden md:flex pr-4 md:pr-2'>
          <Logo withLabel />
        </div>
        <div className='w-full flex justify-between md:justify-end md:space-x-4'>
          <CardFinder />
          <div className='flex space-x-4 items-center'>
            <UserButton user={session.data?.user} />
            <Link
              href='https://github.com/jellycat-io/sidedeck'
              target='_blank'
            >
              <Button variant='ghost' size='iconSm'>
                <Github className='w-4 h-4' />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
