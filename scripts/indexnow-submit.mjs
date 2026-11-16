import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { INDEXNOW_KEY } from '../edge-router/src/indexnow-key.mjs';

export const INDEXNOW_HOST = 'dayfiles.com';
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
export const INDEXNOW_BATCH_SIZE = 10000;
export const SITEMAP_INDEX_URL = `https://${INDEXNOW_HOST}/sitemap-index.xml`;

const KEY_FILE_URL = new URL(
  `../edge-router/indexnow/${INDEXNOW_KEY}.txt`,
  import.meta.url,
);

const USAGE = `Usage:
  npm run indexnow:submit -- <url> [url...]
  npm run indexnow:submit -- --all

Submits https://${INDEXNOW_HOST}/ URLs to IndexNow. Without --all, only URLs given as arguments are submitted. --all reads ${SITEMAP_INDEX_URL} and each child sitemap, then submits those page URLs. Posts are batched at ${INDEXNOW_BATCH_SIZE} URLs and each response prints its HTTP status. This script does not run during the site build.`;

function keyFromFile() {
  const key = readFileSync(KEY_FILE_URL, 'utf8');
  if (key !== INDEXNOW_KEY) {
    throw new Error('IndexNow key file does not match edge-router/src/indexnow-key.mjs');
  }
  return key;
}

export function parseSubmitArgs(argv) {
  const urls = [];
  let all = false;
  let help = false;
  for (const arg of argv) {
    if (arg === '--all') {
      all = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      help = true;
      continue;
    }
    if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    urls.push(arg);
  }
  return { all, help, urls };
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

export function extractLocs(xml) {
  return [...String(xml).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((match) => decodeXml(match[1].trim()));
}

export function isSitemapIndex(xml) {
  return /<sitemapindex[\s>]/i.test(xml);
}

export function assertDayfilesUrl(value, host = INDEXNOW_HOST) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid URL: ${value}`);
  }
  if (url.protocol !== 'https:' || url.hostname !== host) {
    throw new Error(`IndexNow URLs must use https://${host}/: ${value}`);
  }
  return value.trim();
}

export function uniqueUrls(urls) {
  const seen = new Set();
  const result = [];
  for (const url of urls) {
    if (seen.has(url)) continue;
    seen.add(url);
    result.push(url);
  }
  return result;
}

export function batchUrls(urls, size = INDEXNOW_BATCH_SIZE) {
  if (!Number.isInteger(size) || size < 1) throw new Error('Batch size must be a positive integer');
  const batches = [];
  for (let index = 0; index < urls.length; index += size) {
    batches.push(urls.slice(index, index + size));
  }
  return batches;
}

export async function collectSitemapUrls(fetchImpl, indexUrl = SITEMAP_INDEX_URL, host = INDEXNOW_HOST) {
  const seenSitemaps = new Set();
  const urls = [];

  async function walk(sitemapUrl, depth) {
    const normalizedSitemap = assertDayfilesUrl(sitemapUrl, host);
    if (seenSitemaps.has(normalizedSitemap)) return;
    if (depth > 5) throw new Error(`Sitemap index is nested too deeply at ${normalizedSitemap}`);
    seenSitemaps.add(normalizedSitemap);

    const response = await fetchImpl(normalizedSitemap);
    if (!response.ok) {
      throw new Error(`Sitemap fetch failed: ${normalizedSitemap} HTTP ${response.status}`);
    }
    const xml = await response.text();
    const locs = extractLocs(xml);
    if (isSitemapIndex(xml)) {
      for (const loc of locs) await walk(loc, depth + 1);
      return;
    }
    for (const loc of locs) urls.push(assertDayfilesUrl(loc, host));
  }

  await walk(indexUrl, 0);
  return uniqueUrls(urls);
}

async function submitBatches({ urls, fetchImpl, endpoint, host, key, log, error, batchSize }) {
  const keyLocation = `https://${host}/${key}.txt`;
  const batches = batchUrls(urls, batchSize);
  let failed = false;
  log(`keyLocation: ${keyLocation}`);
  for (const [index, urlList] of batches.entries()) {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key, keyLocation, urlList }),
    });
    const label = batches.length > 1 ? ` batch ${index + 1}/${batches.length}` : '';
    log(`HTTP ${response.status}${label} (${urlList.length} URLs)`);
    if (response.status !== 200 && response.status !== 202) {
      failed = true;
      const detail = (await response.text()).trim();
      if (detail) error(detail.slice(0, 500));
    } else {
      await response.body?.cancel();
    }
  }
  return failed ? 1 : 0;
}

export async function runIndexNow(argv, {
  fetchImpl = globalThis.fetch,
  endpoint = INDEXNOW_ENDPOINT,
  host = INDEXNOW_HOST,
  batchSize = INDEXNOW_BATCH_SIZE,
  log = console.log,
  error = console.error,
} = {}) {
  try {
    const parsed = parseSubmitArgs(argv);
    if (parsed.help) {
      log(USAGE);
      return 0;
    }
    if (parsed.all && parsed.urls.length > 0) {
      throw new Error('Pass --all or a list of URLs, not both.');
    }
    if (!parsed.all && parsed.urls.length === 0) {
      error(USAGE);
      return 1;
    }

    const key = keyFromFile();
    const urls = parsed.all
      ? await collectSitemapUrls(fetchImpl, SITEMAP_INDEX_URL, host)
      : uniqueUrls(parsed.urls.map((url) => assertDayfilesUrl(url, host)));
    if (urls.length === 0) throw new Error('No URLs to submit.');
    return await submitBatches({ urls, fetchImpl, endpoint, host, key, log, error, batchSize });
  } catch (caught) {
    error(caught instanceof Error ? caught.message : String(caught));
    return 1;
  }
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  process.exit(await runIndexNow(process.argv.slice(2)));
}
