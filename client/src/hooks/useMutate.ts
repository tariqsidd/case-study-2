import { useCallback, useMemo, useRef, useState } from 'react';

export type MutationStatus = 'idle' | 'pending' | 'success' | 'error';

export interface UseMutateOptions<TData = unknown, TError = Error, TVariables = unknown> {
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: TError, variables: TVariables) => void | Promise<void>;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void | Promise<void>;
}

export interface UseMutateResult<TData = unknown, TError = Error, TVariables = unknown> {
  data: TData | undefined;
  error: TError | null;
  status: MutationStatus;
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  mutate: (variables: TVariables, opts?: UseMutateOptions<TData, TError, TVariables>) => void;
  mutateAsync: (variables: TVariables, opts?: UseMutateOptions<TData, TError, TVariables>) => Promise<TData>;
  reset: () => void;
}

export function useMutate<TData = unknown, TError = Error, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutateOptions<TData, TError, TVariables> = {}
): UseMutateResult<TData, TError, TVariables> {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<TError | null>(null);
  const [status, setStatus] = useState<MutationStatus>('idle');
  const mountedRef = useRef(true);

  const baseOptionsRef = useRef(options);
  baseOptionsRef.current = options;

  const safeSet = useCallback(<K extends 'data' | 'error' | 'status'>(key: K, value: any) => {
    if (!mountedRef.current) return;
    if (key === 'data') setData(value);
    if (key === 'error') setError(value);
    if (key === 'status') setStatus(value);
  }, []);

  const reset = useCallback(() => {
    safeSet('data', undefined);
    safeSet('error', null);
    safeSet('status', 'idle');
  }, [safeSet]);

  const run = useCallback(async (variables: TVariables, local?: UseMutateOptions<TData, TError, TVariables>) => {
    const merged = { ...baseOptionsRef.current, ...(local || {}) } as UseMutateOptions<TData, TError, TVariables>;
    safeSet('status', 'pending');
    safeSet('error', null);

    try {
      const result = await mutationFn(variables);
      safeSet('data', result);
      safeSet('status', 'success');
      if (merged.onSuccess) await merged.onSuccess(result, variables);
      if (merged.onSettled) await merged.onSettled(result, null, variables);
      return result;
    } catch (err: any) {
      const e = (err instanceof Error ? err : new Error(String(err))) as unknown as TError;
      safeSet('error', e);
      safeSet('status', 'error');
      if (merged.onError) await merged.onError(e, variables);
      if (merged.onSettled) await merged.onSettled(undefined, e as any, variables);
      throw e;
    }
  }, [mutationFn, safeSet]);

  const mutate = useCallback((variables: TVariables, opts?: UseMutateOptions<TData, TError, TVariables>) => {
    run(variables, opts).catch(() => void 0);
  }, [run]);

  const mutateAsync = useMemo(() => run, [run]);

  return {
    data,
    error,
    status,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    mutate,
    mutateAsync,
    reset,
  };
}
