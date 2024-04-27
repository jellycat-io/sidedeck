import { TriangleAlert } from 'lucide-react';

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className='flex items-center gap-x-2 text-sm p-3 rounded-md bg-destructive/15 text-destructive'>
      <TriangleAlert className='h-4 w-4' />
      <p>{message}</p>
    </div>
  );
}
