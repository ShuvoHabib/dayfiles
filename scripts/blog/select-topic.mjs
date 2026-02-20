import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPosts, ROOT_DIR } from './lib.mjs';

const TOPICS = {
  eis: [
    'Image workflow automation for recurring content tasks',
    'How teams standardize image output quality with repeatable presets',
    'Practical batch image cleanup for marketing teams',
    'Faster image handoff from design to publishing'
  ],
  pdf: [
    'Reliable PDF conversion workflows for cross-team collaboration',
    'How to reduce PDF size without losing readability',
    'Document packaging and PDF handoff playbook',
    'PDF cleanup checklist for client-ready deliverables'
  ]
};

function parseArgs(argv) {
  const args = {
    forceProduct: 'auto',
    out: path.join(ROOT_DIR, 'tmp/blog/topic.json')
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--force-product' && argv[i + 1]) {
      args.forceProduct = argv[i + 1];
      i += 1;
    } else if (arg === '--out' && argv[i + 1]) {
      args.out = path.resolve(argv[i + 1]);
      i += 1;
    }
  }

  return args;
}

export async function chooseTopic(forceProduct = 'auto') {
  const posts = await readPosts();
  const last = posts[0];

  let product = 'eis';
  if (forceProduct === 'eis' || forceProduct === 'pdf') {
    product = forceProduct;
  } else if (last?.product === 'eis') {
    product = 'pdf';
  }

  const recentTitles = new Set(posts.slice(0, 6).map((post) => String(post.title || '').toLowerCase()));
  const topic = TOPICS[product].find((candidate) => !recentTitles.has(candidate.toLowerCase())) || TOPICS[product][0];

  return {
    selectedAt: new Date().toISOString(),
    product,
    topic
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const selection = await chooseTopic(args.forceProduct);
  await fs.mkdir(path.dirname(args.out), { recursive: true });
  await fs.writeFile(args.out, `${JSON.stringify(selection, null, 2)}\n`, 'utf8');
  console.log(`Selected topic (${selection.product}): ${selection.topic}`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
