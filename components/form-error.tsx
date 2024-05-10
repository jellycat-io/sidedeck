import { TriangleAlert } from 'lucide-react';

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className='flex items-center gap-x-2 text-sm p-2 rounded-md bg-destructive/15 text-destructive'>
      <TriangleAlert className='h-8 w-8' />
      <p>{message}</p>
    </div>
  );
}
