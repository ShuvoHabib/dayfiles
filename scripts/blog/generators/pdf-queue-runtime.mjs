import fs from 'node:fs/promises';
import path from 'node:path';
import { ensureDir, ROOT_DIR } from '../lib.mjs';

function parseArgs(argv) {
  const args = {
    baseDate: '2026-03-17',
    dryRun: false,
    limit: 0,
    outputDir: path.join(ROOT_DIR, 'content/blog-queue')
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--date' && argv[i + 1]) {
      args.baseDate = argv[i + 1];
      i += 1;
    } else if (arg === '--limit' && argv[i + 1]) {
      args.limit = Number.parseInt(argv[i + 1], 10) || 0;
      i += 1;
    } else if (arg === '--output-dir' && argv[i + 1]) {
      args.outputDir = path.resolve(argv[i + 1]);
      i += 1;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    }
  }

  return args;
}

function plusDays(baseDate, offset) {
  const date = new Date(`${baseDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

function quote(value) {
  return String(value).replaceAll('"', '\\"');
}

function renderFrontmatter({
  title,
  slug,
  date,
  product,
  description,
  tags,
  canonicalUrl,
  featuredImage,
  featuredImageAlt,
  sources,
  faq
}) {
  const lines = [
    '---',
    `title: "${quote(title)}"`,
    `slug: "${slug}"`,
    `date: "${date}"`,
    `product: "${product}"`,
    `description: "${quote(description)}"`,
    'tags:'
  ];

  for (const tag of tags) {
    lines.push(`  - "${quote(tag)}"`);
  }

  lines.push(`canonicalUrl: "${canonicalUrl}"`);
  lines.push(`featuredImage: "${featuredImage}"`);
  lines.push(`featuredImageAlt: "${quote(featuredImageAlt)}"`);
  lines.push('sources:');

  for (const source of sources) {
    lines.push(`  - title: "${quote(source.title)}"`);
    lines.push(`    url: "${source.url}"`);
  }

  if (Array.isArray(faq) && faq.length > 0) {
    lines.push('faq:');
    for (const item of faq) {
      lines.push(`  - q: "${quote(item.q)}"`);
      lines.push(`    a: "${quote(item.a)}"`);
    }
  }

  lines.push('---', '');
  return lines.join('\n');
}

async function writeIfChanged(filePath, contents) {
  let existing = null;
  try {
    existing = await fs.readFile(filePath, 'utf8');
  } catch {
    // ignore missing file
  }

  if (existing === contents) {
    return false;
  }

  await fs.writeFile(filePath, contents, 'utf8');
  return true;
}

export async function runPdfQueueGenerator({
  features,
  generatorName,
  slugForFeature,
  titleForFeature,
  descriptionForFeature,
  tagsForFeature,
  bodyForFeature,
  sourcesForFeature,
  faqForFeature
}) {
  const args = parseArgs(process.argv.slice(2));
  const selected = args.limit > 0 ? features.slice(0, args.limit) : features;
  let changed = 0;

  if (!args.dryRun) {
    await ensureDir(args.outputDir);
  }

  for (let i = 0; i < selected.length; i += 1) {
    const feature = selected[i];
    const slug = slugForFeature(feature);
    const date = plusDays(args.baseDate, i);
    const frontmatter = renderFrontmatter({
      title: titleForFeature(feature),
      slug,
      date,
      product: 'pdf',
      description: descriptionForFeature(feature),
      tags: tagsForFeature(feature),
      canonicalUrl: `https://dayfiles.com/blog/${slug}`,
      featuredImage: `/blog/images/${slug}.svg`,
      featuredImageAlt: `${feature.name} ${generatorName} visual`,
      sources: sourcesForFeature(feature),
      faq: faqForFeature ? faqForFeature(feature) : null
    });
    const markdown = `${frontmatter}\n${bodyForFeature(feature)}\n`;
    const outPath = path.join(args.outputDir, `${date}-${slug}.md`);

    if (args.dryRun) {
      console.log(`DRY RUN ${outPath}`);
      continue;
    }

    if (await writeIfChanged(outPath, markdown)) {
      changed += 1;
    }
  }

  console.log(
    args.dryRun
      ? `Dry run complete for ${selected.length} ${generatorName} article(s).`
      : `Generated/updated ${changed} ${generatorName} article(s).`
  );
}
