import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function LinkButton({ href, children, className }: LinkButtonProps) {
  return (
    <Button variant='link' size='sm' className={className} asChild>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
