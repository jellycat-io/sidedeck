'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { resetPassword } from '@/actions/auth/reset-password';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Routes } from '@/routes';
import { ResetPasswordSchema } from '@/schemas/auth';

export const ResetPasswordForm = () => {
  const [error, setError] = React.useState<string | undefined>('');
  const [success, setSuccess] = React.useState<string | undefined>('');
  const [isPending, startTransition] = React.useTransition();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit, control } = form;

  function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    if (success || error) return;

    if (!token) {
      setError('Missing token.');
      return;
    }

    startTransition(() => {
      resetPassword(token, values).then((data) =>
        data.error ? setError(data.error) : setSuccess(data.success),
      );
    });
  }

  return (
    <CardWrapper
      headerLabel='Reset your password'
      backButtonLabel='Back to login'
      backButtonHref={Routes.auth.login}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              name='password'
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='password'>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      id='password'
                      placeholder='Enter your password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='confirmPassword'
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='confirmPassword'>
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='password'
                      id='confirmPassword'
                      placeholder='Confirm your password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending && (
              <LoaderCircle className='mr-2 w-4 h-4 animate-spin' />
            )}
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
