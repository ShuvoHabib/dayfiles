import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

async function collectFiles(directory, extension, results = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectFiles(filePath, extension, results);
    if (entry.isFile() && entry.name.endsWith(extension)) results.push(filePath);
  }
  return results;
}

const sitemap = await readFile('public/sitemap.xml', 'utf8');
const blogIndex = JSON.parse(await readFile('public/blog-index.json', 'utf8'));
const blogDirectories = blogIndex.map((entry) => entry.slug);
const htmlFiles = await collectFiles('public', '.html');
const html = (await Promise.all(htmlFiles.map((file) => readFile(file, 'utf8')))).join('\n');
const failures = [];

for (const slug of ['product-hunt-launch-everyday-image-studio', 'eis-workflow-playbook']) {
  if (sitemap.includes(slug) || blogDirectories.includes(slug)) {
    failures.push(`retired article is still published: ${slug}`);
  }
}

if (blogDirectories.length !== 19) {
  failures.push(`expected 19 retained blog directories, found ${blogDirectories.length}`);
}
if (/adsbygoogle|pagead2\.googlesyndication\.com|googletagmanager\.com/i.test(html)) {
  failures.push('generated approval inventory contains an advertising or analytics script');
}
if (/type="checkbox"[^>]*\schecked(?:\s|=|>)/i.test(html)) {
  failures.push('generated subscription consent is preselected');
}

for (const slug of blogDirectories) {
  const article = await readFile(path.join('public/blog', slug, 'index.html'), 'utf8');
  if (!article.includes('Maintained and self-reviewed') || !article.includes('Last checked ')) {
    failures.push(`retained article lacks visible maintenance evidence: ${slug}`);
  }
}

if (failures.length) {
  throw new Error(`AdSense guardrails failed:\n- ${failures.join('\n- ')}`);
}

const sitemapCount = (sitemap.match(/<loc>/g) ?? []).length;
console.log(`AdSense guardrails passed for ${blogDirectories.length} articles and ${sitemapCount} editorial URLs.`);
