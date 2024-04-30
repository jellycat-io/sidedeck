'use client';

import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useMobileSidebar } from '@/hooks/use-mobile-sidebar';

import { Sidebar } from './sidebar';

export function MobileSidebar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const open = useMobileSidebar((state) => state.open);
  const onOpen = useMobileSidebar((state) => state.onOpen);
  const onClose = useMobileSidebar((state) => state.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Button
        variant='ghost'
        className='flex md:hidden hover:-translate-y-0'
        onClick={onOpen}
        size='iconSm'
      >
        <Menu className='h-4 w-4' />
      </Button>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side='left'>
          <div className='pb-6'>
            <Logo withLabel />
          </div>
          <div className='pr-8'>
            <Sidebar storageKey='sd-mobile-sidebar-state' />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
