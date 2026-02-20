import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { fileURLToPath } from 'node:url';

marked.setOptions({
  gfm: true,
  breaks: false
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, '../..');
export const CONTENT_DIR = path.join(ROOT_DIR, 'content/blog');
export const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
export const BLOG_PUBLIC_DIR = path.join(PUBLIC_DIR, 'blog');
export const BLOG_IMAGE_DIR = path.join(BLOG_PUBLIC_DIR, 'images');
export const GENERATED_DIR = path.join(ROOT_DIR, 'src/generated');
export const BLOG_INDEX_JSON = path.join(GENERATED_DIR, 'blog-index.json');
export const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
export const LLMS_PATH = path.join(PUBLIC_DIR, 'llms.txt');
export const FEED_PATH = path.join(BLOG_PUBLIC_DIR, 'feed.xml');
export const REDIRECTS_PATH = path.join(PUBLIC_DIR, '_redirects');
export const SITE_URL = 'https://dayfiles.com';

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function normalizeDateString(dateInput) {
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) {
    return null;
  }

  return d.toISOString().slice(0, 10);
}

export function formatHumanDate(dateInput) {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function renderMarkdown(markdown) {
  return marked.parse(markdown || '');
}

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function listMarkdownFiles(contentDir = CONTENT_DIR) {
  await ensureDir(contentDir);
  const files = await fs.readdir(contentDir);
  return files.filter((file) => file.endsWith('.md')).sort();
}

export async function readPosts(contentDir = CONTENT_DIR) {
  const files = await listMarkdownFiles(contentDir);
  const posts = [];

  for (const file of files) {
    const absPath = path.join(contentDir, file);
    const raw = await fs.readFile(absPath, 'utf8');
    const parsed = matter(raw);

    posts.push({
      file,
      path: absPath,
      body: parsed.content.trim(),
      html: renderMarkdown(parsed.content.trim()),
      ...parsed.data
    });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export function isValidUrl(urlValue) {
  try {
    const url = new URL(urlValue);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function toAbsoluteUrl(urlValue) {
  if (!urlValue) {
    return '';
  }

  if (urlValue.startsWith('http://') || urlValue.startsWith('https://')) {
    return urlValue;
  }

  if (urlValue.startsWith('/')) {
    return `${SITE_URL}${urlValue}`;
  }

  return `${SITE_URL}/${urlValue}`;
}

export function postUrl(slug) {
  return `${SITE_URL}/blog/${slug}`;
}

export function postRelativeUrl(slug) {
  return `/blog/${slug}`;
}

export function readingMinutes(markdown) {
  const words = String(markdown || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export async function writeJson(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export async function removeDirIfExists(dirPath) {
  await fs.rm(dirPath, { recursive: true, force: true });
}
