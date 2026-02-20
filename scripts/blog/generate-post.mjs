import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import { chooseTopic } from './select-topic.mjs';
import { generateFeaturedImage } from './generate-image.mjs';
import { CONTENT_DIR, ROOT_DIR, ensureDir, normalizeDateString, postUrl, readPosts, slugify } from './lib.mjs';

function parseArgs(argv) {
  const args = {
    facts: path.join(ROOT_DIR, 'tmp/blog/facts.json'),
    mode: 'publish',
    forceProduct: 'auto',
    forceSlug: '',
    date: '',
    dryRun: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--facts' && argv[i + 1]) {
      args.facts = path.resolve(argv[i + 1]);
      i += 1;
    } else if (arg === '--mode' && argv[i + 1]) {
      args.mode = argv[i + 1];
      i += 1;
    } else if (arg === '--force-product' && argv[i + 1]) {
      args.forceProduct = argv[i + 1];
      i += 1;
    } else if (arg === '--force-slug' && argv[i + 1]) {
      args.forceSlug = argv[i + 1];
      i += 1;
    } else if (arg === '--date' && argv[i + 1]) {
      args.date = argv[i + 1];
      i += 1;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    }
  }

  return args;
}

function toEtDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function compactLines(lines = []) {
  return lines.filter(Boolean).map((line) => String(line).trim()).filter((line) => line.length > 0);
}

function renderFrontmatter({ title, slug, date, product, description, tags, canonicalUrl, featuredImage, featuredImageAlt, sources, faq }) {
  const yaml = [
    '---',
    `title: "${String(title).replaceAll('"', '\\"')}"`,
    `slug: "${slug}"`,
    `date: "${date}"`,
    `product: "${product}"`,
    `description: "${String(description).replaceAll('"', '\\"')}"`,
    'tags:'
  ];

  tags.forEach((tag) => {
    yaml.push(`  - "${String(tag).replaceAll('"', '\\"')}"`);
  });

  yaml.push(`canonicalUrl: "${canonicalUrl}"`);
  yaml.push(`featuredImage: "${featuredImage}"`);
  yaml.push(`featuredImageAlt: "${String(featuredImageAlt).replaceAll('"', '\\"')}"`);
  yaml.push('sources:');

  sources.forEach((source) => {
    yaml.push(`  - title: "${String(source.title).replaceAll('"', '\\"')}"`);
    yaml.push(`    url: "${source.url}"`);
  });

  yaml.push('faq:');
  faq.forEach((item) => {
    yaml.push(`  - q: "${String(item.q).replaceAll('"', '\\"')}"`);
    yaml.push(`    a: "${String(item.a).replaceAll('"', '\\"')}"`);
  });
  yaml.push('---', '');

  return yaml.join('\n');
}

function fallbackDraft({ topic, product, sources }) {
  const productName = product === 'pdf' ? 'PDF Toolkit' : 'Everyday Image Studio';
  const otherName = product === 'pdf' ? 'Everyday Image Studio' : 'PDF Toolkit';

  const title = `${productName} Workflow Guide: ${topic}`;
  const description = `A practical, source-backed guide to improve ${productName} workflows in daily team operations.`;

  const markdownBody = `## Why this workflow matters

Teams lose momentum when files move across too many tools. ${productName} helps centralize repetitive work so projects move from draft to delivery faster.

## What we observed from the live product pages

- ${productName} is positioned as a practical tool for daily operations.
- The Dayfiles stack includes both ${productName} and ${otherName}, so teams can combine image and document workflows.
- Core value proposition: create, convert, organize, and share files with less switching cost.

## Step-by-step execution model

### 1. Intake and triage
Create a repeatable intake checklist for file requests. Standardize naming, ownership, and expected output type.

### 2. Transformation and quality checks
Use ${productName} for the transformation stage, then run a quality pass before any handoff. Keep output presets consistent.

### 3. Publish and handoff
Use stable output naming and include source references in every final package.

## Team operating standards

- Define one owner per file package.
- Keep approval criteria written and versioned.
- Track cycle time and rework counts by file type.

## Integration with the wider Dayfiles stack

A reliable practice is to route visual assets through Everyday Image Studio and finalized documents through PDF Toolkit. This separation keeps quality bars clear while preserving delivery speed.

## Common pitfalls and fixes

- **Pitfall:** inconsistent file naming. **Fix:** template-based naming.
- **Pitfall:** unclear output quality. **Fix:** preset-driven export rules.
- **Pitfall:** weak handoff context. **Fix:** include links, source files, and change notes.

## Final checklist

1. Confirm input quality and target output format.
2. Apply preset workflow steps in ${productName}.
3. Run QA checklist before release.
4. Package and share with explicit source links.
`;

  return {
    title,
    description,
    tags: ['file workflow', productName.toLowerCase(), 'dayfiles', 'operations'],
    markdownBody,
    faq: [
      {
        q: `When should teams use ${productName}?`,
        a: `Use ${productName} when the team needs repeatable, high-quality file transformation and quick handoff.`
      },
      {
        q: 'How often should workflow presets be reviewed?',
        a: 'Review presets at least monthly or after major output quality issues.'
      },
      {
        q: 'Why include source links in each post?',
        a: 'Source links keep claims verifiable and reduce content drift over time.'
      }
    ],
    sources
  };
}

async function generateWithAi({ topic, product, sourceFacts, sources }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for AI post generation.');
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const productName = product === 'pdf' ? 'PDF Toolkit' : 'Everyday Image Studio';

  const system = `You are a senior SEO content writer for Dayfiles. Return strict JSON only with keys: title, description, tags, markdownBody, faq.\nRules:\n- 1200-1600 words markdownBody.\n- Source-backed claims only from supplied facts.\n- Include practical how-to structure with H2/H3 headings.\n- No fabricated metrics.\n- FAQ must have exactly 3 items with keys q and a.`;

  const user = {
    topic,
    product,
    productName,
    sources,
    facts: sourceFacts
  };

  const response = await client.chat.completions.create({
    model: process.env.BLOG_TEXT_MODEL || 'gpt-4.1-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      {
        role: 'user',
        content: JSON.stringify(user)
      }
    ]
  });

  const content = response.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('AI response was empty.');
  }

  const parsed = JSON.parse(content);
  parsed.sources = sources;
  return parsed;
}

function ensureUniqueSlug(baseSlug, existingSlugs) {
  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  while (existingSlugs.has(`${baseSlug}-${counter}`)) {
    counter += 1;
  }

  return `${baseSlug}-${counter}`;
}

export async function generatePost(options = {}) {
  const args = {
    facts: path.join(ROOT_DIR, 'tmp/blog/facts.json'),
    mode: 'publish',
    forceProduct: 'auto',
    forceSlug: '',
    date: '',
    dryRun: false,
    ...options
  };

  const factsRaw = await fs.readFile(args.facts, 'utf8');
  const facts = JSON.parse(factsRaw);

  const topicSelection = await chooseTopic(args.forceProduct);
  const selectedSource = facts.sources.find((source) => source.product === topicSelection.product);
  if (!selectedSource) {
    throw new Error(`No facts found for product ${topicSelection.product}`);
  }

  const sources = [
    { title: selectedSource.name, url: selectedSource.url },
    {
      title: 'Dayfiles Home',
      url: 'https://dayfiles.com/'
    }
  ];

  let draft;
  if (args.dryRun || args.mode === 'dry-run') {
    draft = fallbackDraft({ topic: topicSelection.topic, product: topicSelection.product, sources });
  } else {
    try {
      draft = await generateWithAi({
        topic: topicSelection.topic,
        product: topicSelection.product,
        sourceFacts: {
          headings: compactLines(selectedSource.headings),
          paragraphs: compactLines(selectedSource.paragraphs),
          textSample: selectedSource.textSample,
          sourceUrl: selectedSource.url,
          scrapedAt: selectedSource.scrapedAt
        },
        sources
      });
    } catch (error) {
      console.warn(`AI generation failed, using fallback draft: ${error.message}`);
      draft = fallbackDraft({ topic: topicSelection.topic, product: topicSelection.product, sources });
    }
  }

  const existing = await readPosts();
  const existingSlugs = new Set(existing.map((post) => post.slug));

  const date = normalizeDateString(args.date || toEtDateString(new Date()));
  const initialSlug = args.forceSlug || slugify(draft.title || topicSelection.topic);
  const slug = ensureUniqueSlug(initialSlug, existingSlugs);

  const imageOutPath = path.join(ROOT_DIR, 'public/blog/images', `${slug}.png`);
  const isDryRun = args.dryRun || args.mode === 'dry-run';
  const effectiveImageOutPath = isDryRun
    ? path.join(ROOT_DIR, 'tmp/blog/images', `${slug}.png`)
    : imageOutPath;
  const image = await generateFeaturedImage({
    title: draft.title,
    product: topicSelection.product,
    slug,
    out: effectiveImageOutPath,
    dryRun: isDryRun
  });

  const canonicalUrl = postUrl(slug);
  const frontmatter = renderFrontmatter({
    title: draft.title,
    slug,
    date,
    product: topicSelection.product,
    description: draft.description,
    tags: Array.isArray(draft.tags) ? draft.tags.slice(0, 8) : ['dayfiles', 'file workflow'],
    canonicalUrl,
    featuredImage: isDryRun ? '/blog/images/preview-placeholder.svg' : image.relativePath,
    featuredImageAlt: `Featured image for ${draft.title}`,
    sources,
    faq: Array.isArray(draft.faq) ? draft.faq.slice(0, 3) : fallbackDraft({ topic: topicSelection.topic, product: topicSelection.product, sources }).faq
  });

  const outputDir = isDryRun ? path.join(ROOT_DIR, 'tmp/blog/drafts') : CONTENT_DIR;
  await ensureDir(outputDir);
  const fileName = `${date}-${slug}.md`;
  const postPath = path.join(outputDir, fileName);
  await fs.writeFile(postPath, `${frontmatter}${draft.markdownBody.trim()}\n`, 'utf8');

  return {
    fileName,
    postPath,
    slug,
    title: draft.title,
    date,
    product: topicSelection.product,
    image: image.relativePath
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await generatePost(args);
  console.log(`Created blog post: ${result.fileName}`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
