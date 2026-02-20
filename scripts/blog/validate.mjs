import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPosts, isValidUrl, normalizeDateString } from './lib.mjs';

const REQUIRED_STRING_FIELDS = [
  'title',
  'slug',
  'date',
  'product',
  'description',
  'canonicalUrl',
  'featuredImage',
  'featuredImageAlt'
];

function normalizeSource(source, idx, errors, file) {
  if (typeof source === 'string') {
    if (!isValidUrl(source)) {
      errors.push(`${file}: sources[${idx}] must be a valid URL string.`);
      return null;
    }

    return { title: `Source ${idx + 1}`, url: source };
  }

  if (!source || typeof source !== 'object') {
    errors.push(`${file}: sources[${idx}] must be an object { title, url } or URL string.`);
    return null;
  }

  if (!source.title || typeof source.title !== 'string') {
    errors.push(`${file}: sources[${idx}].title is required.`);
  }

  if (!source.url || typeof source.url !== 'string' || !isValidUrl(source.url)) {
    errors.push(`${file}: sources[${idx}].url must be a valid URL.`);
  }

  return { title: source.title, url: source.url };
}

function validateFaq(faq, errors, file) {
  if (!Array.isArray(faq) || faq.length === 0) {
    errors.push(`${file}: faq must be a non-empty array.`);
    return;
  }

  faq.forEach((entry, idx) => {
    if (!entry || typeof entry !== 'object') {
      errors.push(`${file}: faq[${idx}] must be an object { q, a }.`);
      return;
    }

    if (!entry.q || typeof entry.q !== 'string') {
      errors.push(`${file}: faq[${idx}].q is required.`);
    }

    if (!entry.a || typeof entry.a !== 'string') {
      errors.push(`${file}: faq[${idx}].a is required.`);
    }
  });
}

function validateBody(body, errors, file) {
  const words = String(body || '').trim().split(/\s+/).filter(Boolean);

  if (words.length < 300) {
    errors.push(`${file}: body must be at least 300 words; found ${words.length}.`);
  }
}

export async function validatePosts() {
  const posts = await readPosts();
  const errors = [];
  const seenSlugs = new Set();

  for (const post of posts) {
    for (const field of REQUIRED_STRING_FIELDS) {
      if (!post[field] || typeof post[field] !== 'string') {
        errors.push(`${post.file}: missing or invalid required field '${field}'.`);
      }
    }

    if (post.product !== 'eis' && post.product !== 'pdf') {
      errors.push(`${post.file}: product must be 'eis' or 'pdf'.`);
    }

    if (seenSlugs.has(post.slug)) {
      errors.push(`${post.file}: duplicate slug '${post.slug}'.`);
    }
    seenSlugs.add(post.slug);

    const normalizedDate = normalizeDateString(post.date);
    if (!normalizedDate) {
      errors.push(`${post.file}: date must be parseable (YYYY-MM-DD recommended).`);
    }

    if (!post.canonicalUrl || !post.canonicalUrl.startsWith('https://dayfiles.com/blog/')) {
      errors.push(`${post.file}: canonicalUrl must start with https://dayfiles.com/blog/.`);
    }

    if (!post.featuredImage.startsWith('/blog/images/')) {
      errors.push(`${post.file}: featuredImage must point to /blog/images/...`);
    }

    if (!Array.isArray(post.tags) || post.tags.length < 2) {
      errors.push(`${post.file}: tags must be an array with at least 2 values.`);
    }

    if (!Array.isArray(post.sources) || post.sources.length === 0) {
      errors.push(`${post.file}: sources must be a non-empty array.`);
    } else {
      post.sources = post.sources
        .map((source, idx) => normalizeSource(source, idx, errors, post.file))
        .filter(Boolean);
    }

    validateFaq(post.faq, errors, post.file);
    validateBody(post.body, errors, post.file);
  }

  return { posts, errors };
}

async function main() {
  const { errors, posts } = await validatePosts();

  if (errors.length > 0) {
    console.error('Blog validation failed:\n');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Blog validation passed for ${posts.length} post(s).`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
