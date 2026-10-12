import 'server-only';
import { revalidatePath, revalidateTag } from 'next/cache';
import { handleWebhook } from '@/lib/hyronix/webhook';
import { replayStore } from '@/lib/hyronix/stores';
import { prewarmResources } from '@/lib/hyronix/client';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  return handleWebhook(request, {
    secret: process.env.HYRONIX_WEBHOOK_SECRET,
    site: process.env.HYRONIX_SITE_KEY,
    store: replayStore,
    prewarm:
      process.env.HYRONIX_PREWARM === 'false' ? undefined : prewarmResources,
    invalidate: async (tags, paths) => {
      for (const tag of tags) revalidateTag(tag, { expire: 0 });
      for (const path of paths) revalidatePath(path);
    },
  });
}
