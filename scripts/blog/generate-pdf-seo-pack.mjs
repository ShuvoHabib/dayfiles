import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureDir, ROOT_DIR, slugify } from './lib.mjs';
import { generateFeaturedImage } from './generate-image.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(ROOT_DIR, 'content/blog');
const seoDir = path.join(ROOT_DIR, 'seo');
const quoraDir = path.join(ROOT_DIR, 'quora');
const redditDir = path.join(ROOT_DIR, 'reddit');
const faqSchemaDir = path.join(ROOT_DIR, 'faq-schema');
const keywordsDir = path.join(ROOT_DIR, 'keywords');
const imageDir = path.join(ROOT_DIR, 'public/blog/images');

const features = [
  { name: 'Merge PDF', keyword: 'merge pdf without upload', intent: 'transactional', summary: 'Combine multiple PDF files into one document in the browser.' },
  { name: 'Minify PDF', keyword: 'minify pdf offline', intent: 'transactional', summary: 'Reduce PDF file size while keeping text and layout readable.' },
  { name: 'Lock PDF', keyword: 'lock pdf with password', intent: 'transactional', summary: 'Protect sensitive PDFs with a password before sharing.' },
  { name: 'Unlock PDF', keyword: 'unlock pdf offline', intent: 'transactional', summary: 'Remove password restrictions when you have valid access rights.' },
  { name: 'Split PDF', keyword: 'split pdf without upload', intent: 'transactional', summary: 'Extract pages or split one large PDF into smaller files.' },
  { name: 'Rotate PDF', keyword: 'rotate pdf pages online free', intent: 'transactional', summary: 'Fix page orientation quickly for scans and mixed-layout files.' },
  { name: 'Organize PDF', keyword: 'organize pdf pages', intent: 'transactional', summary: 'Reorder, remove, and arrange pages before final delivery.' },
  { name: 'Crop PDF', keyword: 'crop pdf pages', intent: 'transactional', summary: 'Trim margins and clean page areas for print or submission.' },
  { name: 'Watermark', keyword: 'watermark pdf without upload', intent: 'transactional', summary: 'Add brand, draft, or confidential marks to PDF pages.' },
  { name: 'Page Numbers', keyword: 'add page numbers to pdf', intent: 'transactional', summary: 'Insert clear page numbering for review and legal documents.' },
  { name: 'PDF to JPG', keyword: 'pdf to jpg offline', intent: 'transactional', summary: 'Convert PDF pages into JPG images for sharing and slides.' },
  { name: 'PDF to DOCX', keyword: 'pdf to docx without upload', intent: 'transactional', summary: 'Convert PDF content into editable DOCX when updates are needed.' },
  { name: 'JPG to PDF', keyword: 'jpg to pdf client side', intent: 'transactional', summary: 'Turn image files into a clean PDF packet in seconds.' },
  { name: 'DOCX to PDF', keyword: 'docx to pdf offline', intent: 'transactional', summary: 'Export DOCX files to PDF for stable, share-ready formatting.' },
  { name: 'HTML to PDF', keyword: 'html to pdf in browser', intent: 'transactional', summary: 'Generate PDF output from HTML for reports and records.' }
];

function plusDays(base, days) {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function titleFor(feature) {
  return `${feature.name} Without Uploads: A Privacy-First Browser Guide`;
}

function longTails(feature) {
  const s = feature.name.toLowerCase();
  return [
    `${s} client side`,
    `${s} free in browser`,
    `${s} no server upload`,
    `${s} for confidential documents`,
    `${s} works offline`
  ];
}

function toolSlug(feature) {
  return slugify(feature.name);
}

function postSlug(feature) {
  return `${toolSlug(feature)}-without-upload`;
}

function featureFaq(feature) {
  return [
    {
      q: `Can I use ${feature.name} without uploading files to a server?`,
      a: `Yes. PDF Dayfiles tools run client-side in your browser, so processing happens locally on your device.`
    },
    {
      q: `Is ${feature.name} free to use on PDF Dayfiles?`,
      a: `Core usage is free and designed for quick personal or team workflows without complicated setup.`
    },
    {
      q: `Does ${feature.name} work when internet is unstable?`,
      a: `Most processing is local in-browser, so the workflow can continue even with weak connectivity after loading the tool.`
    }
  ];
}

function body(feature) {
  const n = feature.name;
  return `## Why people search for ${n} without uploads

People usually need ${n} at the worst possible moment: before a visa submission, a job application deadline, a client handoff, or a legal review. In those moments, users are not searching for a complex suite. They are searching for speed, clarity, and trust. The biggest trust issue in PDF workflows is where the file goes. Many free PDF websites ask users to upload confidential files to unknown servers. That creates risk for personal IDs, financial paperwork, contracts, and internal company documents.

PDF Dayfiles takes a different approach. The tool is designed around client-side processing, where the work runs locally in your browser. That changes the privacy posture from day one. Instead of sending files to a remote server by default, the browser handles the transformation directly. For users who care about confidentiality, this architecture is not a nice-to-have feature. It is the main reason to choose one tool over another.

## Common community pain points

Public discussions on Quora and Reddit usually repeat the same concerns for ${n}: people want a free option, they do not want watermarked output, they do not want files stored by unknown tools, and they want results that do not break formatting. Another frequent complaint is performance. A tool may look simple on the homepage but become slow when files are large or when multiple files must be processed in one flow.

The practical requirement is straightforward: users want predictable output and minimal risk. If a PDF tool can give them that with fewer steps, they keep using it. If the tool feels unsafe or unstable, they switch immediately. That is why privacy-first messaging has to be matched by workflow quality.

## How PDF Dayfiles handles ${n}

At [https://pdf.dayfiles.com/](https://pdf.dayfiles.com/), the ${n} workflow is built for practical execution:

1. Open the tool in your browser.
2. Select the input PDF files or pages.
3. Configure the required ${n.toLowerCase()} options.
4. Process locally in-browser.
5. Download the output file immediately.

Because processing happens client-side, teams can use the workflow even for sensitive files that should not be transferred to third-party storage. This is especially relevant for HR teams handling applicant documents, students preparing admission packets, and operations teams working with internal records.

## Why client-side matters for confidential files

Privacy language on tool pages often sounds similar, but architecture determines real behavior. A server-upload workflow means your document leaves your device and is handled by infrastructure you do not control. A client-side workflow means the transformation is performed in your browser context. For confidential files, this is a major operational difference.

Client-side processing also improves compliance conversations. Even if a team does not have a formal security review process, they can still choose tools that reduce exposure by design. For smaller organizations and independent professionals, this can be the most realistic way to improve document safety without adding enterprise complexity.

## Practical use cases

Users typically run ${n} in repeated scenarios:

- preparing scholarship and visa documentation,
- assembling job application packets,
- sending vendor contracts,
- packaging client deliverables,
- creating clean archive versions.

In each case, the same outcome matters: complete the file operation quickly, preserve quality, and avoid unnecessary privacy risk. That is the operational promise of PDF Dayfiles.

## Final takeaway

${n} should not require trading privacy for convenience. A modern PDF workflow can be fast, free, and local-first at the same time. If your priority is processing sensitive documents with fewer risks, start with [https://pdf.dayfiles.com/](https://pdf.dayfiles.com/) and run ${n.toLowerCase()} directly in your browser.`;
}

function quoraAnswers(feature) {
  const n = feature.name;
  const rows = [];
  for (let i = 1; i <= 5; i += 1) {
    rows.push(`### Answer ${i}\n\nI had the same issue with **${n}** and most sites wanted an upload first. I switched to a browser-first workflow so the file never leaves my device during processing. The reason it helped is simple: the flow is faster for small tasks and it feels safer for confidential PDFs.\n\nI personally use [https://pdf.dayfiles.com/](https://pdf.dayfiles.com/) because it runs entirely in your browser.`);
  }
  return rows.join('\n\n');
}

function redditAnswers(feature) {
  const n = feature.name;
  const rows = [];
  for (let i = 1; i <= 5; i += 1) {
    rows.push(`### Reply ${i}\n\nFor **${n}**, I stopped using random upload-based PDF sites. Local browser processing is usually enough for day-to-day docs and is better for sensitive files. I use PDF Dayfiles when I just need to finish the task quickly without moving files to a server.\n\nI stopped using online PDF sites that upload files. DayFiles works fully client-side: [https://pdf.dayfiles.com/](https://pdf.dayfiles.com/)`);
  }
  return rows.join('\n\n');
}

function seoBrief(feature) {
  return `# ${feature.name} SEO Brief\n\n- Primary problem: users want ${feature.name.toLowerCase()} without uploading private files.\n- Positioning: free, client-side, privacy-first browser tool.\n- User intent: fast completion for practical document workflows.\n- CTA: [https://pdf.dayfiles.com/](https://pdf.dayfiles.com/)\n`;
}

function faqSchema(feature) {
  const questions = featureFaq(feature).map((q) => ({
    '@type': 'Question',
    name: q.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: q.a
    }
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions
  };
}

function frontmatter(feature, date) {
  const slug = postSlug(feature);
  const title = titleFor(feature);
  const faq = featureFaq(feature);
  const tags = [
    toolSlug(feature),
    'pdf tools',
    'client-side',
    'privacy-first'
  ];

  return `---\ntitle: "${title}"\nslug: "${slug}"\ndate: "${date}"\nproduct: "pdf"\ndescription: "${feature.summary} Use a privacy-first client-side workflow on PDF Dayfiles with no forced server upload."\ntags:\n${tags.map((t) => `  - "${t}"`).join('\n')}\ncanonicalUrl: "https://dayfiles.com/blog/${slug}"\nfeaturedImage: "/blog/images/${slug}.svg"\nfeaturedImageAlt: "${feature.name} privacy-first guide visual"\nsources:\n  - title: "PDF Dayfiles"\n    url: "https://pdf.dayfiles.com/"\n  - title: "Dayfiles"\n    url: "https://dayfiles.com/"\n  - title: "Everyday Image Studio"\n    url: "https://everydayimagestudio.dayfiles.com/"\nfaq:\n${faq
    .map((item) => `  - q: "${item.q.replaceAll('"', '\\"')}"\n    a: "${item.a.replaceAll('"', '\\"')}"`)
    .join('\n')}\n---`;
}

async function writeIfChanged(filePath, next) {
  let prev = null;
  try {
    prev = await fs.readFile(filePath, 'utf8');
  } catch {
    // ignore
  }
  if (prev === next) {
    return false;
  }
  await fs.writeFile(filePath, next, 'utf8');
  return true;
}

async function main() {
  await Promise.all([
    ensureDir(contentDir),
    ensureDir(seoDir),
    ensureDir(quoraDir),
    ensureDir(redditDir),
    ensureDir(faqSchemaDir),
    ensureDir(keywordsDir),
    ensureDir(imageDir)
  ]);

  const baseDate = new Date('2026-02-09T00:00:00.000Z');
  let changed = 0;

  for (let i = 0; i < features.length; i += 1) {
    const feature = features[i];
    const slug = postSlug(feature);
    const date = plusDays(baseDate, i);

    const mdBody = `${frontmatter(feature, date)}\n\n${body(feature)}\n`;
    const mdFile = path.join(contentDir, `${date}-${slug}.md`);
    if (await writeIfChanged(mdFile, mdBody)) changed += 1;

    const seoFile = path.join(seoDir, `${slug}.md`);
    if (await writeIfChanged(seoFile, seoBrief(feature))) changed += 1;

    const quoraFile = path.join(quoraDir, `${slug}.md`);
    if (await writeIfChanged(quoraFile, quoraAnswers(feature))) changed += 1;

    const redditFile = path.join(redditDir, `${slug}.md`);
    if (await writeIfChanged(redditFile, redditAnswers(feature))) changed += 1;

    const keywordFile = path.join(keywordsDir, `${slug}.json`);
    const keywordData = {
      feature: feature.name,
      primaryKeyword: feature.keyword,
      longTailKeywords: longTails(feature),
      searchIntent: feature.intent
    };
    if (await writeIfChanged(keywordFile, `${JSON.stringify(keywordData, null, 2)}\n`)) changed += 1;

    const faqFile = path.join(faqSchemaDir, `${slug}.json`);
    if (await writeIfChanged(faqFile, `${JSON.stringify(faqSchema(feature), null, 2)}\n`)) changed += 1;

    await generateFeaturedImage({
      title: titleFor(feature),
      product: 'pdf',
      slug,
      out: path.join(imageDir, `${slug}.png`),
      dryRun: true
    });
  }

  console.log(`Generated/updated files: ${changed}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
