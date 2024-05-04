import { Footer } from './_components/footer';
import { Navbar } from './_components/navbar';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({
  children,
}: Readonly<LandingLayoutProps>) {
  return (
    <div className='bg-background text-foreground'>
      <Navbar />
      <main className='pt-20 pb-60'>{children}</main>
      <Footer />
    </div>
  );
}
