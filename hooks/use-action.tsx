import React from 'react';

import { ActionState } from '@/lib/create-safe-action';

type Action<TI, TO> = (data: TI) => Promise<ActionState<TI, TO>>;

interface UseActionOptions<TO> {
  onSuccess?: (data: TO) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

export function useAction<TI, TO>(
  action: Action<TI, TO>,
  options: UseActionOptions<TO> = {},
) {
  const [data, setData] = React.useState<TO | undefined>(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState<boolean>(false);

  const execute = React.useCallback(
    async (data: TI) => {
      setLoading(true);

      try {
        const result = await action(data);

        if (!result) return;

        if (result.error) {
          setError(result.error);
          options.onError?.(result.error);
        }

        if (result.data) {
          setData(result.data);
          options.onSuccess?.(result.data);
        }
      } catch (e) {
        setError(`An error occurred: ${e}`);
        options.onError?.('An error occurred');
      } finally {
        setLoading(false);
        options.onComplete?.();
      }
    },
    [action, options],
  );

  return { data, error, loading, execute };
}
