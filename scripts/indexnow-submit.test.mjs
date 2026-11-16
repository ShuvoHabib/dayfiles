import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { INDEXNOW_KEY } from '../edge-router/src/indexnow-key.mjs';
import {
  INDEXNOW_BATCH_SIZE,
  INDEXNOW_ENDPOINT,
  batchUrls,
  extractLocs,
  runIndexNow,
} from './indexnow-submit.mjs';

const silent = { log() {}, error() {} };

function jsonResponse(body, status = 200) {
  return new Response(body, { status, headers: { 'content-type': 'application/xml' } });
}

test('default batch size is 10000', () => {
  assert.equal(INDEXNOW_BATCH_SIZE, 10000);
  assert.equal(batchUrls(['a', 'b', 'c'], 2).map((batch) => batch.length).join(','), '2,1');
  assert.equal(batchUrls(Array.from({ length: 10000 }, (_, index) => index)).length, 1);
});

test('reads sitemap locations and decodes XML entities', () => {
  const locs = extractLocs('<urlset><url><loc>https://dayfiles.com/a?x=1&amp;y=2</loc></url></urlset>');
  assert.deepEqual(locs, ['https://dayfiles.com/a?x=1&y=2']);
});

test('submits only argument URLs by default', async () => {
  const calls = [];
  const lines = [];
  const code = await runIndexNow(
    ['https://dayfiles.com/blog/', 'https://dayfiles.com/blog/', 'https://dayfiles.com/merge-pdf/'],
    {
      ...silent,
      log: (line) => lines.push(line),
      fetchImpl: async (url, init) => {
        calls.push({ url: String(url), init });
        return new Response('', { status: 202 });
      },
    },
  );

  assert.equal(code, 0);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, INDEXNOW_ENDPOINT);
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers['content-type'], 'application/json; charset=utf-8');
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    host: 'dayfiles.com',
    key: INDEXNOW_KEY,
    keyLocation: `https://dayfiles.com/${INDEXNOW_KEY}.txt`,
    urlList: ['https://dayfiles.com/blog/', 'https://dayfiles.com/merge-pdf/'],
  });
  assert.match(lines.join('\n'), /HTTP 202 \(2 URLs\)/);
});

test('does not submit when no URLs are given', async () => {
  let called = false;
  const code = await runIndexNow([], {
    ...silent,
    fetchImpl: async () => {
      called = true;
      return new Response('', { status: 200 });
    },
  });
  assert.equal(code, 1);
  assert.equal(called, false);
});

test('rejects URLs outside dayfiles.com before posting', async () => {
  let called = false;
  const code = await runIndexNow(['https://example.com/page'], {
    ...silent,
    fetchImpl: async () => {
      called = true;
      return new Response('', { status: 200 });
    },
  });
  assert.equal(code, 1);
  assert.equal(called, false);
});

test('rejects --all combined with URL arguments', async () => {
  let called = false;
  const code = await runIndexNow(['--all', 'https://dayfiles.com/blog/'], {
    ...silent,
    fetchImpl: async () => {
      called = true;
      return new Response('', { status: 200 });
    },
  });
  assert.equal(code, 1);
  assert.equal(called, false);
});

test('--all submits every unique page URL from the sitemap index', async () => {
  const sitemaps = {
    'https://dayfiles.com/sitemap-index.xml': `<?xml version="1.0"?>
      <sitemapindex>
        <sitemap><loc>https://dayfiles.com/sitemap.xml</loc></sitemap>
        <sitemap><loc>https://dayfiles.com/sitemaps/editorial.xml</loc></sitemap>
      </sitemapindex>`,
    'https://dayfiles.com/sitemap.xml': `<urlset>
        <url><loc>https://dayfiles.com/merge-pdf/</loc></url>
        <url><loc>https://dayfiles.com/merge-pdf/</loc></url>
      </urlset>`,
    'https://dayfiles.com/sitemaps/editorial.xml': `<urlset>
        <url><loc>https://dayfiles.com/blog/</loc></url>
      </urlset>`,
  };
  const requests = [];
  const code = await runIndexNow(['--all'], {
    ...silent,
    fetchImpl: async (url, init) => {
      const href = String(url);
      requests.push({ href, method: init?.method || 'GET' });
      if (init?.method === 'POST') {
        requests.at(-1).body = JSON.parse(init.body);
        return new Response('', { status: 200 });
      }
      const body = sitemaps[href];
      if (!body) return jsonResponse('missing', 404);
      return jsonResponse(body);
    },
  });

  assert.equal(code, 0);
  assert.deepEqual(
    requests.filter((request) => request.method === 'GET').map((request) => request.href),
    [
      'https://dayfiles.com/sitemap-index.xml',
      'https://dayfiles.com/sitemap.xml',
      'https://dayfiles.com/sitemaps/editorial.xml',
    ],
  );
  const posts = requests.filter((request) => request.method === 'POST');
  assert.equal(posts.length, 1);
  assert.equal(posts[0].href, INDEXNOW_ENDPOINT);
  assert.deepEqual(posts[0].body.urlList, [
    'https://dayfiles.com/merge-pdf/',
    'https://dayfiles.com/blog/',
  ]);
  assert.equal(posts[0].body.key, INDEXNOW_KEY);
  assert.equal(posts[0].body.host, 'dayfiles.com');
});

test('prints the HTTP status and fails when IndexNow rejects a batch', async () => {
  const lines = [];
  const errors = [];
  const code = await runIndexNow(['https://dayfiles.com/blog/'], {
    log: (line) => lines.push(line),
    error: (line) => errors.push(line),
    endpoint: 'https://indexnow.test/indexnow',
    fetchImpl: async () => new Response('forbidden', { status: 403 }),
  });
  assert.equal(code, 1);
  assert.match(lines.join('\n'), /HTTP 403 \(1 URLs\)/);
  assert.match(errors.join('\n'), /forbidden/);
});

test('splits submissions into batches of at most 10000', async () => {
  const urls = Array.from({ length: 10001 }, (_, index) => `https://dayfiles.com/p/${index}`);
  const sizes = [];
  const code = await runIndexNow(urls, {
    ...silent,
    endpoint: 'https://indexnow.test/indexnow',
    fetchImpl: async (_url, init) => {
      sizes.push(JSON.parse(init.body).urlList.length);
      return new Response('', { status: 200 });
    },
  });
  assert.equal(code, 0);
  assert.deepEqual(sizes, [10000, 1]);
});

test('the CLI with no arguments does not contact IndexNow', () => {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const result = spawnSync(process.execPath, ['scripts/indexnow-submit.mjs'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /npm run indexnow:submit -- --all/);
  assert.equal(result.stdout, '');
});
