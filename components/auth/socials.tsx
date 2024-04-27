'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

export function Socials() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  function handleClick(provider: 'google' | 'github') {
    signIn(provider, {
      callbackUrl: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
    });
  }

  return (
    <div className='flex items-center w-full gap-x-6'>
      <Button
        size='lg'
        variant='outline'
        className='w-full'
        onClick={() => handleClick('google')}
      >
        <FcGoogle className='mr-2 h-4 w-4' />
        Sign in with Google
      </Button>
    </div>
  );
}
