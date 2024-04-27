'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface BackButtonProps {
  label: string;
  href: string;
}

export function BackButton({ label, href }: BackButtonProps) {
  return (
    <Button variant='link' size='sm' className='font-normal w-full' asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
}
