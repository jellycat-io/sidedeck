import { Navbar } from './_components/navbar';
import { Sidebar } from './_components/sidebar';

interface PlatformLayoutProps {
  children: React.ReactNode;
}

export default function PlatformLayout({ children }: PlatformLayoutProps) {
  return (
    <div>
      <Navbar />
      <div className='pt-14 md:grid md:grid-cols-[224px_auto] h-screen'>
        <aside className='py-6 px-4 hidden md:block border-r'>
          <Sidebar />
        </aside>
        <main className='px-8 py-6'>{children}</main>
      </div>
    </div>
  );
}
