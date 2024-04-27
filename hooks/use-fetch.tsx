import { useState, useMemo, useCallback, useEffect } from 'react';

type FetchState<TO> = {
  error?: string | null;
  data?: TO;
};

interface UseFetchOptions<TO> {
  onSuccess?: (data: TO) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

interface UseFetchReturn<TO> {
  data: TO | undefined;
  error: string | undefined;
  loading: boolean;
  refresh: () => void;
}

export function useFetch<TO>(
  action: () => Promise<FetchState<TO>>,
  options?: UseFetchOptions<TO>,
): UseFetchReturn<TO>;

export function useFetch<TI, TO>(
  action: (args: TI) => Promise<FetchState<TO>>,
  args: TI,
  options?: UseFetchOptions<TO>,
): UseFetchReturn<TO>;

export function useFetch<TI, TO>(
  action: (args?: TI) => Promise<FetchState<TO>>,
  initialArgs?: TI,
  options: UseFetchOptions<TO> = {},
): UseFetchReturn<TO> {
  const [data, setData] = useState<TO | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const args = useMemo(() => initialArgs, [initialArgs]);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      const result = await action(args);

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
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      options.onError?.(errorMsg);
    } finally {
      setLoading(false);
      options.onComplete?.();
    }
  }, [action, args, options]);

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error, loading, refresh: execute };
}
