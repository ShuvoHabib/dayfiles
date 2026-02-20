import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import { BLOG_IMAGE_DIR, ensureDir, slugify } from './lib.mjs';

function parseArgs(argv) {
  const args = {
    title: '',
    product: 'eis',
    slug: '',
    out: '',
    dryRun: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--title' && argv[i + 1]) {
      args.title = argv[i + 1];
      i += 1;
    } else if (arg === '--product' && argv[i + 1]) {
      args.product = argv[i + 1];
      i += 1;
    } else if (arg === '--slug' && argv[i + 1]) {
      args.slug = argv[i + 1];
      i += 1;
    } else if (arg === '--out' && argv[i + 1]) {
      args.out = path.resolve(argv[i + 1]);
      i += 1;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    }
  }

  if (!args.slug && args.title) {
    args.slug = slugify(args.title);
  }

  if (!args.out) {
    args.out = path.join(BLOG_IMAGE_DIR, `${args.slug || 'blog-image'}.png`);
  }

  return args;
}

async function writePlaceholderImage(filePath, product, title) {
  const palette =
    product === 'pdf'
      ? { a: '#63C7FF', b: '#4EA0FF', fg: '#F6F7FB' }
      : { a: '#5DE2B0', b: '#48C7A7', fg: '#F6F7FB' };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${palette.a}"/><stop offset="1" stop-color="${palette.b}"/></linearGradient></defs>
  <rect width="1600" height="900" fill="#0B1020"/>
  <circle cx="1240" cy="140" r="280" fill="url(#g)" opacity="0.28"/>
  <rect x="96" y="120" width="1408" height="660" rx="36" fill="#101A34" stroke="#1B2A54"/>
  <text x="160" y="260" fill="${palette.fg}" font-family="Arial, sans-serif" font-size="52" font-weight="700">Dayfiles Blog</text>
  <text x="160" y="340" fill="#C0C8DF" font-family="Arial, sans-serif" font-size="42">${title.replaceAll('&', 'and')}</text>
  <text x="160" y="760" fill="#C0C8DF" font-family="Arial, sans-serif" font-size="32">Generated placeholder image</text>
</svg>`;

  await fs.writeFile(filePath.replace(/\.png$/, '.svg'), svg, 'utf8');
  return filePath.replace(/\.png$/, '.svg');
}

async function screenshotFallback(filePath, product) {
  const targetUrl = product === 'pdf' ? 'https://pdf.dayfiles.com/' : 'https://everydayimagestudio.dayfiles.com/';

  try {
    const playwright = await import('playwright');
    const browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await page.screenshot({ path: filePath, fullPage: false });
    await browser.close();
    return filePath;
  } catch (error) {
    throw new Error(
      `Image fallback mode is set to screenshot but Playwright screenshot failed. ${error?.message || error}`
    );
  }
}

export async function generateFeaturedImage({ title, product, slug, out, dryRun = false }) {
  await ensureDir(path.dirname(out));

  if (dryRun || !process.env.OPENAI_API_KEY) {
    const placeholderPath = await writePlaceholderImage(out, product, title || slug);
    return { relativePath: placeholderPath.replace(/.*\/public/, ''), absolutePath: placeholderPath, mode: 'placeholder' };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = [
    'Create a clean, editorial featured image for a technical blog post.',
    `Brand: Dayfiles. Product focus: ${product === 'pdf' ? 'PDF Toolkit' : 'Everyday Image Studio'}.`,
    `Post title: ${title}.`,
    'Style: modern SaaS illustration, premium, minimal clutter, soft gradients, no logos from other brands.',
    'No text overlays, no watermark.'
  ].join(' ');

  try {
    const result = await client.images.generate({
      model: process.env.BLOG_IMAGE_MODEL || 'gpt-image-1',
      prompt,
      size: '1536x1024',
      quality: 'high'
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      throw new Error('Image response missing base64 payload.');
    }

    await fs.writeFile(out, Buffer.from(b64, 'base64'));
    return { relativePath: out.replace(/.*\/public/, ''), absolutePath: out, mode: 'ai' };
  } catch (error) {
    const fallbackMode = process.env.BLOG_IMAGE_FALLBACK || 'abort';

    if (fallbackMode === 'screenshot') {
      const screenshotPath = await screenshotFallback(out, product);
      return {
        relativePath: screenshotPath.replace(/.*\/public/, ''),
        absolutePath: screenshotPath,
        mode: 'screenshot-fallback'
      };
    }

    throw error;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const output = await generateFeaturedImage(args);
  console.log(`Featured image created (${output.mode}): ${output.relativePath}`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
