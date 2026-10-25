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

test('routes thelast30days legal pages to the PDF Pages origin', async () => {
  for (const path of ['/thelast30days/privacy-policy/', '/thelast30days/terms-of-use/']) {
    const response = await handleRequest(new Request(`https://dayfiles.com${path}`), env);
    assert.equal(await response.text(), `upstream:https://pdf-processor-4mc.pages.dev${path}`);
  }
});

test('routes Simple Invoice Maker legal and support pages to the PDF Pages origin', async () => {
  for (const path of ['/simple-invoice-maker/privacy-policy/', '/simple-invoice-maker/terms/', '/simple-invoice-maker/support/']) {
    const response = await handleRequest(new Request(`https://dayfiles.com${path}`), env);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), `upstream:https://pdf-processor-4mc.pages.dev${path}`);
  }
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
  const oldPdfSitemap = await handleRequest(new Request('https://pdf.dayfiles.com/sitemaps/pdf.xml?ref=old'), env);
  assert.equal(oldPdfSitemap.status, 301);
  assert.equal(oldPdfSitemap.headers.get('location'), 'https://dayfiles.com/sitemap.xml?ref=old');
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

test('routes the free web workflow pages to the PDF Pages origin', async () => {
  for (const path of [
    '/bates-numbering-pdf/',
    '/bank-statement-to-excel/',
    '/compare-pdf/',
    '/search-redact-pdf/',
  ]) {
    const response = await handleRequest(new Request(`https://dayfiles.com${path}`), env);
    assert.equal(response.status, 200);
    assert.equal(
      await response.text(),
      `upstream:https://pdf-processor-4mc.pages.dev${path}`,
    );
  }
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
  const sitemapIndex = await handleRequest(new Request('https://dayfiles.com/sitemap-index.xml'), env);
  const sitemapIndexText = await sitemapIndex.text();
  assert.match(sitemapIndexText, /<loc>https:\/\/dayfiles\.com\/sitemap\.xml<\/loc>/);
  assert.match(sitemapIndexText, /sitemaps\/editorial\.xml/);
  assert.doesNotMatch(sitemapIndexText, /<lastmod>/);
  const robots = await handleRequest(new Request('https://dayfiles.com/robots.txt'), env);
  const robotsText = await robots.text();
  assert.match(robotsText, /User-agent: GPTBot/);
  assert.match(robotsText, /Clean-param: lang \/$/m);
  assert.match(robotsText, /Sitemap: https:\/\/dayfiles\.com\/sitemap-index\.xml/);
  const ads = await handleRequest(new Request('https://dayfiles.com/ads.txt'), env);
  assert.match(await ads.text(), /pub-1193261985740702/);
  const pdfSitemap = await handleRequest(new Request('https://dayfiles.com/sitemap.xml'), env);
  assert.equal(await pdfSitemap.text(), 'upstream:https://pdf-processor-4mc.pages.dev/sitemap.xml');
  const legacyPdfSitemap = await handleRequest(new Request('https://dayfiles.com/sitemaps/pdf.xml?source=gsc'), env);
  assert.equal(legacyPdfSitemap.status, 301);
  assert.equal(legacyPdfSitemap.headers.get('location'), 'https://dayfiles.com/sitemap.xml?source=gsc');
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

test('redirects the legacy sign-pdf URL to the live e-sign page', async () => {
  for (const path of ['/sign-pdf', '/sign-pdf/']) {
    const response = await handleRequest(new Request(`https://dayfiles.com${path}?ref=gsc`), env);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), 'https://dayfiles.com/e-sign-pdf/?ref=gsc');
    assert.equal(response.headers.get('strict-transport-security'), 'max-age=31536000; includeSubDomains');
    assert.doesNotMatch(response.headers.get('strict-transport-security'), /preload/);
  }

  const pdfHost = await handleRequest(new Request('https://pdf.dayfiles.com/sign-pdf/'), env);
  assert.equal(pdfHost.status, 301);
  assert.equal(pdfHost.headers.get('location'), 'https://dayfiles.com/e-sign-pdf/');

  const www = await handleRequest(new Request('https://www.dayfiles.com/sign-pdf/'), env);
  assert.equal(www.status, 301);
  assert.equal(www.headers.get('location'), 'https://dayfiles.com/e-sign-pdf/');
});

test('redirects apex http requests to https', async () => {
  const response = await handleRequest(new Request('http://dayfiles.com/merge-pdf/?a=1'), env);
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), 'https://dayfiles.com/merge-pdf/?a=1');
});

test('returns 404 for assetlinks until a signing fingerprint exists', async () => {
  globalThis.fetch = async () => {
    throw new Error('assetlinks must not fall through to the homepage');
  };
  const response = await handleRequest(new Request('https://dayfiles.com/.well-known/assetlinks.json'), env);
  assert.equal(response.status, 404);
  assert.match(response.headers.get('content-type'), /^text\/html/);
  assert.match(await response.text(), /Page not found/);
});

test('keeps the Apple App Site Association file on the PDF origin', async () => {
  const response = await handleRequest(
    new Request('https://dayfiles.com/.well-known/apple-app-site-association'),
    env,
  );
  assert.equal(
    await response.text(),
    'upstream:https://pdf-processor-4mc.pages.dev/.well-known/apple-app-site-association',
  );
});

test('turns extension-path SPA fallbacks into real 404s and keeps real assets', async () => {
  globalThis.fetch = async (request) => {
    const { pathname } = new URL(request.url);
    if (pathname === '/foo.html' || pathname === '/x.json' || pathname === '/abc.txt' || pathname === '/blog/foo.html') {
      return new Response('<!doctype html><title>Home</title>', {
        status: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }
    if (pathname === '/index.html') {
      return new Response(null, { status: 308, headers: { location: '/' } });
    }
    if (pathname === '/merge-pdf/index.html') {
      return new Response(null, { status: 308, headers: { location: '/merge-pdf/' } });
    }
    if (pathname === '/assets/app.js') {
      return new Response('console.log(1)', { headers: { 'content-type': 'application/javascript' } });
    }
    if (pathname === '/blog/feed.xml') {
      return new Response('<rss></rss>', { headers: { 'content-type': 'application/xml' } });
    }
    if (pathname === '/private-pdf-icon.png') {
      return new Response('png', { headers: { 'content-type': 'image/png' } });
    }
    return new Response('missing', { status: 404, headers: { 'content-type': 'text/plain' } });
  };

  for (const path of ['/foo.html', '/x.json', '/abc.txt', '/blog/foo.html']) {
    const response = await handleRequest(new Request(`https://dayfiles.com${path}`), env);
    assert.equal(response.status, 404, path);
    assert.match(await response.text(), /Page not found/);
  }

  const asset = await handleRequest(new Request('https://dayfiles.com/assets/app.js'), env);
  assert.equal(asset.status, 200);
  assert.equal(await asset.text(), 'console.log(1)');

  const icon = await handleRequest(new Request('https://dayfiles.com/private-pdf-icon.png'), env);
  assert.equal(icon.status, 200);
  assert.equal(await icon.text(), 'png');

  const feed = await handleRequest(new Request('https://dayfiles.com/blog/feed.xml'), env);
  assert.equal(feed.status, 200);
  assert.match(await feed.text(), /<rss>/);

  const index = await handleRequest(new Request('https://dayfiles.com/index.html'), env);
  assert.equal(index.status, 308);
  assert.equal(index.headers.get('location'), 'https://dayfiles.com/');

  const nestedIndex = await handleRequest(new Request('https://dayfiles.com/merge-pdf/index.html'), env);
  assert.equal(nestedIndex.status, 308);
  assert.equal(nestedIndex.headers.get('location'), 'https://dayfiles.com/merge-pdf/');

  const extensionless = await handleRequest(new Request('https://dayfiles.com/not-a-real-page'), env);
  assert.equal(extensionless.status, 404);
});

test('adds git lastmod to the PDF sitemap and drops redirected URLs', async () => {
  globalThis.fetch = async (request) => {
    const { pathname } = new URL(request.url);
    if (pathname !== '/sitemap.xml') return new Response('missing', { status: 404 });
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://dayfiles.com/merge-pdf/</loc></url>
  <url><loc>https://dayfiles.com/sign-pdf/</loc></url>
  <url><loc>https://dayfiles.com/e-sign-pdf/</loc><lastmod>2026-08-01</lastmod></url>
  <url><loc>https://dayfiles.com/bank-statement-to-excel/</loc></url>
</urlset>`, { headers: { 'content-type': 'application/xml' } });
  };

  const response = await handleRequest(new Request('https://dayfiles.com/sitemap.xml'), env);
  const xml = await response.text();
  assert.match(xml, /<loc>https:\/\/dayfiles\.com\/merge-pdf\/<\/loc>\s*<lastmod>2026-10-25<\/lastmod>/);
  assert.doesNotMatch(xml, /<loc>https:\/\/dayfiles\.com\/sign-pdf\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/dayfiles\.com\/e-sign-pdf\/<\/loc>\s*<lastmod>2026-10-25<\/lastmod>/);
  assert.match(xml, /bank-statement-to-excel\/<\/loc>\s*<lastmod>2026-10-25<\/lastmod>/);
  assert.match(response.headers.get('content-type'), /^application\/xml/);
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
