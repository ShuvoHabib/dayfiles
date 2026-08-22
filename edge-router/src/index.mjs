import pdfRoutes from './pdf-routes.json' with { type: 'json' };
import { BLOG_GONE_SLUGS, BLOG_REDIRECTS } from '../../scripts/blog/remediation.mjs';
import { PDF_ROUTE_REDIRECTS } from './route-remediation.mjs';

const PUBLIC_HOST = 'dayfiles.com';
const PUBLIC_HOSTS = new Set([
  PUBLIC_HOST,
  `www.${PUBLIC_HOST}`,
  `pdf.${PUBLIC_HOST}`,
  `blog.${PUBLIC_HOST}`,
]);

const EDITORIAL_EXACT_PATHS = new Set([
  '/about',
  '/advertising-disclosure',
  '/application-packet-mistakes',
  '/compliance-sensitive-image-prep',
  '/contact',
  '/content-review-process',
  '/cookies',
  '/document-delivery-formats',
  '/editorial-policy',
  '/everyday-image-studio',
  '/how-dayfiles-tests-workflows',
  '/image-workflows',
  '/images',
  '/pdf-toolkit',
  '/pdf-workflows',
  '/privacy-policy',
  '/shuvo-habib',
  '/terms',
]);

const EDITORIAL_ASSET_PATHS = new Set([
  '/apple-touch-icon.png',
  '/blog-index.json',
  '/contact-form.js',
  '/dayfiles-logo.svg',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon.ico',
  '/favicon.svg',
  '/icon-192.png',
  '/producthunt-featured.svg',
  '/subscribe-form.js',
]);

const KNOWN_PDF_PATHS = new Set(pdfRoutes.map(normalizePath));
const REDIRECTED_PDF_TRUST_PATHS = new Map([
  ['/about', '/private-pdf/about/'],
  ['/contact', '/private-pdf/contact/'],
  ['/terms', '/private-pdf/terms/'],
]);
const BLOG_REDIRECT_PATHS = new Map(
  Object.entries(BLOG_REDIRECTS).map(([slug, destination]) => [`/blog/${slug}`, destination]),
);
const BLOG_GONE_PATHS = new Set(BLOG_GONE_SLUGS.map((slug) => `/blog/${slug}`));
const PDF_REDIRECT_PATHS = new Map(Object.entries(PDF_ROUTE_REDIRECTS));

function normalizePath(pathname) {
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

function isEditorialPath(pathname) {
  const normalized = normalizePath(pathname);
  return (
    normalized === '/blog' ||
    normalized.startsWith('/blog/') ||
    EDITORIAL_EXACT_PATHS.has(normalized) ||
    EDITORIAL_ASSET_PATHS.has(pathname)
  );
}

function isKnownPdfPath(pathname) {
  const normalized = normalizePath(pathname);
  return (
    KNOWN_PDF_PATHS.has(normalized) ||
    normalized === '/about-privacy' ||
    normalized.startsWith('/tool/') ||
    normalized.startsWith('/api/') ||
    normalized === '/app-ads.txt' ||
    normalized === '/manifest.webmanifest' ||
    normalized === '/sw.js' ||
    normalized.startsWith('/assets/') ||
    /\.[a-z0-9]{1,12}$/i.test(normalized)
  );
}

function isEditorialApiRequest(request) {
  const { pathname } = new URL(request.url);
  if (pathname !== '/api/contact' && pathname !== '/api/subscribe') return false;

  const referer = request.headers.get('referer');
  if (!referer) return false;
  try {
    return isEditorialPath(new URL(referer).pathname);
  } catch {
    return false;
  }
}

function redirectResponse(request, destination, status = 301) {
  const source = new URL(request.url);
  const target = new URL(destination, `https://${PUBLIC_HOST}`);
  for (const [key, value] of source.searchParams) {
    if (!target.searchParams.has(key)) target.searchParams.append(key, value);
  }
  return new Response(null, {
    status,
    headers: {
      Location: target.toString(),
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function redirectHostRequest(request, hostname) {
  const url = new URL(request.url);
  const normalized = normalizePath(url.pathname);

  if (hostname === `pdf.${PUBLIC_HOST}`) {
    const mapped = REDIRECTED_PDF_TRUST_PATHS.get(normalized) ?? url.pathname;
    const status = request.method === 'GET' || request.method === 'HEAD' ? 301 : 308;
    return redirectResponse(request, mapped, status);
  }

  if (hostname === `blog.${PUBLIC_HOST}`) {
    const path = normalized === '/' ? '/blog/' : normalized.startsWith('/blog') ? url.pathname : `/blog${url.pathname}`;
    return redirectResponse(request, path, 301);
  }

  return redirectResponse(request, url.pathname, 301);
}

function rewriteUpstreamRequest(request, upstreamOrigin) {
  const publicUrl = new URL(request.url);
  const upstreamUrl = new URL(`${publicUrl.pathname}${publicUrl.search}`, upstreamOrigin);
  const upstream = new URL(upstreamOrigin);
  const headers = new Headers(request.headers);
  headers.delete('host');

  const origin = headers.get('origin');
  if (origin) {
    const originUrl = new URL(origin);
    if (PUBLIC_HOSTS.has(originUrl.hostname)) headers.set('origin', upstream.origin);
  }

  const referer = headers.get('referer');
  if (referer) {
    const refererUrl = new URL(referer);
    if (PUBLIC_HOSTS.has(refererUrl.hostname)) {
      refererUrl.protocol = upstream.protocol;
      refererUrl.host = upstream.host;
      headers.set('referer', refererUrl.toString());
    }
  }

  const init = {
    method: request.method,
    headers,
    redirect: 'manual',
  };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
    init.duplex = 'half';
  }
  return new Request(upstreamUrl, init);
}

function rewritePublicLocation(location, upstreamOrigin, requestUrl, staging) {
  if (!location) return null;
  const target = new URL(location, upstreamOrigin);
  if (target.origin !== new URL(upstreamOrigin).origin) return location;
  target.protocol = 'https:';
  target.host = staging ? new URL(requestUrl).host : PUBLIC_HOST;
  return target.toString();
}

async function proxyRequest(request, upstreamOrigin, staging) {
  const response = await fetch(rewriteUpstreamRequest(request, upstreamOrigin));
  const headers = new Headers(response.headers);
  const location = rewritePublicLocation(headers.get('location'), upstreamOrigin, request.url, staging);
  if (location) headers.set('location', location);
  if (staging) headers.set('x-robots-tag', 'noindex, nofollow');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function editorialSitemapResponse(request, env, staging) {
  const upstreamRequest = rewriteUpstreamRequest(
    requestWithPath(request, '/sitemap.xml'),
    env.EDITORIAL_ORIGIN,
  );
  const response = await fetch(upstreamRequest);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('content-type', 'application/xml; charset=utf-8');
  if (staging) headers.set('x-robots-tag', 'noindex, nofollow');

  if (!response.ok) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const xml = (await response.text()).replace(
    /\s*<url>\s*<loc>https:\/\/dayfiles\.com\/<\/loc>[\s\S]*?<\/url>/,
    '',
  );
  return new Response(xml, { status: response.status, headers });
}

function textResponse(body, contentType, staging = false) {
  const headers = new Headers({
    'content-type': `${contentType}; charset=utf-8`,
    'cache-control': 'public, max-age=300',
  });
  if (staging) headers.set('x-robots-tag', 'noindex, nofollow');
  return new Response(body, { headers });
}

function requestWithPath(request, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, request);
}

function notFoundResponse(staging) {
  const body = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page not found | Dayfiles</title></head><body><main><h1>Page not found</h1><p>The requested Dayfiles page does not exist.</p><a href="/">Return to Dayfiles</a></main></body></html>';
  const response = textResponse(body, 'text/html', staging);
  return new Response(response.body, { status: 404, headers: response.headers });
}

function retiredBlogResponse(request, staging) {
  const normalized = normalizePath(new URL(request.url).pathname);
  const destination = BLOG_REDIRECT_PATHS.get(normalized);
  if (destination) return redirectResponse(request, destination, 301);
  if (!BLOG_GONE_PATHS.has(normalized)) return null;

  const body = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Article retired | Dayfiles</title></head><body><main><h1>Article retired</h1><p>This article was removed because it did not meet the current Dayfiles evidence standard.</p><a href="/pdf-workflows/">Browse tested PDF workflows</a></main></body></html>';
  const response = textResponse(body, 'text/html', staging);
  return new Response(response.body, { status: 410, headers: response.headers });
}

function consolidatedPdfRouteResponse(request) {
  const destination = PDF_REDIRECT_PATHS.get(normalizePath(new URL(request.url).pathname));
  return destination ? redirectResponse(request, destination, 301) : null;
}

async function specialSeoResponse(request, env, staging) {
  const { pathname } = new URL(request.url);
  if (pathname === '/ads.txt') {
    return textResponse('google.com, pub-1193261985740702, DIRECT, f08c47fec0942fa0\n', 'text/plain', staging);
  }
  if (pathname === '/robots.txt') {
    const robots = staging
      ? 'User-agent: *\nDisallow: /\n'
      : `User-agent: *\nAllow: /\n\nUser-agent: Yandex\nAllow: /\nClean-param: lang /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: anthropic-ai\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: CCBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nUser-agent: Applebot-Extended\nAllow: /\n\nUser-agent: Bytespider\nAllow: /\n\nUser-agent: Amazonbot\nAllow: /\n\nUser-agent: meta-externalagent\nAllow: /\n\nSitemap: https://${PUBLIC_HOST}/sitemap.xml\n`;
    return textResponse(robots, 'text/plain', staging);
  }
  if (pathname === '/sitemap.xml') {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>https://${PUBLIC_HOST}/sitemaps/pdf.xml</loc></sitemap>\n  <sitemap><loc>https://${PUBLIC_HOST}/sitemaps/editorial.xml</loc></sitemap>\n</sitemapindex>\n`;
    return textResponse(xml, 'application/xml', staging);
  }
  if (pathname === '/sitemaps/pdf.xml') {
    return proxyRequest(requestWithPath(request, '/sitemap.xml'), env.PDF_ORIGIN, staging);
  }
  if (pathname === '/sitemaps/editorial.xml') {
    return editorialSitemapResponse(request, env, staging);
  }
  if (pathname === '/llms.txt') {
    const [editorial, pdf] = await Promise.all([
      fetch(new URL('/llms.txt', env.EDITORIAL_ORIGIN)),
      fetch(new URL('/llms.txt', env.PDF_ORIGIN)),
    ]);
    if (!editorial.ok || !pdf.ok) return new Response('Unable to assemble llms.txt', { status: 502 });
    const body = `${await editorial.text()}\n\n---\n\n${await pdf.text()}`;
    return textResponse(body, 'text/plain', staging);
  }
  return null;
}

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  const staging = env.ROUTER_MODE !== 'production';

  if (PUBLIC_HOSTS.has(url.hostname) && url.hostname !== PUBLIC_HOST) {
    return redirectHostRequest(request, url.hostname);
  }

  const retiredBlog = retiredBlogResponse(request, staging);
  if (retiredBlog) return retiredBlog;
  const consolidatedPdfRoute = consolidatedPdfRouteResponse(request);
  if (consolidatedPdfRoute) return consolidatedPdfRoute;
  const special = await specialSeoResponse(request, env, staging);
  if (special) return special;
  if (isEditorialApiRequest(request)) return proxyRequest(request, env.EDITORIAL_ORIGIN, staging);
  if (isEditorialPath(url.pathname)) return proxyRequest(request, env.EDITORIAL_ORIGIN, staging);
  if (isKnownPdfPath(url.pathname)) return proxyRequest(request, env.PDF_ORIGIN, staging);
  return notFoundResponse(staging);
}

export default {
  fetch(request, env) {
    return handleRequest(request, env).catch((error) => {
      console.error('dayfiles-edge-router request failed', error);
      return new Response('Upstream service unavailable', {
        status: 502,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    });
  },
};
