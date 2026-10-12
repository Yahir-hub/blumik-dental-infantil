import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { randomBytes, randomUUID, createHmac } from 'node:crypto';
const secret = randomBytes(32).toString('hex');
let contentVersion = Date.now();
const root = process.cwd(),
  out = root + '/.qa';
await mkdir(out, { recursive: true });
const key = process.env.HYRONIX_SITE_KEY;
assert.match(key ?? '', /^site_[a-f0-9]{32}$/);
const api = process.env.HYRONIX_CONTENT_API_URL;
assert.ok(api);
const slugs = [
  'home',
  'servicios',
  'pacientes-neurodivergentes',
  'preguntas-frecuentes',
  'profesionales',
  'contacto',
  'aviso-de-privacidad',
];
const payloads = new Map();
for (const suffix of ['', ...slugs.map((s) => '/pages/' + s)]) {
  const response = await fetch(`${api}/sites/${key}${suffix}`);
  assert.equal(response.status, 200);
  payloads.set(suffix, await response.json());
}
let mode = 'live',
  counts = [];
const events = [];
const proxy = createServer(async (req, res) => {
  counts.push(req.url);
  if (req.url.startsWith('/api/content/v1/media/')) {
    if (mode === 'media-failure') {
      res.writeHead(503);
      res.end();
      return;
    }
    const r = await fetch(new URL(req.url, new URL(api).origin));
    res.writeHead(r.status, {
      'content-type': r.headers.get('content-type') ?? 'image/webp',
    });
    res.end(Buffer.from(await r.arrayBuffer()));
    return;
  }
  if (mode === 'slow')
    await new Promise((resolve) => setTimeout(resolve, 3000));
  if (mode.startsWith('error-')) {
    res.writeHead(Number(mode.slice(6)));
    res.end();
    return;
  }
  if (mode === 'invalid-json') {
    res.writeHead(200);
    res.end('{');
    return;
  }
  if (mode === 'invalid-shape') {
    res.writeHead(200);
    res.end(JSON.stringify({ page: { sections: 'invalid' } }));
    return;
  }
  const suffix = req.url.split('/sites/' + key)[1];
  const original = payloads.get(suffix);
  if (!original) {
    res.writeHead(404);
    res.end();
    return;
  }
  // Real published payload copied only inside a local fault-injection test. Supabase is never mutated.
  const body = structuredClone(original);
  body.site.content_version = contentVersion;
  if (mode === 'sentinel') {
    if (body.page) {
      const hero = body.page.sections.find((s) => s.key === 'hero');
      if (hero.fields.content)
        hero.fields.content = 'HYRONIX_SSR_' + suffix.split('/').at(-1);
      hero.fields.title = 'HYRONIX_H1_' + suffix.split('/').at(-1);
      body.page.seo.meta_title = 'HYRONIX_METADATA';
      body.page.seo.meta_description = 'HYRONIX_DESCRIPTION';
      body.page.seo.schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'CMS schema',
      };
      if (suffix.endsWith('preguntas-frecuentes'))
        body.page.sections.find((s) => s.key === 'section_2').fields.items = [
          { question: 'HYRONIX_QUESTION', answer: 'HYRONIX_ANSWER' },
        ];
    } else {
      Object.assign(body.site_settings, {
        phone: '477 123 4567',
        whatsapp: '524771234567',
        business_name: 'HYRONIX_BUSINESS',
        address: 'HYRONIX_ADDRESS',
        opening_hours:
          'Lunes a viernes, de 9:00 a.m. – 1:00 p.m.. Sábados: cerrado. Domingos: cerrado.',
      });
    }
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
});
await new Promise((resolve) => proxy.listen(0, '127.0.0.1', resolve));
const proxyPort = proxy.address().port;
const child = spawn(
  process.execPath,
  [
    'node_modules/next/dist/bin/next',
    'start',
    '--port',
    '3002',
    '--hostname',
    '127.0.0.1',
  ],
  {
    cwd: root,
    env: {
      ...process.env,
      HYRONIX_CONTENT_API_URL: `http://127.0.0.1:${proxyPort}/api/content/v1`,
      HYRONIX_WEBHOOK_SECRET: secret,
      HYRONIX_STORE_DRIVER: 'local',
      HYRONIX_LOCAL_STORE_PATH: `${out}/verify-${randomUUID()}.sqlite`,
      HYRONIX_CONTENT_REVALIDATE_SECONDS: '60',
      HYRONIX_PREWARM: 'false',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  },
);
child.stdout.on('data', (chunk) => {
  for (const line of chunk.toString().split('\n'))
    if (line.includes('[Hyronix]')) {
      try {
        events.push(JSON.parse(line.slice(line.indexOf('{'))));
      } catch {}
    }
});
child.stderr.on('data', () => {});
const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-f]+);/gi, (_, v) =>
      String.fromCodePoint(parseInt(v, 16)),
    )
    .replace(/&#(\d+);/g, (_, v) => String.fromCodePoint(Number(v)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
const visible = (html) =>
  decode(
    (html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '')
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<[^>]*>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
async function page(slug, origin = 'http://127.0.0.1:3002') {
  const start = performance.now();
  const response = await fetch(origin + '/' + (slug === 'home' ? '' : slug), {
    headers: { 'User-Agent': 'Googlebot' },
  });
  const ttfb = performance.now() - start;
  const html = await response.text();
  assert.equal(response.status, 200, slug + ' status');
  assert.ok(html.includes('<h1'), slug + ' H1');
  return {
    html,
    text: visible(html),
    ttfbMs: Math.round(ttfb),
    totalMs: Math.round(performance.now() - start),
    bytes: Buffer.byteLength(html),
  };
}
const results = [];
async function invalidate() {
  contentVersion++;
  const body = JSON.stringify({
    event_id: randomUUID(),
    site_key: key,
    content_version: contentVersion,
    published_at: new Date().toISOString(),
    event_type: 'settings.updated',
    affected_slugs: [],
  });
  for (let attempt = 0; attempt < 4; attempt++) {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const response = await fetch(
      'http://127.0.0.1:3002/api/hyronix/revalidate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hyronix-timestamp': timestamp,
          'x-hyronix-event-id': JSON.parse(body).event_id,
          'x-hyronix-signature':
            'sha256=' +
            createHmac('sha256', secret)
              .update(timestamp + '.' + body)
              .digest('hex'),
        },
        body,
      },
    );
    if (response.status === 429) {
      await new Promise((resolve) =>
        setTimeout(resolve, Number(response.headers.get('retry-after')) * 1000),
      );
      continue;
    }
    assert.equal(response.status, 200);
    return;
  }
  throw Error('Webhook rate limit did not recover');
}
try {
  for (let i = 0; i < 60; i++) {
    try {
      await fetch('http://127.0.0.1:3002/robots.txt');
      break;
    } catch {
      if (i === 59) throw Error('Test server not ready');
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  for (const slug of slugs) {
    counts = [];
    const result = await page(slug);
    assert.ok(
      result.html.includes(
        'https://blumikdentalinfantil.com' +
          (slug === 'home' ? '/' : '/' + slug),
      ),
    );
    assert.ok(!result.html.includes('storage_path'));
    assert.ok(!result.html.includes('sb_secret_'));
    const jsonld = [
      ...result.html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ].map((m) => JSON.parse(m[1]));
    assert.ok(jsonld.length > 0);
    assert.equal(
      counts.filter((p) => p.endsWith('/pages/' + slug)).length,
      1,
      'One page fetch ' + slug,
    );
    assert.ok(
      counts.filter((p) => p.endsWith('/sites/' + key)).length <= 1,
      'Initial settings fetch or cached settings',
    );
    await writeFile(out + '/blumik-ssr-' + slug + '.html', result.html);
    results.push({
      case: 'live',
      slug,
      ttfbMs: result.ttfbMs,
      totalMs: result.totalMs,
      bytes: result.bytes,
      requests: counts.length,
    });
  }
  for (const slug of [
    'home',
    'servicios',
    'pacientes-neurodivergentes',
    'preguntas-frecuentes',
  ]) {
    mode = 'sentinel';
    await invalidate();
    const result = await page(slug);
    assert.ok(
      result.text.includes('HYRONIX_H1_' + slug),
      'SSR H1 from payload',
    );
    assert.ok(
      result.html.includes('<title>HYRONIX_METADATA</title>'),
      'Metadata from payload',
    );
    assert.ok(
      !result.html.includes('DRAFT_MUST_NEVER_RENDER'),
      'Draft not serialized',
    );
    if (slug === 'preguntas-frecuentes') {
      assert.ok(result.text.includes('HYRONIX_QUESTION'));
      assert.ok(result.html.includes('HYRONIX_ANSWER'));
    } else assert.ok(result.text.includes('HYRONIX_SSR_' + slug));
    assert.ok(result.html.includes('524771234567'), 'Normalized WA');
    assert.ok(result.html.includes('HYRONIX_ADDRESS'), 'Global address');
    await writeFile(out + '/sentinel-' + slug + '.html', result.html);
    results.push({ case: 'sentinel', slug, status: 'PASS' });
  }
  mode = 'live';
  await invalidate();
  for (const slug of slugs) await page(slug);
  const normal = await page('home');
  for (const failure of [
    'error-404',
    'error-429',
    'error-500',
    'error-502',
    'error-503',
    'invalid-json',
    'invalid-shape',
    'slow',
  ]) {
    mode = failure;
    await invalidate();
    const result = await page('home');
    assert.equal(
      result.text,
      normal.text,
      failure + ' useful fallback matches source',
    );
    assert.ok(result.totalMs < 2800, failure + ' bounded total response');
    results.push({
      case: failure,
      status: 'PASS',
      ttfbMs: result.ttfbMs,
      totalMs: result.totalMs,
    });
    await writeFile(out + '/' + failure + '.html', result.html);
  }
  mode = 'error-503';
  await invalidate();
  for (const slug of slugs.slice(1)) {
    const result = await page(slug);
    assert.ok(result.text.length > 100);
    results.push({ case: 'fallback', slug, status: 'PASS' });
  }
  for (const file of ['robots.txt', 'sitemap.xml']) {
    const r = await fetch('http://127.0.0.1:3002/' + file);
    assert.equal(r.status, 200);
    assert.ok((await r.text()).includes('https://blumikdentalinfantil.com'));
  }
  mode = 'live';
  await writeFile(
    out + '/test-results.json',
    JSON.stringify(
      { date: new Date().toISOString(), status: 'PASS', results, events },
      null,
      2,
    ),
  );
  console.log(
    'PASS: 7 SSR routes, shared fetch, published payload sentinels, SEO/FAQ/settings, 8 failure modes, timeout, sitemap/robots.',
  );
  if (process.argv.includes('--serve')) {
    console.log(
      'Browser media test ready on 3002; .qa/browser-mode.txt controls live/media-failure',
    );
    const timer = setInterval(async () => {
      try {
        mode = (await readFile(out + '/browser-mode.txt', 'utf8')).trim();
      } catch {}
    }, 500);
    await once(child, 'exit');
    clearInterval(timer);
  }
} finally {
  child.kill();
  await new Promise((resolve) => proxy.close(resolve));
}
