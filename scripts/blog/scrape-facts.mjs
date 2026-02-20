import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT_DIR, ensureDir } from './lib.mjs';

const TARGETS = [
  {
    product: 'eis',
    name: 'Everyday Image Studio',
    url: 'https://everydayimagestudio.dayfiles.com/'
  },
  {
    product: 'pdf',
    name: 'PDF Toolkit',
    url: 'https://pdf.dayfiles.com/'
  }
];

function parseArgs(argv) {
  const args = { out: path.join(ROOT_DIR, 'tmp/blog/facts.json') };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--out' && argv[i + 1]) {
      args.out = path.resolve(argv[i + 1]);
      i += 1;
    }
  }

  return args;
}

function cleanText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractHeadings(html) {
  const matches = html.match(/<h[1-3][^>]*>.*?<\/h[1-3]>/gim) || [];
  return matches
    .map((entry) => cleanText(entry))
    .filter((line) => line.length > 2)
    .slice(0, 12);
}

function extractParagraphLines(html) {
  const matches = html.match(/<p[^>]*>.*?<\/p>/gim) || [];
  const lines = matches
    .map((entry) => cleanText(entry))
    .filter((line) => line.length > 40)
    .slice(0, 30);

  return Array.from(new Set(lines)).slice(0, 12);
}

export async function scrapeFacts() {
  const results = [];

  for (const target of TARGETS) {
    const response = await fetch(target.url, {
      headers: {
        'user-agent': 'dayfiles-blog-bot/1.0 (+https://dayfiles.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to scrape ${target.url}: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const text = cleanText(html);

    results.push({
      ...target,
      scrapedAt: new Date().toISOString(),
      title: (html.match(/<title[^>]*>(.*?)<\/title>/i) || [null, target.name])[1],
      headings: extractHeadings(html),
      paragraphs: extractParagraphLines(html),
      textSample: text.slice(0, 3000)
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    sources: results
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const facts = await scrapeFacts();
  await ensureDir(path.dirname(args.out));
  await fs.writeFile(args.out, `${JSON.stringify(facts, null, 2)}\n`, 'utf8');
  console.log(`Scraped ${facts.sources.length} source pages -> ${args.out}`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
