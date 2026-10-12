import 'server-only';
import { resolve } from 'node:path';
import { LocalStore } from './local-store';
import type { SnapshotStore, WebhookReplayStore } from './contracts';
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
export const snapshotStore = (): SnapshotStore => local();
export const replayStore = (): WebhookReplayStore => local();
