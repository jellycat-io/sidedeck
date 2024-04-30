import { Button } from '@/components/ui/button';

interface PanelActionButtonProps {
  action: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
}

export function PanelActionButton({
  action,
  children,
}: PanelActionButtonProps) {
  return (
    <Button variant='ghost' className='w-full' onClick={action}>
      {children}
    </Button>
  );
}
