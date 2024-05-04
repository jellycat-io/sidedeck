import { LoaderCircle } from 'lucide-react';

import { ButtonProps, Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionButtonProps extends ButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function ActionButton({
  children,
  loading,
  icon,
  className,
  ...props
}: ActionButtonProps) {
  return (
    <Button {...props} className={cn('gap-x-2', className)}>
      {loading ? (
        <LoaderCircle className='h-4 w-4 animate-spin' />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </Button>
  );
}
