import { Github, Heart } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className='fixed bottom-0 bg-background w-full px-4 pt-6 pb-8 border-t'>
      <div className='md:max-w-screen-2xl mx-auto flex flex-col items-cemter w-full justify-between'>
        <div className='flex justify-between items-center w-full pb-6'>
          <div className='flex items-center space-x-2'>
            <Logo withLabel hideOnMobile />
            <p>&copy; {new Date().getFullYear()}</p>
          </div>
          <div className='space-y-1'>
            <p className='flex-1 flex justify-end items-center text-sm text-neutral-400'>
              Made with{' '}
              <Heart className='mx-2 w-4 h-4 text-rose-600 animate-pulse' /> by
              Jellycat Studio.
            </p>
            <p className='flex-1 flex justify-end items-center text-sm text-neutral-400'>
              Source code available on{' '}
              <Link
                className='ml-1.5 font-medium underline underline-offset-4'
                href='https://github.com/jellycat-io/sidedeck'
                target='_blank'
              >
                <span className='flex items-center gap-x-1'>
                  <Github className='w-4 h-4' />
                  Github
                </span>
              </Link>
              .
            </p>
          </div>
        </div>
        <div className='flex flex-col items-start justify-center w-full space-y-2'>
          <Button size='sm' variant='link' className='p-0' asChild>
            <Link href='/privacy-policy'>Privacy policy</Link>
          </Button>
          <Button size='sm' variant='link' className='p-0' asChild>
            <Link href='/terms-of-service'>Terms of service</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
