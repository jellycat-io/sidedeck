'use client';

import { LoaderCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import { verifyEmailAction } from '@/actions/auth/email-verification';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { useAction } from '@/hooks/use-action';
import { Routes } from '@/routes';

export const EmailVerificationForm = () => {
  const [error, setError] = React.useState<string | undefined>('');
  const [success, setSuccess] = React.useState<string | undefined>('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { execute: verifyEmail, loading: verifyingEmail } = useAction(
    verifyEmailAction,
    {
      onError: setError,
      onSuccess: (data) => setSuccess(data.success),
    },
  );

  const onSubmit = React.useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError('Missing token.');
      return;
    }

    verifyEmail(token);
  }, [token, success, error, verifyEmail]);

  React.useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel='Confirm your email address'
      backButtonLabel='Back to login'
      backButtonHref={Routes.auth.login}
    >
      <div className='flex items-center w-full justify-center'>
        {verifyingEmail && <LoaderCircle className='text-xl animate-spin' />}
        {!success && <FormError message={error} />}
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
};
