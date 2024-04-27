export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className='h-full flex items-center justify-center p-8'
      suppressHydrationWarning
    >
      {children}
    </main>
  );
}
