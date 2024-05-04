'use client';

import { usePathname } from 'next/navigation';

import { logout } from '@/actions/auth/logout';

interface LogoutButtonProps {
  children: React.ReactNode;
}

export function LogoutButton({ children }: LogoutButtonProps) {
  const pathName = usePathname();
  const handleClick = () => {
    logout(pathName);
  };

  return (
    <span className='cursor-pointer' onClick={handleClick}>
      {children}
    </span>
  );
}
