import { CircleCheck } from 'lucide-react';

interface FormSuccessProps {
  message?: string;
}

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null;

  return (
    <div className='flex items-center gap-x-2 text-sm p-2 rounded-md bg-success/15 text-success'>
      <CircleCheck className='h-8 w-8' />
      <p>{message}</p>
    </div>
  );
}
