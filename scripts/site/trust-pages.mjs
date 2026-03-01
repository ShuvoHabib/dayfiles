import { SITE_URL } from '../blog/lib.mjs';

const contactEmail = 'contact@dayfiles.com';

export const trustPages = [
  {
    slug: 'about',
    title: 'About Dayfiles | Browser-Based File Workflow Tools',
    description:
      'Learn what Dayfiles publishes, who the site is for, and how its browser-based PDF and image workflow guides connect to the live tools.',
    shortTitle: 'About Dayfiles',
    schemaType: 'AboutPage',
    heroEyebrow: 'About the publisher',
    h1: 'About Dayfiles',
    heroCopy:
      'Dayfiles is a small web publisher and product hub focused on practical PDF and image workflows. The site exists to help people complete everyday file work faster with clear guides and direct paths into the live tools.',
    sections: [
      {
        title: 'What Dayfiles is',
        paragraphs: [
          'Dayfiles publishes browser-based workflow content for PDF handling, image preparation, and document cleanup. The site also acts as the main hub for the live Dayfiles tools, including PDF Toolkit and Everyday Image Studio.',
          'The goal is straightforward: explain how to finish common file tasks without heavy setup, and make those paths easy to find from search, from the homepage, and from related guides.'
        ]
      },
      {
        title: 'Who the site is for',
        paragraphs: [
          'The site is built for people doing daily document or image work, including applicants, operations teams, HR coordinators, creators, and anyone who needs a quick browser-first workflow.',
          'That means the content is written around real tasks such as filling forms, assembling packets, resizing images, preparing submission files, and exporting clean final versions.'
        ]
      },
      {
        title: 'How content and tools fit together',
        paragraphs: [
          'Dayfiles separates three things clearly: the marketing site, the editorial guides, and the live product interfaces. The main site explains the workflows and links to the tools when a visitor is ready to use them.',
          'This structure helps readers understand what a tool does before they click into the app, and it gives search engines a stable set of pages with visible context instead of only app shells.'
        ]
      }
    ]
  },
  {
    slug: 'contact',
    title: 'Contact Dayfiles | Support, Policy, and Business Questions',
    description:
      'Contact Dayfiles for support, policy, copyright, privacy, advertising, or business questions related to the site, its guides, and live tools.',
    shortTitle: 'Contact',
    schemaType: 'ContactPage',
    heroEyebrow: 'Publisher contact',
    h1: 'Contact Dayfiles',
    heroCopy:
      'Use this page for support, privacy, copyright, advertising, and business questions related to Dayfiles guides and product hubs.',
    sections: [
      {
        title: 'Primary contact',
        paragraphs: [
          `Email the Dayfiles team at ${contactEmail} for policy questions, support issues, business requests, advertising matters, or corrections to published content.`,
          'When you write in, include the page URL, the product or guide involved, and the issue you want reviewed so requests can be handled faster.'
        ]
      },
      {
        title: 'What to use this page for',
        list: [
          'support questions about the public site or its guides',
          'privacy, copyright, or content removal requests',
          'advertising and sponsorship questions',
          'business development and partnership inquiries',
          'reporting factual errors or broken pages'
        ]
      },
      {
        title: 'Response scope',
        paragraphs: [
          'Dayfiles is a web publisher and product hub, not a managed document service. Responses focus on site issues, published content, and public product entry points rather than account-based enterprise support.',
          'If a question relates to a third-party platform, browser setting, or file you do not have rights to use, Dayfiles may not be able to provide detailed troubleshooting.'
        ]
      }
    ],
    contactEmail
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy | Dayfiles',
    description:
      'Read the Dayfiles privacy policy covering site analytics, advertising, browser data handling, third-party services, and how public pages are operated.',
    shortTitle: 'Privacy Policy',
    schemaType: 'WebPage',
    heroEyebrow: 'Site policy',
    h1: 'Privacy Policy',
    heroCopy:
      'This policy explains how Dayfiles handles basic site data, analytics, advertising scripts, and public content across the main website.',
    sections: [
      {
        title: 'What this policy covers',
        paragraphs: [
          'This policy covers the public website at dayfiles.com, including the homepage, blog, product hub pages, and related static files. Separate live tools or third-party platforms may have their own interfaces or notices.',
          'Dayfiles is designed so visitors can browse public pages without creating an account on the main site.'
        ]
      },
      {
        title: 'Information collected on the public site',
        paragraphs: [
          'The site may collect standard technical information such as browser type, device information, approximate location, referring page, and page usage data through analytics or advertising tools.',
          'That information is used to understand site performance, maintain the service, measure traffic, and support content publishing.'
        ]
      },
      {
        title: 'Advertising and analytics',
        paragraphs: [
          'Dayfiles may use Google Analytics and Google AdSense or similar services on selected public pages. Those providers may use cookies or similar technologies to measure visits, serve ads, and report performance.',
          'Visitors can control many advertising and cookie preferences through their browser settings and Google account controls where available.'
        ]
      },
      {
        title: 'How browser-based tools relate to the main site',
        paragraphs: [
          'Dayfiles publishes browser-first workflows and links into live product interfaces. Core workflows are positioned around direct in-browser usage, but specific tool behavior can vary by product and should be reviewed on the relevant page before use.',
          'Visitors should avoid uploading or processing files they do not have rights to use, and should review the product context before starting any sensitive workflow.'
        ]
      }
    ]
  },
  {
    slug: 'terms',
    title: 'Terms of Service | Dayfiles',
    description:
      'Read the Dayfiles terms of service for site usage, acceptable use, intellectual property, third-party services, and limitations of liability.',
    shortTitle: 'Terms of Service',
    schemaType: 'WebPage',
    heroEyebrow: 'Site terms',
    h1: 'Terms of Service',
    heroCopy:
      'These terms govern use of the public Dayfiles website, including its editorial content, product hub pages, and links into live tools.',
    sections: [
      {
        title: 'Use of the site',
        paragraphs: [
          'You may use Dayfiles for lawful browsing, reading, and general workflow research. You agree not to misuse the site, interfere with its operation, or use it to promote unlawful, abusive, or infringing activity.',
          'Any workflow guidance on the site is informational and does not replace legal, compliance, or professional review where those are required.'
        ]
      },
      {
        title: 'Content and intellectual property',
        paragraphs: [
          'Dayfiles content, branding, visuals, and editorial materials are protected by applicable intellectual property laws. You may quote or reference the site with attribution, but you may not republish or scrape the content at scale without permission.',
          'Third-party product names, file formats, and platforms mentioned on the site remain the property of their respective owners.'
        ]
      },
      {
        title: 'Third-party services and links',
        paragraphs: [
          'Dayfiles may link to live product interfaces, browser stores, analytics tools, ad services, and other third-party websites. Those services operate under their own terms and privacy practices.',
          'Dayfiles is not responsible for the availability, content, or policies of third-party services.'
        ]
      },
      {
        title: 'No warranty',
        paragraphs: [
          'The site is provided on an as-is basis. Dayfiles does not guarantee uninterrupted availability, error-free operation, or suitability for any specific legal, compliance, or business requirement.',
          'Use your own judgment before relying on any workflow guide for sensitive, regulated, or high-risk tasks.'
        ]
      }
    ]
  },
  {
    slug: 'editorial-policy',
    title: 'Editorial Policy | How Dayfiles Publishes Guides',
    description:
      'See how Dayfiles researches, writes, updates, and separates editorial workflow guides from product navigation and advertising on the site.',
    shortTitle: 'Editorial Policy',
    schemaType: 'WebPage',
    heroEyebrow: 'Editorial standards',
    h1: 'Editorial Policy',
    heroCopy:
      'This page explains how Dayfiles creates workflow guides, handles updates, cites sources, and keeps ads separate from editorial recommendations.',
    sections: [
      {
        title: 'How guides are created',
        paragraphs: [
          'Dayfiles workflow guides are written to explain a specific task, not just repeat a keyword. Articles are structured around user intent, practical steps, related tools, and the tradeoffs a reader should understand before acting.',
          'Where appropriate, guides cite primary sources, product pages, or operational references so readers can verify details for themselves.'
        ]
      },
      {
        title: 'What Dayfiles tries to avoid',
        list: [
          'thin pages with little unique instructional value',
          'misleading promises about results or product behavior',
          'hiding ads or sponsored elements inside editorial recommendations',
          'copying large amounts of third-party content without adding original value'
        ]
      },
      {
        title: 'Update and correction policy',
        paragraphs: [
          'Pages may be updated when products change, when better workflow information becomes available, or when errors are reported. Important fixes should be reflected in the visible page content rather than only in metadata.',
          'Readers can request corrections through the Dayfiles contact page if a guide is inaccurate, outdated, or materially incomplete.'
        ]
      },
      {
        title: 'Editorial independence',
        paragraphs: [
          'Advertising, analytics, and product promotion do not override the editorial requirement to make pages understandable and useful on their own. Dayfiles aims to keep the difference between guidance, product navigation, and monetization visible to readers.',
          'When a page links into a Dayfiles tool, that relationship is part of the publisher model and should be understandable from the surrounding content.'
        ]
      }
    ]
  },
  {
    slug: 'advertising-disclosure',
    title: 'Advertising Disclosure | Dayfiles',
    description:
      'Read how Dayfiles uses advertising on selected pages, how ads relate to editorial content, and how the site funds free public guides.',
    shortTitle: 'Advertising Disclosure',
    schemaType: 'WebPage',
    heroEyebrow: 'Advertising disclosure',
    h1: 'Advertising Disclosure',
    heroCopy:
      'Dayfiles may run advertising on selected pages to support free workflow guides and public product discovery.',
    sections: [
      {
        title: 'How advertising is used',
        paragraphs: [
          'Dayfiles may display Google Ads or similar advertising units on selected public pages. Those ads help support the cost of maintaining the site, publishing new guides, and keeping core public content free to read.',
          'Not every page will contain ads, and the presence of an ad does not change the editorial goal of explaining a workflow clearly.'
        ]
      },
      {
        title: 'Separation from editorial content',
        paragraphs: [
          'Ads are intended to remain visually separate from article copy, FAQs, product descriptions, and navigation. Editorial decisions are made for usefulness and clarity, not to disguise ads as guidance.',
          'If Dayfiles promotes its own tools on a page, that promotion is part of the site structure and should be obvious from the surrounding labels, links, and context.'
        ]
      },
      {
        title: 'Reader expectations',
        paragraphs: [
          'Readers should assume that advertising and analytics may appear on the public site. They should also expect that the site will identify its own product hubs and related guides openly rather than hiding commercial relationships.',
          'Questions about advertising practices can be sent through the Dayfiles contact page.'
        ]
      }
    ]
  }
];

export function getTrustPageBySlug(slug) {
  return trustPages.find((page) => page.slug === slug) || null;
}
