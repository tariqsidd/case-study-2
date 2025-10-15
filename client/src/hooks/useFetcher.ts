import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface UseFetcherOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  auto?: boolean; // auto-fetch on mount and when deps change
  deps?: any[]; // dependencies to re-fetch on change
}

export interface UseFetcherResult<TResponse> {
  data: TResponse | null;
  error: Error | null;
  loading: boolean;
  refetch: () => Promise<void>;
  abort: () => void;
}

const getBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  return envUrl ?? 'http://localhost:5001';
};

export function useFetcher<TResponse = unknown, TBody = unknown>(
  path: string,
  { method = 'GET', body, headers, auto = true, deps = [] }: UseFetcherOptions<TBody> = {}
): UseFetcherResult<TResponse> {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const controllerRef = useRef<AbortController | null>(null);

  const url = useMemo(() => {
    const base = getBaseUrl();
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalized}`;
  }, [path]);

  const doFetch = useCallback(async () => {
    // Abort in-flight
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const isJson = body !== undefined && body !== null;
      const res = await fetch(url, {
        method,
        headers: {
          'Accept': 'application/json',
          ...(isJson ? { 'Content-Type': 'application/json' } : {}),
          ...(headers || {}),
        },
        body: isJson ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Request failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`);
      }

      const contentType = res.headers.get('content-type') || '';
      const parsed = contentType.includes('application/json') ? await res.json() : await res.text();
      setData(parsed as TResponse);
    } catch (err: any) {
      if (err?.name === 'AbortError') return; // ignore abort errors
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [url, method, JSON.stringify(body), JSON.stringify(headers)]);

  useEffect(() => {
    if (!auto) return;
    doFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doFetch, ...deps]);

  const abort = useCallback(() => {
    if (controllerRef.current) controllerRef.current.abort();
  }, []);

  return { data, error, loading, refetch: doFetch, abort };
}
