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

function collectSeoWarnings(post) {
  const warnings = [];
  const titleLength = String(post.title || '').trim().length;
  const descriptionLength = String(post.description || '').trim().length;
  const body = String(post.body || '').trim();
  const words = body.split(/\s+/).filter(Boolean);
  const introParagraph = body.split(/\n\s*\n/)[0] || '';
  const h2s = [...body.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim());
  const hasQuestionH2 = h2s.some((heading) => /^(what|why|how|when|where|can|should)\b/i.test(heading));
  const hasOrderedList = /^\d+\.\s+/m.test(body);
  const internalLinkCount = (body.match(/\[[^\]]+\]\(\/blog\/[^)]+\)/g) || []).length;

  if (titleLength < 50 || titleLength > 60) {
    warnings.push(`${post.file}: title should ideally be 50-60 characters; found ${titleLength}.`);
  }

  if (descriptionLength < 150 || descriptionLength > 160) {
    warnings.push(`${post.file}: description should ideally be 150-160 characters; found ${descriptionLength}.`);
  }

  if (words.length < 900) {
    warnings.push(`${post.file}: body is thin for search intent; target at least 900 words, found ${words.length}.`);
  }

  if (!/^\s*(how|what|why|when|where|can|should)\b/i.test(introParagraph)) {
    warnings.push(`${post.file}: opening paragraph should start with a question hook.`);
  }

  if (h2s.length < 5) {
    warnings.push(`${post.file}: add more H2 sections to improve topical coverage; found ${h2s.length}.`);
  }

  if (!hasQuestionH2) {
    warnings.push(`${post.file}: include at least one question-style H2 for featured snippet coverage.`);
  }

  if (!hasOrderedList) {
    warnings.push(`${post.file}: include a numbered procedure or checklist in the body.`);
  }

  if (internalLinkCount < 2) {
    warnings.push(`${post.file}: include at least 2 internal /blog/ links in the body; found ${internalLinkCount}.`);
  }

  if (!Array.isArray(post.faq) || post.faq.length !== 3) {
    warnings.push(`${post.file}: FAQ should contain exactly 3 entries for the current template.`);
  }

  return warnings;
}

export async function validatePosts(options = {}) {
  const strictSeo = options.strictSeo === true;
  const posts = await readPosts();
  const errors = [];
  const warnings = [];
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

    const postWarnings = collectSeoWarnings(post);
    warnings.push(...postWarnings);
    if (strictSeo) {
      errors.push(...postWarnings.map((warning) => `[seo] ${warning}`));
    }
  }

  return { posts, errors, warnings };
}

async function main() {
  const strictSeo = process.argv.includes('--strict-seo') || process.env.BLOG_STRICT_SEO === '1';
  const { errors, posts, warnings } = await validatePosts({ strictSeo });

  if (warnings.length > 0) {
    console.warn('Blog SEO warnings:\n');
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
    console.warn('');
  }

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
