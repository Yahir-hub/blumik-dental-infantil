import 'server-only';
import { resolve } from 'node:path';
import { LocalStore } from '@/lib/hyronix/local-store';
import type { SnapshotStore, WebhookReplayStore } from './contracts';
import { PostgresStore } from './postgres-store';
let store: LocalStore | undefined;
function local() {
  if (
    process.env.HYRONIX_STORE_DRIVER !== 'local' ||
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME
  )
    throw Error('DURABLE_STORE_NOT_CONFIGURED');
  const path = process.env.HYRONIX_LOCAL_STORE_PATH;
  if (!path) throw Error('LOCAL_STORE_PATH_REQUIRED');
  return (store ??= new LocalStore(resolve(path)));
}
// Provider integration point: both adapters must meet the atomic contract documented in 5C.
function configured(): SnapshotStore & WebhookReplayStore {
  if (process.env.HYRONIX_STORE_DRIVER !== 'postgres') return local();
  return new PostgresStore({
    url: process.env.HYRONIX_STORE_URL ?? '',
    publishableKey: process.env.HYRONIX_STORE_PUBLISHABLE_KEY ?? '',
    token: process.env.HYRONIX_STORE_TOKEN ?? '',
    namespace: process.env.HYRONIX_STORE_NAMESPACE ?? '',
    site: process.env.HYRONIX_SITE_KEY ?? '',
  });
}
export const snapshotStore = (): SnapshotStore => configured();
export const replayStore = (): WebhookReplayStore => configured();
