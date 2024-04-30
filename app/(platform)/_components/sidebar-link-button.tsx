import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface SidebarLinkButtonProps {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SidebarLinkButton({
  href,
  children,
  disabled,
}: SidebarLinkButtonProps) {
  return (
    <Button
      variant='ghost'
      size='icon'
      className='ml-auto'
      asChild
      disabled={disabled}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}