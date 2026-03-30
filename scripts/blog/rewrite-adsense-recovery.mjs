import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'content/blog');

const SCREENSHOTS = {
  pdf: {
    src: '/blog/images/pdf-toolkit-hub-ui.png',
    alt: 'Dayfiles PDF Toolkit hub page showing the main PDF workflow categories and open-tool actions'
  },
  images: {
    src: '/blog/images/images-hub-ui.png',
    alt: 'Dayfiles Images hub page showing the image conversion, compression, and export workflow overview'
  },
  eis: {
    src: '/blog/images/everyday-image-studio-ui.png',
    alt: 'Everyday Image Studio workspace showing the main editing canvas and tool navigation'
  },
  esign: {
    src: '/blog/images/e-sign-pdf-ui.png',
    alt: 'PDF Dayfiles e-sign interface with the upload-first layout and signing workflow navigation'
  },
  fillforms: {
    src: '/blog/images/fill-pdf-forms-ui.png',
    alt: 'PDF Dayfiles fill-form interface showing the upload area and form workflow navigation'
  }
};

const commonRelated = {
  pdf: [
    { label: 'PDF Toolkit Checklist for Reliable Document Delivery', href: '/blog/pdf-operations-checklist/' },
    { label: 'PDF Fill and Sign Workflow Guide for Private Teams', href: '/blog/pdf-fill-sign-private-workflow/' },
    { label: 'Confidential Client Report PDF Workflow for Delivery Teams', href: '/blog/pdf-confidential-client-report-workflow/' }
  ],
  images: [
    { label: 'How to Compress Images in Bulk Before Upload Deadlines', href: '/blog/images-bulk-image-compression-guide/' },
    { label: 'How to Resize Images in Bulk for Listings and Uploads', href: '/blog/images-bulk-resize-listings-guide/' },
    { label: 'How to Convert Images to JPG for Consistent Delivery', href: '/blog/images-convert-to-jpg-guide/' }
  ],
  eis: [
    { label: 'Everyday Image Studio Workflow Playbook for Daily Teams', href: '/blog/eis-workflow-playbook/' },
    { label: 'Visa Photo Checklist to Prevent Resubmission Delays', href: '/blog/eis-visa-photo-resubmission-checklist/' },
    { label: 'Employee ID Photo Standards for HR Teams and Faster Reviews', href: '/blog/eis-employee-id-photo-standard-guide/' }
  ]
};

const pdfTaskConfigs = {
  'merge-pdf-without-upload': {
    action: 'merge PDF files',
    surface: 'one packet',
    useCases: ['combine signed forms into one submission', 'assemble a board packet from separate exports', 'send one clean file instead of several loose attachments'],
    preflight: ['confirm the approved source files are already final', 'decide the exact page order before the files are loaded', 'rename drafts so they cannot be mixed into the export'],
    steps: ['Open the PDF hub and launch the merge flow from the Dayfiles tool route.', 'Load only the files that belong in the final packet.', 'Sort them into the expected order before exporting.', 'Run the merge once, then open the first, middle, and last sections of the combined file.', 'Rename the exported packet so reviewers can tell it is the approved combined version.'],
    failureModes: ['draft versions hidden in the same folder', 'pages combined in the wrong order', 'one file missing from the final packet'],
    checklist: ['The packet opens as one file on the first try.', 'Every source document that belongs in the packet is present.', 'The output file name makes the final status obvious.'],
    related: ['/blog/organize-pdf-without-upload/', '/blog/page-numbers-without-upload/', '/blog/pdf-operations-checklist/']
  },
  'minify-pdf-without-upload': {
    action: 'reduce PDF file size',
    surface: 'upload or email limit',
    useCases: ['fit a PDF under an application portal size cap', 'prepare an attachment for a mail system with strict limits', 'shrink a report before handing it to a client who needs a lighter file'],
    preflight: ['know the size target before compression starts', 'identify pages that contain tiny text or screenshots', 'decide whether image quality loss is acceptable for this handoff'],
    steps: ['Start from the PDF Toolkit hub and open the compression route.', 'Check the original file size and write down the target you need to reach.', 'Run one compression pass instead of repeated blind exports.', 'Review pages with signatures, charts, and small body text before shipping.', 'Keep the original file alongside the reduced copy in case a reviewer needs the higher-quality version.'],
    failureModes: ['compressing a file that already has weak scan quality', 'making small text unreadable', 'sending the smaller file without checking whether the target limit was actually met'],
    checklist: ['The exported file meets the required size threshold.', 'Text stays readable at normal review zoom.', 'Signatures, seals, or charts still look reliable enough for the destination.'],
    related: ['/blog/pdf-to-jpg-without-upload/', '/blog/pdf-operations-checklist/', '/blog/pdf-confidential-client-report-workflow/']
  },
  'lock-pdf-without-upload': {
    action: 'password protect a PDF',
    surface: 'controlled access',
    useCases: ['share a packet with personal details', 'send a financial file to a client contact', 'protect an internal review document before it leaves the team'],
    preflight: ['choose where the password will be shared before export', 'confirm who actually needs access', 'decide whether the destination will reject password-protected files'],
    steps: ['Open the PDF Toolkit route for password protection.', 'Load the approved file, not a draft copy.', 'Set the password and record the sharing method outside the document itself.', 'Export the locked file and reopen it once to confirm the password challenge works.', 'Send the password through a separate channel only after the recipient is ready.'],
    failureModes: ['sending the file without a password handoff plan', 'protecting the wrong document version', 'forgetting to test the password before delivery'],
    checklist: ['The correct final file is the one that was protected.', 'The password opens the file on a clean test.', 'The recipient has a separate, safe path to receive the password.'],
    related: ['/blog/unlock-pdf-without-upload/', '/blog/e-sign-pdf-online/', '/blog/pdf-fill-sign-private-workflow/']
  },
  'unlock-pdf-without-upload': {
    action: 'remove restrictions from a PDF you are authorized to edit',
    surface: 'editing or review access',
    useCases: ['continue working on a file after internal approval', 'prepare a document for a trusted editing round', 'strip restrictions from a document before archiving the editable copy'],
    preflight: ['confirm you have authority to remove the restriction', 'store the original locked file separately', 'know whether the next step is editing, review, or archival reuse'],
    steps: ['Start from the PDF Toolkit hub and open the unlock route.', 'Load the file and remove the restriction only for the approved working copy.', 'Export the unlocked version into a clearly labeled folder.', 'Open the file and test the action that was previously blocked.', 'Keep the locked original if the team still needs a protected archive.'],
    failureModes: ['unlocking files without documented permission', 'overwriting the protected original', 'sending the unlocked file farther than the working group intended'],
    checklist: ['The editable copy is stored separately from the original.', 'The blocked action now works as expected.', 'The team still knows which version remains protected.'],
    related: ['/blog/lock-pdf-without-upload/', '/blog/fill-pdf-forms-online/', '/blog/pdf-fill-sign-private-workflow/']
  },
  'split-pdf-without-upload': {
    action: 'split a PDF into smaller files',
    surface: 'separate packets or sections',
    useCases: ['send different sections to different reviewers', 'extract one chapter from a longer document', 'break a large packet into upload-sized pieces'],
    preflight: ['name the output sections before splitting', 'mark the page ranges that belong together', 'decide whether any shared cover pages need to be duplicated'],
    steps: ['Open the split route from PDF Toolkit.', 'Load the full source file and identify the page boundaries that matter.', 'Create output sections that match the real handoff needs, not just arbitrary chunks.', 'Export the split files and verify the first and last page of each file.', 'Rename each file so the next reviewer knows which section it contains.'],
    failureModes: ['cutting a section in the wrong place', 'losing context pages that should stay with a section', 'sending files with unclear names'],
    checklist: ['Each output starts and ends at the expected page.', 'Section names match the downstream use.', 'No required appendix or cover page was dropped by accident.'],
    related: ['/blog/merge-pdf-without-upload/', '/blog/organize-pdf-without-upload/', '/blog/crop-pdf-without-upload/']
  },
  'rotate-pdf-without-upload': {
    action: 'correct page orientation in a PDF',
    surface: 'readability and submission quality',
    useCases: ['fix sideways scans before review', 'prepare a packet for printing', 'clean up mixed-orientation pages in one report'],
    preflight: ['identify which pages are wrong before opening the tool', 'decide whether all pages or only selected pages need rotation', 'check if the file contains forms or signatures that need a visual spot check afterward'],
    steps: ['Open the rotate route from the PDF hub.', 'Load the file and target only the pages with orientation issues.', 'Rotate the pages into the correct reading direction.', 'Export and reopen the file in a standard viewer.', 'Scroll through the corrected pages at reading speed to catch any page that was rotated the wrong way.'],
    failureModes: ['rotating all pages when only a few needed adjustment', 'missing one sideways page in the middle of a long file', 'forgetting to check print-ready orientation after export'],
    checklist: ['Every page reads upright in a standard viewer.', 'No correctly oriented page was changed by mistake.', 'The packet is comfortable to review or print without manual turning.'],
    related: ['/blog/crop-pdf-without-upload/', '/blog/organize-pdf-without-upload/', '/blog/pdf-operations-checklist/']
  },
  'organize-pdf-without-upload': {
    action: 'reorder PDF pages',
    surface: 'review sequence and narrative flow',
    useCases: ['move a summary page to the front', 'group related exhibits together', 'fix a packet that exported in the wrong order'],
    preflight: ['write down the intended page order', 'identify pages that should be removed or moved together', 'decide whether page numbering needs to happen after reordering'],
    steps: ['Start from the PDF Toolkit hub and open the organize route.', 'Load the file and map the intended sequence before dragging pages around.', 'Move pages into the final order and remove anything that does not belong in the packet.', 'Export one clean reordered copy.', 'Review the output like a recipient would, from page one to the end.'],
    failureModes: ['moving one page without its supporting appendix', 'accidentally duplicating or dropping a page', 'treating order changes as cosmetic when they change meaning for the reviewer'],
    checklist: ['The packet tells the story in the intended order.', 'No page disappeared during reordering.', 'Page numbering or references still make sense after export.'],
    related: ['/blog/merge-pdf-without-upload/', '/blog/split-pdf-without-upload/', '/blog/page-numbers-without-upload/']
  },
  'crop-pdf-without-upload': {
    action: 'crop PDF pages',
    surface: 'clean margins and visible content area',
    useCases: ['trim scan borders before submission', 'remove extra whitespace from presentation handouts', 'tighten page framing for cleaner print output'],
    preflight: ['know whether the crop should apply to all pages or a selected range', 'check whether important footer text sits near the edge', 'decide whether the packet will be printed after cropping'],
    steps: ['Open the crop route from PDF Toolkit.', 'Load the file and inspect the pages that need cleaner framing.', 'Apply the crop to the intended range only.', 'Export the adjusted file and review pages with seals, footers, or page numbers.', 'Print-preview or zoom the file once if the final destination is especially strict.'],
    failureModes: ['cropping away footer details', 'applying one crop box to pages with different layouts', 'fixing whitespace but harming readability'],
    checklist: ['The content area is tighter without losing useful text.', 'Footers, signatures, or stamps remain visible.', 'The cropped file still looks balanced in print or review mode.'],
    related: ['/blog/rotate-pdf-without-upload/', '/blog/page-numbers-without-upload/', '/blog/pdf-operations-checklist/']
  },
  'watermark-without-upload': {
    action: 'add a watermark to a PDF',
    surface: 'status, ownership, or confidentiality',
    useCases: ['mark a file as draft before internal review', 'label a confidential packet before sharing', 'add a visible ownership cue to a document that may circulate'],
    preflight: ['decide whether the watermark is for status or control', 'choose placement that will not block signatures or dense text', 'confirm whether the destination accepts visible marking'],
    steps: ['Open the watermark route from the PDF hub.', 'Load the approved file and define the label you need, such as Draft or Confidential.', 'Preview placement and opacity before export.', 'Export the watermarked copy and read several dense pages to ensure the label does not obstruct the content.', 'Store the clean original separately if later delivery will require an unmarked version.'],
    failureModes: ['covering signatures or table text', 'using a watermark that is too faint to be useful', 'forgetting which copy is the clean original'],
    checklist: ['The watermark is readable but not disruptive.', 'Critical content stays legible under the mark.', 'The team can still identify the clean source version.'],
    related: ['/blog/lock-pdf-without-upload/', '/blog/page-numbers-without-upload/', '/blog/merge-pdf-without-upload/']
  },
  'page-numbers-without-upload': {
    action: 'add page numbers to a PDF',
    surface: 'review references and packet control',
    useCases: ['make a packet easier to reference in meetings', 'support legal or compliance review', 'clean up a document that will be cited page by page'],
    preflight: ['confirm where numbering should start', 'check whether the cover page should stay unnumbered', 'decide whether existing page references in the file need updating'],
    steps: ['Open the page-number route from PDF Toolkit.', 'Load the file and choose the numbering range and placement.', 'Apply numbering with the reviewer view in mind, not just the export itself.', 'Export the new version and test references against a few sample pages.', 'Send the numbered copy only after confirming the visible sequence matches the intended packet structure.'],
    failureModes: ['numbering the cover when it should stay clean', 'placing numbers where existing footer text already sits', 'breaking references because numbering starts on the wrong page'],
    checklist: ['Page numbers are visible and consistent.', 'The starting page is correct for the use case.', 'Reviewers can cite pages without confusion.'],
    related: ['/blog/organize-pdf-without-upload/', '/blog/merge-pdf-without-upload/', '/blog/pdf-operations-checklist/']
  },
  'pdf-to-jpg-without-upload': {
    action: 'turn PDF pages into JPG files',
    surface: 'sharing, slides, or image-based review',
    useCases: ['drop PDF pages into a slide deck', 'send one page as an image to a chat or CMS', 'prepare page graphics for a lightweight image workflow'],
    preflight: ['identify which pages need image export', 'know the destination size or layout if possible', 'check whether text-heavy pages need a clarity review after conversion'],
    steps: ['Start from the PDF Toolkit route for PDF-to-JPG conversion.', 'Load the source PDF and target the pages that should become images.', 'Run one export pass and keep the output set together.', 'Review image sharpness on pages with small text or charts.', 'Rename the image batch so it is clearly tied back to the source document and version.'],
    failureModes: ['exporting more pages than needed', 'accepting blurry text on dense pages', 'losing track of which image set came from which PDF version'],
    checklist: ['The correct pages were exported.', 'Text and charts remain readable enough for the destination.', 'The image batch can still be traced to the source PDF.'],
    related: ['/blog/jpg-to-pdf-without-upload/', '/blog/images-convert-to-jpg-guide/', '/blog/pdf-operations-checklist/']
  },
  'pdf-to-docx-without-upload': {
    action: 'convert a PDF to DOCX',
    surface: 'editing and reuse',
    useCases: ['recover editable text from a report', 'prepare a document for revision', 'extract a starting point for a template refresh'],
    preflight: ['confirm the PDF is a reasonable candidate for editing', 'expect layout cleanup if the original has complex tables or forms', 'decide where the edited DOCX should live once exported'],
    steps: ['Open the PDF-to-DOCX route from PDF Toolkit.', 'Load the source PDF and export the DOCX once.', 'Open the DOCX and inspect paragraphs, tables, and headers before deeper editing begins.', 'Fix layout issues in the working file rather than rerunning random conversions.', 'Keep the PDF source alongside the DOCX so reviewers can compare if something shifted.'],
    failureModes: ['expecting perfect layout transfer from complex PDFs', 'editing the wrong converted copy', 'forgetting to compare key sections back to the source PDF'],
    checklist: ['The DOCX is editable where it needs to be.', 'Critical sections survived conversion with acceptable structure.', 'The original PDF is still available for comparison.'],
    related: ['/blog/docx-to-pdf-without-upload/', '/blog/fill-pdf-forms-online/', '/blog/pdf-operations-checklist/']
  },
  'jpg-to-pdf-without-upload': {
    action: 'combine JPG images into a PDF',
    surface: 'submission packet or shareable document',
    useCases: ['turn photo evidence into one report', 'assemble image pages for a portal upload', 'wrap screenshots into one client-ready file'],
    preflight: ['sort the image sequence before creating the PDF', 'check that image orientation is already correct', 'decide whether the final PDF needs page numbering or a cover page'],
    steps: ['Open the JPG-to-PDF route from PDF Toolkit.', 'Load the ordered image set rather than a mixed folder.', 'Review the sequence and page framing before export.', 'Create the PDF and test the output in a normal viewer.', 'If the result becomes a formal packet, continue with reordering or numbering before delivery.'],
    failureModes: ['images loaded in the wrong order', 'portrait and landscape pages mixed without review', 'turning draft images into a formal PDF too early'],
    checklist: ['The page sequence matches the intended story or evidence order.', 'Each image page is readable in the PDF wrapper.', 'The output is ready for the next packet step if one is needed.'],
    related: ['/blog/pdf-to-jpg-without-upload/', '/blog/docx-to-pdf-without-upload/', '/blog/merge-pdf-without-upload/']
  },
  'docx-to-pdf-without-upload': {
    action: 'convert DOCX to PDF',
    surface: 'finalized sharing format',
    useCases: ['freeze a report before external delivery', 'submit a formatted document to a portal', 'turn an edited draft into a stable review copy'],
    preflight: ['check the final DOCX version first', 'confirm headers, page breaks, and signatures are ready', 'decide where the stable PDF should live after export'],
    steps: ['Launch the DOCX-to-PDF route from PDF Toolkit.', 'Convert the final DOCX once the editable document is approved.', 'Open the PDF and inspect page breaks, headings, and any embedded graphics.', 'Compare the exported PDF against the source DOCX in the sections that matter most.', 'Use the PDF for delivery, not the working DOCX, once the check passes.'],
    failureModes: ['converting a draft instead of the approved document', 'missing changed page breaks after export', 'sending the editable file instead of the final PDF'],
    checklist: ['The PDF reflects the approved DOCX version.', 'Page breaks and formatting still look intentional.', 'The delivery copy is the PDF, not a loose editable draft.'],
    related: ['/blog/pdf-to-docx-without-upload/', '/blog/jpg-to-pdf-without-upload/', '/blog/pdf-operations-checklist/']
  },
  'html-to-pdf-without-upload': {
    action: 'turn HTML into a PDF',
    surface: 'stable snapshot of a web-based layout',
    useCases: ['freeze a webpage or template for review', 'export a generated report into a shareable file', 'capture a formatted HTML deliverable before submission'],
    preflight: ['decide whether the page should be captured for screen reading or print reading', 'check whether long sections need controlled page breaks', 'remove temporary UI elements before export if they should not appear in the PDF'],
    steps: ['Open the HTML-to-PDF route from PDF Toolkit.', 'Load or prepare the HTML source that needs to be exported.', 'Check page width, section flow, and likely break points before export.', 'Generate the PDF and review where headings, tables, and charts break across pages.', 'Repeat only if the layout issue is clear; do not keep exporting without a specific correction target.'],
    failureModes: ['capturing web UI chrome that should not be in the PDF', 'bad page breaks through tables or charts', 'treating the first export as final without checking print flow'],
    checklist: ['The PDF preserves the intended structure of the HTML source.', 'Tables and visual sections break in sensible places.', 'The exported file reads like a finished document, not a raw webpage capture.'],
    related: ['/blog/docx-to-pdf-without-upload/', '/blog/pdf-confidential-client-report-workflow/', '/blog/pdf-operations-checklist/']
  }
};

const customBodies = {
  'e-sign-pdf-online': renderPdfTaskBody({
    ...pdfTaskConfigs['lock-pdf-without-upload'],
    action: 'e-sign a PDF in the browser',
    screenshot: SCREENSHOTS.esign,
    intro: 'How do you move from an unsigned PDF to a signed file without losing control of the final packet? The safest approach is to treat signing as the last deliberate approval step, not as a shortcut you click in the middle of a messy document workflow.',
    preflight: ['confirm the document content is already final', 'decide who signs first if there are multiple approvers', 'make sure the destination accepts a digitally signed or browser-signed copy'],
    steps: ['Open the Dayfiles e-sign route and load the approved PDF.', 'Place the signature only after the page order and content are settled.', 'Export the signed copy as a separate final file.', 'Open the file once more to confirm the signature appears where the reviewer expects it.', 'Store the unsigned working file separately if internal edits may still happen later.'],
    failureModes: ['signing a draft version', 'placing the signature before the layout is finalized', 'sending the signed file without a final read-through'],
    checklist: ['The signed copy is based on the approved document.', 'Signature placement is visible and intentional.', 'The final file name clearly identifies the signed version.'],
    related: ['/blog/fill-pdf-forms-online/', '/blog/pdf-fill-sign-private-workflow/', '/blog/merge-pdf-without-upload/']
  }),
  'fill-pdf-forms-online': renderPdfTaskBody({
    ...pdfTaskConfigs['unlock-pdf-without-upload'],
    action: 'fill PDF forms online',
    screenshot: SCREENSHOTS.fillforms,
    intro: 'How do you fill a PDF form quickly without creating submission mistakes that show up later? The clean route is to treat form completion as a short control workflow: confirm the right file, fill the fields once, then run a final review before the form enters a packet or portal.',
    preflight: ['confirm you are filling the final version of the form', 'gather the exact values before typing so you do not improvise', 'decide whether the form will be sent alone or merged into a larger packet'],
    steps: ['Open the Dayfiles fill-form route and upload the approved PDF form.', 'Fill every required field with the source information in front of you.', 'Review names, dates, numbers, and checkboxes before export.', 'Save the completed file as a separate output rather than overwriting the blank master.', 'If the form belongs in a packet, move straight to the next packaging step while the details are still fresh.'],
    failureModes: ['typing into the wrong version of the form', 'carrying over a wrong date or ID number', 'saving over the blank master copy'],
    checklist: ['All required fields are complete.', 'High-risk fields such as names, dates, and IDs were checked twice.', 'The filled file is stored separately from the blank template.'],
    related: ['/blog/e-sign-pdf-online/', '/blog/pdf-fill-sign-private-workflow/', '/blog/pdf-visa-application-packet-checklist/']
  }),
  'eis-workflow-playbook': renderPlaybookBody({
    intro: 'How should a team use Everyday Image Studio when daily image work has started to sprawl across folders, rushed exports, and inconsistent reviews? The playbook that works best is the one that turns repeated image handling into a visible operating routine, with clear intake, editing, review, and handoff rules.',
    screenshot: SCREENSHOTS.eis,
    audience: 'small teams that create, clean, and ship repeated image assets',
    standards: ['one intake naming rule', 'one preset strategy for common edits', 'one review checkpoint before export'],
    sections: [
      ['What should the team standardize first?', 'Start by locking down file naming, source-folder rules, and who owns the final approval step. Teams get into trouble long before export if incoming files arrive in mixed folders with unclear status.'],
      ['Where Everyday Image Studio fits best', 'Use it when the work depends on repeated image cleanup, resizing, crop control, or lightweight production tasks that do not need a heavy design suite. It works best when the team values speed and consistency more than endless creative branching.'],
      ['A repeatable daily sequence', 'A reliable team sequence usually looks like intake, edit, quality check, export, and handoff. That keeps the editing canvas connected to the file decision that comes before it and the delivery rule that comes after it.'],
      ['What the quality gate should catch', 'Catch inconsistent crops, accidental over-editing, wrong export dimensions, and files that should have stayed as originals. The review step matters most on assets that are headed toward listings, portals, or customer-facing channels.'],
      ['How to keep handoffs readable', 'The export folder should reveal what is final, what is source, and what still needs review. Teams lose time when the editing work is fine but the handoff names are too vague for the next person to trust.'],
      ['What to measure after rollout', 'Measure rework rate, turnaround time, and how often files come back for size, crop, or background corrections. Those numbers show whether the workflow is really improving, not just whether the team likes the tool.']
    ],
    related: ['/blog/eis-social-content-production-workflow/', '/blog/eis-passport-photo-checklist/', '/blog/images-bulk-resize-listings-guide/']
  }),
  'pdf-operations-checklist': renderChecklistBody({
    intro: 'What makes a PDF delivery process reliable when several people touch the file before it leaves the team? The strongest answer is not one feature. It is a checklist that forces the team to confirm version, formatting, privacy, and handoff discipline before the document becomes someone else’s problem.',
    screenshot: SCREENSHOTS.pdf,
    titleWord: 'PDF delivery',
    orderedTitle: 'Checklist for a stable PDF release',
    orderedItems: ['Confirm the correct source file is being packaged.', 'Check page order, page count, and any section breaks that matter to reviewers.', 'Verify signatures, seals, or form fields if the file depends on them.', 'Review file size if the destination has upload or email limits.', 'Rename the file so its status is obvious outside your team.', 'Archive the working version separately from the delivery version.'],
    sections: [
      ['Why PDF mistakes still survive into final delivery', 'PDF work often looks finished before it is actually safe to send. Teams get trapped when a file opens correctly but still carries the wrong order, the wrong version label, or a silent quality problem.'],
      ['Which decisions should happen before anyone exports', 'The team should know the destination, the owner of the final review, and whether the file will be archived, signed, compressed, or merged before delivery. Without those choices, the last export becomes guesswork.'],
      ['What to review visually', 'Read the file like the recipient will read it. That means checking headers, page sequence, charts, signatures, and any section that would cause rework if it were wrong.'],
      ['What to review operationally', 'Look at file naming, folder placement, sensitivity level, and whether the handoff instructions are clear. Many delivery failures happen outside the visible page itself.'],
      ['How the Dayfiles routes fit together', 'Merging, compression, reordering, signing, and conversion each solve a narrow problem. The checklist works because it ties those routes together into one delivery decision instead of leaving them as separate tool clicks.']
    ],
    related: ['/blog/merge-pdf-without-upload/', '/blog/pdf-confidential-client-report-workflow/', '/blog/pdf-fill-sign-private-workflow/']
  }),
  'google-ads-content-support': renderPolicyBody(),
  'product-hunt-launch-everyday-image-studio': renderLaunchBody(),
  'student-visa-application-story': renderStoryBody({
    intro: 'How does a student keep image prep, PDF cleanup, and final submission from turning into deadline panic? A workable routine starts by treating the application like a packet with checkpoints, not as a last-minute pile of unrelated files.',
    screenshot: SCREENSHOTS.pdf,
    scenario: 'a student preparing scholarship and visa documents across several upload portals',
    stages: ['build one source folder for every required document', 'clean image assets before mixing them into the packet', 'convert, merge, or rename PDFs only after the source files are stable', 'run one final pre-submission review per portal'],
    lessons: ['The packet gets calmer when every file has a known status.', 'The image step and the PDF step should stay connected.', 'Submission stress drops when the reviewer can see what changed and what stayed original.'],
    related: ['/blog/eis-passport-photo-checklist/', '/blog/fill-pdf-forms-online/', '/blog/pdf-visa-application-packet-checklist/']
  }),
  'eis-passport-photo-checklist': renderChecklistBody({
    intro: 'What should someone check before exporting a passport photo so the file does not come back for another round? The safest routine is to lock the requirement first, edit lightly, and review the export against the actual submission rules instead of guessing from memory.',
    screenshot: SCREENSHOTS.eis,
    titleWord: 'passport photo prep',
    orderedTitle: 'Passport photo review sequence',
    orderedItems: ['Read the exact destination requirements before editing.', 'Start from the cleanest original image you have.', 'Check crop, head position, and background before export.', 'Avoid edits that change identity or create obvious artifacts.', 'Export in the requested format and size.', 'Open the final file once more before upload.'],
    sections: [
      ['Which requirement matters most at the start?', 'The destination requirement matters more than any preset. A good passport photo can still be rejected if the crop, size, or background rule belongs to a different country or portal.'],
      ['How much editing is too much?', 'Passport prep should correct clarity and compliance issues, not redesign the image. Heavy retouching can create a rejection risk even when the output looks visually clean.'],
      ['What reviewers should slow down for', 'Hair edges, background cutoffs, export dimensions, and facial alignment are the places where avoidable problems usually survive into upload.'],
      ['How to separate source and upload copies', 'Keep the original image untouched and export a labeled submission copy. That reduces confusion if you later need a different size or a different portal standard.'],
      ['Where this connects inside Dayfiles', 'The image edit happens in Everyday Image Studio, but the surrounding routine often includes JPG normalization and packet assembly if the final file becomes part of a broader document submission.']
    ],
    related: ['/blog/eis-visa-photo-resubmission-checklist/', '/blog/images-convert-to-jpg-guide/', '/blog/student-visa-application-story/']
  }),
  'pdf-fill-sign-private-workflow': renderChecklistBody({
    intro: 'How should a team handle repeated fill-and-sign work when the files contain personal or internal information? The strongest approach is to standardize who prepares the file, who signs, and who archives the approved version before the packet moves farther than it should.',
    screenshot: SCREENSHOTS.fillforms,
    titleWord: 'fill-and-sign work',
    orderedTitle: 'Private fill-and-sign workflow',
    orderedItems: ['Confirm the correct template or source PDF.', 'Fill fields using the approved values only.', 'Review the file before the signature step.', 'Apply the signature after content approval.', 'Export and name the signed file clearly.', 'Archive the signed version and keep the working copy separate.'],
    sections: [
      ['Where private packet work usually breaks', 'It breaks when form completion, approval, and signing are mixed into one rushed moment. The mistakes are usually small, but the privacy risk is high because the file is already close to delivery.'],
      ['What should be documented before the first recurring run', 'The team should document the source template, the owner of the final review, the signing order, and where signed files are stored after completion.'],
      ['What the reviewer should catch', 'Field errors, wrong dates, stale attachments, and signatures placed on the wrong version are the issues worth slowing down for.'],
      ['How Dayfiles routes support the sequence', 'The fill route, sign route, and surrounding PDF toolkit steps are useful because they support a defined sequence. They work poorly when the team treats them as unrelated shortcuts.'],
      ['What the archive should make obvious', 'The archive should tell future reviewers which file was blank, which file was filled, and which file became the signed final copy.']
    ],
    related: ['/blog/fill-pdf-forms-online/', '/blog/e-sign-pdf-online/', '/blog/pdf-confidential-client-report-workflow/']
  }),
  'pdf-visa-application-packet-checklist': renderChecklistBody({
    intro: 'How do you reduce visa packet rework when one mistake can send the whole file set back for another round? The packet needs an order of operations: confirm the case requirements, standardize every file, then review the packet as one submission unit before upload.',
    screenshot: SCREENSHOTS.pdf,
    titleWord: 'visa packet review',
    orderedTitle: 'Visa packet release checklist',
    orderedItems: ['Confirm the destination checklist and accepted formats.', 'Gather the final source files into one controlled folder.', 'Convert or merge only after the source set is stable.', 'Review names, dates, signatures, and page order together.', 'Export the upload-ready packet with clear naming.', 'Check the packet against the portal requirements before final upload.'],
    sections: [
      ['Why visa packet failures happen late', 'Most failures appear after the files look complete. A packet may open correctly but still contain a wrong date, a missing page, or a confusing file name that creates delay at the portal stage.'],
      ['What should be standardized before editing begins', 'Source folder structure, file naming, and the order of operations should be decided first. That keeps the packet review focused on content quality rather than file hunting.'],
      ['What the cross-form review should catch', 'Names, dates, signatures, passport image quality, and packet sequence deserve a slow pass because they are the most expensive mistakes to fix after upload.'],
      ['How image and PDF steps connect', 'Passport or ID images often feed the same packet. The packet review is stronger when the image prep is handled as part of the same controlled routine instead of a separate rush job.'],
      ['When the packet is actually ready', 'It is ready when the whole case reads as one coherent submission, not just when each file seems acceptable on its own.']
    ],
    related: ['/blog/eis-passport-photo-checklist/', '/blog/fill-pdf-forms-online/', '/blog/merge-pdf-without-upload/']
  }),
  'pdf-employee-onboarding-doc-workflow': renderWorkflowBody({
    intro: 'How should HR teams control onboarding PDFs when several forms, signatures, and reviewers are involved? The packet stays reliable when the team defines one order for collection, review, signing, and archival instead of letting each coordinator improvise.',
    screenshot: SCREENSHOTS.pdf,
    focus: 'employee onboarding packets',
    pillars: ['collection discipline', 'field review', 'signature timing', 'archive clarity'],
    sections: [
      ['What should HR lock before touching the packet?', 'Lock the template versions, the owner of the final review, and the archive location first. Those decisions prevent most version-control confusion later.'],
      ['What the clean onboarding sequence looks like', 'Collect approved forms, fill only what belongs in this packet, sign after the review pass, then archive the signed output separately from the working packet.'],
      ['Which checks deserve human review every time', 'Names, start dates, tax forms, signatures, and the presence of every required page should never be left to assumption.'],
      ['Where Dayfiles helps most', 'The value is not just one conversion or signing feature. It is the ability to keep the document steps inside one readable browser workflow.'],
      ['How to tell the packet is ready', 'The packet is ready when another coordinator could open the folder and instantly understand which file is final and what was already approved.']
    ],
    related: ['/blog/pdf-fill-sign-private-workflow/', '/blog/e-sign-pdf-online/', '/blog/pdf-confidential-client-report-workflow/']
  }),
  'images-bulk-image-compression-guide': renderImageGuideBody({
    action: 'compress image batches',
    intro: 'How do you shrink a group of images without turning the final batch into a quality problem? The job is easier when compression is treated as a controlled export step with a known size target, a short review list, and a separate source archive.',
    useCases: ['portal uploads with file-size caps', 'email-ready asset packs', 'CMS uploads that reject oversized files'],
    preflight: ['know the target size or destination limit', 'identify images with tiny text or product detail', 'separate source files from the soon-to-be compressed batch'],
    steps: ['Open the Images hub and start the compression route.', 'Bring in only the files for the current delivery batch.', 'Apply compression once, then review the files most likely to degrade first.', 'Check whether the new batch now fits the intended upload or send limit.', 'Label the compressed output as a delivery copy instead of replacing the originals.'],
    checks: ['text clarity', 'product edge detail', 'overall file size', 'source-versus-output naming'],
    related: ['/blog/images-bulk-resize-listings-guide/', '/blog/images-convert-to-jpg-guide/', '/blog/images-remove-background-product-photos-guide/']
  }),
  'images-bulk-resize-listings-guide': renderImageGuideBody({
    action: 'resize image batches for listings',
    intro: 'How do you make a listing image batch consistent without re-exporting files one by one? The practical route is to decide the target dimensions first, resize the batch in one pass, then review the images most likely to crop badly or lose product framing.',
    useCases: ['marketplace listing uploads', 'catalog refreshes', 'CMS image replacement with fixed slots'],
    preflight: ['confirm the destination dimensions and aspect ratio', 'identify images that may crop awkwardly', 'decide whether background cleanup happens before or after resizing'],
    steps: ['Open the Images hub and choose the resize path.', 'Load the batch and set the target size based on the destination slot.', 'Run the resize once across the working batch.', 'Inspect edge cases such as wide packaging shots or tall portraits.', 'Export the resized set with a folder name that matches the destination.'],
    checks: ['consistent dimensions', 'safe cropping around the subject', 'no accidental stretching', 'clear handoff naming'],
    related: ['/blog/images-bulk-image-compression-guide/', '/blog/images-remove-background-product-photos-guide/', '/blog/images-convert-to-jpg-guide/']
  }),
  'images-convert-to-jpg-guide': renderImageGuideBody({
    action: 'convert mixed image files to JPG',
    intro: 'How do you convert a mixed image batch to JPG without flattening the wrong assets or losing track of the originals? The safest version of the task is not just conversion. It is format normalization with a clear reason, a labeled output batch, and a short quality review for the risky files.',
    useCases: ['systems that only accept JPG', 'shared folders that need one stable format', 'PDF assembly steps that work better with one image type'],
    preflight: ['confirm JPG is really the required destination', 'flag images that depend on transparency', 'decide how the JPG delivery batch will be labeled'],
    steps: ['Open the Images hub and start the JPG conversion route.', 'Bring in the files that belong in the same delivery batch.', 'Convert them once into a dedicated JPG output set.', 'Review screenshots, gradients, and transparent-background assets first.', 'Store the JPG delivery batch separately from the originals so later edits still have the source files.'],
    checks: ['clarity on detailed images', 'acceptable handling of transparency loss', 'stable naming', 'separation between source and output'],
    related: ['/blog/images-bulk-resize-listings-guide/', '/blog/images-bulk-image-compression-guide/', '/blog/pdf-operations-checklist/']
  }),
  'pdf-confidential-client-report-workflow': renderWorkflowBody({
    intro: 'How do delivery teams keep confidential client reports accurate and controlled when the file passes through several hands? The report stays safer when the team treats it like a record with one review order, one export path, and one final delivery owner.',
    screenshot: SCREENSHOTS.pdf,
    focus: 'confidential report delivery',
    pillars: ['version control', 'privacy review', 'final export discipline', 'handoff clarity'],
    sections: [
      ['What should be fixed before the report reaches PDF stage?', 'Source data, final text, and attachment choices should already be settled. PDF work should stabilize the report, not hide unresolved content decisions.'],
      ['Where report risk usually appears', 'It appears in stale attachments, inconsistent version labels, and pages that were never checked from the client view.'],
      ['What the delivery owner should review personally', 'Open the exported file, read the summary and appendix pages, confirm privacy labels, and check the file name exactly as the client will receive it.'],
      ['Which Dayfiles steps belong in the route', 'Merging, reordering, signing, or compressing may all matter, but the sequence should be intentional. Each step should solve one documented delivery need.'],
      ['What makes the handoff trustworthy', 'The receiving person should know which file is final, whether it is confidential, and whether any separate instructions or passwords follow in another channel.']
    ],
    related: ['/blog/merge-pdf-without-upload/', '/blog/e-sign-pdf-online/', '/blog/pdf-operations-checklist/']
  }),
  'eis-employee-id-photo-standard-guide': renderChecklistBody({
    intro: 'How should HR teams standardize employee ID photos so approvals do not keep bouncing back for small avoidable fixes? The process works best when the team locks the standard first, edits consistently, then reviews every export against the same acceptance rule.',
    screenshot: SCREENSHOTS.eis,
    titleWord: 'ID photo approvals',
    orderedTitle: 'Employee ID photo standard',
    orderedItems: ['Lock the crop and background rule first.', 'Start from a clean original image.', 'Apply the same editing standard to every employee photo.', 'Check alignment and export dimensions before approval.', 'Store the approved file with a predictable naming rule.', 'Keep the original image available for future re-export needs.'],
    sections: [
      ['Why the standard matters more than the tool', 'A tool can help the team edit quickly, but the real consistency comes from the rule set. Without the standard, approvals depend too much on who happens to review the image that day.'],
      ['What should HR review every time', 'Head position, crop, background cleanliness, export dimensions, and the final file name should be checked on every approval cycle.'],
      ['Where the rework usually starts', 'It usually starts when one team member treats the photo like a design task while another treats it like a compliance asset. The export ends up looking polished but not necessarily acceptable.'],
      ['How to archive approved photos', 'Keep the approved ID photo separate from both the untouched original and any temporary edits so future requests do not restart the whole process.'],
      ['Where this fits in Dayfiles', 'The photo standard lives most naturally inside Everyday Image Studio, while related batch export and packet work may continue in the broader image or PDF routes.']
    ],
    related: ['/blog/eis-visa-photo-resubmission-checklist/', '/blog/eis-passport-photo-checklist/', '/blog/images-bulk-resize-listings-guide/']
  }),
  'eis-social-content-production-workflow': renderWorkflowBody({
    intro: 'How should a small team use Everyday Image Studio to produce repeatable social assets without losing brand control? The clearest route is to decide formats, presets, and review gates before the editing sprint begins, then make the export handoff as consistent as the design work.',
    screenshot: SCREENSHOTS.eis,
    focus: 'social asset production',
    pillars: ['preset discipline', 'channel sizing rules', 'review ownership', 'export readiness'],
    sections: [
      ['When this workflow is the right fit', 'It is the right fit when the team needs repeatable production more than one-off experimentation. Social content gets expensive when every asset begins from scratch.'],
      ['What should be decided before editing starts', 'Decide channel sizes, brand-safe presets, naming rules, and who signs off before export. Those choices remove a large part of the avoidable noise.'],
      ['What the editing workspace should support', 'The editor should support fast iteration without hiding where the final asset will go. Teams move faster when the workspace still points back to the delivery requirement.'],
      ['What the pre-review checklist should catch', 'Text cutoffs, wrong aspect ratios, unreadable mobile layouts, and export mismatches are the issues worth stopping for before the asset leaves the team.'],
      ['What the downstream team should receive', 'They should receive a clean, labeled export set that clearly distinguishes drafts, approved assets, and resized channel variants.']
    ],
    related: ['/blog/eis-workflow-playbook/', '/blog/images-bulk-resize-listings-guide/', '/blog/images-remove-background-product-photos-guide/']
  }),
  'eis-visa-photo-resubmission-checklist': renderChecklistBody({
    intro: 'What should someone review before resubmitting a visa photo so the same issue does not return again? The task gets safer when the reviewer checks the requirement, the edit, and the export as one linked chain instead of assuming the last correction solved everything.',
    screenshot: SCREENSHOTS.eis,
    titleWord: 'visa photo resubmission',
    orderedTitle: 'Resubmission-ready photo check',
    orderedItems: ['Re-read the destination photo rule.', 'Compare the rejected file against the source image.', 'Correct crop, background, or export issues one at a time.', 'Review the revised file against the stated requirement.', 'Export a clearly labeled resubmission copy.', 'Archive the earlier rejected version separately.'],
    sections: [
      ['Why resubmissions keep happening', 'They keep happening when the person fixing the image addresses the visible symptom but not the original requirement mismatch. The second file looks different but still fails for the same reason.'],
      ['What should be checked before editing starts', 'Check the destination standard, the original image quality, and the exact reason the previous file failed if that information is available.'],
      ['What the final review should catch', 'Alignment, background cleanliness, size, export format, and anything that looks over-edited deserve one more look before upload.'],
      ['What should be archived after approval', 'Keep the accepted file, the rejected version, and the original image separate. That makes future re-submissions or alternate destination requests much easier to manage.'],
      ['Where this fits in the Dayfiles flow', 'The correction work belongs in Everyday Image Studio, but the surrounding submission routine may also involve JPG conversion and PDF packet assembly.']
    ],
    related: ['/blog/eis-passport-photo-checklist/', '/blog/student-visa-application-story/', '/blog/images-convert-to-jpg-guide/']
  }),
  'story-operations-team-privacy-first-daily-files': renderStoryBody({
    intro: 'How does an operations team make daily file handling safer without slowing everything down? The routine that tends to hold up is the one that turns privacy into a visible habit: clear source folders, clear delivery copies, and one final review before anything leaves the team.',
    screenshot: SCREENSHOTS.images,
    scenario: 'an operations team shipping recurring image and PDF files under deadline pressure',
    stages: ['separate source files from delivery copies', 'normalize image or PDF outputs only after the source batch is settled', 'use one review step before release', 'archive the final handoff set with readable names'],
    lessons: ['The routine matters more than any single export feature.', 'Privacy gets easier when status is visible in the folder structure.', 'Rework drops when the final reviewer knows exactly which file is meant to travel.'],
    related: ['/blog/images-bulk-image-compression-guide/', '/blog/pdf-operations-checklist/', '/blog/story-remote-hr-private-onboarding-routine/']
  }),
  'story-remote-hr-private-onboarding-routine': renderStoryBody({
    intro: 'How can a remote HR team keep onboarding packets consistent when coordinators work in different places and different time zones? The routine improves when the team uses one packet sequence, one signing rule, and one archive rule instead of passing files around informally.',
    screenshot: SCREENSHOTS.pdf,
    scenario: 'a distributed HR team preparing private onboarding packets for new hires',
    stages: ['collect approved forms into one packet folder', 'fill and review the packet before signatures begin', 'sign only the approved copy', 'archive the signed final packet separately from editable working files'],
    lessons: ['Distributed work needs stronger naming discipline than in-office handoffs.', 'Signing is safer when it happens after review, not during form cleanup.', 'A readable archive prevents repeat confusion for later coordinators.'],
    related: ['/blog/pdf-fill-sign-private-workflow/', '/blog/e-sign-pdf-online/', '/blog/pdf-employee-onboarding-doc-workflow/']
  }),
  'story-student-scholarship-document-routine': renderStoryBody({
    intro: 'How can a student keep scholarship documents clean when each portal asks for a slightly different combination of files? The routine gets much easier when the student keeps one source set, one export rule, and one final portal check for every submission cycle.',
    screenshot: SCREENSHOTS.pdf,
    scenario: 'a student assembling scholarship applications across several document and image requirements',
    stages: ['collect source files by requirement instead of by portal only', 'clean or resize image assets before packet assembly', 'convert or merge PDFs once the source set is stable', 'export one portal-ready copy for each submission'],
    lessons: ['Separate source files from upload copies from the beginning.', 'Image prep and PDF prep should be part of the same plan.', 'Portal stress drops when each packet has a visible final owner.'],
    related: ['/blog/student-visa-application-story/', '/blog/pdf-visa-application-packet-checklist/', '/blog/eis-passport-photo-checklist/']
  }),
  'images-remove-background-product-photos-guide': renderImageGuideBody({
    action: 'remove backgrounds from product photos',
    intro: 'How do you clean product-photo backgrounds without creating rough cutouts that fail later in listings or ads? The strongest workflow is to define the output use first, then review edge quality and export consistency before the batch moves downstream.',
    useCases: ['marketplace listings', 'catalog updates', 'campaign assets that need cleaner isolation'],
    preflight: ['decide whether the output is for a white background, transparent export, or another layout', 'flag products with hairline edges or reflective surfaces', 'confirm whether resizing or format conversion comes after background removal'],
    steps: ['Open the Images hub and start the background-removal route.', 'Load the images that belong in the same product batch.', 'Run the cutout process and inspect difficult edges first.', 'Review whether the result still supports the next step, such as resize or JPG conversion.', 'Export the cleaned batch with naming that distinguishes it from the originals.'],
    checks: ['edge quality', 'subject completeness', 'background cleanliness', 'readiness for the next export step'],
    related: ['/blog/images-bulk-resize-listings-guide/', '/blog/images-convert-to-jpg-guide/', '/blog/eis-social-content-production-workflow/']
  }),
  'images-blur-faces-before-sharing-guide': renderImageGuideBody({
    action: 'blur faces before sharing sensitive photos',
    intro: 'How do you reduce privacy risk when images need to be shared quickly but still contain visible faces? The safest workflow treats face blur as a release step: identify the images that truly need masking, apply the blur deliberately, then review the result before the file goes out.',
    useCases: ['internal reporting', 'public sharing of event photos', 'case updates where identity should not be exposed'],
    preflight: ['identify which faces must actually be obscured', 'confirm the destination does not require a clean original', 'decide where the unblurred source file will be stored after editing'],
    steps: ['Open the Images hub and start the face-blur route.', 'Load only the images meant for the current share set.', 'Apply blur to every face that should be hidden, then zoom in to confirm coverage.', 'Review the images at the size they are likely to be shared.', 'Export the safe-share batch separately from the original photos.'],
    checks: ['full face coverage', 'no accidental exposure at common viewing sizes', 'separation between source and share copies', 'clear file naming for the safe-share batch'],
    related: ['/blog/images-bulk-image-compression-guide/', '/blog/story-operations-team-privacy-first-daily-files/', '/blog/eis-social-content-production-workflow/']
  })
};

function renderFigure({ src, alt, caption }) {
  return `<figure>
  <img src="${src}" alt="${alt}" loading="lazy" />
  <figcaption>${caption}</figcaption>
</figure>`;
}

function joinBullet(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

function joinOrdered(items) {
  return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
}

function renderRelated(links) {
  return links.map((href) => `- [${linkLabel(href)}](${href})`).join('\n');
}

function linkLabel(href) {
  const all = [...commonRelated.pdf, ...commonRelated.images, ...commonRelated.eis];
  const found = all.find((item) => item.href === href);
  if (found) {
    return found.label;
  }
  return href.replace('/blog/', '').replaceAll('-', ' ').replace('/', '');
}

function renderPdfTaskBody(config) {
  const screenshot = config.screenshot || SCREENSHOTS.pdf;
  const related = config.related || pdfTaskConfigs['merge-pdf-without-upload'].related;
  return `${config.intro || `How do you ${config.action} without turning a simple file job into extra rework? The safest way through the task is to decide what the finished file needs to do, line up the checks that matter before export, and only then run the operation.`}

In the Dayfiles stack, the safest starting point is [PDF Toolkit](/pdf-toolkit/) before opening the live route at [PDF Dayfiles](https://pdf.dayfiles.com/). That keeps the task grounded in the broader packet workflow instead of treating it like a disconnected one-click trick.

## When is ${config.action} the right move?

${config.action[0].toUpperCase()}${config.action.slice(1)} is usually the right move when the next person only needs ${config.surface}. Common situations include:

${joinBullet(config.useCases)}

The shared pattern across those jobs is that the file already matters. It is close to a portal upload, a client handoff, an internal approval round, or a packet archive. That is why the checks around the operation matter as much as the operation itself.

${renderFigure({
  ...screenshot,
  caption: 'Use the Dayfiles PDF hub as the stable starting point before opening the specific task route.'
})}

## What should be ready before you open the tool?

Before the file is loaded, decide the conditions for a good export:

${joinBullet(config.preflight)}

That short preflight prevents the most common mistake in browser tools: using the right feature on the wrong file, with the wrong destination in mind.

## How should the task run from start to finish?

${joinOrdered(config.steps)}

This sequence keeps the task specific. It avoids repeated exports, vague versioning, and the temptation to treat the first usable output as the finished delivery copy.

## What usually goes wrong with this type of PDF job?

Most rework comes from a few predictable failure modes:

${joinBullet(config.failureModes)}

The fix is not more feature exploration. The fix is slowing down at the exact moment when the operator would otherwise assume the file is already good enough.

## What should you verify before the file moves on?

Use this quick release check:

${joinOrdered(config.checklist)}

If the destination is sensitive, time-limited, or tied to another person’s review queue, this check should happen immediately after export while the task context is still fresh.

## What changes for the next reviewer after this step?

The next reviewer should receive a file that answers three questions immediately: what changed, whether the file is ready, and what still belongs to the source archive. That is especially important for ${config.action} because the operation often changes how the file behaves without changing the underlying subject matter.

If the file lands in a shared folder with no naming discipline, another person may not know whether they are opening the source version, the in-progress copy, or the final delivery output. Clean file names and a short handoff note can prevent that confusion without adding another heavy process layer.

## When should you pause instead of shipping the output?

Pause if the file still needs content edits, if there is disagreement about the approved source, or if the destination requires a different output format than the one you are preparing. The fastest way to create avoidable rework is to use ${config.action} as a substitute for clarifying the actual delivery requirement.

## How does this fit into the larger Dayfiles workflow?

This task rarely lives alone. A merged packet may still need numbering. A compressed report may still need a final visual read-through. A converted file may need to be checked against the original before anyone treats it as official. Dayfiles works best when each narrow operation stays attached to the broader handoff logic around it.

That broader logic is simple: keep the approved source clear, run the operation once with intent, then review the output as if you were the recipient. When teams skip that last step, the tool may still work perfectly while the handoff fails anyway.

## Related Dayfiles reading

${renderRelated(related)}

## Before you send the finished file

Treat the exported file as one step in a controlled handoff. Store the output with a readable name, keep the source version available if later changes are likely, and only move to the next channel when the file behaves the way the recipient expects.

The small discipline at the end of the workflow is what gives the whole task its value. The feature click is quick. The trustworthy handoff is the part worth protecting.`;
}

function renderImageGuideBody(config) {
  return `${config.intro}

The best starting point on Dayfiles is the [Images hub](/images/) before switching into the live tool at [Images by Dayfiles](https://images.dayfiles.com/). That route works best when the batch already has a clear destination and the operator knows what kind of review the output will need.

## What jobs usually trigger this workflow?

This workflow comes up most often when a team is preparing files for:

${joinBullet(config.useCases)}

Each of those jobs has one thing in common: the output is meant to travel. That means the batch needs more than a quick edit. It needs a predictable handoff.

${renderFigure({
  ...SCREENSHOTS.images,
  caption: 'Start from the Dayfiles Images hub when the job depends on conversion, compression, or export discipline.'
})}

## What should be decided before processing starts?

Use this short preflight before loading the batch:

${joinBullet(config.preflight)}

Those decisions keep the batch consistent. They also make it easier to explain the output to the next reviewer instead of forcing them to reverse-engineer what changed.

## What is the cleanest step-by-step route?

${joinOrdered(config.steps)}

Running the workflow in that order reduces the two biggest risks in image handling: mixing source files with output copies and discovering a preventable quality problem only after the batch has already been sent onward.

## Which files deserve the closest review?

Do not review every file with the same intensity. Slow down on the assets most likely to break the handoff:

${joinBullet(config.checks)}

If those risk points are sound, the rest of the batch is usually much easier to trust.

## How should the handoff be packaged?

The next person should be able to tell which files are source assets, which files are the processed delivery batch, and what destination the batch was prepared for. Clear folder names and export labels matter because image work often gets reused in several systems after the first share.

That packaging step matters even more when the images will later be compressed again, dropped into a PDF, or handed to someone who was not part of the original edit. If the output set is not clearly labeled, the next operator may make a second round of edits on top of the wrong files.

## What should happen right after export?

Do one short pass before the batch moves on:

1. Open several representative files from the output set.
2. Compare the output against one or two source files if the job is sensitive.
3. Confirm the destination requirement was actually met.
4. Store the batch in a folder that makes the output status obvious.

This four-step release pass prevents a surprising number of downstream problems. It catches naming issues, missed compression targets, awkward crops, and accidental quality loss before another system or teammate bakes those problems in.

## Where do image guides usually lose value?

They lose value when they stop at “click this tool” and never explain what a good batch looks like afterward. The Dayfiles version of the workflow should stay useful even for someone who already knows where the button lives, because the real work is deciding which files need extra attention and what counts as a safe output.

## What should the next system or teammate receive?

The receiving person should get a batch that is boring in the best possible way. The files should open the same way, follow one naming rule, and already match the destination constraint that triggered the work in the first place. If the next person has to ask which files are final or whether the originals were preserved, the workflow still needs work.

That matters because image tasks often chain together. A resized batch may later be compressed. A cleaned product photo may later be converted to JPG. A privacy-safe share set may later be moved into a report. The handoff quality on this step affects every later step.

## When is it worth running the workflow again?

Run it again only when the review reveals one specific correction target, such as the wrong dimensions, unacceptable compression, or a naming issue that would confuse the next handoff. Re-running the full batch without a clear reason often creates a second round of file sprawl and makes it harder to tell which output is authoritative.

## Related Dayfiles reading

${renderRelated(config.related)}

## Before you release the batch

The final question is not “Did the tool run?” It is “Would the next person know exactly what this batch is for, whether it is approved, and whether the originals are still safe?” If the answer is yes, the workflow is doing its job.`;
}

function renderChecklistBody(config) {
  return `${config.intro}

The Dayfiles route behind this kind of work matters because the file is rarely alone. It usually sits inside a broader image or PDF workflow, so the checklist has to protect the handoff as well as the visible page or image.

${renderFigure({
  ...config.screenshot,
  caption: `Use this Dayfiles workspace as the reference point for ${config.titleWord}.`
})}

## ${config.orderedTitle}

${joinOrdered(config.orderedItems)}

That ordered pass works better than a loose review because it keeps the operator from jumping straight to export before the risky details are checked.

${config.sections
  .map(
    ([heading, paragraph]) => `## ${heading}

${paragraph}`
  )
  .join('\n\n')}

## How should this checklist be used under deadline?

Run the checklist in order and stop at the first issue that would make the file bounce back later. Teams often waste time by finishing the full review on a version that was already wrong at the top of the sequence. It is faster to fix the blocking problem immediately, then restart the short review with a cleaner file.

The checklist also works best when one person owns the final pass. Shared responsibility sounds safe, but it often leaves the riskiest fields and final file names in a gray area where everyone assumes someone else checked them.

## Which issues should stop the workflow immediately?

Stop immediately for source-version confusion, obvious requirement mismatches, missing pages or images, and any field or export setting that would cause the destination to reject the file. Those are not “clean up later” problems. They are signs that the checklist did its job by catching the issue before the handoff.

Less serious issues can be grouped into one correction pass, but blocking issues should interrupt the run at once. That approach keeps the checklist useful under real working conditions instead of turning it into a slow ritual that teams ignore.

## How should the final owner document the result?

The final owner does not need a long memo. A short note in the folder name, handoff message, or archive convention is enough if it clearly tells the next person what changed and what the file is ready for. That tiny bit of documentation is often what separates a reliable checklist from a checklist that only helped the person who ran it.

## What does a strong final pass feel like?

A strong final pass feels calm and specific. The reviewer knows which fields, pages, or exports deserve extra attention and which parts of the file can be trusted because the earlier steps were handled cleanly. That is the real payoff of a checklist: it reduces uncertainty at the last moment instead of adding more generic work.

## Why the checklist is worth keeping after this one file

The checklist earns its place when it helps the next run go faster with fewer surprises. Once the team or individual has a repeatable final pass, the file work becomes easier to trust even before the export happens. That longer-term reduction in uncertainty is what makes a checklist valuable rather than merely procedural.

## Related Dayfiles reading

${renderRelated(config.related)}

## What “ready” should mean here

Ready means the file can move to its next destination without another person needing to guess what changed, what is final, or what still needs correction. That standard is what makes the checklist worth using.`;
}

function renderWorkflowBody(config) {
  return `${config.intro}

Dayfiles helps most when the team uses the tool routes as part of one visible sequence instead of scattered one-off fixes. The workflow gets stronger when each step has a clear owner and the next person can see what stage the file is in.

${renderFigure({
  ...config.screenshot,
  caption: `Use this Dayfiles view as the operational starting point for ${config.focus}.`
})}

## Which operating rules matter most?

For ${config.focus}, the rules worth locking early are:

${joinBullet(config.pillars)}

Those rules reduce rework because they turn vague “someone should check this” expectations into named parts of the process.

## What should the working sequence look like?

1. Confirm the source inputs and who owns the final review.
2. Run the edit, packaging, or preparation step without mixing in unrelated file changes.
3. Review the risky fields or pages before export.
4. Export one clearly labeled output for the next handoff.
5. Archive the final file in a way the next operator can trust.

That sequence is deliberately plain. Workflows become brittle when they collect too many optional branches. A small team usually needs a route that is easy to repeat, easy to teach, and easy to audit after a bad handoff.

${config.sections
  .map(
    ([heading, paragraph]) => `## ${heading}

${paragraph}`
  )
  .join('\n\n')}

## What should managers or owners look for after rollout?

Look for fewer naming mistakes, fewer packet returns, fewer last-minute “which file is final?” questions, and faster review cycles on repeated work. Those are the signals that the workflow is actually reducing friction rather than just adding a better-looking process description.

## Where should the workflow stay flexible?

Keep the destination rule, review rule, and archive rule firm. Stay flexible about the exact order of low-risk preparation tasks if the team has a good reason to change them. That balance helps the workflow hold up under real pressure. It protects the steps that prevent errors without forcing the team into unnecessary ceremony for every minor variation in the work.

## What should happen when the workflow breaks?

Treat the break as a clue, not as proof that the workflow has failed as a concept. Ask which step allowed the mistake through, what evidence would have caught it earlier, and whether the file state was still visible to the next operator. Those questions usually reveal whether the fix belongs in intake, review, export, or archive discipline.

## What should stay true even when the job changes slightly?

Even when the document type, reviewer, or destination changes, the workflow should still preserve four basics: a known source of truth, a visible review moment, a deliberate export point, and a trustworthy archive. Those constants are what make the process usable across several kinds of file work without becoming vague.

## Why this kind of workflow ages well

It ages well because it focuses on file state, not temporary interface details. Tools will change and destinations will change, but teams will still need to know which file is approved, what changed, and whether the output is ready to move. A workflow built around those questions stays useful longer than one built around a narrow button path.

## Related Dayfiles reading

${renderRelated(config.related)}

## What success looks like

Success here means the next operator can pick up the file without guessing about status, sequence, or destination. When that is true, the workflow is carrying its weight instead of just adding another layer of motion.`;
}

function renderStoryBody(config) {
  return `${config.intro}

This kind of Dayfiles story is useful because it mirrors a real operating pattern rather than a polished demo. The situation is simple: ${config.scenario}. What matters is the sequence of decisions that makes the next review easier instead of harder.

${renderFigure({
  ...config.screenshot,
  caption: 'A visible Dayfiles hub makes it easier to keep related image and PDF steps inside one routine.'
})}

## What the routine looked like in practice

${joinOrdered(config.stages)}

This kind of routine works because every step leaves the file in a clearer state than before. The next operator does not need to infer which copy is safe to use or whether a previous correction already happened.

## What the person doing the work had to decide

1. Which file was the real source of truth.
2. Which step belonged to image cleanup versus document packaging.
3. When the file was ready to leave the working folder.
4. What needed to stay available for future reuse.

Those decisions sound small, but they are usually where stress and inconsistency show up. The story is useful because it makes those judgment calls visible instead of pretending the workflow is fully automatic.

## What changed once the routine was used consistently

${joinBullet(config.lessons)}

None of those gains come from magic. They come from making the file state visible at every handoff point.

## Where teams or students usually drift off course

They drift when they mix source files with delivery copies, when the person doing the edit is not the person checking the result, or when the archive is too vague to support a later reuse cycle. A good routine prevents that drift before deadlines make the mistakes expensive.

## What someone else can copy from this story

They do not need the same exact documents or the same exact deadline. They need the same discipline: a known source folder, a defined export point, a final review moment, and an archive that can be read later without detective work. That is the transferable value in the routine.

## Why the routine stays useful after the first success

The first successful run proves the sequence can work. The real value appears later, when a second or third file set can follow the same route with less confusion. That repeatability is what turns the story from a nice anecdote into an operating pattern worth keeping.

## What the story should make easier for the next reader

The story should make it easier to spot where their own process is loose. A reader should be able to compare the routine against their own folders, approvals, and handoff habits and immediately notice where confusion is likely to appear. That practical comparison is what gives the story lasting value.

## What should someone borrow first from the routine?

They should borrow the smallest repeatable rule with the biggest payoff: keep originals separate, label delivery copies clearly, and make one person own the final check. Those simple habits scale surprisingly well across student work, team operations, hiring packets, and recurring client deliverables.

## Why routines beat last-minute heroics

People rarely remember a workflow because it sounded impressive. They remember it because it removed one recurring source of stress. A routine that reduces deadline confusion, packet mistakes, or archive mess is more valuable than a clever shortcut that only works when the original operator is available to explain it.

## Related Dayfiles reading

${renderRelated(config.related)}

## What to carry forward from the story

The useful part of the story is the discipline, not the label. If the next file set can follow the same sequence with less confusion and less rework, then the routine is worth keeping.`;
}

function renderPlaybookBody(config) {
  return `${config.intro}

The Dayfiles workflow becomes more valuable when the team can explain how work moves from intake to delivery. That is the point of a playbook: it documents the routine well enough that good results do not depend on one person remembering every step.

${renderFigure({
  ...config.screenshot,
  caption: `Use the Everyday Image Studio workspace as a repeatable operating surface for ${config.audience}.`
})}

## What should be documented first?

Start with the non-negotiables:

${joinBullet(config.standards)}

Those choices create the conditions for reliable editing. Without them, even a strong tool setup gets buried under inconsistent intake and vague approvals.

## What should the team do every day?

1. Intake files into a predictable working area.
2. Apply the agreed editing or processing rule for that job type.
3. Review risky outputs before export.
4. Hand off only labeled, approved files.
5. Keep the original assets available for reuse or correction.

The playbook should make those five steps feel ordinary. If the route is too clever to remember, the team will drift back into ad hoc file handling the moment work gets busy.

${config.sections
  .map(
    ([heading, paragraph]) => `## ${heading}

${paragraph}`
  )
  .join('\n\n')}

## How should the playbook evolve?

Change it when the team sees repeated failure patterns, not just when someone has a new preference. The playbook is strongest when it captures the fixes that remove recurring rework, unclear approvals, or export mistakes. That keeps it practical instead of turning it into a theoretical operations document.

## What should new teammates be able to learn from it?

They should be able to see where files enter the system, what “approved” means for the team, when exports are allowed to leave the workspace, and where the final outputs live afterward. If the playbook answers those questions cleanly, it shortens onboarding and reduces the amount of tribal knowledge needed to do good work.

## What should stay visible even when the team is busy?

The source-of-truth folder, the approval signal, and the final archive path should always stay visible. Busy teams rarely fail because they forgot a sophisticated tactic. They fail because ordinary status signals disappeared under deadline pressure. A practical playbook protects those signals first.

## What would prove the playbook is doing its job?

It would show up in cleaner handoffs, fewer clarification messages, and less repeated export work on the same files. A good playbook should make the routine easier to explain and easier to trust, not just easier to admire in a document. If the team still spends too much time figuring out what a file is, the playbook needs another iteration.

## Why a playbook matters even for small teams

Small teams often assume they can rely on memory because everyone talks frequently. In practice, the opposite is true under deadline pressure. A lightweight playbook keeps routine file work from becoming dependent on one person’s memory, and that makes the whole system more resilient when priorities shift quickly.

## Related Dayfiles reading

${renderRelated(config.related)}

## What makes the playbook useful

It is useful when a new teammate can follow the sequence, a manager can review the outcomes, and the final asset handoff looks predictable instead of personal. That is the standard the playbook should support.`;
}

function renderLaunchBody() {
  return `What should a launch announcement on Dayfiles actually do for readers? It should explain what changed, who the product helps, and where a curious visitor should go next if they want to test the workflow instead of just read the headline.

Everyday Image Studio matters because it gives Dayfiles a focused editing surface for image cleanup, repeated export work, and lightweight production tasks that do not need a heavy design suite. The launch post should therefore connect the announcement to the real jobs a visitor can try immediately.

${renderFigure({
  ...SCREENSHOTS.eis,
  caption: 'The Everyday Image Studio workspace gives launch readers a concrete place to evaluate the product instead of only reading an announcement.'
})}

## What is newly available?

Everyday Image Studio gives visitors a browser-first route for practical image editing and repeatable export work. The value is not only that the tool is live. The value is that it supports recurring jobs such as crop cleanup, asset preparation, and standardized image delivery without adding a heavy software setup step.

## Who should care about this launch?

The launch is most relevant for:

- small teams that need fast image turnaround,
- solo operators working against upload or branding constraints,
- people who already use Dayfiles for PDF or file-handoff work and want a connected image route.

## What should a visitor understand before clicking away?

A launch post should help a reader understand the shape of the product in plain language. Everyday Image Studio is not trying to be every creative tool on the web. Its role inside Dayfiles is more specific: help users run practical image editing work that sits close to file delivery, repeated exports, and operational handoffs.

## What should a first-time visitor test?

A good first session should answer three questions:

1. Can the product handle a realistic image task quickly?
2. Is the editing surface readable enough for repeated daily work?
3. Does the output fit naturally into the rest of the Dayfiles stack?

That is a better test than browsing features in the abstract.

## How should the launch traffic be converted into trust?

Trust comes from showing the product in context. A visitor should be able to go from the launch announcement to a workflow guide and then to the live tool without hitting a dead end or a vague promise. The more direct that path feels, the more the launch post behaves like useful product orientation instead of marketing filler.

## How does this launch connect to the rest of Dayfiles?

The launch matters more because it fits into the broader Dayfiles flow. Image prep, PDF packaging, and final delivery often belong to the same job, especially in operations, hiring, application, or listing workflows. The product is stronger when readers can move from the announcement to a real guide and then to the live workspace.

## What would make the launch post worth revisiting later?

It should still help a later visitor understand where Everyday Image Studio sits inside the site, what kinds of tasks it supports, and which follow-up guides make the evaluation easier. That is the standard that keeps a launch post from aging into a low-information archive page.

## What should the site learn from the launch itself?

The launch is useful feedback about what visitors notice first, which workflow questions they ask immediately, and which guides make them confident enough to try the tool. Those signals should shape future product-page and guide improvements so the launch keeps producing value after the announcement week is over.

## What should the post avoid becoming?

It should not become a detached announcement that only makes sense to people who already followed the launch week closely. The page stays useful when it still helps a new visitor understand the product role, the likely workflow fit, and the best next page to read after the announcement.

## Why launch context still matters later

Later readers often arrive from search, a shared link, or a passing mention rather than from the original launch moment. Keeping the post useful for them makes the page more than a timestamp. It turns the launch into a durable orientation page that still helps the product explain itself.

## Where should launch traffic go next?

- [Everyday Image Studio Workflow Playbook for Daily Teams](/blog/eis-workflow-playbook/)
- [How to Convert Images to JPG for Consistent Delivery](/blog/images-convert-to-jpg-guide/)
- [Employee ID Photo Standards for HR Teams and Faster Reviews](/blog/eis-employee-id-photo-standard-guide/)

## What should the launch post leave behind?

The best launch post does not just celebrate. It gives visitors a useful next step and makes the product easier to evaluate on its own terms. That is the job this announcement should do on Dayfiles.`;
}

function renderPolicyBody() {
  return `Why does Dayfiles use ads on some content pages at all? The honest answer is that the site needs a way to support public guides without turning every useful workflow page into a signup wall or an empty product teaser. The policy only works if the content remains the main reason to visit the page.

The right standard for Dayfiles is straightforward: content first, ad placement second, and no attempt to confuse policy pages, support pages, or thin utility pages with ad-heavy experiences. A free guide should still feel useful if a reader ignores the ads completely.

## What should readers expect from ad-supported pages?

Readers should expect:

- task-focused guides that stand on their own,
- visible trust and policy pages,
- clear separation between editorial material and advertising,
- no requirement to click an ad to finish the workflow.

That expectation matters because the credibility of the whole site depends on it.

## What should the team check before placing ads on a page?

1. Is the page useful even if the ads are ignored?
2. Does the page have enough original content to stand on its own?
3. Would the page still feel trustworthy if a reviewer landed there first?
4. Is the ad placement clearly separate from the editorial content?

Those questions are more useful than a generic monetization rule because they force the site to protect the reading experience before it protects revenue.

## Where should Dayfiles be extra careful?

Dayfiles should be especially careful on:

- trust pages such as privacy, terms, and disclosure pages,
- short or low-information pages,
- pages that already exist mainly to route a visitor elsewhere.

If a page does not carry enough editorial value by itself, ads should not be the thing doing the visual heavy lifting.

## How should this policy affect future publishing?

It should push the site toward stronger guides, clearer product pages, and fewer low-information routes. Ads are easier to defend when the surrounding page obviously helps the visitor solve a real job. That means every new page should be evaluated first for usefulness, not just for monetization potential.

## How should readers judge whether the standard is being met?

They should be able to read a page, understand the task, find the next step, and move on without feeling tricked into another click. If the guide still works as a guide when the ads are ignored, the balance is probably in the right place. If the page feels thin without the monetization layer, the publishing decision should be reconsidered.

## What should this mean for page quality on Dayfiles?

It means short, low-information, or purely promotional pages should not be treated as enough. Pages need enough original value to justify their existence before ads are even part of the discussion. That standard is stricter than “the page loads and has a title,” but it is the right standard for a site that wants long-term trust.

## How should this shape editorial decisions day to day?

It should push the team to ask whether a page helps a user finish a job, avoid a mistake, or understand a product route more clearly than before. If the answer is weak, the page probably needs more work before monetization becomes a meaningful conversation. That editorial discipline supports both user trust and long-term approval readiness.

## Why this matters for approval as much as trust

Approval issues and trust issues usually point back to the same root problem: pages that do not carry enough obvious value on their own. Building stronger pages is therefore not just a policy response. It is also the best way to make the site more useful for real readers who arrive without prior context.

## How does this connect to the rest of the site?

The ad policy works only if the rest of Dayfiles keeps improving. That means stronger workflow guides, clearer product hubs, and a better user experience on pages that explain real jobs instead of just naming features.

## Which supporting guides explain the real value?

- [PDF Toolkit Checklist for Reliable Document Delivery](/blog/pdf-operations-checklist/)
- [Everyday Image Studio Workflow Playbook for Daily Teams](/blog/eis-workflow-playbook/)
- [How to Blur Faces Before Sharing Sensitive Photos Online](/blog/images-blur-faces-before-sharing-guide/)

## What this policy is trying to protect

The goal is to keep free content viable without weakening trust. If a reader can understand the workflow, use the guide, and move to the next task without friction, then the policy is serving the site instead of the other way around.`;
}

function renderFrontmatter(data) {
  const lines = ['---'];
  const quote = (value) => `"${String(value).replaceAll('"', '\\"')}"`;

  lines.push(`title: ${quote(data.title)}`);
  lines.push(`slug: ${quote(data.slug)}`);
  lines.push(`date: ${quote(data.date)}`);
  lines.push(`product: ${quote(data.product)}`);
  lines.push(`description: ${quote(data.description)}`);
  if (Array.isArray(data.tags) && data.tags.length) {
    lines.push('tags:');
    for (const tag of data.tags) {
      lines.push(`  - ${quote(tag)}`);
    }
  }
  lines.push(`canonicalUrl: ${quote(data.canonicalUrl)}`);
  lines.push(`featuredImage: ${quote(data.featuredImage)}`);
  lines.push(`featuredImageAlt: ${quote(data.featuredImageAlt)}`);
  if (Array.isArray(data.sources) && data.sources.length) {
    lines.push('sources:');
    for (const source of data.sources) {
      if (typeof source === 'string') {
        lines.push(`  - ${quote(source)}`);
      } else {
        lines.push(`  - title: ${quote(source.title)}`);
        lines.push(`    url: ${quote(source.url)}`);
      }
    }
  }
  if (Array.isArray(data.faq) && data.faq.length) {
    lines.push('faq:');
    for (const item of data.faq) {
      lines.push(`  - q: ${quote(item.q)}`);
      lines.push(`    a: ${quote(item.a)}`);
    }
  }
  lines.push('---');
  return `${lines.join('\n')}\n`;
}

function defaultBodyFor(post) {
  if (pdfTaskConfigs[post.slug]) {
    return renderPdfTaskBody(pdfTaskConfigs[post.slug]);
  }

  if (customBodies[post.slug]) {
    return customBodies[post.slug];
  }

  throw new Error(`No rewrite template for slug: ${post.slug}`);
}

async function main() {
  const files = (await fs.readdir(BLOG_DIR)).filter((file) => file.endsWith('.md')).sort();

  for (const file of files) {
    const abs = path.join(BLOG_DIR, file);
    const raw = await fs.readFile(abs, 'utf8');
    const parsed = matter(raw);
    const body = defaultBodyFor(parsed.data);
    const out = `${renderFrontmatter(parsed.data)}\n${body.trim()}\n`;
    await fs.writeFile(abs, out, 'utf8');
  }

  console.log(`Rewrote ${files.length} published post(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
