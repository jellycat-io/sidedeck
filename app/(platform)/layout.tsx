import { Navbar } from './_components/navbar';

interface PlatformLayoutProps {
  children: React.ReactNode;
}

export default function PlatformLayout({ children }: PlatformLayoutProps) {
  return (
    <div className='h-screen'>
      <Navbar />
      <main className='p-8'>{children}</main>
    </div>
  );
}
