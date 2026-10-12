import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { randomBytes, randomUUID, createHmac } from 'node:crypto';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
const dir = await mkdtemp(resolve('.qa/cache-')),
  key = process.env.HYRONIX_SITE_KEY,
  api = process.env.HYRONIX_CONTENT_API_URL;
const slugs = ['home', 'servicios', 'preguntas-frecuentes'];
const payloads = new Map();
for (const resource of ['settings', ...slugs]) {
  const r = await fetch(
    `${api}/sites/${key}${resource === 'settings' ? '' : '/pages/' + resource}`,
  );
  assert.equal(r.status, 200);
  payloads.set(resource, await r.json());
}
let mode = 'A',
  version = 40,
  requests = 0,
  notModified = 0;
const secret = randomBytes(32).toString('hex');
const proxy = createServer((req, res) => {
  requests++;
  if (mode === 'down') {
    res.writeHead(503);
    res.end();
    return;
  }
  if (mode === 'invalid-json') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end('{');
    return;
  }
  if (mode === 'invalid-shape') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end('{"page":[]}');
    return;
  }
  const resource = req.url.includes('/pages/')
    ? req.url.split('/pages/')[1]
    : 'settings';
  const payload = structuredClone(payloads.get(resource));
  if (!payload) {
    res.writeHead(404);
    res.end();
    return;
  }
  payload.site.content_version = version;
  if (payload.page) {
    payload.page.sections.find((s) => s.key === 'hero').fields.title =
      'Texto ' + mode;
    payload.page.seo.meta_title = 'SEO ' + mode;
  } else payload.site_settings.address = 'DIRECCION ' + mode;
  if (mode === 'draft') payload.draft_value = 'MUST_NOT_CACHE';
  const etag = '"' + version + '-' + resource + '"';
  if (req.headers['if-none-match'] === etag) {
    notModified++;
    res.writeHead(304);
    res.end();
    return;
  }
  res.writeHead(200, { 'content-type': 'application/json', etag });
  res.end(JSON.stringify(payload));
});
await new Promise((resolve) => proxy.listen(0, '127.0.0.1', resolve));
const port = proxy.address().port;
const env = {
  ...process.env,
  HYRONIX_CONTENT_API_URL: `http://127.0.0.1:${port}/api/content/v1`,
  HYRONIX_WEBHOOK_SECRET: secret,
  HYRONIX_STORE_DRIVER: 'local',
  HYRONIX_LOCAL_STORE_PATH: dir + '/store.sqlite',
  HYRONIX_CONTENT_REVALIDATE_SECONDS: '2',
  HYRONIX_PREWARM: 'true',
};
let child;
const logs = [];
async function start() {
  child = spawn(
    process.execPath,
    [
      'node_modules/next/dist/bin/next',
      'start',
      '--hostname',
      '127.0.0.1',
      '--port',
      '3004',
    ],
    { env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true },
  );
  child.stdout.on('data', (b) => logs.push(b.toString()));
  child.stderr.on('data', (b) => logs.push(b.toString()));
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch('http://127.0.0.1:3004/robots.txt');
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw Error('Server start failed');
}
async function stop() {
  if (child.exitCode === null) {
    const done = once(child, 'exit');
    child.kill();
    await done;
  }
}
const results = [];
async function page(slug) {
  const start = performance.now();
  const r = await fetch(
    'http://127.0.0.1:3004/' + (slug === 'home' ? '' : slug),
    { headers: { 'User-Agent': 'Googlebot' } },
  );
  const ttfb = performance.now() - start;
  const html = await r.text();
  assert.equal(r.status, 200);
  return { html, ttfbMs: Math.round(ttfb), bytes: Buffer.byteLength(html) };
}
let eventVersion = 100;
async function invalidate(slug = 'home') {
  const event = {
    event_id: randomUUID(),
    site_key: key,
    content_version: eventVersion++,
    published_at: new Date().toISOString(),
    event_type: 'content.published',
    affected_slugs: [slug],
  };
  const body = JSON.stringify(event),
    timestamp = String(Math.floor(Date.now() / 1000));
  const r = await fetch('http://127.0.0.1:3004/api/hyronix/revalidate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hyronix-timestamp': timestamp,
      'x-hyronix-event-id': event.event_id,
      'x-hyronix-signature':
        'sha256=' +
        createHmac('sha256', secret)
          .update(timestamp + '.' + body)
          .digest('hex'),
    },
    body,
  });
  assert.equal(r.status, 200);
  return r.json();
}
function snapshot() {
  const db = new DatabaseSync(dir + '/store.sqlite');
  const rows = db
    .prepare('select resource,version,payload from snapshots')
    .all();
  db.close();
  return rows;
}
try {
  await start();
  mode = 'down';
  const original = await page('home');
  assert.ok(original.html.includes('Odontopediatra'));
  assert.ok(!original.html.includes('Texto A'));
  assert.equal(snapshot().length, 0, 'No invalid response persisted');
  mode = 'A';
  for (const slug of slugs) {
    const before = requests,
      cold = await page(slug),
      coldCalls = requests - before,
      warm = await page(slug);
    assert.ok(cold.html.includes('Texto A'));
    assert.equal(requests - before, coldCalls, 'Warm must not query API');
    results.push({
      slug,
      coldMs: cold.ttfbMs,
      warmMs: warm.ttfbMs,
      coldCalls,
      warmCalls: 0,
      bytes: warm.bytes,
    });
  }
  mode = 'B';
  version = 42;
  await invalidate();
  let b = await page('home');
  assert.ok(b.html.includes('Texto B'));
  assert.ok(b.html.includes('<title>SEO B</title>'));
  assert.equal(snapshot().find((r) => r.resource === 'home').version, 42);
  // Cached settings also renew; both UI and structured data use the validated snapshot.
  await new Promise((r) => setTimeout(r, 2200));
  await page('home');
  await new Promise((r) => setTimeout(r, 150));
  b = await page('home');
  assert.ok(b.html.includes('DIRECCION B'));
  assert.ok(notModified > 0, 'ETag conditional refresh');
  for (const failure of ['invalid-json', 'invalid-shape', 'draft']) {
    mode = failure;
    version = 43;
    await invalidate();
    const r = await page('home');
    assert.ok(r.html.includes('Texto B'));
    assert.ok(r.html.includes('<title>SEO B</title>'));
    assert.ok(!r.html.includes('MUST_NOT_CACHE'));
    assert.equal(snapshot().find((r) => r.resource === 'home').version, 42);
  }
  mode = 'OLD';
  version = 41;
  await invalidate();
  assert.ok((await page('home')).html.includes('Texto B'));
  assert.equal(snapshot().find((r) => r.resource === 'home').version, 42);
  mode = 'down';
  await invalidate();
  const outage = await page('home');
  assert.ok(outage.html.includes('Texto B'));
  assert.ok(outage.html.includes('<title>SEO B</title>'));
  await writeFile(dir + '/outage-B.html', outage.html);
  // Empty Next cache after invalidation, then restart process while API is unreachable.
  await new Promise((r) => proxy.close(r));
  await stop();
  await start();
  await invalidate();
  const restarted = await page('home');
  assert.ok(restarted.html.includes('Texto B'));
  assert.equal(snapshot().find((r) => r.resource === 'home').version, 42);
  for (const slug of slugs) {
    if (slug !== 'home') await invalidate(slug);
    const r = await page(slug);
    results.find((v) => v.slug === slug).outageMs = r.ttfbMs;
    assert.ok(r.html.includes('Texto ' + (slug === 'home' ? 'B' : 'A')));
  }
  const report = {
    originalFallback: 'PASS (empty snapshot and unavailable API)',
    status: 'PASS',
    date: new Date().toISOString(),
    results,
    etag304: notModified,
    snapshotVersions: snapshot().map(({ resource, version }) => ({
      resource,
      version,
    })),
    critical: 'A → B → invalidation + API down + process restart → B',
    evidence: dir,
  };
  await writeFile('.qa/cache-results.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
} catch (e) {
  console.log(logs.slice(-15).join('').replaceAll(secret, '[REDACTED]'));
  throw e;
} finally {
  await stop();
  if (proxy.listening) await new Promise((r) => proxy.close(r));
}
