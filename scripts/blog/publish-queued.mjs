import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { fileURLToPath } from 'node:url';
import { buildBlogArtifacts } from './build.mjs';
import { generateFeaturedImage } from './generate-image.mjs';
import { CONTENT_DIR, PUBLIC_DIR, ROOT_DIR, ensureDir, normalizeDateString } from './lib.mjs';

const QUEUE_DIR = path.join(ROOT_DIR, 'content/blog-queue');
const STATE_PATH = path.join(ROOT_DIR, '.blog-queue-state.json');

function parseArgs(argv) {
  const args = {
    mode: 'publish',
    date: '',
    ignoreSchedule: false,
    timezone: 'America/New_York',
    minGapDays: 2
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--mode' && argv[i + 1]) {
      args.mode = argv[i + 1];
      i += 1;
    } else if (arg === '--date' && argv[i + 1]) {
      args.date = argv[i + 1];
      i += 1;
    } else if (arg === '--ignore-schedule') {
      args.ignoreSchedule = true;
    } else if (arg === '--timezone' && argv[i + 1]) {
      args.timezone = argv[i + 1];
      i += 1;
    } else if (arg === '--min-gap-days' && argv[i + 1]) {
      args.minGapDays = Number(argv[i + 1]);
      i += 1;
    }
  }

  return args;
}

function getNowInTimezone(timezone = 'America/New_York', now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit'
  }).formatToParts(now);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    date: `${map.year}-${map.month}-${map.day}`,
    hour: Number(map.hour)
  };
}

function daysBetweenIso(a, b) {
  const aDate = new Date(`${a}T00:00:00Z`);
  const bDate = new Date(`${b}T00:00:00Z`);
  const ms = Math.abs(bDate.getTime() - aDate.getTime());
  return Math.floor(ms / 86400000);
}

async function readState() {
  try {
    const raw = await fs.readFile(STATE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {
      lastPublishedEtDate: null,
      lastPublishedSlug: null,
      publishedCount: 0,
      updatedAt: null
    };
  }
}

async function writeState(state) {
  const next = {
    ...state,
    updatedAt: new Date().toISOString()
  };
  await fs.writeFile(STATE_PATH, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

async function getNextQueuedFile() {
  await ensureDir(QUEUE_DIR);
  const files = await fs.readdir(QUEUE_DIR);
  const md = files.filter((file) => file.endsWith('.md')).sort();
  if (md.length === 0) {
    return null;
  }
  return md[0];
}

function assertPostContract(data, body, fileName) {
  const required = ['title', 'slug', 'product', 'description', 'canonicalUrl', 'featuredImage', 'featuredImageAlt'];
  for (const key of required) {
    if (!data[key] || typeof data[key] !== 'string') {
      throw new Error(`${fileName}: missing required frontmatter '${key}'.`);
    }
  }

  if (data.product !== 'pdf' && data.product !== 'eis') {
    throw new Error(`${fileName}: product must be 'pdf' or 'eis'.`);
  }

  if (!Array.isArray(data.tags) || data.tags.length < 2) {
    throw new Error(`${fileName}: tags must have at least 2 values.`);
  }

  if (!Array.isArray(data.sources) || data.sources.length < 1) {
    throw new Error(`${fileName}: sources must be a non-empty array.`);
  }

  if (!Array.isArray(data.faq) || data.faq.length < 1) {
    throw new Error(`${fileName}: faq must be a non-empty array.`);
  }

  for (let i = 0; i < data.sources.length; i += 1) {
    const source = data.sources[i];
    if (!source || typeof source !== 'object') {
      throw new Error(`${fileName}: sources[${i}] must be an object.`);
    }
    if (!source.title || typeof source.title !== 'string') {
      throw new Error(`${fileName}: sources[${i}].title is required.`);
    }
    if (!source.url || typeof source.url !== 'string' || !/^https?:\/\//.test(source.url)) {
      throw new Error(`${fileName}: sources[${i}].url must be a valid URL.`);
    }
  }

  for (let i = 0; i < data.faq.length; i += 1) {
    const faq = data.faq[i];
    if (!faq || typeof faq !== 'object') {
      throw new Error(`${fileName}: faq[${i}] must be an object.`);
    }
    if (!faq.q || typeof faq.q !== 'string') {
      throw new Error(`${fileName}: faq[${i}].q is required.`);
    }
    if (!faq.a || typeof faq.a !== 'string') {
      throw new Error(`${fileName}: faq[${i}].a is required.`);
    }
  }

  const words = String(body || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  if (words < 300) {
    throw new Error(`${fileName}: body must be at least 300 words; found ${words}.`);
  }
}

async function ensureFeaturedImage(data) {
  const featuredRelative = data.featuredImage;
  const featuredAbsolute = path.join(PUBLIC_DIR, featuredRelative.replace(/^\//, ''));

  try {
    await fs.access(featuredAbsolute);
    return featuredRelative;
  } catch {
    const outPng = path.join(PUBLIC_DIR, 'blog/images', `${data.slug}.png`);
    const generated = await generateFeaturedImage({
      title: data.title,
      product: data.product,
      slug: data.slug,
      out: outPng,
      dryRun: true
    });
    return generated.relativePath;
  }
}

async function publishOneFromQueue({ publishDate, dryRun }) {
  const nextFile = await getNextQueuedFile();
  if (!nextFile) {
    return { skipped: true, reason: 'queue_empty' };
  }

  const sourcePath = path.join(QUEUE_DIR, nextFile);
  const raw = await fs.readFile(sourcePath, 'utf8');
  const parsed = matter(raw);
  const data = { ...parsed.data };

  assertPostContract(data, parsed.content, nextFile);
  data.date = publishDate;
  data.canonicalUrl = `https://dayfiles.com/blog/${data.slug}`;
  if (!dryRun) {
    data.featuredImage = await ensureFeaturedImage(data);
  }

  const outputFile = `${publishDate}-${data.slug}.md`;
  const destinationPath = path.join(CONTENT_DIR, outputFile);
  const nextRaw = matter.stringify(parsed.content.trim(), data);

  if (dryRun) {
    return {
      skipped: false,
      dryRun: true,
      queuedFile: nextFile,
      targetFile: outputFile,
      slug: data.slug
    };
  }

  await ensureDir(CONTENT_DIR);
  await fs.writeFile(destinationPath, `${nextRaw.trim()}\n`, 'utf8');
  await fs.unlink(sourcePath);

  return {
    skipped: false,
    dryRun: false,
    queuedFile: nextFile,
    targetFile: outputFile,
    slug: data.slug
  };
}

export async function publishQueued(options = {}) {
  const args = {
    mode: 'publish',
    date: '',
    ignoreSchedule: false,
    timezone: 'America/New_York',
    minGapDays: 2,
    ...options
  };

  const dryRun = args.mode === 'dry-run';
  const nowTz = getNowInTimezone(args.timezone);
  const publishDate = normalizeDateString(args.date || nowTz.date);

  if (!publishDate) {
    throw new Error(`Invalid publish date: ${args.date}`);
  }

  if (!dryRun && !args.ignoreSchedule && nowTz.hour !== 9) {
    console.log(
      `Skipping publish. Current ${args.timezone} hour is ${nowTz.hour}:00; publish window is 09:00.`
    );
    return { skipped: true, reason: 'outside_publish_window' };
  }

  const state = await readState();
  if (!dryRun && state.lastPublishedEtDate) {
    const gap = daysBetweenIso(state.lastPublishedEtDate, publishDate);
    if (gap < args.minGapDays) {
      console.log(
        `Skipping publish. Last publish date was ${state.lastPublishedEtDate}; minimum gap is ${args.minGapDays} days.`
      );
      return { skipped: true, reason: 'cadence_not_met' };
    }
  }

  const publishResult = await publishOneFromQueue({ publishDate, dryRun });
  if (publishResult.skipped) {
    return publishResult;
  }

  if (dryRun) {
    console.log(
      `Dry-run ready: ${publishResult.queuedFile} -> ${publishResult.targetFile} (slug: ${publishResult.slug}).`
    );
    return publishResult;
  }

  await buildBlogArtifacts();

  await writeState({
    ...state,
    lastPublishedEtDate: publishDate,
    lastPublishedSlug: publishResult.slug,
    publishedCount: Number(state.publishedCount || 0) + 1
  });

  console.log(`Published queued post ${publishResult.slug} for ${publishDate}.`);
  return publishResult;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await publishQueued(args);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
