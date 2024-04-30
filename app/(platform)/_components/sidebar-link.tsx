'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function SidebarLink({
  href,
  children,
  disabled,
  icon,
}: SidebarLinkProps) {
  const pathname = usePathname();

  const isActive = useMemo(() => {
    return pathname === href;
  }, [pathname, href]);

  return (
    <div className='w-full'>
      <Button
        variant='ghost'
        size='sm'
        className={cn(
          'w-full hover:-translate-y-0 justify-start',
          isActive && 'bg-accent text-accent-foreground',
        )}
        disabled={disabled}
      >
        <Link href={href} className='flex items-center gap-x-2'>
          {icon}
          {children}
        </Link>
      </Button>
    </div>
  );
}
