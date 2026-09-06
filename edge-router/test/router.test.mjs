import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { handleRequest } from '../src/index.mjs';
import pdfRoutes from '../src/pdf-routes.json' with { type: 'json' };
import { PDF_ROUTE_REDIRECTS } from '../src/route-remediation.mjs';

const originalFetch = globalThis.fetch;
const env = {
  PDF_ORIGIN: 'https://pdf-processor-4mc.pages.dev',
  EDITORIAL_ORIGIN: 'https://dayfiles.pages.dev',
  ROUTER_MODE: 'production',
};

beforeEach(() => {
  globalThis.fetch = async (request) => new Response(`upstream:${new URL(request.url).origin}${new URL(request.url).pathname}`, {
    status: 200,
    headers: { 'content-type': 'text/plain', location: '/next/' },
  });
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('routes PDF app pages to the PDF Pages origin', async () => {
  const response = await handleRequest(new Request('https://dayfiles.com/merge-pdf/?a=1'), env);
  assert.equal(await response.text(), 'upstream:https://pdf-processor-4mc.pages.dev/merge-pdf/');
  assert.equal(response.headers.get('location'), 'https://dayfiles.com/next/');
});

test('routes articles and exact editorial inventory to editorial Pages', async () => {
  for (const path of ['/blog/fill-sign-merge-lock-pdf-packet/', '/editorial-policy/', '/images/']) {
    const response = await handleRequest(new Request(`https://dayfiles.com${path}`), env);
    assert.match(await response.text(), /^upstream:https:\/\/dayfiles\.pages\.dev/);
  }
});

test('routes Body Layers platform legal pages to the PDF Pages origin', async () => {
  for (const path of ['/human-anatomy-3d-body-layers/ios/privacy-policy/', '/human-anatomy-3d-body-layers/ios/terms-of-use/', '/human-anatomy-3d-body-layers/android/privacy-policy/', '/human-anatomy-3d-body-layers/android/terms-of-use/']) {
    const response = await handleRequest(new Request(`https://dayfiles.com${path}`), env);
    assert.match(await response.text(), /^upstream:https:\/\/pdf-processor-4mc\.pages\.dev/);
  }
});

test('consolidates redundant blog articles and retires unsupported stories', async () => {
  const redirect = await handleRequest(new Request('https://dayfiles.com/blog/merge-pdf-without-upload/'), env);
  assert.equal(redirect.status, 301);
  assert.equal(
    redirect.headers.get('location'),
    'https://dayfiles.com/guides/how-to-merge-pdf-files-without-uploading/',
  );

  const gone = await handleRequest(
    new Request('https://dayfiles.com/blog/story-remote-hr-private-onboarding-routine/'),
    env,
  );
  assert.equal(gone.status, 410);
  assert.match(await gone.text(), /did not meet the current Dayfiles evidence standard/);
});

test('consolidates thin comparison routes into the tested comparison hub', async () => {
  const response = await handleRequest(new Request('https://dayfiles.com/smallpdf-vs-pdf24/'), env);
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), 'https://dayfiles.com/best-private-pdf-tools/');
});

test('consolidates templated audience and workflow routes into detailed guides', async () => {
  const audience = await handleRequest(new Request('https://dayfiles.com/students-pdf-tools/'), env);
  assert.equal(audience.status, 301);
  assert.equal(
    audience.headers.get('location'),
    'https://dayfiles.com/guides/how-to-use-private-pdf-tools-as-a-student/',
  );

  const workflow = await handleRequest(
    new Request('https://dayfiles.com/pdf-tools-for-client-documents/'),
    env,
  );
  assert.equal(workflow.status, 301);
  assert.equal(
    workflow.headers.get('location'),
    'https://dayfiles.com/guides/how-to-prepare-a-pdf-for-client-delivery/',
  );
});

test('does not capture nested PDF image assets as the editorial images page', async () => {
  const response = await handleRequest(new Request('https://dayfiles.com/images/tool-preview.webp'), env);
  assert.equal(await response.text(), 'upstream:https://pdf-processor-4mc.pages.dev/images/tool-preview.webp');
});

test('keeps colliding form APIs with the page origin that submitted them', async () => {
  const editorial = await handleRequest(new Request('https://dayfiles.com/api/subscribe', {
    method: 'POST',
    headers: { referer: 'https://dayfiles.com/blog/' },
    body: '{}',
  }), env);
  assert.equal(await editorial.text(), 'upstream:https://dayfiles.pages.dev/api/subscribe');

  const pdf = await handleRequest(new Request('https://dayfiles.com/api/subscribe', {
    method: 'POST',
    headers: { referer: 'https://dayfiles.com/' },
    body: '{}',
  }), env);
  assert.equal(await pdf.text(), 'upstream:https://pdf-processor-4mc.pages.dev/api/subscribe');
});

test('redirects old PDF trust paths in one hop and keeps the query', async () => {
  const response = await handleRequest(new Request('https://pdf.dayfiles.com/about/?ref=old'), env);
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), 'https://dayfiles.com/private-pdf/about/?ref=old');
});

test('redirects the complete historical PDF inventory to final apex destinations in one hop', async () => {
  const trustDestinations = new Map([
    ['/about', '/private-pdf/about/'],
    ['/contact', '/private-pdf/contact/'],
    ['/terms', '/private-pdf/terms/'],
  ]);

  const historicalRoutes = [...new Set([...pdfRoutes, ...Object.keys(PDF_ROUTE_REDIRECTS)])];

  for (const route of historicalRoutes) {
    const normalized = route === '/' ? '/' : route.replace(/\/+$/, '');
    const destination =
      trustDestinations.get(normalized) ??
      PDF_ROUTE_REDIRECTS[normalized] ??
      `${normalized || '/'}${normalized === '/' ? '' : '/'}`;
    const expected = new URL(destination, 'https://dayfiles.com');
    expected.searchParams.append('migration_check', '1');

    const sourcePath = normalized === '/' ? '/' : `${normalized}/`;
    const response = await handleRequest(
      new Request(`https://pdf.dayfiles.com${sourcePath}?migration_check=1`),
      env,
    );

    assert.equal(response.status, 301, `expected permanent redirect for ${route}`);
    assert.equal(response.headers.get('location'), expected.toString(), `unexpected destination for ${route}`);
  }
});

test('routes the searchable PDF OCR page to the PDF Pages origin', async () => {
  const response = await handleRequest(new Request('https://dayfiles.com/ocr-pdf/?ref=old'), env);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'upstream:https://pdf-processor-4mc.pages.dev/ocr-pdf/');
});

test('uses 308 for non-GET requests from the old PDF hostname', async () => {
  const response = await handleRequest(new Request('https://pdf.dayfiles.com/api/contact', { method: 'POST' }), env);
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), 'https://dayfiles.com/api/contact');
});

test('redirects blog and www aliases without creating mirrors', async () => {
  const blog = await handleRequest(new Request('https://blog.dayfiles.com/article/?x=1'), env);
  assert.equal(blog.headers.get('location'), 'https://dayfiles.com/blog/article/?x=1');
  const www = await handleRequest(new Request('https://www.dayfiles.com/blog/a/'), env);
  assert.equal(www.headers.get('location'), 'https://dayfiles.com/blog/a/');
});

test('serves SEO control files and genuine unknown-route 404s', async () => {
  const sitemap = await handleRequest(new Request('https://dayfiles.com/sitemap.xml'), env);
  const sitemapText = await sitemap.text();
  assert.match(sitemapText, /sitemaps\/pdf\.xml/);
  assert.match(sitemapText, /sitemaps\/editorial\.xml/);
  assert.doesNotMatch(sitemapText, /<lastmod>/);
  const robots = await handleRequest(new Request('https://dayfiles.com/robots.txt'), env);
  const robotsText = await robots.text();
  assert.match(robotsText, /User-agent: GPTBot/);
  assert.match(robotsText, /Clean-param: lang \/$/m);
  const ads = await handleRequest(new Request('https://dayfiles.com/ads.txt'), env);
  assert.match(await ads.text(), /pub-1193261985740702/);
  const pdfSitemap = await handleRequest(new Request('https://dayfiles.com/sitemaps/pdf.xml'), env);
  assert.equal(await pdfSitemap.text(), 'upstream:https://pdf-processor-4mc.pages.dev/sitemap.xml');
  const editorialSitemap = await handleRequest(new Request('https://dayfiles.com/sitemaps/editorial.xml'), env);
  assert.equal(await editorialSitemap.text(), 'upstream:https://dayfiles.pages.dev/sitemap.xml');
  const missing = await handleRequest(new Request('https://dayfiles.com/not-a-real-page'), env);
  assert.equal(missing.status, 404);
  assert.match(missing.headers.get('content-type'), /^text\/html/);
});

test('removes the replaced apex homepage from the editorial child sitemap', async () => {
  globalThis.fetch = async () => new Response(`<?xml version="1.0"?><urlset>
    <url><loc>https://dayfiles.com/</loc><lastmod>2026-07-23</lastmod></url>
    <url><loc>https://dayfiles.com/blog/</loc></url>
  </urlset>`, { headers: { 'content-type': 'application/xml' } });

  const response = await handleRequest(new Request('https://dayfiles.com/sitemaps/editorial.xml'), env);
  const xml = await response.text();
  assert.doesNotMatch(xml, /<loc>https:\/\/dayfiles\.com\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/dayfiles\.com\/blog\/<\/loc>/);
});

test('marks staging output noindex', async () => {
  const response = await handleRequest(new Request('https://staging.example/merge-pdf/'), {
    ...env,
    ROUTER_MODE: 'staging',
  });
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
  assert.equal(response.headers.get('location'), 'https://staging.example/next/');
  const robots = await handleRequest(new Request('https://staging.example/robots.txt'), {
    ...env,
    ROUTER_MODE: 'staging',
  });
  assert.match(await robots.text(), /Disallow: \/$/m);
});
