import { Eye } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface PanelActionLinkProps {
  href: string;
  children: React.ReactNode;
}

export function PanelActionLink({ href, children }: PanelActionLinkProps) {
  return (
    <Button
      variant='ghost'
      className='w-full hover:-translate-y-0 rounded-none'
      asChild
    >
      <Link href={href}>
        <Eye className='mr-2 w-4 h-4' />
        {children}
      </Link>
    </Button>
  );
}
