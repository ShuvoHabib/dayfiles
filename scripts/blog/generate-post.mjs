import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import { chooseTopic } from './select-topic.mjs';
import { generateFeaturedImage } from './generate-image.mjs';
import { CONTENT_DIR, ROOT_DIR, ensureDir, normalizeDateString, postUrl, readPosts, slugify } from './lib.mjs';

function productHubHref(product) {
  return product === 'pdf' ? '/pdf-toolkit' : '/everyday-image-studio';
}

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

function fallbackDraft({ topic, product, sources, relatedPosts = [] }) {
  const productName = product === 'pdf' ? 'PDF Toolkit' : 'Everyday Image Studio';
  const otherName = product === 'pdf' ? 'Everyday Image Studio' : 'PDF Toolkit';
  const hubHref = productHubHref(product);
  const relatedLinks = relatedPosts
    .slice(0, 3)
    .map((post) => `[${post.title}](/blog/${post.slug})`)
    .join(', ');

  const title = `${productName} Workflow Guide: ${topic}`;
  const description = `A practical, source-backed guide to improve ${productName} workflows in daily team operations.`;

  const markdownBody = `How can a team turn ${topic} into a repeatable workflow without adding new handoff risk? The short answer is to define the output first, keep the transformation path narrow, and review the final artifact before it leaves ${productName}. That approach makes the workflow easier to repeat and easier to trust.

## What is this ${productName} workflow?

This workflow is a practical operating pattern for teams that use [${productName}](${hubHref}) to move files from intake to delivery with fewer ad hoc decisions. It works best when a team needs consistency, clear ownership, and a documented handoff rather than another one-off tool run.

## Why this workflow matters

Teams lose momentum when files move across too many tools. ${productName} helps centralize repetitive work so projects move from draft to delivery faster.

## What we observed from the live product pages

- [${productName}](${hubHref}) is positioned as a practical tool for daily operations.
- The Dayfiles stack includes both ${productName} and ${otherName}, so teams can combine image and document workflows.
- Core value proposition: create, convert, organize, and share files with less switching cost.

## How to run the workflow step by step

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

## Client-side workflow vs ad hoc tool switching

| Requirement | Defined ${productName} workflow | Ad hoc switching |
| --- | --- | --- |
| Ownership | One named operator per package | Ownership shifts during the job |
| Output quality | Checked against a known standard | Depends on whoever is available |
| Auditability | Sources and steps are easier to trace | Decisions are scattered across tools |
| Rework risk | Lower because the flow is documented | Higher because quality checks move around |

## Related reading

${relatedLinks || `Pair this guide with other Dayfiles workflow posts once adjacent coverage exists.`}

## Where to start on Dayfiles

Use [${productName}](${hubHref}) as the main hub on dayfiles.com when you need the product overview first, then open the live tool when you are ready to run the workflow directly.

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

async function generateWithAi({ topic, product, sourceFacts, sources, relatedPosts }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for AI post generation.');
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const productName = product === 'pdf' ? 'PDF Toolkit' : 'Everyday Image Studio';

  const system = `You are a senior SEO content writer for Dayfiles. Return strict JSON only with keys: title, description, tags, markdownBody, faq.
Rules:
- 1400-1800 words in markdownBody.
- Source-backed claims only from supplied facts.
- Title must be 50-60 characters and front-load the topic.
- Description must be 150-160 characters and start with Learn, Discover, Understand, or Use.
- Open with a question hook and a direct answer in the first paragraph.
- Include at least 5 H2 sections.
- Include one question-style H2.
- Include one "How to" H2 with numbered steps.
- Include one markdown comparison table.
- Use short paragraphs.
- Include a natural internal link to the main Dayfiles product hub: `/pdf-toolkit` for PDF content or `/everyday-image-studio` for image content.
- Link 2-4 relevant internal posts from the supplied relatedPosts list using markdown links to /blog/<slug> when the fit is natural.
- No fabricated metrics or unsupported product claims.
- FAQ must have exactly 3 items with keys q and a.`;

  const user = {
    topic,
    product,
    productName,
    sources,
    relatedPosts,
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

  const existing = await readPosts();
  const relatedPosts = existing
    .filter((post) => post.product === topicSelection.product)
    .slice(0, 8)
    .map((post) => ({ title: post.title, slug: post.slug }));

  let draft;
  if (args.dryRun || args.mode === 'dry-run') {
    draft = fallbackDraft({ topic: topicSelection.topic, product: topicSelection.product, sources, relatedPosts });
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
        sources,
        relatedPosts
      });
    } catch (error) {
      console.warn(`AI generation failed, using fallback draft: ${error.message}`);
      draft = fallbackDraft({ topic: topicSelection.topic, product: topicSelection.product, sources, relatedPosts });
    }
  }

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
