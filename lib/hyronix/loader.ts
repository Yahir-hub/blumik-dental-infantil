import type { SnapshotStore, Snapshot } from './contracts';
import { validatedSnapshot } from './validation';
import { TIMEOUT_MS } from './config';
export async function readBounded(response: Response, max: number) {
  if (Number(response.headers.get('content-length')) > max)
    throw Error('BODY_LIMIT');
  const reader = response.body?.getReader();
  if (!reader) throw Error('EMPTY_BODY');
  let size = 0;
  const chunks: Uint8Array[] = [];
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      void reader.cancel().catch(() => {});
      reject(Error('BODY_TIMEOUT'));
    }, 5000);
  });
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), timeout]);
      if (done) break;
      size += value.byteLength;
      if (size > max) throw Error('BODY_LIMIT');
      chunks.push(value);
    }
  } finally {
    clearTimeout(timer);
    await reader.cancel().catch(() => {});
  }
  // Reject malformed UTF-8: the HMAC string then represents the exact request bytes.
  return new TextDecoder('utf-8', { fatal: true }).decode(
    Buffer.concat(chunks),
  );
}
export async function refreshSnapshot(
  base: string,
  site: string,
  resource: string,
  store: SnapshotStore,
  fetcher: typeof fetch = fetch,
): Promise<Snapshot> {
  const start = Date.now();
  let status = 0;
  const previous = await store.get(site, resource);
  try {
    const path = resource === 'settings' ? '' : '/pages/' + resource;
    const response = await fetcher(
      `${base.replace(/\/$/, '')}/sites/${site}${path}`,
      {
        // Network only on a validated Data Cache miss; raw/untrusted responses never enter Next cache.
        cache: 'no-store',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: {
          Accept: 'application/json',
          ...(previous?.etag ? { 'If-None-Match': previous.etag } : {}),
        },
      },
    );
    status = response.status;
    if (status === 304 && previous) return previous;
    if (status !== 200) throw Error('API_UNAVAILABLE');
    if (!response.headers.get('content-type')?.includes('application/json'))
      throw Error('INVALID_CONTENT_TYPE');
    const value = validatedSnapshot(
      JSON.parse(await readBounded(response, 1000000)),
      site,
      resource,
      response.headers.get('etag'),
    );
    if (!value) throw Error('INVALID_PUBLIC_PAYLOAD');
    return await store.set(value);
  } finally {
    console.info(
      '[Hyronix]',
      JSON.stringify({
        route: resource,
        status,
        latency: Date.now() - start,
        operation: 'refresh',
      }),
    );
  }
}
