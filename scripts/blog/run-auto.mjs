import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBlogArtifacts } from './build.mjs';
import { CONTENT_DIR, ROOT_DIR, ensureDir } from './lib.mjs';
import { generatePost } from './generate-post.mjs';
import { scrapeFacts } from './scrape-facts.mjs';

function parseArgs(argv) {
  const args = {
    mode: 'publish',
    forceProduct: 'auto',
    forceSlug: '',
    date: '',
    ignoreSchedule: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--mode' && argv[i + 1]) {
      args.mode = argv[i + 1];
      i += 1;
    } else if ((arg === '--force-product' || arg === '--force_product') && argv[i + 1]) {
      args.forceProduct = argv[i + 1];
      i += 1;
    } else if ((arg === '--force-slug' || arg === '--force_slug') && argv[i + 1]) {
      args.forceSlug = argv[i + 1];
      i += 1;
    } else if (arg === '--date' && argv[i + 1]) {
      args.date = argv[i + 1];
      i += 1;
    } else if (arg === '--ignore-schedule') {
      args.ignoreSchedule = true;
    }
  }

  return args;
}

function getEasternNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour12: false,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit'
  }).formatToParts(now);

  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    weekday: lookup.weekday,
    date: `${lookup.year}-${lookup.month}-${lookup.day}`,
    hour: Number(lookup.hour)
  };
}

async function alreadyPublished(dateStr) {
  await ensureDir(CONTENT_DIR);
  const files = await fs.readdir(CONTENT_DIR);
  return files.some((file) => file.startsWith(`${dateStr}-`) && file.endsWith('.md'));
}

async function writeFactsSnapshot(facts) {
  const outPath = path.join(ROOT_DIR, 'tmp/blog/facts.json');
  await ensureDir(path.dirname(outPath));
  await fs.writeFile(outPath, `${JSON.stringify(facts, null, 2)}\n`, 'utf8');
  return outPath;
}

export async function runAutomation(options = {}) {
  const args = {
    mode: 'publish',
    forceProduct: 'auto',
    forceSlug: '',
    date: '',
    ignoreSchedule: false,
    ...options
  };

  const dryRun = args.mode === 'dry-run';
  const etNow = getEasternNow();

  if (!dryRun && !args.ignoreSchedule) {
    const validDay = ['Mon', 'Wed', 'Fri'].includes(etNow.weekday);
    const validHour = etNow.hour === 9;

    if (!validDay || !validHour) {
      console.log(
        `Skipping publish. Current ET window is ${etNow.weekday} ${etNow.hour}:00; publish window is Mon/Wed/Fri at 09:00 ET.`
      );
      return { skipped: true, reason: 'outside_publish_window' };
    }
  }

  const publishDate = args.date || etNow.date;

  if (!dryRun && (await alreadyPublished(publishDate))) {
    console.log(`A post already exists for ${publishDate}. Exiting without changes.`);
    return { skipped: true, reason: 'already_published' };
  }

  const facts = await scrapeFacts();
  const factsPath = await writeFactsSnapshot(facts);

  const result = await generatePost({
    facts: factsPath,
    mode: args.mode,
    forceProduct: args.forceProduct,
    forceSlug: args.forceSlug,
    date: publishDate,
    dryRun
  });

  if (dryRun) {
    console.log(`Dry-run draft created at ${result.postPath}`);
    return { skipped: false, dryRun: true, result };
  }

  await buildBlogArtifacts();
  console.log(`Published post ${result.slug} for ${publishDate}.`);
  return { skipped: false, dryRun: false, result };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await runAutomation(args);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
