/**
 * Hand-written titles, H1s, and meta descriptions.
 * Mechanical trimming was leaving unfinished titles and mid-sentence descriptions.
 */

export const PAGE_COPY = {
  '/private-pdf/about': {
    description:
      'Learn who runs Private PDF Editor and which PDF workflows the product supports today.',
  },
  '/guides/how-to-prepare-a-pdf-for-job-application': {
    description:
      'Merge, compress, and check a job-application PDF so it is readable and ready to send.',
  },
  '/guides/how-to-combine-bank-statements-into-one-pdf': {
    h1: 'How to Combine Bank Statements Into One PDF',
    description:
      'Merge bank statement PDFs into one packet for an application, a review, or a submission.',
  },
  '/guides/how-to-merge-compress-and-lock-a-pdf-locally': {
    h1: 'How to Merge, Compress, and Lock a PDF',
    description:
      'Merge the PDFs, compress the packet if it needs to be lighter, and add a password to the finished file.',
  },
  '/guides/how-to-edit-compress-and-protect-a-pdf-locally': {
    description:
      'Edit PDF text or OCR output first, then compress the file and protect the finished copy.',
  },
  '/guides/how-to-fill-sign-and-lock-a-pdf-form-locally': {
    description:
      'Complete the form fields, add a signature, and protect the finished copy in that order.',
  },
  '/guides/how-to-check-a-pdf-before-you-split-crop-or-unlock-it': {
    description:
      'Run a checker first, then split, crop, unlock, or edit while the PDF is still open.',
  },
  '/guides/how-to-organize-clean-up-and-finish-a-pdf-locally': {
    description:
      'Organize pages, remove mistakes, fix orientation or margins, and finish with numbering, a watermark, or compression.',
  },
  '/guides/how-to-flatten-a-pdf-before-sharing-it': {
    description:
      'Flatten a PDF when filled fields, a visible signature, a watermark, or a redaction should stay in the shared copy.',
  },
  '/guides/how-to-convert-pdf-tables-to-excel-without-exposing-sensitive-files': {
    h1: 'How to Convert PDF Tables to Excel',
    description:
      'Check whether a PDF table is text-based, use the original spreadsheet when you have it, and review every exported row.',
  },
  '/guides/how-to-prepare-a-pdf-for-powerpoint-without-uploading-confidential-pages': {
    h1: 'How to Prepare a PDF for PowerPoint',
    description:
      'Keep only the pages a slide deck needs, export those pages as images, and leave the rest of the PDF out.',
  },
  '/guides/how-to-fill-and-sign-a-pdf-form-before-sending-it': {
    description:
      'Complete the form fields, add a visible signature, and review the flattened copy.',
  },
  '/guides/how-to-prepare-hr-pdf-forms-without-uploading-employee-documents': {
    title: 'Prepare HR PDF Forms | Private PDF',
    h1: 'How to Prepare HR PDF Forms',
    description:
      'Fill HR form fields, add visible signatures, attach the supporting pages, and protect the finished copy.',
  },
  '/guides/how-to-protect-a-signed-pdf-before-emailing-it': {
    description:
      'Review the signature, flatten the signed PDF, and add a password only when the handoff needs one.',
  },
  '/guides/how-to-send-private-pdf-files-without-uploading-them-first': {
    title: 'Send Only the PDF Pages You Need | Private PDF',
    h1: 'How to Send Only the PDF Pages a Recipient Needs',
    description:
      'Extract or trim a PDF so the recipient gets the pages they asked for, and leave the rest of the source file out.',
  },
  '/guides/how-to-use-private-pdf-tools-for-accounting-documents': {
    h1: 'How to Use Private PDF Tools for Accounting Documents',
    description:
      'Package invoices, statements, reimbursements, and bookkeeping PDFs into one tidy packet.',
  },
  '/guides/how-to-sign-and-fill-pdf-forms-locally': {
    h1: 'How to Sign and Fill PDF Forms',
    description:
      'Fill supported form fields first, add a visible signature second, and review the flattened copy.',
  },
  '/guides/how-to-lock-and-unlock-pdf-files': {
    h1: 'How to Lock and Unlock PDF Files',
    description:
      'Add a password when a PDF is ready to share, and remove a password only when you are allowed to keep editing.',
  },
  '/guides/when-not-to-upload-sensitive-pdfs-to-ai-chat-or-summarizer-tools': {
    h1: 'When to Keep a Sensitive PDF Out of an AI Chat',
    description:
      'Decide when a PDF should stay out of an AI chat, then prepare a shorter or redacted copy first.',
  },
  '/guides/how-to-redact-a-pdf-locally': {
    title: 'Redact a PDF Before You Share It | Private PDF',
    h1: 'How to Redact a PDF Before You Share It',
    description:
      'Cover sensitive areas, check the exported PDF, and remove a page when covering the area is not enough.',
  },
  '/ocr-pdf': {
    description:
      'Turn scanned PDFs and images into searchable PDFs in eight languages, and keep the original page appearance.',
  },
  '/unlock-pdf': {
    description:
      'Open a compatible PDF when you already know the password, then save a copy you can print or edit.',
  },
  '/redact-pdf': {
    description:
      'Cover sensitive areas on a PDF, flatten those areas, and save one redacted PDF.',
  },
  '/pdf-file-size-checker': {
    description:
      'Check a PDF file size in bytes, KB, and MB, then compare it with common email and portal limits.',
  },
  '/pdf-password-status-checker': {
    description:
      'Check whether a PDF asks for an open password or carries permission restrictions.',
  },
  '/docx-to-pdf': {
    description: 'Turn a Word document into a PDF and save a clean file.',
  },
  '/e-sign-pdf': {
    description: 'Draw or type a signature, place it on the PDF, and save a flattened copy.',
  },
  '/html-to-pdf': {
    description: 'Turn an HTML file or pasted HTML into a PDF and keep the visual layout.',
  },
  '/extract-pdf-images': {
    title: 'Extract PDF Images | Private PDF',
    h1: 'Extract PDF Images',
    description: 'Save the raster images embedded in a PDF and download them together in a ZIP file.',
  },
  '/pdf-to-powerpoint': {
    title: 'PDF to PowerPoint | Private PDF',
    h1: 'PDF to PowerPoint',
    description: 'Build a PowerPoint file with one PDF page image on each slide.',
  },
  '/lock-pdf': {
    description: 'Add a password to a PDF and save the file.',
  },
};

const DAYFILES = ' | Dayfiles';

function blog(title, description) {
  return {
    h1: title,
    documentTitle: `${title}${DAYFILES}`,
    description,
  };
}

export const BLOG_COPY = {
  'add-bates-numbers-to-pdf-files': blog(
    'Add Bates Numbers Across PDF Files',
    'Add Bates numbers across several PDFs in one sequence, pick a readable footer, keep file order, and export an index.',
  ),
  'build-client-pdf-from-docx-html-and-images': blog(
    'Build One Client PDF From Mixed Files',
    'Combine DOCX, HTML, and image files into one client PDF, then review the packet before you send it.',
  ),
  'check-if-a-pdf-can-be-edited-before-rework': blog(
    'Check If a PDF Can Be Edited',
    'Check whether a PDF can be edited before rework so the team picks a workflow and avoids a false start.',
  ),
  'compare-two-pdf-files-for-changes': blog(
    'Compare Two PDF Files for Changes',
    'Compare two PDFs page by page, review text and visual changes, and save a report of the differences.',
  ),
  'compress-images-to-a-specific-size-before-upload': blog(
    'Compress Images to a Specific Size',
    'Compress images toward a size target, then review the result before you attach the files.',
  ),
  'convert-bank-statement-pdf-to-excel-safely': blog(
    'Convert a Bank Statement PDF to Excel',
    'Turn a text-based bank statement PDF into Excel or CSV, then review each transaction row before you export.',
  ),
  'convert-heic-png-and-webp-for-easier-delivery': blog(
    'Convert HEIC, PNG, and WebP Files',
    'Convert HEIC, PNG, and WebP files to a delivery format that stays consistent across documents.',
  ),
  'edit-pdf-locally-before-final-review': blog(
    'Edit PDFs Before Final Review',
    'Edit a PDF on one working copy, keep the review path short, and export the file before you share it.',
  ),
  'extract-pdf-pages-for-review-packets': blog(
    'Extract PDF Pages for a Review Packet',
    'Pull selected PDF pages into a shorter review packet and leave the full source file unchanged.',
  ),
  'fill-sign-merge-lock-pdf-packet': blog(
    'Fill, Sign, Merge, and Lock a PDF',
    'Fill the form, add signatures, merge the packet, and lock the PDF you plan to deliver.',
  ),
  'finalize-pdf-with-watermark-page-numbers-and-lock': blog(
    'Finalize a PDF With Watermarks',
    'Add a watermark and page numbers, then lock the approved PDF before you hand it off.',
  ),
  'images-to-clean-compressed-pdf-submission': blog(
    'Turn Images Into a Clean PDF',
    'Turn image files into one PDF, merge the set, and compress the finished submission.',
  ),
  'large-submission-packaging-workflow': blog(
    'Package a Large PDF Submission',
    'Merge, organize, and compress a large PDF submission, then lock the file you will send.',
  ),
  'passport-photo-to-final-pdf-packet': blog(
    'Add Passport Photos to a PDF',
    'Prepare passport-style photos, export the approved images, and add them to a PDF packet.',
  ),
  'pdf-fix-text-and-recompress-workflow': blog(
    'Fix PDF Text and Save the File',
    'Edit PDF text through a DOCX stage, rebuild the PDF, and compress the revised file.',
  ),
  'pdf-operations-checklist': blog(
    'PDF Checklist for Document Delivery',
    'Use this checklist to standardize PDF conversion, compression, and delivery with fewer errors.',
  ),
  'pdf-pages-to-images-cleanup-and-back': blog(
    'Clean PDF Pages and Rebuild the File',
    'Turn PDF pages into images, clean those pages, and rebuild one PDF for review.',
  ),
  'redact-pdf-before-sharing-or-filing': blog(
    'Redact a PDF Before You Share It',
    'Redact a PDF, review the covered areas, and save a separate file before you share or file it.',
  ),
  'remove-pdf-pages-before-final-packet': blog(
    'Remove PDF Pages Before Sharing',
    'Remove extra PDF pages so the packet you share contains only the pages the recipient needs.',
  ),
  'resize-images-to-match-file-size-limits': blog(
    'Resize Images to Fit a Size Limit',
    'Resize images to meet a file-size limit, then check dimensions and quality before you export.',
  ),
  'search-and-redact-text-in-pdf': blog(
    'Search and Redact Text in a PDF',
    'Search a PDF for a phrase, review each match, and save a copy where that text is no longer selectable.',
  ),
  'split-update-and-recombine-pdf-workflow': blog(
    'Split a PDF, Then Update and Recombine',
    'Split a PDF, update the section that changed, and recombine the packet before delivery.',
  ),
  'turn-short-videos-into-gifs-for-product-updates': blog(
    'Turn Short Videos Into GIFs',
    'Turn a short product clip into a GIF you can drop into docs, changelogs, and launch posts.',
  ),
};
