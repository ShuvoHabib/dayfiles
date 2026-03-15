import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import matter from 'gray-matter';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');

function collectSitemapUrls(xml) {
  return new Set([...String(xml).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
}

async function copyIntoTemp(relativePath, tempRoot) {
  const sourcePath = path.join(repoRoot, relativePath);
  const destPath = path.join(tempRoot, relativePath);
  await fs.cp(sourcePath, destPath, { recursive: true });
}

async function ensureFileCopy(relativePath, tempRoot) {
  const sourcePath = path.join(repoRoot, relativePath);
  const destPath = path.join(tempRoot, relativePath);
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.copyFile(sourcePath, destPath);
}

function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

async function main() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'dayfiles-publish-test-'));

  try {
    await copyIntoTemp('content/blog', tempRoot);
    await copyIntoTemp('content/blog-queue', tempRoot);
    await copyIntoTemp('public', tempRoot);
    await copyIntoTemp('src/generated', tempRoot);
    await ensureFileCopy('.blog-queue-state.json', tempRoot).catch(async () => {
      const statePath = path.join(tempRoot, '.blog-queue-state.json');
      await fs.writeFile(
        statePath,
        `${JSON.stringify(
          {
            lastPublishedEtDate: null,
            lastPublishedSlug: null,
            publishedCount: 0,
            updatedAt: null
          },
          null,
          2
        )}\n`,
        'utf8'
      );
    });

    process.env.DAYFILES_ROOT_DIR = tempRoot;

    const lib = await import(pathToFileURL(path.join(repoRoot, 'scripts/blog/lib.mjs')).href);
    const publishModule = await import(pathToFileURL(path.join(repoRoot, 'scripts/blog/publish-queued.mjs')).href);

    const queueFiles = await fs.readdir(path.join(tempRoot, 'content/blog-queue'));
    const nextFile = queueFiles.filter((file) => file.endsWith('.md')).sort()[0];
    assert.ok(nextFile, 'Expected at least one queued post for sitemap test.');

    const queuedRaw = await fs.readFile(path.join(tempRoot, 'content/blog-queue', nextFile), 'utf8');
    const queued = matter(queuedRaw);
    const expectedUrl = `${lib.SITE_URL}/blog/${queued.data.slug}`;

    const beforeSitemap = await fs.readFile(path.join(tempRoot, 'public/sitemap.xml'), 'utf8');
    const beforeUrls = collectSitemapUrls(beforeSitemap);

    const stateRaw = await fs.readFile(path.join(tempRoot, '.blog-queue-state.json'), 'utf8');
    const state = JSON.parse(stateRaw);
    const publishDate = state.lastPublishedEtDate ? addDays(state.lastPublishedEtDate, 2) : '2026-03-01';

    await publishModule.publishQueued({
      mode: 'publish',
      date: publishDate,
      ignoreSchedule: true,
      timezone: 'America/New_York',
      minGapDays: 2
    });

    const afterSitemap = await fs.readFile(path.join(tempRoot, 'public/sitemap.xml'), 'utf8');
    const afterUrls = collectSitemapUrls(afterSitemap);
    const added = [...afterUrls].filter((url) => !beforeUrls.has(url));
    const removed = [...beforeUrls].filter((url) => !afterUrls.has(url));

    assert.deepEqual(removed, [], 'Publishing should not remove existing sitemap URLs.');
    assert.deepEqual(added, [expectedUrl], 'Publishing should add exactly one new sitemap URL.');

    const postHtmlPath = path.join(tempRoot, 'public/blog', queued.data.slug, 'index.html');
    await fs.access(postHtmlPath);

    const publishedMarkdownPath = path.join(tempRoot, 'content/blog', `${publishDate}-${queued.data.slug}.md`);
    await fs.access(publishedMarkdownPath);

    console.log(`Sitemap publish test passed for ${queued.data.slug}.`);
  } finally {
    delete process.env.DAYFILES_ROOT_DIR;
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
