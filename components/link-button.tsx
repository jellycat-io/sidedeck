import Link from 'next/link';

import { Button, ButtonProps } from '@/components/ui/button';

interface LinkButtonProps extends ButtonProps {
  href: string;
}

export function LinkButton({
  href,
  children,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Button variant='link' size='sm' className={className} asChild {...props}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
