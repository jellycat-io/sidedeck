import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { PanelActionButton } from './panel-action-button';
import { PanelActionLink } from './panel-action-link';

interface DashboardPanelProps {
  title: string;
  children: React.ReactNode;
  link?: string;
  linkLabel?: string;
  action?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  actionLabel?: string;
}

export function DashboardPanel({
  title,
  children,
  link,
  linkLabel,
  action,
  actionLabel,
}: DashboardPanelProps) {
  return (
    <Card className='overflow-hidden'>
      <CardHeader className='pt-4 pb-2'>
        <CardTitle className='text-lg'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='pb-2 px-4'>{children}</CardContent>
      <CardFooter className='p-0'>
        {link && <PanelActionLink href={link}>{linkLabel}</PanelActionLink>}
        {action && (
          <PanelActionButton action={action}>{actionLabel}</PanelActionButton>
        )}
      </CardFooter>
    </Card>
  );
}
