import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { cn, snakeCaseToCapitalized } from '@/lib/utils';

interface SidebarBlockProps {
  id: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  isExpanded: boolean;
  onExpand: (id: string) => void;
  items: SidebarBlockItemProps[];
}

export function SidebarBlock({
  id,
  icon,
  disabled,
  isExpanded,
  items,
  onExpand,
}: SidebarBlockProps) {
  useEffect(() => {
    if (disabled && isExpanded) {
      onExpand(id);
    }
  }, [disabled, id, isExpanded, onExpand]);

  return (
    <AccordionItem value={id} className='border-none'>
      <AccordionTrigger
        disabled={disabled}
        className={cn(
          'flex items-center gap-x-2 h-9 px-3 rounded-md transition text-start no-underline hover:no-underline hover:bg-accent hover:text-accent-foreground font-medium text-sm disabled:text-muted-foreground [&>svg]:disabled:hidden disabled:hover:bg-transparent',
        )}
        onClick={() => onExpand(id)}
      >
        <div className='flex items-center gap-x-2'>
          {icon}
          {snakeCaseToCapitalized(id)}
        </div>
      </AccordionTrigger>
      {!disabled && (
        <AccordionContent>
          {items.map((item) => (
            <div key={item.href} className='w-full pl-4'>
              <SidebarBlockItem
                href={item.href}
                disabled={item.disabled}
                icon={item.icon}
                label={item.label}
              />
            </div>
          ))}
        </AccordionContent>
      )}
    </AccordionItem>
  );
}

interface SidebarBlockItemProps {
  href: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function SidebarBlockItem({
  href,
  label,
  disabled,
  icon,
}: SidebarBlockItemProps) {
  const pathname = usePathname();

  const isActive = useMemo(() => pathname === href, [pathname, href]);

  return (
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
        {label}
      </Link>
    </Button>
  );
}