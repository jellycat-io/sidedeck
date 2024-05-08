interface ViewDeckPageProps {
  params: {
    id: string;
  };
}

export default function ViewDeckPage({ params }: ViewDeckPageProps) {
  const { id } = params;

  return (
    <div className='flex flex-col gap-y-4' suppressHydrationWarning>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl font-semibold'>View deck {id}</h1>
      </div>
    </div>
  );
}
