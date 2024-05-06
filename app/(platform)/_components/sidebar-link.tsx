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
      <Link href={href}>
        <Button
          variant='ghost'
          size='sm'
          className={cn(
            'w-full justify-start gap-x-2',
            isActive && 'bg-accent text-accent-foreground',
          )}
          disabled={disabled}
        >
          {icon}
          {children}
        </Button>
      </Link>
    </div>
  );
}
