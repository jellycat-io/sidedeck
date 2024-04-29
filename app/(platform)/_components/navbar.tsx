import { DoorOpen, Github } from 'lucide-react';
import Link from 'next/link';

import { CardFinder } from '@/components/card-finder';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/user-button';
import { Routes } from '@/routes';

export function Navbar() {
  return (
    <nav className='sticky top-0 w-full z-20 h-14 px-4 border-b shadow-sm flex items-center bg-background'>
      <div className='md:max-w-screen-2xl mx-auto flex items-center w-full justify-between'>
        <Logo withLabel hideOnMobile />
        <div className='flex space-x-4 md:w-auto items-center justify-between w-full'>
          <CardFinder />
          <div className='flex space-x-2 items-center'>
            <UserButton />
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
