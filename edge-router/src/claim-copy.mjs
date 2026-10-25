/**
 * Claim-safe titles, descriptions, and hero copy for Private PDF pages.
 * The PDF app source is not in this repo. This module rewrites the HTML
 * dayfiles.com already proxies. It does not change routing, redirects,
 * assetlinks, or apple-app-site-association.
 */

import { BLOG_COPY, PAGE_COPY } from './claim-overrides.mjs';

export const CLAIM_COPY_LASTMOD = '2026-10-25';

const PRODUCT = 'Private PDF';
const TITLE_SUFFIX = ` | ${PRODUCT}`;

export const STORE_LINKS = {
  defaultPlay: 'https://play.google.com/store/apps/details?id=com.dayfiles.pdfprocessor',
  defaultIos: 'https://apps.apple.com/app/id6809184465',
};

const STORE_PATHS = new Set([
  '/merge-pdf',
  '/split-pdf',
  '/organize-pdf',
  '/remove-pdf-pages',
  '/edit-pdf',
]);

const TRUST_SENTENCE =
  'Private in-browser processing. No upload queue, and we do not store your files or document data.';

const APP_TRUST = 'Get the Private PDF app for Android and iPhone.';

const STORE_BODY = 'Merge, split, organize and edit PDFs.';

export function storeLinksForPath(pathname) {
  const slug = normalizeContentPath(pathname).replace(/^\//, '') || 'home';
  return {
    play: `${STORE_LINKS.defaultPlay}&referrer=utm_source%3Dweb%26utm_medium%3Dwebsite%26utm_campaign%3D${slug}`,
    ios: `${STORE_LINKS.defaultIos}?pt=129418272&ct=web-${slug}&mt=8`,
  };
}

export const ALLOWED_TOOLS = [
  {
    path: '/merge-pdf',
    label: 'Merge PDF files',
    title: 'Merge PDF Files – Combine PDFs Online | Private PDF',
    h1: 'Merge PDF Files',
    description:
      'Combine several PDFs into one file in the order you choose. Reorder pages before you save. Also in the Private PDF app.',
    hero: 'Combine PDFs into one file in the order you choose.',
  },
  {
    path: '/split-pdf',
    label: 'Split PDF files',
    title: 'Split PDF Files by Page Range | Private PDF',
    h1: 'Split PDF Files',
    description:
      'Split one PDF into separate files by page range or by the pages you pick. Also in the Private PDF app for Android and iOS.',
    hero: 'Split one PDF into separate files by page range or by the pages you pick.',
  },
  {
    path: '/compress-pdf',
    label: 'Compress PDF files',
    title: 'Compress PDF Files Online | Private PDF',
    h1: 'Compress PDF Files',
    description:
      'Compress a PDF and check the result before you send it. Results depend on the file.',
    hero: 'Compress a PDF and check the result before you send it.',
    store: false,
  },
  {
    path: '/edit-pdf',
    label: 'Edit PDF text',
    title: 'Edit PDF Text and Pages | Private PDF',
    h1: 'Edit PDF Text and Pages',
    description:
      'Edit text in a PDF and update pages before you save. Also in the Private PDF app for Android and iOS.',
    hero: 'Edit text in a PDF and update pages before you save.',
  },
  {
    path: '/organize-pdf',
    label: 'Reorder or rearrange PDF pages',
    title: 'Reorder, Rearrange or Delete PDF Pages | Private PDF',
    h1: 'Reorder or Rearrange PDF Pages',
    description: 'Reorder, rearrange or delete PDF pages, then save the file.',
    hero: 'Reorder, rearrange or delete PDF pages, then save the file.',
  },
  {
    path: '/rotate-pdf',
    label: 'Rotate PDF pages',
    title: 'Rotate PDF Pages Online | Private PDF',
    h1: 'Rotate PDF Pages',
    description: 'Rotate PDF pages by 90, 180 or 270 degrees and save the file.',
    hero: 'Rotate PDF pages by 90, 180 or 270 degrees and save the file.',
    store: false,
  },
  {
    path: '/remove-pdf-pages',
    label: 'Delete PDF pages',
    title: 'Delete PDF Pages Online | Private PDF',
    h1: 'Delete PDF Pages',
    description:
      'Delete PDF pages you do not want and save the remaining file. Also in the Private PDF app.',
    hero: 'Delete PDF pages you do not want and save the remaining file.',
  },
  {
    path: '/watermark-pdf',
    label: 'Add watermark to PDF',
    title: 'Add Watermark to PDF Online | Private PDF',
    h1: 'Add Watermark to PDF',
    description: 'Add a text or image watermark to a PDF, then save the file.',
    hero: 'Add a text or image watermark to a PDF, then save the file.',
    store: false,
  },
  {
    path: '/add-page-numbers-pdf',
    label: 'Add page numbers to PDF',
    title: 'Add Page Numbers to PDF Online | Private PDF',
    h1: 'Add Page Numbers to PDF',
    description: 'Add page numbers to a PDF and choose the position and format.',
    hero: 'Add page numbers to a PDF and choose the position and format.',
    store: false,
  },
  {
    path: '/bank-statement-to-excel',
    label: 'Bank statement PDF to Excel',
    title: 'Bank Statement PDF to Excel | Private PDF',
    h1: 'Bank Statement PDF to Excel',
    description:
      'Turn rows from a text-based bank statement PDF into an Excel or CSV sheet you can review.',
    hero: 'Turn transaction rows from a text-based bank statement PDF into an Excel or CSV sheet you can review.',
    store: false,
  },
];

const ALLOWED_BY_PATH = new Map(ALLOWED_TOOLS.map((tool) => [tool.path, tool]));

export const HOME_COPY = {
  title: 'Merge, Split, Organize and Edit PDFs | Private PDF',
  h1: 'Merge, Split, Organize and Edit PDFs | Private PDF',
  description:
    'Merge, split, organize and edit PDFs, then reorder or delete pages. Now available on iOS and Android.',
  hero: 'Reorder or delete pages, and get the Private PDF app for Android and iOS.',
};

const HOME_REPLACEMENTS = [
  ['Privacy-first PDF toolkit', 'PDF tools'],
  ['Privacy tools · Check, clean and store PDFs locally', 'PDF page tools'],
  [
    'Edit, merge, split, compress, inspect, protect, and convert PDFs privately in your browser. Files stay on your device for normal workflows, and every web feature is free without a paywall.',
    HOME_COPY.hero,
  ],
  ['No uploads', 'Merge and split'],
  ['No account required', 'Organize PDFs'],
  ['No paywalls', 'Split PDFs'],
  ['Free on Google Play and the App Store', 'On Google Play and the App Store'],
  [
    'Edit, merge, compress, and protect PDFs privately—right on your phone or tablet.',
    'Merge, split, organize and edit PDFs on your phone or tablet.',
  ],
  ['Files stay on-device', 'Reorder pages'],
  ['Works offline', 'Edit PDFs'],
  [
    'Privacy-first browser processing for normal workflows. No upload queue, no stored document data, and no web feature locked behind a subscription or paid unlock.',
    'Reorder or delete pages. Now available on iOS and Android.',
  ],
  ['Best for shrinking large files before sending.', 'Best for compressing a PDF before you send it.'],
  ['Best for extracting specific page ranges quickly.', 'Best for choosing the pages you want to keep.'],
  [
    'Best for local text changes, OCR review, and export without upload.',
    'Best for editing PDF text and pages.',
  ],
  ['Best for removing blanks, duplicates, or irrelevant pages fast.', 'Best for deleting PDF pages from a file.'],
  ['Best for branding and confidentiality labels.', 'Best for adding a watermark to a PDF.'],
  ['Private browser PDF toolkit by Dayfiles', 'PDF toolkit by Dayfiles'],
  ['Fast private processing in your browser.', 'Open a PDF and use the tool.'],
  ['Offline-ready app', 'PDF page tools'],
  [
    'Local-first PDF tools for browser and offline workflows. Files stay on your device during normal processing. Support is available through the',
    'PDF tools for merge, split, organize and edit. Support is available through the',
  ],
  [
    'Copyright 2026 DayFiles. Private PDF Editor is a browser-based PDF tool with offline-ready support.',
    'Copyright 2026 DayFiles. Private PDF Editor is a browser-based PDF tool.',
  ],
  [
    'Get new private PDF tools and workflow updates first',
    'Get PDF tool and workflow updates',
  ],
  [
    'Join the email list for meaningful product updates, new local-first PDF workflows, and practical guides. No paywall, no account required to use the tools, and no noisy daily blasts.',
    'Join the email list for product updates and practical guides.',
  ],
  ['Privacy-first updates', 'Product updates'],
  ['Files stay local. Only your email is submitted here.', 'Get product updates by email.'],
  ['Only your email is submitted here.', 'Get product updates by email.'],
  ['Keep everything in your browser with no upload queue.', 'Merge, split, organize and edit PDFs.'],
];

export const GUIDE_COPY = {
  '/guides/how-to-make-a-pdf-smaller-without-uploading': {
    title: 'Compress a PDF | Private PDF',
    h1: 'How to Compress a PDF',
    description: 'Compress a PDF and check the result before you send it. Results depend on the file.',
    hero: 'Compress a PDF and check the result before you send it.',
  },
};

export const GUIDE_LINKS = {
  '/guides/how-to-merge-pdf-files-without-uploading': ['/merge-pdf/', 'Merge PDF files'],
  '/guides/how-to-merge-receipts-and-invoices-into-one-pdf': ['/merge-pdf/', 'Merge PDF files'],
  '/guides/how-to-combine-bank-statements-into-one-pdf': ['/merge-pdf/', 'Merge PDF files'],
  '/guides/how-to-split-a-pdf-by-pages-or-ranges': ['/split-pdf/', 'Split PDF files'],
  '/guides/how-to-split-one-pdf-into-multiple-files': ['/split-pdf/', 'Split PDF files'],
  '/guides/how-to-separate-pdf-pages-privately': ['/split-pdf/', 'Split PDF files'],
  '/guides/how-to-compress-pdf-without-losing-quality': ['/compress-pdf/', 'Compress PDF files'],
  '/guides/how-to-compress-pdf-for-email': ['/compress-pdf/', 'Compress PDF files'],
  '/guides/how-to-compress-a-scanned-pdf': ['/compress-pdf/', 'Compress PDF files'],
  '/guides/how-to-make-a-pdf-smaller-without-uploading': ['/compress-pdf/', 'Compress PDF files'],
  '/guides/how-to-delete-pages-from-a-pdf': ['/remove-pdf-pages/', 'Delete PDF pages'],
  '/guides/how-to-reorder-and-delete-pdf-pages': ['/organize-pdf/', 'Reorder or rearrange PDF pages'],
  '/guides/how-to-organize-clean-up-and-finish-a-pdf-locally': ['/organize-pdf/', 'Reorder or rearrange PDF pages'],
  '/guides/how-to-add-a-watermark-to-a-pdf': ['/watermark-pdf/', 'Add watermark to PDF'],
  '/guides/how-to-add-page-numbers-to-a-pdf': ['/add-page-numbers-pdf/', 'Add page numbers to PDF'],
  '/guides/how-to-rotate-one-page-in-a-pdf': ['/rotate-pdf/', 'Rotate PDF pages'],
  '/guides/how-to-edit-pdf-text-and-rewrite-scanned-pages-locally': ['/edit-pdf/', 'Edit PDF text'],
};

const EXCLUDED_PREFIXES = [
  '/thelast30days/',
  '/simple-invoice-maker/',
  '/human-anatomy-3d-body-layers/',
  '/app/',
  '/compress-pdf-offline/',
  '/assets/',
  '/.well-known/',
];

const PHRASES = [
  'Nothing leaves your browser.',
  'Nothing leaves your browser',
  'without uploading them to a server',
  'Without Uploading Them to a Server',
  'without uploading the file to a server',
  'without uploading the file to another service',
  'Without Uploading the File to Another Service',
  'without uploading documents',
  'without uploading the file first',
  'Without Uploading the File First',
  'without uploading the file to another service',
  'without uploading confidential pages',
  'without uploading employee documents',
  'without uploading every assignment packet',
  'without uploading the whole packet everywhere',
  'Without Uploading Files in Browser',
  'without uploading files in browser',
  'Without Uploading Files Online',
  'without uploading files online',
  'Without Uploading It Online',
  'without uploading it online',
  'Without Uploading Files',
  'without uploading files',
  'Without Uploading It',
  'without uploading it',
  'without uploading',
  'Without Uploading',
  'no server upload',
  'No server upload',
  'No upload queue',
  'no upload queue',
  'no stored document data',
  'we do not store your files or document data',
  'Your statement stays in this browser.',
  'Your statement stays in this browser',
  'Files stay on your device',
  'files stay on your device',
  'stays in this browser',
  'No document uploads',
  'no document uploads',
  'No uploads',
  'no uploads',
  'No upload',
  'no upload',
  'without a paywall',
  'No paywalls',
  'no paywalls',
  'No paywall',
  'no paywall',
  'No account required',
  'no account required',
  'no account',
  'No ads',
  'no ads',
  'Online Free',
  'online free',
  'for free',
  'Free, Local & Private',
  'Free, Local and Private',
  'Free & Private',
  'Free and Private',
  'Free to use with no account required',
  'to use with no account required',
  'and without an account',
  'without an account',
  'no file upload',
  'low, balanced, or high compression presets',
  'without losing quality',
  'Without Losing Quality',
  'a smaller PDF',
  'smaller PDF',
  'Privacy-first',
  'privacy-first',
  'private browser-only processing',
  'private browser-based processing',
  'Private in-browser processing',
  'private in-browser processing',
  'local private processing',
  'local browser-based processing',
  'local browser processing',
  'in seconds',
  'in minutes',
  'instant download',
  'on-device',
  'on your device',
  'local-first',
  'download speed',
  'with browser-only processing',
  'browser-only processing',
  'without server upload',
  'no file upload',
  'without upload',
  'without an account',
  'without sending the document anywhere',
  'Processing stays in your browser.',
  'Processing stays in your browser',
  'On Android, this is a Private PDF Premium feature.',
  'On Android, Bank statement to Excel is a Private PDF Premium feature.',
  'Without Uploads',
  'Without Re-Uploading the File',
  'Without Sending the Whole Document Away',
  'Without Sending the Whole Set Everywhere',
  'Without Creating Extra Exposure',
  'Without Exposing Sensitive Files',
  'more safely',
  'safely',
];

const SCRIPT_REPLACEMENTS = [
  ['`${m.title} Online Free`', '`${m.title}`'],
  ['"feature.watermark.title":"Watermark"', '"feature.watermark.title":"Add Watermark to PDF"'],
  ['id:"watermark",title:"Watermark"', 'id:"watermark",title:"Add Watermark to PDF"'],
  ['"feature.page_numbers.title":"Page Numbers"', '"feature.page_numbers.title":"Add Page Numbers to PDF"'],
  ['id:"page_numbers",title:"Page Numbers"', 'id:"page_numbers",title:"Add Page Numbers to PDF"'],
  ['"feature.remove_pages.title":"Remove PDF Pages"', '"feature.remove_pages.title":"Delete PDF Pages"'],
  ['id:"remove_pages",title:"Remove PDF Pages"', 'id:"remove_pages",title:"Delete PDF Pages"'],
  ['"feature.organize.title":"Organize PDF"', '"feature.organize.title":"Reorder or Rearrange PDF Pages"'],
  ['id:"organize",title:"Organize PDF"', 'id:"organize",title:"Reorder or Rearrange PDF Pages"'],
  ['"feature.merge.title":"Merge PDF"', '"feature.merge.title":"Merge PDF Files"'],
  ['id:"merge",title:"Merge PDF"', 'id:"merge",title:"Merge PDF Files"'],
  ['"feature.split.title":"Split PDF"', '"feature.split.title":"Split PDF Files"'],
  ['id:"split",title:"Split PDF"', 'id:"split",title:"Split PDF Files"'],
  ['"feature.rotate.title":"Rotate PDF"', '"feature.rotate.title":"Rotate PDF Pages"'],
  ['id:"rotate",title:"Rotate PDF"', 'id:"rotate",title:"Rotate PDF Pages"'],
  ['"feature.edit_pdf.title":"Edit PDF"', '"feature.edit_pdf.title":"Edit PDF Text and Pages"'],
  ['id:"edit_pdf",title:"Edit PDF"', 'id:"edit_pdf",title:"Edit PDF Text and Pages"'],
  ['uiTitle:"Compress PDF"', 'uiTitle:"Compress PDF Files"'],
  ['title:"Bank statement to Excel"', 'title:"Bank Statement PDF to Excel"'],
  ['Private PDF Tools Online — Free, No Uploads or Paywalls', HOME_COPY.title],
  ['Free PDF Tools Online - No Uploads | Private PDF', HOME_COPY.title],
  ['Free Online PDF Tools', HOME_COPY.h1],
  ['Process PDFs in seconds.', ''],
  ['Nothing leaves your browser.', ''],
  ...HOME_REPLACEMENTS,
];

function knownHeadReplacements() {
  const pairs = [
    ['Merge PDF Online Free | Private PDF', ALLOWED_BY_PATH.get('/merge-pdf').title],
    ['Split PDF Online Free | Private PDF', ALLOWED_BY_PATH.get('/split-pdf').title],
    ['Compress PDF Online Free | Private PDF', ALLOWED_BY_PATH.get('/compress-pdf').title],
    ['Edit PDF Online Free - Text and OCR | Private PDF', ALLOWED_BY_PATH.get('/edit-pdf').title],
    ['Organize PDF - Reorder/Delete Pages | Private PDF', ALLOWED_BY_PATH.get('/organize-pdf').title],
    ['Rotate PDF Online Free | Private PDF', ALLOWED_BY_PATH.get('/rotate-pdf').title],
    ['Remove PDF Pages Online Free | Private PDF', ALLOWED_BY_PATH.get('/remove-pdf-pages').title],
    ['Add Watermark to PDF Online Free | Private PDF', ALLOWED_BY_PATH.get('/watermark-pdf').title],
    ['Add Page Numbers to PDF Online Free | Private PDF', ALLOWED_BY_PATH.get('/add-page-numbers-pdf').title],
    ['Bank statement to Excel — Free & Private', ALLOWED_BY_PATH.get('/bank-statement-to-excel').title],
    ['Bank statement to Excel — Free &amp; Private', ALLOWED_BY_PATH.get('/bank-statement-to-excel').title],
    [
      'Merge PDF files online for free in seconds. Combine multiple PDFs in your preferred order with private browser-only processing and instant download.',
      ALLOWED_BY_PATH.get('/merge-pdf').description,
    ],
    [
      'Split PDF pages online by ranges or selected pages. Create separate PDF files quickly with a visual page selector and local private processing.',
      ALLOWED_BY_PATH.get('/split-pdf').description,
    ],
    [
      'Compress PDF files online without uploading. Choose low, balanced, or high compression presets and download a smaller PDF instantly.',
      ALLOWED_BY_PATH.get('/compress-pdf').description,
    ],
    [
      'Edit PDF paragraph text online for free with local browser processing. Rewrite text-based PDFs, run OCR on scanned PDFs, review blocks, and export without upload.',
      ALLOWED_BY_PATH.get('/edit-pdf').description,
    ],
    [
      'Organize PDF pages by drag reorder, move controls, and delete actions. Clean up document structure with instant browser-based processing.',
      ALLOWED_BY_PATH.get('/organize-pdf').description,
    ],
    [
      'Rotate PDF pages online with visual controls. Turn pages 90, 180, or 270 degrees and download your corrected PDF instantly.',
      ALLOWED_BY_PATH.get('/rotate-pdf').description,
    ],
    [
      'Remove PDF pages online for free. Delete blank, duplicate, or unwanted pages and export one cleaned PDF with private browser-based processing.',
      ALLOWED_BY_PATH.get('/remove-pdf-pages').description,
    ],
    [
      'Add watermark to PDF online with text or image options. Control opacity, position, and rotation, then download your watermarked PDF.',
      ALLOWED_BY_PATH.get('/watermark-pdf').description,
    ],
    [
      'Add page numbers to PDF pages online for free. Choose format, style, and position to create professional numbered documents.',
      ALLOWED_BY_PATH.get('/add-page-numbers-pdf').description,
    ],
    [
      'Extract transaction rows from text-based bank statements, review the amounts, and export Excel or CSV. Your statement stays in this browser.',
      ALLOWED_BY_PATH.get('/bank-statement-to-excel').description,
    ],
    [
      'Private PDF tools that process files in your browser with no uploads for normal workflows. Every web feature is free to use, with no subscription or paywall.',
      HOME_COPY.description,
    ],
    [
      'Free online PDF tools with no uploads. Edit text, OCR scans, merge, split, extract, remove, redact, compress, convert, sign, crop, and protect PDFs locally in your browser for private processing.',
      HOME_COPY.description,
    ],
  ];
  return pairs;
}

export function normalizeContentPath(pathname) {
  if (!pathname) return '/';
  let path = pathname.split('?')[0].split('#')[0];
  if (path.length > 1) path = path.replace(/\/+$/, '');
  return path || '/';
}

export function shouldRewritePath(pathname) {
  const path = normalizeContentPath(pathname);
  if (EXCLUDED_PREFIXES.some((prefix) => path.startsWith(prefix))) return false;
  if (path === '/sitemap.xml' || path === '/robots.txt' || path === '/llms.txt') return false;
  return true;
}

export function claimCopyLastmod(pathname) {
  return shouldRewritePath(pathname) ? CLAIM_COPY_LASTMOD : null;
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function escapeText(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value) {
  return escapeText(value).replace(/"/g, '&quot;');
}

const BODY_REPLACEMENTS = [
  ['Files stay local. Only your email is submitted here.', 'Get product updates by email.'],
  ['Only your email is submitted here.', 'Get product updates by email.'],
  ['Subscribe free', 'Subscribe'],
  ['Shrink a report or scan for faster downloads and easier storage.', ''],
  ['keeps uploads lighter and easier to review', ''],
  ['keeps uploads lighter and easier', ''],
  ['for private or temporary documents', 'for temporary documents'],
  ['local to your browser', 'in your browser'],
  ['already local', 'ready'],
  ['full of account prompts, cloud-first storage, and feature overlap', 'with fewer extra steps'],
  ['full of account prompts, cloud-first storage, and feature overload', 'with fewer extra steps'],
  ['Best for sharing sensitive files securely.', 'Best for adding a password to a PDF.'],
  ['Best for sharing sensitive files securely', 'Best for adding a password to a PDF'],
  ['4. Download your result instantly', '4. Download your result'],
  [
    'The goal is to make common PDF jobs faster without adding account setup, background syncing, or extra handoff steps between tools',
    'Download the finished file when processing ends',
  ],
  [
    'The goal is to make common PDF jobs faster without adding account setup, background syncing, or unnecessary uploads',
    'Download the finished file when processing ends',
  ],
  [
    'Private PDF tools preview showing offline, secure PDF merge, edit, compress, and convert workflows.',
    'Private PDF tools preview.',
  ],
];

const BODY_PHRASES = [
  'Free to use with no account required',
  'with no account required',
  'No account required',
  'no account required',
  'Your statement stays in this browser.',
  'Your statement stays in this browser',
  'Your PDF stays in this browser.',
  'stays in this browser',
  'stays in your browser',
  'All processing stays in your browser.',
  'All processing stays on this device.',
  'Processing stays in your browser.',
  'Processing stays on this device.',
  'stays on this device',
  'stay on this device',
  'on this device',
  'Your files stay local',
  'Files stay local',
  'No upload queue',
  'no upload queue',
  'Without Uploading Files',
  'without uploading files',
  'Without Uploading It',
  'without uploading it',
  'without uploading them',
  'Without Uploading',
  'without uploading',
  'without uploads',
  'Without Uploads',
  'On Android, Bank statement to Excel is a Private PDF Premium feature.',
  'On Android, this is a Private PDF Premium feature.',
  'local-first',
  'browser-local',
  'browser-only',
  'Without Exposing Sensitive Files',
  'Without Creating Extra Exposure',
  'Without Sending the Whole Document Away',
  'Without Sending the Whole Set Everywhere',
  'Without Re-Uploading the File',
  'more safely',
  'upload-first',
  'without adding account setup, background syncing, or unnecessary uploads',
  'without adding account setup, background syncing, or extra handoff steps between tools',
  'without turning into account-based storage',
  'does not create an account history or a cloud copy',
  'without account prompts',
  'without account friction',
  'friction of accounts, upload progress, and server-side retention',
  'unnecessary uploads, accounts, or wait time',
  'No account',
  'privacy-first',
  'Privacy notes',
];

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function cleanBodyText(input, { stripAppMention = false } = {}) {
  let text = decodeHtml(input);
  if (!text.trim()) return text;
  const productToken = '\u0001';
  const policyToken = '\u0002';
  text = text.replaceAll(PRODUCT, productToken);
  text = text.replace(/privacy policy/gi, policyToken);
  const replacements = BODY_REPLACEMENTS.slice().sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of replacements) {
    text = text.replace(new RegExp(escapeRegExp(from), 'gi'), to);
  }
  const phrases = BODY_PHRASES.slice().sort((a, b) => b.length - a.length);
  for (const phrase of phrases) {
    text = text.replace(new RegExp(escapeRegExp(phrase), 'gi'), ' ');
  }
  if (stripAppMention) {
    text = text.replace(new RegExp(`Also in the ${productToken} app(?: for Android and iOS)?\\.?`, 'gi'), ' ');
  }
  text = text
    .replace(/\blocal(?:ly)?\b/gi, ' ')
    .replace(/\boffline\b/gi, ' ')
    .replace(/\bon-device\b/gi, ' ')
    .replace(/\bfree\b/gi, ' ')
    .replace(/\bprivately\b/gi, ' ')
    .replace(/\bprivate\b/gi, ' ')
    .replace(/\bsafely\b/gi, ' ')
    .replace(/\bsecure(?:ly)?\b/gi, ' ')
    .replace(/\binstant(?:ly)?\b/gi, ' ');
  text = text.replaceAll(productToken, PRODUCT);
  text = text.replaceAll(policyToken, 'Privacy Policy');
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\(\s*\)/g, '')
    .replace(/\bbrowser-\b/gi, 'browser ')
    .replace(/^[,.;:\-–— ]+/, '')
    .replace(/[,;:\-–— ]+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function cleanSchemaText(input) {
  const saved = [];
  const masked = String(input || '').replace(/https?:\/\/[^\s)"']+|\]\([^)\s]+\)/g, (match) => {
    const token = `\u0003${saved.length}\u0003`;
    saved.push(match);
    return token;
  });
  let cleaned = cleanBodyText(masked).replace(/[ \t]+\u0003/g, '\u0003');
  cleaned = cleaned.replace(/\u0003(\d+)\u0003/g, (_, index) => saved[Number(index)] || '');
  return cleaned;
}

export function rewriteVisibleHtml(html, { stripAppMention = false } = {}) {
  if (!html) return html;
  let cleaned = html;
  for (const [from, to] of BODY_REPLACEMENTS) {
    if (from && cleaned.includes(from)) cleaned = cleaned.replaceAll(from, to);
  }
  cleaned = cleaned.replace(/\balt=(["'])([\s\S]*?)\1/gi, (full, quote, value) => {
    const next = escapeAttr(cleanBodyText(value));
    return `alt=${quote}${next}${quote}`;
  });
  return cleaned.replace(/<body\b[^>]*>[\s\S]*<\/body>/i, (body) => {
    const parts = body.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>)/gi);
    return parts
      .map((part, index) => {
        if (index % 2 === 1) return part;
        return part.replace(/>([^<]+)</g, (full, text) => {
          const next = cleanBodyText(text, { stripAppMention });
          return `>${escapeText(next)}<`;
        });
      })
      .join('');
  });
}

export function blogClaimCopy(post) {
  const authored = BLOG_COPY[post.slug];
  if (!authored) {
    const title = stripClaims(post.title);
    return {
      h1: title,
      description: fitDescription(post.description),
      documentTitle: fitBrandTitle(post.title, 'Dayfiles'),
    };
  }
  return authored;
}

export function stripClaims(input) {
  let text = decodeHtml(input);
  const productToken = '\u0001';
  const policyToken = '\u0002';
  text = text.replaceAll(PRODUCT, productToken);
  text = text.replace(/privacy policy/gi, policyToken);
  const phrases = PHRASES.slice().sort((a, b) => b.length - a.length);
  for (const phrase of phrases) {
    const pattern = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    text = text.replace(pattern, ' ');
  }
  text = text
    .replace(/\bonline free\b/gi, ' ')
    .replace(/\bfor free\b/gi, ' ')
    .replace(/\bfree\s*&\s*private\b/gi, ' ')
    .replace(/\bfree\b/gi, ' ')
    .replace(/\bprivately\b/gi, ' ')
    .replace(/\bprivacy(?:-first)?\b/gi, ' ')
    .replace(/\bprivate\b/gi, ' ')
    .replace(/\blocal(?:ly)?\b/gi, ' ')
    .replace(/\bon-device\b/gi, ' ')
    .replace(/\boffline\b/gi, ' ')
    .replace(/\bsecure(?:ly)?\b/gi, ' ')
    .replace(/\binstant(?:ly)?\b/gi, ' ')
    .replace(/\bquickly\b/gi, ' ')
    .replace(/\bfaster\b/gi, ' ')
    .replace(/\bfast\b/gi, ' ')
    .replace(/\bspeed\b/gi, ' ')
    .replace(/\bin seconds\b/gi, ' ')
    .replace(/\bin minutes\b/gi, ' ')
    .replace(/\bwithout uploading\b/gi, ' ')
    .replace(/\bsafely\b/gi, ' ');
  text = text.replaceAll(productToken, PRODUCT);
  text = text.replaceAll(policyToken, 'Privacy Policy');
  const suffixToken = '\u0003';
  text = text.replace(/\s*\|\s*(?:Private PDF|DayFiles|Dayfiles)(?:\s+Blog)?\s*$/i, suffixToken);
  text = text
    .replace(/\bsmaller\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s*[—–]\s*,\s*&?\s*/g, ' ')
    .replace(/\s+&\s+(?=[|.,]|$)/g, ' ')
    .replace(/\bmore\s+by\b/gi, 'by')
    .replace(/,?\s*\b(?:and|or|with)\b\s*(?=,|\.|$)/gi, ' ')
    .replace(/\s+([,;:!?])/g, '$1')
    .replace(/\s+\.(?!\w)/g, '.')
    .replace(/([([])\s+/g, '$1')
    .replace(/\s+([)\]])/g, '$1')
    .replace(/\(\s*\)/g, '')
    .replace(/\s+[-–—|]\s+/g, ' ')
    .replace(/^[,.;:\-–—|& ]+|[,;:\-–—|& ]+$/g, '')
    .replace(/^(?:and|or|with)\b[, ]*/i, '')
    .replace(/[, ]*\b(?:and|or|with)$/i, '')
    .replace(/\.{2,}/g, '.')
    .replace(/\.\s*\./g, '.')
    .replace(/,\s*(?:and|or)\s+(?=(?:a|an|the)\b)/gi, ' ')
    .replace(/,\s*,/g, ',')
    .replace(/,\s*\./g, '.')
    .replace(/\s+/g, ' ')
    .replace(/\.{2,}/g, '.')
    .replace(/\s+\b(?:with|and|or)\b\s*$/i, '')
    .replace(/,\s*$/g, '')
    .trim();
  return text.replaceAll(suffixToken, TITLE_SUFFIX);
}

export function fitPdfTitle(input) {
  let base = stripClaims(input).replace(new RegExp(`\\s*\\|\\s*${PRODUCT}\\s*$`, 'i'), '').trim();
  base = base.replace(/[\s\-–—|:]+$/g, '').trim();
  if (!base) base = 'PDF tools';
  const full = `${base}${TITLE_SUFFIX}`;
  if (full.length <= 60) return full;
  const max = 60 - TITLE_SUFFIX.length;
  let cut = base.slice(0, max).replace(/\s+\S*$/, '').replace(/[\s\-–—|:]+$/g, '').replace(/[, ]*\b(?:and|or)$/i, '').trim();
  if (cut.length < 8) cut = base.slice(0, max).trim();
  return `${cut}${TITLE_SUFFIX}`;
}

export function fitBrandTitle(input, brand = 'Dayfiles') {
  const suffix = ` | ${brand}`;
  let base = stripClaims(input)
    .replace(new RegExp(`\\s*\\|\\s*${brand}(?:\\s+Blog)?\\s*$`, 'i'), '')
    .replace(/[\s\-–—|:]+$/g, '')
    .trim();
  if (!base) base = brand;
  const full = `${base}${suffix}`;
  if (full.length <= 60) return full;
  const max = 60 - suffix.length;
  let cut = base.slice(0, max).replace(/\s+\S*$/, '').replace(/[\s\-–—|:]+$/g, '').replace(/[, ]*\b(?:and|or)$/i, '').trim();
  if (cut.length < 8) cut = base.slice(0, max).trim();
  return `${cut}${suffix}`;
}

export function fitDescription(input) {
  let text = stripClaims(input).replace(/\s+/g, ' ').trim();
  if (text.length <= 155) return text;
  let cut = text.slice(0, 155).replace(/\s+\S*$/, '').replace(/[,:;.\s]+$/g, '').trim();
  while (/\b(?:a|an|the|and|or|with|to|for|of|in|on|before|after|from|by)\s*$/i.test(cut)) {
    cut = cut.replace(/\b(?:a|an|the|and|or|with|to|for|of|in|on|before|after|from|by)\s*$/i, '').replace(/[,:;.\s]+$/g, '').trim();
  }
  if (cut.length < 40) cut = text.slice(0, 155).trim();
  return cut;
}

function readTag(html, re) {
  const match = html.match(re);
  return match ? decodeHtml(match[1]) : '';
}

function readTitle(html) {
  return readTag(html, /<title>([^<]*)<\/title>/i);
}

function readMeta(html, attr, key) {
  const re = new RegExp(
    `<meta\\b[^>]*\\b${attr}=(["'])${key}\\1[^>]*>`,
    'i',
  );
  const tag = html.match(re);
  if (!tag) return '';
  const content = tag[0].match(/\bcontent=(["'])([\s\S]*?)\1/i);
  return content ? decodeHtml(content[2]) : '';
}

function readH1(html) {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!match) return '';
  return decodeHtml(match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function readHero(html) {
  const match = html.match(/<\/h1>\s*<p\b[^>]*>([\s\S]*?)<\/p>/i);
  if (!match) return '';
  return decodeHtml(match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

export function pageSpec(pathname, html = '') {
  const path = normalizeContentPath(pathname);
  if (path === '/') {
    return {
      ...HOME_COPY,
      trust: '',
      kind: 'home',
      store: false,
      related: false,
      guide: null,
    };
  }
  const tool = ALLOWED_BY_PATH.get(path);
  if (tool) {
    const store = tool.store !== false && STORE_PATHS.has(tool.path);
    const links = storeLinksForPath(tool.path);
    return {
      title: tool.title,
      h1: tool.h1,
      description: tool.description,
      hero: tool.hero,
      trust: store ? APP_TRUST : '',
      kind: 'tool',
      store,
      related: true,
      guide: null,
      play: links.play,
      ios: links.ios,
      storeBody: STORE_BODY,
    };
  }
  const current = {
    title: readTitle(html),
    description: readMeta(html, 'name', 'description'),
    h1: readH1(html),
    hero: readHero(html),
  };
  const guide = GUIDE_LINKS[path] || null;
  const authored = { ...(GUIDE_COPY[path] || {}), ...(PAGE_COPY[path] || {}) };
  return {
    title: authored.title || (current.title ? fitPdfTitle(current.title) : ''),
    h1: authored.h1 || (current.h1 ? stripClaims(current.h1) : ''),
    description: authored.description || (current.description ? fitDescription(current.description) : ''),
    hero: authored.hero || (current.hero ? stripClaims(current.hero) : ''),
    trust: '',
    kind: guide ? 'guide' : 'strip',
    store: false,
    related: false,
    guide,
  };
}

function replaceMeta(html, attr, key, value) {
  if (!value) return html;
  const re = new RegExp(`<meta\\b[^>]*\\b${attr}=(["'])${key}\\1[^>]*>`, 'i');
  return html.replace(re, (tag) => {
    if (/\bcontent=/.test(tag)) {
      return tag.replace(/\bcontent=(["'])[\s\S]*?\1/i, `content="${escapeAttr(value)}"`);
    }
    return tag.replace(/<meta\b/i, `<meta content="${escapeAttr(value)}"`);
  });
}

function replaceH1(html, h1) {
  if (!h1) return html;
  return html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, (tag) => {
    const open = tag.match(/^<h1\b[^>]*>/i)[0];
    return `${open}${escapeText(h1)}</h1>`;
  });
}

function replaceHero(html, hero) {
  if (hero == null) return html;
  return html.replace(/(<\/h1>\s*<p\b[^>]*>)([\s\S]*?)(<\/p>)/i, `$1${escapeText(hero)}$3`);
}

function storeBlock(spec) {
  return `<aside data-pdf-app-cta="true" style="margin:1rem 0;padding:.85rem 1rem;border:1px solid #d6dde8;border-radius:12px;background:#fff;color:#0f172a;font:14px/1.45 system-ui,sans-serif"><p style="margin:0 0 .35rem;font-weight:700">Get the Private PDF app</p><p style="margin:0 0 .7rem">${escapeText(spec.storeBody)}</p><p style="margin:0;display:flex;flex-wrap:wrap;gap:.5rem"><a href="${escapeAttr(spec.play)}" style="display:inline-block;padding:.45rem .75rem;border-radius:8px;background:#0f172a;color:#fff;text-decoration:none;font-weight:650">Google Play</a><a href="${escapeAttr(spec.ios)}" style="display:inline-block;padding:.45rem .75rem;border-radius:8px;background:#0f172a;color:#fff;text-decoration:none;font-weight:650">App Store</a></p></aside>`;
}

function relatedBlock(path) {
  const items = ALLOWED_TOOLS.filter((tool) => tool.path !== path)
    .map(
      (tool) =>
        `<li><a href="${tool.path}/">${escapeText(tool.label)}</a></li>`,
    )
    .join('');
  return `<nav data-pdf-related-tools="true" aria-label="Related tools" style="margin:1rem 0 1.25rem;font:14px/1.45 system-ui,sans-serif"><p style="margin:0 0 .4rem;font-weight:700">Related tools</p><ul style="margin:0;padding-left:1.1rem;display:flex;flex-direction:column;gap:.25rem">${items}</ul></nav>`;
}

function guideBlock(guide) {
  const [href, anchor] = guide;
  return `<p data-pdf-tool-link="true" style="margin:1rem 0;font:16px/1.5 system-ui,sans-serif">Use <a href="${escapeAttr(href)}">${escapeText(anchor)}</a> for this task.</p>`;
}

function clientScript() {
  const payload = {
    home: HOME_COPY,
    homeReplacements: HOME_REPLACEMENTS,
    tools: ALLOWED_TOOLS.map((tool) => {
      const store = tool.store !== false && STORE_PATHS.has(tool.path);
      const links = storeLinksForPath(tool.path);
      return {
        path: tool.path,
        label: tool.label,
        title: tool.title,
        h1: tool.h1,
        description: tool.description,
        hero: tool.hero,
        trust: store ? APP_TRUST : '',
        store,
        play: links.play,
        ios: links.ios,
        storeBody: STORE_BODY,
      };
    }),
    guides: GUIDE_LINKS,
    guideCopy: GUIDE_COPY,
    pages: { ...GUIDE_COPY, ...PAGE_COPY },
    bodyReplacements: BODY_REPLACEMENTS,
    bodyPhrases: BODY_PHRASES,
    phrases: PHRASES,
    trustSentence: TRUST_SENTENCE,
    excluded: EXCLUDED_PREFIXES,
  };
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  return `<script data-pdf-claim-script="true">
(function () {
  var data = ${json};
  function norm(path) {
    path = (path || '/').split('?')[0].split('#')[0];
    if (path.length > 1) path = path.replace(/\\/+$/, '');
    return path || '/';
  }
  function eligible(path) {
    return !data.excluded.some(function (prefix) { return path.indexOf(prefix) === 0; });
  }
  function strip(input) {
    var text = String(input || '');
    var product = '\\u0001';
    text = text.replaceAll(${JSON.stringify(PRODUCT)}, product);
    data.phrases.slice().sort(function (a, b) { return b.length - a.length; }).forEach(function (phrase) {
      text = text.split(phrase).join(' ');
      text = text.split(phrase.toLowerCase()).join(' ');
    });
    text = text
      .replace(/\\bonline free\\b/gi, ' ')
      .replace(/\\bfor free\\b/gi, ' ')
      .replace(/\\bfree\\s*&\\s*private\\b/gi, ' ')
      .replace(/\\bfree\\b/gi, ' ')
      .replace(/\\bprivately\\b/gi, ' ')
      .replace(/\\bprivacy(?:-first)?\\b/gi, ' ')
      .replace(/\\bprivate\\b/gi, ' ')
      .replace(/\\blocal(?:ly)?\\b/gi, ' ')
      .replace(/\\bon-device\\b/gi, ' ')
      .replace(/\\boffline\\b/gi, ' ')
      .replace(/\\bsecure(?:ly)?\\b/gi, ' ')
      .replace(/\\binstant(?:ly)?\\b/gi, ' ')
      .replace(/\\bquickly\\b/gi, ' ')
      .replace(/\\bfaster\\b/gi, ' ')
      .replace(/\\bfast\\b/gi, ' ')
      .replace(/\\bspeed\\b/gi, ' ')
      .replace(/\\bin seconds\\b/gi, ' ')
      .replace(/\\bin minutes\\b/gi, ' ')
      .replace(/\\bwithout uploading\\b/gi, ' ')
      .replace(/\\bsmaller\\b/gi, ' ');
    text = text.split(product).join(${JSON.stringify(PRODUCT)});
    return text
      .replace(/\\s+/g, ' ')
      .replace(/\\s*[—–]\\s*,\\s*&?\\s*/g, ' ')
      .replace(/\\s+&\\s+(?=[|.,]|$)/g, ' ')
      .replace(/\\bmore\\s+by\\b/gi, 'by')
      .replace(/\\s+([,;:!?])/g, '$1')
      .replace(/\\s+\\.(?!\\w)/g, '.')
      .replace(/\\.{2,}/g, '.')
      .replace(/^[,.;:\\-–—|& ]+|[,;:\\-–—|& ]+$/g, '')
      .trim();
  }
  function fitTitle(input) {
    var base = strip(input).replace(/\\s*\\|\\s*Private PDF\\s*$/i, '').trim();
    if (!base) base = 'PDF tools';
    var full = base + ' | Private PDF';
    if (full.length <= 60) return full;
    var max = 60 - ' | Private PDF'.length;
    var cut = base.slice(0, max).replace(/\\s+\\S*$/, '').trim();
    return (cut || base.slice(0, max)) + ' | Private PDF';
  }
  function fitDesc(input) {
    var text = strip(input);
    if (text.length <= 155) return text;
    return text.slice(0, 155).replace(/\\s+\\S*$/, '').trim();
  }
  function setMeta(attr, key, value) {
    if (!value) return;
    var node = document.head.querySelector('meta[' + attr + '="' + key + '"]');
    if (node && node.getAttribute('content') !== value) node.setAttribute('content', value);
  }
  function toolMap() {
    var map = {};
    data.tools.forEach(function (tool) { map[tool.path] = tool; });
    return map;
  }
  function apply() {
    var path = norm(location.pathname);
    if (!eligible(path)) return;
    var tools = toolMap();
    var tool = tools[path];
    var h1 = document.querySelector('h1');
    var hero = h1 && h1.nextElementSibling && h1.nextElementSibling.tagName === 'P' ? h1.nextElementSibling : null;
    var spec;
    if (path === '/') spec = data.home;
    else if (tool) spec = tool;
    else {
      var authored = data.pages[path];
      var fallback = {
        title: fitTitle(document.title),
        description: fitDesc((document.head.querySelector('meta[name="description"]') || {}).content || ''),
        h1: h1 ? strip(h1.textContent) : '',
        hero: hero ? strip(hero.textContent) : ''
      };
      spec = authored ? {
        title: authored.title || fallback.title,
        description: authored.description || fallback.description,
        h1: authored.h1 || fallback.h1,
        hero: authored.hero || fallback.hero
      } : fallback;
    }
    if (spec.title && document.title !== spec.title) document.title = spec.title;
    setMeta('name', 'description', spec.description);
    setMeta('property', 'og:title', spec.title);
    setMeta('name', 'twitter:title', spec.title);
    setMeta('property', 'og:description', spec.description);
    setMeta('name', 'twitter:description', spec.description);
    if (h1 && spec.h1 && h1.textContent.trim() !== spec.h1) h1.textContent = spec.h1;
    if (hero && spec.hero && hero.textContent.trim() !== spec.hero) hero.textContent = spec.hero;
    document.querySelectorAll('p').forEach(function (p) {
      if (p.textContent.indexOf('No upload queue') === -1 && p.textContent.indexOf('Private in-browser processing') === -1) return;
      var next = tool ? (tool.trust || '') : '';
      if (p.textContent !== next) p.textContent = next;
    });
    var map = {};
    data.homeReplacements.forEach(function (pair) { map[pair[0]] = pair[1]; });
    var stripApp = !(path === '/' || (tool && tool.store));
    function cleanBody(input) {
      var text = String(input || '');
      var product = '\\u0001';
      var policy = '\\u0002';
      text = text.split(${JSON.stringify(PRODUCT)}).join(product);
      text = text.replace(/privacy policy/gi, policy);
      data.bodyReplacements.slice().sort(function (a, b) { return b[0].length - a[0].length; }).forEach(function (pair) {
        text = text.split(pair[0]).join(pair[1]);
        text = text.split(pair[0].toLowerCase()).join(pair[1]);
      });
      data.bodyPhrases.slice().sort(function (a, b) { return b.length - a.length; }).forEach(function (phrase) {
        text = text.split(phrase).join(' ');
        text = text.split(phrase.toLowerCase()).join(' ');
      });
      if (stripApp) text = text.replace(new RegExp('Also in the ' + product + ' app(?: for Android and iOS)?\\\\.?', 'gi'), ' ');
      text = text
        .replace(/\\blocal(?:ly)?\\b/gi, ' ')
        .replace(/\\boffline\\b/gi, ' ')
        .replace(/\\bon-device\\b/gi, ' ')
        .replace(/\\bfree\\b/gi, ' ')
        .replace(/\\bprivately\\b/gi, ' ')
        .replace(/\\bprivate\\b/gi, ' ')
        .replace(/\\bsafely\\b/gi, ' ')
        .replace(/\\bsecure(?:ly)?\\b/gi, ' ')
        .replace(/\\binstant(?:ly)?\\b/gi, ' ');
      text = text.split(product).join(${JSON.stringify(PRODUCT)});
      text = text.split(policy).join('Privacy Policy');
      return text.replace(/\\s+/g, ' ').replace(/\\s+([,.;:!?])/g, '$1').replace(/^[,.;:\\- ]+/, '').replace(/[,;:\\- ]+$/g, '').trim();
    }
    if (document.body) {
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      var node;
      while ((node = walker.nextNode())) {
        var parent = node.parentNode;
        if (!parent || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(parent.tagName)) continue;
        if (map[node.nodeValue]) node.nodeValue = map[node.nodeValue];
        var cleaned = cleanBody(node.nodeValue);
        if (cleaned !== node.nodeValue) node.nodeValue = cleaned;
      }
    }
    document.querySelectorAll('meta[content], img[alt]').forEach(function (el) {
      ['content', 'alt'].forEach(function (attr) {
        var value = el.getAttribute(attr);
        if (!value) return;
        data.bodyReplacements.forEach(function (pair) {
          if (value.indexOf(pair[0]) !== -1) value = value.split(pair[0]).join(pair[1]);
        });
        if (value !== el.getAttribute(attr)) el.setAttribute(attr, value);
      });
    });
    var anchor = h1 && h1.parentNode ? h1.parentNode : document.body;
    if (path === '/' && !document.querySelector('[data-pdf-home-tools]')) {
      var homeNav = document.createElement('nav');
      homeNav.setAttribute('data-pdf-home-tools', 'true');
      homeNav.setAttribute('aria-label', 'PDF tools');
      homeNav.style.cssText = 'margin:1rem 0 1.25rem;font:14px/1.45 system-ui,sans-serif';
      var homeLabel = document.createElement('p');
      homeLabel.style.cssText = 'margin:0 0 .4rem;font-weight:700';
      homeLabel.textContent = 'PDF tools';
      var homeList = document.createElement('ul');
      homeList.style.cssText = 'margin:0;padding-left:1.1rem';
      data.tools.forEach(function (item) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = item.path + '/';
        a.textContent = item.label;
        li.appendChild(a);
        homeList.appendChild(li);
      });
      homeNav.appendChild(homeLabel);
      homeNav.appendChild(homeList);
      anchor.appendChild(homeNav);
    }
    var relatedNode = document.querySelector('[data-pdf-related-tools]');
    if (tool) {
      if (!relatedNode) {
        var nav = document.createElement('nav');
        nav.setAttribute('data-pdf-related-tools', 'true');
        nav.setAttribute('aria-label', 'Related tools');
        nav.style.cssText = 'margin:1rem 0 1.25rem;font:14px/1.45 system-ui,sans-serif';
        var label = document.createElement('p');
        label.style.cssText = 'margin:0 0 .4rem;font-weight:700';
        label.textContent = 'Related tools';
        var list = document.createElement('ul');
        list.style.cssText = 'margin:0;padding-left:1.1rem';
        data.tools.forEach(function (item) {
          if (item.path === path) return;
          var li = document.createElement('li');
          var link = document.createElement('a');
          link.href = item.path + '/';
          link.textContent = item.label;
          li.appendChild(link);
          list.appendChild(li);
        });
        nav.appendChild(label);
        nav.appendChild(list);
        anchor.appendChild(nav);
      }
    } else if (relatedNode) {
      relatedNode.remove();
    }
    var storeNode = document.querySelector('[data-pdf-app-cta]');
    if (tool && tool.store) {
      if (!storeNode) {
        var aside = document.createElement('aside');
        aside.setAttribute('data-pdf-app-cta', 'true');
        aside.style.cssText = 'margin:1rem 0;padding:.85rem 1rem;border:1px solid #d6dde8;border-radius:12px;background:#fff;color:#0f172a;font:14px/1.45 system-ui,sans-serif';
        aside.innerHTML = '<p style="margin:0 0 .35rem;font-weight:700">Get the Private PDF app</p><p style="margin:0 0 .7rem"></p><p style="margin:0;display:flex;flex-wrap:wrap;gap:.5rem"><a style="display:inline-block;padding:.45rem .75rem;border-radius:8px;background:#0f172a;color:#fff;text-decoration:none;font-weight:650">Google Play</a><a style="display:inline-block;padding:.45rem .75rem;border-radius:8px;background:#0f172a;color:#fff;text-decoration:none;font-weight:650">App Store</a></p>';
        aside.querySelector('p:nth-of-type(2)').textContent = tool.storeBody;
        var links = aside.querySelectorAll('a');
        links[0].href = tool.play;
        links[1].href = tool.ios;
        anchor.appendChild(aside);
      }
    } else if (storeNode) {
      storeNode.remove();
    }
    var guide = data.guides[path];
    if (guide && !document.querySelector('[data-pdf-tool-link]')) {
      var p = document.createElement('p');
      p.setAttribute('data-pdf-tool-link', 'true');
      p.style.cssText = 'margin:1rem 0;font:16px/1.5 system-ui,sans-serif';
      p.appendChild(document.createTextNode('Use '));
      var a = document.createElement('a');
      a.href = guide[0];
      a.textContent = guide[1];
      p.appendChild(a);
      p.appendChild(document.createTextNode(' for this task.'));
      anchor.appendChild(p);
    }
  }
  var timers = [];
  var observer = null;
  function schedule() {
    timers.forEach(clearTimeout);
    timers = [0, 50, 200, 700, 1600, 3200].map(function (delay) { return setTimeout(apply, delay); });
  }
  if (typeof MutationObserver === 'function') {
    observer = new MutationObserver(function () { apply(); });
  }
  var previousApply = apply;
  apply = function () {
    if (observer) observer.disconnect();
    previousApply();
    if (observer && document.documentElement) {
      observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
    }
  };
  var push = history.pushState;
  var replace = history.replaceState;
  history.pushState = function () { var result = push.apply(this, arguments); schedule(); return result; };
  history.replaceState = function () { var result = replace.apply(this, arguments); schedule(); return result; };
  window.addEventListener('popstate', schedule);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule);
  schedule();
})();
</script>`;
}

function homeToolsBlock() {
  const items = ALLOWED_TOOLS.map(
    (tool) => `<li><a href="${tool.path}/">${escapeText(tool.label)}</a></li>`,
  ).join('');
  return `<nav data-pdf-home-tools="true" aria-label="PDF tools" style="margin:1rem 0 1.25rem;font:14px/1.45 system-ui,sans-serif"><p style="margin:0 0 .4rem;font-weight:700">PDF tools</p><ul style="margin:0;padding-left:1.1rem;display:flex;flex-direction:column;gap:.25rem">${items}</ul></nav>`;
}

function claimWords(value) {
  return newCopyViolations(value).length > 0;
}

function cleanJsonNode(node, spec) {
  if (Array.isArray(node)) {
    return node.map((item) => cleanJsonNode(item, spec)).filter((item) => item != null);
  }
  if (!node || typeof node !== 'object') return node;
  const type = node['@type'];
  if (type === 'Question') {
    const question = typeof node.name === 'string' ? node.name : '';
    const answer = node.acceptedAnswer && typeof node.acceptedAnswer.text === 'string' ? node.acceptedAnswer.text : '';
    if (claimWords(question) || claimWords(answer)) return null;
  }
  const copy = { ...node };
  if (copy.offers && (copy.offers.price === '0' || copy.offers.price === 0)) delete copy.offers;
  for (const key of ['name', 'headline', 'description', 'text', 'abstract']) {
    if (typeof copy[key] !== 'string') continue;
    if (key === 'name' && (type === 'WebPage' || type === 'WebSite') && spec.title) copy[key] = spec.title;
    else if (key === 'description' && spec.description && (type === 'WebPage' || type === 'WebSite')) copy[key] = spec.description;
    else if (key === 'description' && spec.description && (spec.kind === 'tool' || spec.kind === 'home') && (type === 'SoftwareApplication' || type === 'HowTo' || type === 'WebApplication')) copy[key] = spec.description;
    else copy[key] = cleanSchemaText(copy[key]);
  }
  if ((type === 'WebPage' || type === 'WebSite') && spec.title) copy.name = spec.title;
  if (type === 'SoftwareApplication' && spec.h1 && (spec.kind === 'tool' || spec.kind === 'home')) copy.name = spec.h1;
  if (spec.description && typeof copy.description === 'string' && (type === 'WebPage' || type === 'WebSite' || ((spec.kind === 'tool' || spec.kind === 'home') && (type === 'SoftwareApplication' || type === 'HowTo' || type === 'WebApplication')))) {
    copy.description = spec.description;
  }
  for (const key of Object.keys(copy)) {
    if (key === 'name' || key === 'headline' || key === 'description' || key === 'text' || key === 'abstract' || key === '@type') continue;
    copy[key] = cleanJsonNode(copy[key], spec);
  }
  if (type === 'FAQPage' && Array.isArray(copy.mainEntity) && copy.mainEntity.length === 0) return null;
  return copy;
}

function rewriteJsonLd(html, spec) {
  return html.replace(/<script\b([^>]*?)type=(["'])application\/ld\+json\2([^>]*)>([\s\S]*?)<\/script>/gi, (full, before, quote, after, body) => {
    try {
      const data = cleanJsonNode(JSON.parse(body), spec);
      if (data == null) return '';
      return `<script${before}type=${quote}application/ld+json${quote}${after}>${JSON.stringify(data)}</script>`;
    } catch {
      return full;
    }
  });
}

function rewriteKeywords(html) {
  return html.replace(/<meta\b[^>]*\bname=(["'])keywords\1[^>]*>/i, (tag) => {
    const content = tag.match(/\bcontent=(["'])([\s\S]*?)\1/i);
    if (!content) return tag;
    const parts = [];
    for (const part of decodeHtml(content[2]).split(',')) {
      const cleaned = stripClaims(part);
      if (cleaned.length > 2 && !parts.includes(cleaned)) parts.push(cleaned);
    }
    return tag.replace(/\bcontent=(["'])[\s\S]*?\1/i, `content="${escapeAttr(parts.join(', '))}"`);
  });
}

function inject(html, block) {
  if (!block || html.includes(block.slice(0, 24))) return html;
  if (/<\/h1>\s*<p\b/i.test(html)) {
    return html.replace(/(<\/h1>\s*<p\b[^>]*>[\s\S]*?<\/p>)/i, `$1${block}`);
  }
  return html.replace(/<\/h1>/i, `</h1>${block}`);
}

export function rewriteClaimHtml(pathname, html) {
  if (!html || !shouldRewritePath(pathname)) return html;
  const path = normalizeContentPath(pathname);
  const spec = pageSpec(path, html);
  let out = html;
  for (const [from, to] of HOME_REPLACEMENTS) {
    if (from && from !== to) out = out.replaceAll(from, to);
  }
  for (const [from, to] of knownHeadReplacements()) {
    if (from && to && from !== to) out = out.replaceAll(from, to);
  }
  if (spec.title) out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escapeText(spec.title)}</title>`);
  out = replaceMeta(out, 'name', 'description', spec.description);
  out = replaceMeta(out, 'property', 'og:title', spec.title);
  out = replaceMeta(out, 'name', 'twitter:title', spec.title);
  out = replaceMeta(out, 'property', 'og:description', spec.description);
  out = replaceMeta(out, 'name', 'twitter:description', spec.description);
  out = replaceH1(out, spec.h1);
  if (spec.hero) out = replaceHero(out, spec.hero);
  else if (spec.kind !== 'home' && spec.kind !== 'tool') out = replaceHero(out, spec.hero || '');
  out = rewriteJsonLd(out, spec);
  out = rewriteKeywords(out);
  if (out.includes(TRUST_SENTENCE)) {
    out = out.replaceAll(TRUST_SENTENCE, spec.trust || '');
  }
  out = rewriteVisibleHtml(out, { stripAppMention: path !== '/' && !spec.store });
  let blocks = '';
  if (path === '/') blocks += homeToolsBlock();
  if (spec.related) blocks += relatedBlock(path);
  if (spec.store) blocks += storeBlock(spec);
  if (spec.guide) blocks += guideBlock(spec.guide);
  if (blocks) out = inject(out, blocks);
  if (!out.includes('data-pdf-claim-script')) {
    out = out.includes('</body>')
      ? out.replace(/<\/body>/i, `${clientScript()}</body>`)
      : `${out}${clientScript()}`;
  }
  return out;
}

function rewriteJsClaimString(value) {
  let decoded = value;
  try {
    decoded = JSON.parse(`"${value}"`);
  } catch {
    return value;
  }
  if (!claimWords(decoded)) return value;
  const cleaned = /\|\s*Private PDF\s*$/i.test(decoded) ? fitPdfTitle(decoded) : stripClaims(decoded);
  return JSON.stringify(cleaned).slice(1, -1);
}

export function shouldRewriteScript(pathname) {
  return /\.m?js$/i.test(normalizeContentPath(pathname));
}

export function rewriteClaimScript(code) {
  if (typeof code !== 'string' || !code) return code;
  if (!/Online Free|No uploads|No upload|Without Uploading|paywall|on-device|Free &|local-first|offline-ready/i.test(code)) {
    return code;
  }
  let out = code;
  const pairs = [...SCRIPT_REPLACEMENTS, ...knownHeadReplacements(), ...HOME_REPLACEMENTS];
  pairs.sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of pairs) {
    if (from && out.includes(from)) out = out.replaceAll(from, to);
  }
  out = out.replace(/\b(title|seoTitle|description|subtitle|h1):"((?:[^"\\]|\\.)*)"/g, (full, key, value) => {
    const cleaned = rewriteJsClaimString(value);
    return cleaned === value ? full : `${key}:"${cleaned}"`;
  });
  return out;
}

export function newCopyViolations(text) {
  const sample = String(text || '').replaceAll(PRODUCT, '');
  const rules = [
    [/\bfree\b/i, 'free'],
    [/\bprivacy\b/i, 'privacy'],
    [/\bprivate(?:ly)?\b/i, 'private'],
    [/\boffline\b/i, 'offline'],
    [/\bon-device\b/i, 'on-device'],
    [/\blocal(?:ly)?\b/i, 'local'],
    [/\bsecure(?:ly)?\b/i, 'secure'],
    [/\bupload/i, 'upload'],
    [/\bpaywall/i, 'paywall'],
    [/\bno account\b/i, 'no account'],
    [/\bno ads\b/i, 'no ads'],
    [/\binstant(?:ly)?\b/i, 'instant'],
    [/\bquickly\b/i, 'quickly'],
    [/\bfast\b/i, 'fast'],
    [/\bseconds\b/i, 'seconds'],
    [/\bsmaller\b/i, 'smaller'],
    [/\bcompression level\b/i, 'compression level'],
    [/\bconvert\b/i, 'convert'],
    [/\bsign(?:ing|ature)?\b/i, 'sign'],
    [/\bextract\b/i, 'extract'],
    [/\block\b/i, 'lock'],
    [/\bunlock\b/i, 'unlock'],
    [/\bpassword\b/i, 'password'],
  ];
  return rules.filter(([pattern]) => pattern.test(sample)).map(([, name]) => name);
}

export function disallowedFeaturePaths(paths) {
  const allowed = new Set(['/', ...ALLOWED_TOOLS.map((tool) => tool.path), ...Object.keys(GUIDE_LINKS)]);
  const markers = [
    'sign',
    'lock',
    'unlock',
    'password',
    'extract',
    'convert',
    'docx',
    'jpg',
    'html-to-',
    'pdf-to-',
    'ocr',
    'redact',
    'crop',
    'fill-pdf',
    'offline',
    'metadata',
    'page-count',
    'page-size',
    'file-size',
    'editability',
    'can-this-pdf',
    'bates',
    'compare',
    'flatten',
    'repair',
    'protect',
  ];
  return paths.filter((pathname) => {
    const path = normalizeContentPath(pathname);
    if (!shouldRewritePath(path) || allowed.has(path) || ALLOWED_BY_PATH.has(path)) return false;
    return markers.some((marker) => path.includes(marker));
  });
}
