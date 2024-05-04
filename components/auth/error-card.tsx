import { CardWrapper } from '@/components/auth/card-wrapper';
import { Routes } from '@/routes';

export function ErrorCard() {
  return (
    <CardWrapper
      headerLabel='Oops! Something went wrong.'
      backButtonLabel='Back to login'
      backButtonHref={Routes.auth.login}
    />
  );
}
