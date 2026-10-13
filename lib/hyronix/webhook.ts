import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { SLUGS, isSlug, routeFor, tagsFor } from './config';
import { record } from './types';
import { readBounded } from './loader';
import type { WebhookEvent, WebhookReplayStore } from './contracts';
const UUID =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
export function eventValid(v: unknown, site: string): v is WebhookEvent {
  return (
    record(v) &&
    Object.keys(v).sort().join(',') ===
      'affected_slugs,content_version,event_id,event_type,published_at,site_key' &&
    typeof v.event_id === 'string' &&
    UUID.test(v.event_id) &&
    v.site_key === site &&
    Number.isSafeInteger(v.content_version) &&
    Number(v.content_version) > 0 &&
    typeof v.published_at === 'string' &&
    Number.isFinite(Date.parse(v.published_at)) &&
    [
      'content.published',
      'settings.updated',
      'post.published',
      'media.updated',
    ].includes(String(v.event_type)) &&
    Array.isArray(v.affected_slugs) &&
    v.affected_slugs.length <= 7 &&
    v.affected_slugs.every(isSlug) &&
    new Set(v.affected_slugs).size === v.affected_slugs.length &&
    (v.event_type !== 'content.published' || v.affected_slugs.length > 0)
  );
}
export function eventScope(event: WebhookEvent) {
  const global =
    event.event_type === 'settings.updated' ||
    event.event_type === 'media.updated';
  const slugs = global ? [...SLUGS] : event.affected_slugs.filter(isSlug);
  const resources = [
    ...(event.event_type === 'settings.updated' ? ['settings'] : []),
    ...slugs,
  ];
  if (event.event_type === 'post.published') resources.push('posts');
  const tags = [
    ...new Set(
      resources.map((r) =>
        r === 'posts'
          ? `hyronix:posts:${event.site_key}`
          : tagsFor(event.site_key, r)[1],
      ),
    ),
  ];
  return { resources, tags, paths: slugs.map(routeFor) };
}
type Dependencies = {
  secret: string | undefined;
  site: string | undefined;
  store: () => WebhookReplayStore;
  invalidate: (tags: string[], paths: string[]) => Promise<void>;
  prewarm?: (resources: string[]) => Promise<boolean>;
  now?: () => number;
};
export async function handleWebhook(
  request: Request,
  deps: Dependencies,
): Promise<Response> {
  const start = Date.now(),
    now = deps.now?.() ?? start;
  const reply = (status: number, result: string, retry?: number) =>
    Response.json(
      { result },
      {
        status,
        headers: {
          'Cache-Control': 'no-store',
          ...(retry ? { 'Retry-After': String(retry) } : {}),
        },
      },
    );
  if (!deps.secret || deps.secret.length < 32 || !deps.site)
    return reply(503, 'not_configured');
  if (
    request.headers.get('content-type')?.split(';')[0].trim() !==
    'application/json'
  )
    return reply(415, 'content_type');
  if (Number(request.headers.get('content-length')) > 8192)
    return reply(413, 'body_limit');
  const timestamp = request.headers.get('x-hyronix-timestamp') ?? '',
    signature = request.headers.get('x-hyronix-signature') ?? '',
    id = request.headers.get('x-hyronix-event-id') ?? '';
  if (
    !/^\d{10}$/.test(timestamp) ||
    Math.abs(now / 1000 - Number(timestamp)) > 300 ||
    !/^sha256=[a-f0-9]{64}$/.test(signature) ||
    !UUID.test(id)
  )
    return reply(401, 'unauthorized');
  let raw: string;
  try {
    raw = await readBounded(new Response(request.body), 8192);
  } catch {
    return reply(413, 'body_limit');
  }
  const expected = createHmac('sha256', deps.secret)
    .update(timestamp + '.' + raw)
    .digest();
  if (!timingSafeEqual(expected, Buffer.from(signature.slice(7), 'hex')))
    return reply(401, 'unauthorized');
  let event: unknown;
  try {
    event = JSON.parse(raw);
  } catch {
    return reply(400, 'invalid_event');
  }
  if (!eventValid(event, deps.site) || event.event_id !== id)
    return reply(400, 'invalid_event');
  const scope = eventScope(event);
  let token: string | undefined;
  try {
    const store = deps.store();
    const reserved = await store.begin(
      event,
      createHash('sha256').update(raw).digest('hex'),
      scope.resources,
      now,
    );
    if (reserved.status === 'limited')
      return reply(429, 'rate_limited', reserved.retryAfter);
    if (reserved.status === 'busy')
      return reply(409, 'in_progress', reserved.retryAfter);
    if (reserved.status === 'conflict') return reply(409, 'event_conflict');
    if (reserved.status === 'duplicate' || reserved.status === 'obsolete')
      return reply(200, reserved.status);
    if (reserved.status !== 'accepted') return reply(503, 'retry_later', 2);
    token = reserved.token;
    // Warm validated snapshots before invalidation; no arbitrary URL or self-request.
    // A failure leaves prior snapshots intact and does not undo successful invalidation.
    let warmed = false;
    if (deps.prewarm)
      try {
        warmed = await deps.prewarm(
          scope.resources.filter((r) => r !== 'posts'),
        );
      } catch {}
    await deps.invalidate(scope.tags, scope.paths);
    await store.complete(event, reserved.token, scope.resources, now);
    console.info(
      '[Hyronix webhook]',
      JSON.stringify({
        event_id: id,
        site_key: event.site_key,
        content_version: event.content_version,
        event_type: event.event_type,
        result: 'invalidated',
        routes: scope.paths,
        prewarm: warmed,
        latency: Date.now() - start,
      }),
    );
    return reply(200, warmed ? 'invalidated_and_warmed' : 'invalidated');
  } catch (error) {
    const code = error instanceof Error && ['INVALID_STORE_CONFIG','DURABLE_STORE_UNAVAILABLE','INVALID_RESERVATION','EMPTY_BODY'].includes(error.message) ? error.message : 'WEBHOOK_PROCESSING_FAILED';
    console.warn('[Hyronix webhook]', JSON.stringify({ event_id: id, result: code }));
    if (token)
      await deps
        .store()
        .release(event, token)
        .catch(() => {});
    return reply(503, 'retry_later', 2);
  }
}
