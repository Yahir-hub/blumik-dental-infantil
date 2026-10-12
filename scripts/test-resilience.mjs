import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { randomBytes, randomUUID, createHmac } from 'node:crypto';
import ts from 'typescript';
const dir = await mkdtemp(resolve('.qa/resilience-'));
for (const file of [
  'types',
  'config',
  'contracts',
  'validation',
  'loader',
  'local-store',
  'webhook',
]) {
  let code = ts.transpileModule(
    await readFile('lib/hyronix/' + file + '.ts', 'utf8'),
    {
      compilerOptions: {
        module: ts.ModuleKind.ES2022,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  code = code.replace(/from '(\.\/[^']+)'/g, "from '$1.mjs'");
  await writeFile(dir + '/' + file + '.mjs', code);
}
const { LocalStore } = await import(pathToFileURL(dir + '/local-store.mjs')),
  { refreshSnapshot } = await import(pathToFileURL(dir + '/loader.mjs')),
  { handleWebhook } = await import(pathToFileURL(dir + '/webhook.mjs'));
const site = 'site_' + 'a'.repeat(32),
  path = dir + '/state.sqlite',
  store = new LocalStore(path),
  secret = randomBytes(32).toString('hex');
const payload = (text, version) => ({
  site: {
    key: site,
    content_version: version,
    updated_at: new Date().toISOString(),
  },
  page: {
    name: 'Inicio',
    slug: '/',
    sections: [
      { key: 'hero', name: 'Hero', type: 'hero', fields: { title: text } },
    ],
    seo: {
      meta_title: text,
      meta_description: 'Description ' + text,
      canonical: 'https://blumikdentalinfantil.com/',
      robots: { index: true, follow: true },
      opengraph: { title: null, description: null, image: null },
      schema: { '@type': 'WebSite', name: text },
    },
  },
});
const load = (body) =>
  refreshSnapshot(
    'http://localhost:3000/api/content/v1',
    site,
    'home',
    store,
    async () =>
      Response.json(body, {
        headers: { ETag: '"' + body.site.content_version + '"' },
      }),
  );
await load(payload('Texto A', 40));
await load(payload('Texto B', 42));
assert.equal(
  (await store.get(site, 'home')).data.page.sections[0].fields.title,
  'Texto B',
);
await assert.rejects(() =>
  refreshSnapshot(
    'http://localhost/api/content/v1',
    site,
    'home',
    store,
    async () => {
      throw Error('API_OFF');
    },
  ),
);
for (const response of [
  new Response('{', { headers: { 'content-type': 'application/json' } }),
  Response.json({ page: [] }),
  Response.json({ ...payload('BAD', 43), draft_value: 'PRIVATE' }),
  Response.json(payload('OLD', 41)),
]) {
  try {
    await refreshSnapshot(
      'http://localhost/api/content/v1',
      site,
      'home',
      store,
      async () => response,
    );
  } catch {}
  assert.equal((await store.get(site, 'home')).contentVersion, 42);
}
let conditional = false;
await refreshSnapshot(
  'http://localhost/api/content/v1',
  site,
  'home',
  store,
  async (_u, o) => {
    conditional = !!o.headers['If-None-Match'];
    return new Response(null, { status: 304 });
  },
);
assert.ok(conditional);
await Promise.all([load(payload('NEW', 44)), load(payload('OLDER', 43))]);
assert.equal((await store.get(site, 'home')).contentVersion, 44);
store.close();
const restarted = new LocalStore(path);
assert.equal((await restarted.get(site, 'home')).contentVersion, 44);
let invalidations = 0;
const now = Date.now();
const event = (version = 50, extra = {}) => ({
  event_id: randomUUID(),
  site_key: site,
  content_version: version,
  published_at: new Date(now).toISOString(),
  affected_slugs: ['home'],
  event_type: 'content.published',
  ...extra,
});
function request(
  body,
  {
    timestamp = String(Math.floor(now / 1000)),
    sign = true,
    signature,
    contentType = 'application/json',
    headers = {},
  } = {},
) {
  const raw = typeof body === 'string' ? body : JSON.stringify(body);
  return new Request('http://localhost/api/hyronix/revalidate', {
    method: 'POST',
    headers: {
      'content-type': contentType,
      'x-hyronix-timestamp': timestamp,
      'x-hyronix-event-id': body.event_id ?? randomUUID(),
      ...(sign
        ? {
            'x-hyronix-signature':
              signature ??
              'sha256=' +
                createHmac('sha256', secret)
                  .update(timestamp + '.' + raw)
                  .digest('hex'),
          }
        : {}),
      ...headers,
    },
    body: raw,
  });
}
const deps = {
  secret,
  site,
  store: () => restarted,
  now: () => now,
  invalidate: async () => {
    invalidations++;
  },
  prewarm: async () => false,
};
const send = (body, options, d = deps) =>
  handleWebhook(request(body, options), d);
for (const options of [
  { sign: false },
  { signature: 'sha256=' + '0'.repeat(64) },
  { timestamp: String(Math.floor(now / 1000) - 301) },
  { timestamp: String(Math.floor(now / 1000) + 301) },
])
  assert.equal((await send(event(), options)).status, 401);
assert.equal((await send(event(), { contentType: 'text/plain' })).status, 415);
assert.equal(
  (await send(event(), { headers: { 'content-length': '9000' } })).status,
  413,
);
assert.equal((await send('x'.repeat(9000))).status, 413);
for (const invalid of [
  { site_key: 'site_' + 'b'.repeat(32) },
  { affected_slugs: ['https://evil.test'] },
  { affected_slugs: ['../admin'] },
  { draft_value: 'private' },
  { content_version: -1 },
])
  assert.equal((await send(event(50, invalid))).status, 400);
const same = event();
assert.equal((await send(same)).status, 200);
assert.equal((await (await send(same)).json()).result, 'duplicate');
assert.equal((await send({...same,content_version:51})).status,409);
assert.equal((await send('{')).status,400);
assert.equal(invalidations, 1);
assert.equal((await (await send(event(49))).json()).result, 'obsolete');
assert.equal(invalidations, 1);
let unlock;
const gate = new Promise((resolve) => {
  unlock = resolve;
});
const concurrent = event(51);
const first = send(
  concurrent,
  {},
  {
    ...deps,
    invalidate: async () => {
      await gate;
      invalidations++;
    },
  },
);
await new Promise((resolve) => setTimeout(resolve, 10));
assert.equal((await send(concurrent)).status, 409);
unlock();
assert.equal((await first).status, 200);
assert.equal(invalidations, 2);
// Older events for a DIFFERENT resource must still invalidate that resource.
assert.equal(
  (await send(event(48, { affected_slugs: ['servicios'] }))).status,
  200,
);
const failed = event(52);
assert.equal(
  (
    await send(
      failed,
      {},
      {
        ...deps,
        invalidate: async () => {
          throw Error('test');
        },
      },
    )
  ).status,
  503,
);
assert.equal((await send(failed)).status, 200);
restarted.close();
const reopened = new LocalStore(path);
assert.equal(
  (await send(failed, {}, { ...deps, store: () => reopened })).status,
  200,
);
reopened.close();
const rateStore = new LocalStore(dir + '/rate.sqlite');
const rateDeps = { ...deps, store: () => rateStore };
for (let i = 0; i < 10; i++)
  assert.equal((await send(event(100 + i), {}, rateDeps)).status, 200);
const limited = await send(event(120), {}, rateDeps);
assert.equal(limited.status, 429);
assert.ok(limited.headers.get('retry-after'));
rateStore.close();
await writeFile(
  '.qa/resilience-results.json',
  JSON.stringify(
    {
      status: 'PASS',
      date: new Date().toISOString(),
      checks: [
        'A→B→outage retains B',
        'corrupt JSON/schema/draft rejected',
        'version CAS and concurrent writes',
        'snapshot restart durable locally',
        'ETag 304',
        'HMAC and time window',
        'body/type/schema/site/slug allowlists',
        'duplicate/concurrent/restart replay',
        'per-resource ordering',
        'failure releases lease',
        'rate limit and Retry-After',
      ],
    },
    null,
    2,
  ),
);
console.log(
  'PASS: snapshot, restart, corrupt/old responses, webhook security, concurrency, rate limit.',
);
