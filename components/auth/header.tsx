import Image from 'next/image';

import { Logo } from '../logo';

interface HeaderProps {
  label: string;
}

export function Header({ label }: HeaderProps) {
  return (
    <div className='w-full flex flex-col gap-y-2 items-center justify-center'>
      <div className='flex items-center gap-4'>
        <Logo withLabel />
      </div>
      <p className='text-muted-foreground text-sm'>{label}</p>
    </div>
  );
}
