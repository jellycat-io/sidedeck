export type FetchState<TO> = {
  error?: string | null;
  data?: TO;
};

// Overload for a handler without arguments
export function createSafeFetch<TO>(
  handler: () => Promise<FetchState<TO>>,
): () => Promise<FetchState<TO>>;

// Overload for a handler with arguments
export function createSafeFetch<TI, TO>(
  handler: (args: TI) => Promise<FetchState<TO>>,
): (args: TI) => Promise<FetchState<TO>>;

// Implementation that handles both cases
export function createSafeFetch<TI, TO>(
  handler:
    | ((args: TI) => Promise<FetchState<TO>>)
    | (() => Promise<FetchState<TO>>),
): (args?: TI) => Promise<FetchState<TO>> {
  return async (args?: TI): Promise<FetchState<TO>> => {
    // Check if the handler expects an argument
    if (args !== undefined) {
      return handler(args);
    } else {
      // Cast the handler to the no-argument version because we know args is undefined
      return (handler as () => Promise<FetchState<TO>>)();
    }
  };
}
