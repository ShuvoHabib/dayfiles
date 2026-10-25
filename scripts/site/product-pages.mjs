import { siteUrl } from '../blog/lib.mjs';

export const productPages = [
  {
    slug: 'images',
    canonicalUrl: siteUrl('/images'),
    title: 'Image Format, Compression and Resize Tools | Dayfiles',
    description:
      'Use Dayfiles Images to change image format, compress, resize in bulk, and export image files in the browser.',
    shortTitle: 'Images',
    navLabel: 'Images',
    appUrl: 'https://images.dayfiles.com/',
    heroEyebrow: 'Image toolbox hub',
    h1: 'Image format, compression and resize tools',
    heroCopy:
      'Use browser-based image tools for format changes, compression, batch resizing, and export.',
    primaryCtaLabel: 'Open Images',
    secondaryCtaLabel: 'Browse image guides',
    secondaryCtaHref: '/blog/',
    whatItDoes: [
      'Images is the Dayfiles landing page for browser-based image processing at scale. It is built for people who need to change formats, compress files, resize batches for listings, and export delivery-ready images without opening a heavy editor.',
      'The hub explains the supported processing tasks, links to practical guidance, and sends users directly to the live image tools when they are ready to work.'
    ],
    whyUse: [
      'Dayfiles positions Images around practical image-processing tasks rather than design editing. The main value is moving from raw image files to upload-ready output for listings, CMS workflows, document assembly, and repeated operational delivery.',
      'That makes it useful for teams handling batch prep, solo operators preparing images for delivery, and anyone who needs browser-based format changes or compression without design-tool overhead.'
    ],
    bestFor: ['bulk image compression', 'format changes', 'listing image resize', 'batch export prep', 'upload-ready image delivery'],
    relatedGuideSlugs: [
      'compress-images-to-a-specific-size-before-upload',
      'convert-heic-png-and-webp-for-easier-delivery'
    ],
    faqs: [
      {
        q: 'What can I do with Dayfiles Images?',
        a: 'You can change image format, compress, resize, clean up, and export image files in a browser-based workflow.'
      },
      {
        q: 'What should I prepare before using Images?',
        a: 'Open the tool and start with the image file you want to process.'
      },
      {
        q: 'Who is Images best for?',
        a: 'It is best for people preparing images for delivery, resizing product assets, changing formats, and handling repeated image tasks.'
      }
    ],
    companionSlug: 'everyday-image-studio',
    companionTitle: 'Everyday Image Studio',
    companionCopy:
      'Need crop, background cleanup, or workflow-specific image editing after conversion or compression? Use Everyday Image Studio as the companion hub.',
    schema: {
      name: 'Images',
      applicationCategory: 'PhotoEditingApplication',
      operatingSystem: 'Web',
      description:
        'Browser-based image tools for conversion, compression, batch resizing, and export in repeated daily workflows.'
    }
  },
  {
    slug: 'pdf-toolkit',
    canonicalUrl: siteUrl('/pdf-toolkit'),
    title: 'Merge, Split, Compress and Edit PDFs | Dayfiles',
    description:
      'Use Dayfiles PDF Toolkit to merge, split, compress and edit PDFs, then reorder, rotate or delete pages and add watermarks or page numbers.',
    shortTitle: 'PDF Toolkit',
    navLabel: 'PDF Toolkit',
    appUrl: 'https://dayfiles.com/',
    heroEyebrow: 'PDF workflow hub',
    h1: 'Merge, split, compress and edit PDFs',
    heroCopy:
      'Open PDF tools to merge, split, compress and edit, then reorder, rotate or delete pages.',
    primaryCtaLabel: 'Open PDF Toolkit',
    secondaryCtaLabel: 'Browse PDF guides',
    secondaryCtaHref: '/blog/',
    whatItDoes: [
      'PDF Toolkit is the Dayfiles landing page for browser-based document operations. It is built for people who need to merge files, split packets, compress documents, edit pages, and add watermarks or page numbers.',
      'The hub explains the supported document workflows, links to tested guidance, and points visitors to the live PDF tools when they are ready to begin.'
    ],
    whyUse: [
      'Dayfiles positions PDF Toolkit around browser-first document work. The main value is moving from intake to a finished PDF with merge, split, compress, and page edits.',
      'That makes it useful for application packets, contracts, repeat document cleanup, and form-heavy tasks where the operator needs a reliable path from raw file to finished delivery.'
    ],
    bestFor: ['applications', 'contracts', 'packet assembly', 'page cleanup', 'document editing'],
    relatedGuideSlugs: [
      'pdf-operations-checklist',
      'fill-sign-merge-lock-pdf-packet'
    ],
    faqs: [
      {
        q: 'What can I do with Dayfiles PDF Toolkit?',
        a: 'You can use it to merge, split, compress and edit PDFs, then reorder, rotate or delete pages and add watermarks or page numbers.'
      },
      {
        q: 'What should I prepare before using PDF Toolkit?',
        a: 'Open the tool and start with the PDF you want to merge, split, compress, or edit.'
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
        'Browser-based PDF workflow tools for merge, split, compress, edit, page changes, watermarks, and page numbers.'
    }
  },
  {
    slug: 'everyday-image-studio',
    canonicalUrl: siteUrl('/everyday-image-studio'),
    title: 'Crop, Clean Up and Export Images | Dayfiles',
    description:
      'Use Everyday Image Studio to crop, clean up, resize, and export images in the browser.',
    shortTitle: 'Everyday Image Studio',
    navLabel: 'Image Studio',
    appUrl: 'https://everydayimagestudio.dayfiles.com/',
    heroEyebrow: 'Image workflow hub',
    h1: 'Crop, clean up and export images',
    heroCopy:
      'Use browser-based image tools for cropping, resizing, cleaning up, and exporting files.',
    primaryCtaLabel: 'Open Image Studio',
    secondaryCtaLabel: 'Browse image guides',
    secondaryCtaHref: '/blog/',
    whatItDoes: [
      'Everyday Image Studio is the Dayfiles landing page for repeated image-editing workflows. It is designed for browser-based crop, cleanup, resize, and export tasks that move from source image to finished asset.',
      'The hub explains editing-focused use cases, links to practical guidance, and routes users into the live image app when they want to start editing.'
    ],
    whyUse: [
      'Dayfiles positions Everyday Image Studio around practical image editing instead of broad image processing or heavy creative suites. The emphasis is on crop accuracy, cleanup quality, and repeated export work rather than batch conversion.',
      'That makes it a good fit for teams creating content, people preparing submission images, and operators who need cleanup and export workflows in the browser.'
    ],
    bestFor: ['passport photo preparation', 'team content production', 'image cleanup', 'repeated export workflows'],
    relatedGuideSlugs: [
      'resize-images-to-match-file-size-limits',
      'turn-short-videos-into-gifs-for-product-updates'
    ],
    faqs: [
      {
        q: 'What does Everyday Image Studio help with?',
        a: 'It helps with browser-based image cropping, resizing, cleanup, and export for repeated daily workflows.'
      },
      {
        q: 'What should I prepare before using Everyday Image Studio?',
        a: 'Open the tool and start with the image you want to crop, clean up, or export.'
      },
      {
        q: 'Who is Everyday Image Studio best for?',
        a: 'It is best for people preparing passport-style photos, producing team content, cleaning up images, and handling repeated export tasks.'
      }
    ],
    companionSlug: 'pdf-toolkit',
    companionTitle: 'PDF Toolkit',
    companionCopy:
      'Need format changes or compression before document packaging? Use Images for broad image processing, then PDF Toolkit for merge, split, compress, and edit workflows.',
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
