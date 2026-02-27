import { SITE_URL } from '../blog/lib.mjs';

export const productPages = [
  {
    slug: 'pdf-toolkit',
    canonicalUrl: `${SITE_URL}/pdf-toolkit`,
    title: 'Free Online PDF Tools With No Account | Dayfiles',
    description:
      'Use Dayfiles PDF Toolkit to merge, split, compress, convert, fill, and sign PDFs in your browser, with no account required for core workflows.',
    shortTitle: 'PDF Toolkit',
    navLabel: 'PDF Toolkit',
    appUrl: 'https://pdf.dayfiles.com/',
    heroEyebrow: 'PDF workflow hub',
    h1: 'Free Online PDF Tools With No Account Required',
    heroCopy:
      'Open browser-based PDF tools for merging, splitting, compressing, converting, filling forms, and signing documents without creating an account before core work begins.',
    primaryCtaLabel: 'Open PDF Toolkit',
    secondaryCtaLabel: 'Browse PDF guides',
    secondaryCtaHref: '/blog',
    whatItDoes: [
      'PDF Toolkit is the Dayfiles landing page for browser-based document operations. It is built for people who need to merge files, split packets, compress oversized documents, convert between formats, fill forms, and e-sign PDFs without switching through a long setup flow first.',
      'This page is the SEO and navigation hub on dayfiles.com. It explains the workflow, links to related guides, and points visitors to the live PDF app when they are ready to use the tool directly.'
    ],
    whyUse: [
      'Dayfiles positions PDF Toolkit around fast, browser-first document work. The main value is that users can move from intake to finished output quickly without a mandatory account wall for core workflows.',
      'That makes it useful for application packets, contracts, repeat document cleanup, and form-heavy tasks where the operator needs a reliable path from raw file to finished delivery.'
    ],
    bestFor: ['applications', 'contracts', 'form filling', 'packet assembly', 'document cleanup'],
    relatedGuideSlugs: [
      'e-sign-pdf-online',
      'fill-pdf-forms-online',
      'merge-pdf-without-upload',
      'pdf-operations-checklist'
    ],
    faqs: [
      {
        q: 'What can I do with Dayfiles PDF Toolkit?',
        a: 'You can use it for merging, splitting, compressing, converting, filling, and signing PDFs in a browser-based workflow.'
      },
      {
        q: 'Do I need an account before using PDF Toolkit?',
        a: 'No. Dayfiles positions PDF Toolkit around no-account-required access for core workflows so users can start quickly.'
      },
      {
        q: 'Who is PDF Toolkit best for?',
        a: 'It is best for people handling applications, contracts, packet assembly, form completion, and everyday document cleanup.'
      }
    ],
    companionSlug: 'everyday-image-studio',
    companionTitle: 'Everyday Image Studio',
    companionCopy:
      'Need image preparation before document assembly? Use Everyday Image Studio as the companion hub for browser-based image cleanup and export workflows.',
    schema: {
      name: 'PDF Toolkit',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'Browser-based PDF workflow tools for merge, split, compress, convert, fill forms, and e-sign operations.'
    }
  },
  {
    slug: 'everyday-image-studio',
    canonicalUrl: `${SITE_URL}/everyday-image-studio`,
    title: 'Free Online Image Editor for Daily Work | Dayfiles',
    description:
      'Use Everyday Image Studio to crop, resize, clean up, and export images in your browser, with no account required for core daily workflows.',
    shortTitle: 'Everyday Image Studio',
    navLabel: 'Image Studio',
    appUrl: 'https://everydayimagestudio.dayfiles.com/',
    heroEyebrow: 'Image workflow hub',
    h1: 'Free Online Image Editing for Daily Work',
    heroCopy:
      'Use browser-based image tools for cropping, resizing, cleaning up, and exporting files fast, without creating an account before core daily work begins.',
    primaryCtaLabel: 'Open Image Studio',
    secondaryCtaLabel: 'Browse image guides',
    secondaryCtaHref: '/blog',
    whatItDoes: [
      'Everyday Image Studio is the Dayfiles landing page for repeated image-editing workflows. It is designed for browser-based crop, resize, cleanup, and export tasks that need to move quickly from source image to finished asset.',
      'This page gives search engines and visitors a static route on dayfiles.com that explains the tool, links to related content, and routes users into the live image app when they want to start editing.'
    ],
    whyUse: [
      'Dayfiles positions Everyday Image Studio around practical image work instead of heavy creative suites. The emphasis is on fast repeated edits, clear exports, and daily task flow rather than long setup or advanced design tooling.',
      'That makes it a good fit for teams creating content, people preparing submission images, and operators who need quick cleanup and export workflows in the browser.'
    ],
    bestFor: ['passport photo preparation', 'team content production', 'quick image cleanup', 'repeated export workflows'],
    relatedGuideSlugs: [
      'eis-passport-photo-checklist',
      'eis-workflow-playbook',
      'product-hunt-launch-everyday-image-studio'
    ],
    faqs: [
      {
        q: 'What does Everyday Image Studio help with?',
        a: 'It helps with browser-based image cropping, resizing, cleanup, and export for fast repeated daily workflows.'
      },
      {
        q: 'Do I need an account before using Everyday Image Studio?',
        a: 'No. Dayfiles positions the tool around no-account-required access for core daily image workflows.'
      },
      {
        q: 'Who is Everyday Image Studio best for?',
        a: 'It is best for people preparing passport-style photos, producing team content, cleaning up images quickly, and handling repeated export tasks.'
      }
    ],
    companionSlug: 'pdf-toolkit',
    companionTitle: 'PDF Toolkit',
    companionCopy:
      'Need document packaging after image prep? Use PDF Toolkit as the companion hub for form filling, conversion, signing, and PDF delivery workflows.',
    schema: {
      name: 'Everyday Image Studio',
      applicationCategory: 'PhotoEditingApplication',
      operatingSystem: 'Web',
      description:
        'Browser-based image workflow tools for cropping, resizing, cleanup, and export in repeated daily editing tasks.'
    }
  }
];

export function getProductPageBySlug(slug) {
  return productPages.find((page) => page.slug === slug) || null;
}
