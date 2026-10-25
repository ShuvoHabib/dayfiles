import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ALLOWED_TOOLS,
  HOME_COPY,
  STORE_LINKS,
  fitBrandTitle,
  fitDescription,
  newCopyViolations,
  rewriteClaimHtml,
  rewriteClaimScript,
  stripClaims,
} from '../src/claim-copy.mjs';

const canonical = '<link rel="canonical" href="https://dayfiles.com/merge-pdf/">';

function page(pathHeading) {
  return `<!doctype html><html><head><title>${pathHeading.title}</title>
<meta name="description" content="${pathHeading.description}">
<meta property="og:title" content="${pathHeading.title}">
<meta name="twitter:title" content="${pathHeading.title}">
${pathHeading.canonical}</head><body>
<h1>${pathHeading.h1}</h1><p>${pathHeading.hero}</p>
<p>Private in-browser processing. No upload queue, and we do not store your files or document data.</p>
</body></html>`;
}

test('allowed tool copy stays inside the claim and length rules', () => {
  for (const tool of ALLOWED_TOOLS) {
    assert.ok(tool.title.length <= 60, tool.title);
    assert.ok(tool.description.length <= 155, `${tool.description} (${tool.description.length})`);
    assert.deepEqual(newCopyViolations(tool.title), []);
    assert.deepEqual(newCopyViolations(tool.description), []);
    assert.deepEqual(newCopyViolations(tool.h1), []);
    assert.deepEqual(newCopyViolations(tool.hero), []);
    assert.deepEqual(newCopyViolations(tool.storeBody || ''), []);
  }
  for (const value of Object.values(HOME_COPY)) {
    assert.ok(value.length <= 155, value);
    assert.deepEqual(newCopyViolations(value), []);
  }
  assert.ok(HOME_COPY.title.length <= 60);
});

test('rewrites an allowed tool page without touching the canonical', () => {
  const html = rewriteClaimHtml('/merge-pdf/', page({
    title: 'Merge PDF Online Free | Private PDF',
    description: 'Merge PDF files online for free in seconds. Combine multiple PDFs in your preferred order with private browser-only processing and instant download.',
    h1: 'Merge PDF Online Free',
    hero: 'Combine PDFs in your preferred order and download one merged file.',
    canonical,
  }));
  assert.match(html, /<title>Merge PDF Files – Combine PDFs Online \| Private PDF<\/title>/);
  assert.match(html, /<h1>Merge PDF Files<\/h1>/);
  assert.match(html, new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(html, /data-pdf-app-cta="true"/);
  assert.match(html, new RegExp(STORE_LINKS.defaultPlay.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(html, /data-pdf-related-tools="true"/);
  assert.match(html, /Delete PDF pages/);
  assert.doesNotMatch(html.split('<script')[0], /Online Free|No upload queue|for free/i);
  assert.equal(newCopyViolations(html.match(/<title>([^<]*)<\/title>/)[1]).length, 0);
});

test('uses the tracked bank-statement store links and no store block on disallowed tools', () => {
  const bank = rewriteClaimHtml('/bank-statement-to-excel/', page({
    title: 'Bank statement to Excel — Free &amp; Private',
    description: 'Extract transaction rows from text-based bank statements, review the amounts, and export Excel or CSV. Your statement stays in this browser.',
    h1: 'Bank statement to Excel',
    hero: 'Extract transaction rows from text-based bank statements.',
    canonical: '<link rel="canonical" href="https://dayfiles.com/bank-statement-to-excel/">',
  }));
  assert.match(bank, new RegExp(STORE_LINKS.bankPlay.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(bank, new RegExp(STORE_LINKS.bankIos.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(bank, /<h1>Bank Statement PDF to Excel<\/h1>/);
  assert.doesNotMatch(bank, /Extract transaction/);

  const sign = rewriteClaimHtml('/e-sign-pdf/', page({
    title: 'Sign PDF Online Free | Private PDF',
    description: 'Sign PDF online free with a visual e-signature tool. Draw, type, or upload your signature.',
    h1: 'E-sign PDF Online Free',
    hero: 'Draw, type, or upload a signature and place it anywhere on your PDF.',
    canonical: '<link rel="canonical" href="https://dayfiles.com/e-sign-pdf/">',
  }));
  assert.match(sign, /<title>Sign PDF \| Private PDF<\/title>/);
  assert.doesNotMatch(sign.split('<script')[0], /data-pdf-app-cta|data-pdf-related-tools|Get the Private PDF app/);
  assert.match(sign, /rel="canonical" href="https:\/\/dayfiles.com\/e-sign-pdf\/"/);
});

test('links a same-topic guide to its tool and lists tools on the homepage', () => {
  const guide = rewriteClaimHtml('/guides/how-to-merge-pdf-files-without-uploading/', page({
    title: 'Merge PDF Files Without Uploading | Private PDF',
    description: 'A practical local-first workflow for combining PDF files in the browser while preserving order, privacy, and download speed.',
    h1: 'How to Merge PDF Files Without Uploading Them to a Server',
    hero: 'A practical local-first workflow for combining PDF files.',
    canonical: '<link rel="canonical" href="https://dayfiles.com/guides/how-to-merge-pdf-files-without-uploading/">',
  }));
  assert.match(guide, /data-pdf-tool-link="true"/);
  assert.match(guide, /href="\/merge-pdf\/"/);
  assert.match(guide, />Merge PDF files</);
  assert.doesNotMatch(guide.split('<script')[0], /data-pdf-app-cta/);
  assert.doesNotMatch(guide.split('<script')[0], /Without Uploading|local-first|privacy/i);
  const title = guide.match(/<title>([^<]*)<\/title>/)[1];
  assert.ok(title.length <= 60, title);

  const home = rewriteClaimHtml('/', page({
    title: 'Private PDF Tools Online — Free, No Uploads or Paywalls',
    description: 'Private PDF tools that process files in your browser with no uploads for normal workflows. Every web feature is free to use, with no subscription or paywall.',
    h1: 'Free Online PDF Tools',
    hero: 'Edit, merge, split, compress, inspect, protect, and convert PDFs privately in your browser.',
    canonical: '<link rel="canonical" href="https://dayfiles.com/">',
  }));
  assert.match(home, new RegExp(HOME_COPY.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(home, /data-pdf-home-tools="true"/);
  assert.match(home, /href="\/watermark-pdf\/"/);
  assert.doesNotMatch(home.split('<script')[0], /No uploads|No paywalls|Online Free/i);
});

test('strips claim strings inside tool bundles', () => {
  const code = 'const ws=`${m.title} Online Free`;title:"Merge PDF Online Free | Private PDF";description:"Merge PDF files online for free in seconds.";';
  const rewritten = rewriteClaimScript(code);
  assert.match(rewritten, /\$\{m\.title\}`/);
  assert.doesNotMatch(rewritten, /Online Free/);
  assert.doesNotMatch(rewritten, /\bfor free\b/);
});

test('blog titles lose claim words and stay within 60 characters', () => {
  const title = fitBrandTitle('How to Merge PDFs Without Uploading Files in Browser', 'Dayfiles');
  assert.ok(title.length <= 60, title);
  assert.equal(newCopyViolations(title).length, 0);
  const description = fitDescription('Yes, this merge tool is free with no account required. It is private, local, and fast.');
  assert.ok(description.length <= 155);
  assert.equal(newCopyViolations(description).length, 0);
  assert.match(stripClaims('Privacy Policy | Private PDF'), /Privacy Policy/);
});
