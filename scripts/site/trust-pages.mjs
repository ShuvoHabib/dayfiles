import { SITE_URL } from '../blog/lib.mjs';

const contactEmail = 'contact@dayfiles.com';
const founderName = 'Shuvo Habib';
const founderSlug = 'shuvo-habib';

export const trustPages = [
  {
    slug: 'about',
    title: 'About Dayfiles | Browser-Based File Workflow Tools',
    description:
      'Learn who runs Dayfiles, how its workflow guides are published and reviewed, and why the site exists as a founder-led publisher for PDF and image work.',
    shortTitle: 'About Dayfiles',
    schemaType: 'AboutPage',
    heroEyebrow: 'About the publisher',
    h1: 'About Dayfiles',
    heroCopy:
      'Dayfiles is a founder-led publisher focused on practical PDF and image workflows. It exists to make everyday file work easier to understand, easier to review, and easier to complete without heavyweight software.',
    highlights: [
      { label: 'Founder and editor', value: founderName },
      { label: 'Primary focus', value: 'PDF delivery, image prep, and browser-based file workflows' },
      { label: 'Publishing model', value: 'Editorial guides plus linked Dayfiles product hubs' }
    ],
    sections: [
      {
        title: 'Who runs Dayfiles',
        paragraphs: [
          `${founderName} runs Dayfiles as the site founder, editorial owner, and product operator. The site is published as a focused content-and-tools business rather than as an anonymous content network.`,
          'That matters because the same person responsible for the tool ecosystem is also responsible for how the guides are scoped, reviewed, corrected, and kept aligned with the live product routes.'
        ]
      },
      {
        title: 'Why Dayfiles exists',
        paragraphs: [
          'Dayfiles exists because many everyday file tasks sit in an awkward middle ground: too important for guesswork, too common for expensive software, and too messy when the only advice online is a feature list or a keyword-stuffed tutorial.',
          'The site is built for people handling application packets, HR documents, image preparation, PDF delivery, and review-sensitive file work that needs a clearer operating path.'
        ]
      },
      {
        title: 'What qualifies the site to publish this material',
        paragraphs: [
          'Dayfiles publishes from direct product and workflow context. The guides are built around the actual jobs the site tools support: conversion, cleanup, packet assembly, handoff review, and browser-first file preparation.',
          'That does not make Dayfiles legal, compliance, or enterprise IT authority. It does make the site accountable for practical workflow guidance tied to the products it operates and documents publicly.'
        ]
      },
      {
        title: 'How Dayfiles is run',
        paragraphs: [
          `${founderName} owns the editorial direction, product framing, and final publishing decisions on the site.`,
          'Guides are reviewed against live page paths, related product hubs, page structure, screenshots, and the clarity of the workflow itself before publication or major revision.'
        ],
        list: [
          'editorial ownership stays with the founder/editor rather than an anonymous content team',
          'guide updates are triggered by product changes, broken paths, weak explanations, or reader correction requests',
          'screenshots and walkthrough details are refreshed when the live route changes materially',
          'correction requests are reviewed through the contact page and direct email channel'
        ]
      },
      {
        title: 'How content and tools fit together',
        paragraphs: [
          'Dayfiles separates three things clearly: the main publisher site, the editorial workflow guides, and the live product interfaces. The main domain explains the work, while the tools handle the actual task execution.',
          'That structure is intentional. The guides should still be useful as knowledge pages even when a reader is comparing options or deciding whether the Dayfiles tools fit the job.'
        ]
      },
      {
        title: 'What Dayfiles is not',
        list: [
          'not legal advice or regulatory compliance advice',
          'not a managed document service or enterprise support desk',
          'not a generic tool directory with anonymous support content',
          'not a promise that every workflow fits every jurisdiction or sensitive file type'
        ]
      }
    ],
    supportingLinks: [
      { label: `${founderName} profile`, href: `/${founderSlug}/` },
      { label: 'How Dayfiles tests workflows', href: '/how-dayfiles-tests-workflows/' },
      { label: 'How Dayfiles reviews content', href: '/content-review-process/' },
      { label: 'Contact Dayfiles', href: '/contact/' }
    ]
  },
  {
    slug: founderSlug,
    title: `${founderName} | Founder and Editor of Dayfiles`,
    description:
      `Read the public profile for ${founderName}, the founder and editor responsible for Dayfiles publishing, workflow reviews, and the site's PDF and image guidance.`,
    shortTitle: founderName,
    schemaType: 'ProfilePage',
    heroEyebrow: 'Publisher profile',
    h1: founderName,
    heroCopy:
      `${founderName} is the founder, editor, and product operator behind Dayfiles. He is responsible for the public workflow guidance, site review standards, and the way Dayfiles connects editorial explanations to live PDF and image product routes.`,
    highlights: [
      { label: 'Role', value: 'Founder, editor, and publisher of Dayfiles' },
      { label: 'Focus', value: 'PDF delivery, image preparation, browser-first workflow guidance, and public site operations' },
      { label: 'Public responsibility', value: 'Editorial direction, route accuracy, screenshot review, and correction decisions' }
    ],
    sections: [
      {
        title: 'What he is responsible for on Dayfiles',
        paragraphs: [
          `${founderName} owns the public editorial direction of Dayfiles, including article scope, content rewrites, trust-page accuracy, and the connection between the main site and the live product hubs.`,
          'That means the same person responsible for publishing the guides is also responsible for deciding when a page is too weak, too stale, or too unclear to stay promoted.'
        ]
      },
      {
        title: 'What kind of work this background supports',
        paragraphs: [
          'The work on Dayfiles is grounded in browser-first product operations and repeated file workflows rather than abstract software commentary. The strongest pages come from dealing directly with conversion routes, packet assembly, image cleanup, handoff review, and the mistakes that cause avoidable rework.',
          'That is the perspective Dayfiles is built to publish from: practical workflow clarity, not legal opinion and not generic content production.'
        ]
      },
      {
        title: 'How he approaches reviews and rewrites',
        list: [
          'checks whether the live route still matches the public claim',
          'rewrites pages that sound too templated or too thin for the job they claim to solve',
          'refreshes screenshots and trust copy when the visible route or reviewer expectation changes',
          'routes correction and accountability issues through public Dayfiles contact paths'
        ]
      },
      {
        title: 'What this profile should signal to readers',
        paragraphs: [
          'Dayfiles is not published by an anonymous editorial pool. It is a founder-led site with named accountability for what gets published, what gets monetized, and what gets corrected.',
          'That does not mean every workflow is right for every sensitive use case. It does mean there is a visible human owner behind the publishing decisions.'
        ]
      }
    ],
    supportingLinks: [
      { label: 'About Dayfiles', href: '/about/' },
      { label: 'How Dayfiles tests workflows', href: '/how-dayfiles-tests-workflows/' },
      { label: 'Contact Dayfiles', href: '/contact/' }
    ]
  },
  {
    slug: 'contact',
    title: 'Contact Dayfiles | Support, Policy, and Business Questions',
    description:
      'Contact Dayfiles for editorial corrections, privacy requests, technical site issues, advertising questions, or business inquiries related to the site and product hubs.',
    shortTitle: 'Contact',
    schemaType: 'ContactPage',
    heroEyebrow: 'Publisher contact',
    h1: 'Contact Dayfiles',
    heroCopy:
      'Use this page to reach the publisher directly about site issues, editorial corrections, privacy requests, advertising questions, and business communication tied to Dayfiles.',
    highlights: [
      { label: 'Primary contact', value: contactEmail },
      { label: 'Response owner', value: `${founderName} / Dayfiles editorial and site operations` },
      { label: 'Best for', value: 'corrections, privacy questions, technical issues, business inquiries' }
    ],
    contactForm: {
      badge: 'Contact form',
      title: 'Send a message to Dayfiles',
      description:
        'Use the form for editorial corrections, privacy or copyright requests, advertising questions, business inquiries, or technical issues on the public site. Include the page URL and enough context to reproduce the problem or review the claim quickly.',
      topicOptions: [
        'Editorial correction',
        'Privacy or data request',
        'Technical site issue',
        'Advertising or sponsorship',
        'Business or partnership inquiry'
      ],
      helpText:
        `Direct email is monitored at ${contactEmail}. Use it if you prefer your own mail client or need to reference a longer thread.`,
      sidecards: [
        {
          title: 'What gets answered here',
          list: [
            'factual corrections and broken guide paths',
            'privacy, copyright, and content removal requests',
            'technical issues on dayfiles.com pages',
            'advertising and business communication'
          ]
        },
        {
          title: 'What this inbox is not for',
          list: [
            'managed support for files you do not control',
            'enterprise consulting or regulated-document review',
            'debugging unrelated third-party platforms or browser extensions not run by Dayfiles'
          ]
        },
        {
          title: 'Response expectations',
          paragraphs: [
            'Dayfiles aims to review substantive editorial, privacy, and technical site messages within 2 business days.',
            `Messages that need direct owner review are routed to ${founderName}.`
          ]
        }
      ]
    },
    sections: [
      {
        title: 'How to make your message useful',
        list: [
          'include the exact page URL or guide title',
          'say whether the issue is factual, technical, legal, or commercial',
          'describe the problem in terms of what a visitor sees or what needs correction',
          'mention the relevant product hub if the issue is tied to Images, PDF Toolkit, or Everyday Image Studio'
        ]
      },
      {
        title: 'Response scope',
        paragraphs: [
          'Dayfiles is a publisher and product hub, not a managed file-processing service. Responses focus on site content, trust pages, public product entry points, and communication tied directly to Dayfiles-controlled pages.',
          'If a question is really about a third-party platform, a personal file you do not have rights to use, or a regulated workflow that requires professional review, Dayfiles may decline to provide detailed troubleshooting.'
        ]
      }
    ],
    contactEmail,
    supportingLinks: [
      { label: `${founderName} profile`, href: `/${founderSlug}/` },
      { label: 'Privacy Policy', href: '/privacy-policy/' },
      { label: 'Advertising Disclosure', href: '/advertising-disclosure/' }
    ]
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy | Dayfiles',
    description:
      'Read how Dayfiles uses analytics cookies, advertising cookies, third-party scripts, and browser controls across the public site.',
    shortTitle: 'Cookie Policy',
    schemaType: 'WebPage',
    heroEyebrow: 'Cookie policy',
    h1: 'Cookie Policy',
    heroCopy:
      'This page explains how Dayfiles uses cookies and similar technologies for analytics, advertising, and public-site performance across dayfiles.com.',
    highlights: [
      { label: 'Applies to', value: 'dayfiles.com public pages' },
      { label: 'Includes', value: 'analytics cookies, ad-related cookies, and script-triggered measurement' },
      { label: 'Controls', value: 'browser settings, Google controls, and applicable consent tools' }
    ],
    sections: [
      {
        title: 'What Dayfiles uses cookies for',
        paragraphs: [
          'Dayfiles may use cookies or similar browser technologies to understand site visits, improve public-page performance, and support advertising on selected pages.',
          'These technologies are tied to the public site experience and are separate from the browser-based tools themselves, which may have their own product-specific behavior.'
        ]
      },
      {
        title: 'Analytics cookies',
        paragraphs: [
          'Analytics cookies may be used to understand page visits, traffic sources, on-site behavior, and general performance trends across the public website.',
          'That information helps Dayfiles understand which guides are useful, which pages need clearer navigation, and where technical or editorial improvements are needed.'
        ]
      },
      {
        title: 'Advertising cookies and ad-related technologies',
        paragraphs: [
          'On pages where advertising appears, Google AdSense or similar providers may use cookies or related technologies to measure ad delivery, understand performance, and serve ads according to their own policies and controls.',
          'The presence of those technologies does not change the editorial requirement that public pages be understandable and useful on their own.'
        ]
      },
      {
        title: 'Third-party scripts',
        paragraphs: [
          'Dayfiles may load third-party scripts for analytics, advertising, embedded product references, and related measurement on the public site.',
          'Those services may set or read cookies according to their own terms, policies, and regional requirements.'
        ]
      },
      {
        title: 'Browser controls and consent expectations',
        paragraphs: [
          'Visitors can limit or clear cookies through browser settings and can review advertising-related controls available through Google where applicable.',
          'Where regional law or platform requirements apply, Dayfiles expects cookie and advertising behavior to respect the relevant consent expectations for that visitor context.'
        ]
      }
    ],
    supportingLinks: [
      { label: 'Privacy Policy', href: '/privacy-policy/' },
      { label: 'Advertising Disclosure', href: '/advertising-disclosure/' },
      { label: 'Contact Dayfiles', href: '/contact/' }
    ]
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
          'Dayfiles workflow guides are written to explain a specific task, not just repeat a keyword. Articles are built around user intent, real workflow checkpoints, live product context, and the mistakes a reader should catch before acting.',
          'Where appropriate, guides cite primary sources, product pages, operational references, or the site’s own public workflow documentation so readers can verify the logic for themselves.'
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
          'Pages may be updated when products change, when clearer workflow evidence becomes available, when screenshots need refresh, or when errors are reported. Important fixes should be reflected in the visible page content rather than only in metadata.',
          'Readers can request corrections through the Dayfiles contact page if a guide is inaccurate, outdated, materially incomplete, or visually out of date compared with the live route.'
        ]
      },
      {
        title: 'Editorial independence',
        paragraphs: [
          'Advertising, analytics, and product promotion do not override the editorial requirement to make pages understandable and useful on their own. Dayfiles aims to keep the difference between guidance, product navigation, and monetization visible to readers.',
          'When a page links into a Dayfiles tool, that relationship is part of the publisher model and should be understandable from the surrounding content.'
        ]
      }
    ],
    supportingLinks: [
      { label: 'How Dayfiles tests workflows', href: '/how-dayfiles-tests-workflows/' },
      { label: 'How Dayfiles reviews content', href: '/content-review-process/' },
      { label: 'Contact Dayfiles', href: '/contact/' }
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
  },
  {
    slug: 'how-dayfiles-tests-workflows',
    title: 'How Dayfiles Tests PDF and Image Workflows',
    description:
      'See how Dayfiles checks workflow guides, screenshots, live tool routes, and review-ready output standards before publishing or revising public pages.',
    shortTitle: 'How Dayfiles Tests Workflows',
    schemaType: 'WebPage',
    heroEyebrow: 'Editorial proof',
    h1: 'How Dayfiles Tests PDF and Image Workflows',
    heroCopy:
      'This page explains how Dayfiles checks workflow routes, screenshots, output expectations, and public-page clarity before a guide is published or materially revised.',
    highlights: [
      { label: 'Checks cover', value: 'live paths, screenshots, guide logic, and review-ready output expectations' },
      { label: 'Applies to', value: 'PDF, Images, and Everyday Image Studio guides on dayfiles.com' },
      { label: 'Goal', value: 'publish guidance that matches the live route and helps readers avoid preventable mistakes' }
    ],
    sections: [
      {
        title: 'What gets checked on live tools',
        list: [
          'whether the linked route still exists and loads correctly',
          'whether the tool category or task path still matches the guide claim',
          'whether the workflow sequence described on the page still makes sense for the current route',
          'whether the product hub and article links still connect cleanly'
        ]
      },
      {
        title: 'What gets checked on guides',
        paragraphs: [
          'Guides are reviewed for task clarity, step order, risky failure points, and whether the final review checks would actually help a user avoid rework.',
          'The site also checks whether an article is saying something distinct or just repeating a neighboring workflow page with surface-level wording changes.'
        ]
      },
      {
        title: 'Examples of failure types Dayfiles looks for',
        list: [
          'screenshots that no longer match the live route',
          'guide intros that overpromise what the workflow can do',
          'navigation paths that send readers into the wrong product hub',
          'checklists that are too generic to catch real delivery mistakes',
          'pages that read like tool-adjacent filler rather than operational guidance'
        ]
      },
      {
        title: 'When screenshots are refreshed',
        paragraphs: [
          'Screenshots should be refreshed when the visible route changes meaningfully, when the UI no longer supports the explanation on the page, or when the old capture makes the product look incomplete or outdated.',
          'Dayfiles uses screenshots as proof and orientation, not as decorative filler. If a capture stops doing that job, it should be replaced.'
        ]
      },
      {
        title: 'What review-ready means before publishing',
        paragraphs: [
          'A page is review-ready when the route is live, the explanation is specific, the screenshots support the claim, the internal links work, and the page would still be useful if a reader were comparing options rather than immediately using the tool.',
          'That standard is stricter than “the page loads.” It is meant to keep workflow pages from becoming low-information wrappers around product links.'
        ]
      }
    ],
    supportingLinks: [
      { label: 'Content review process', href: '/content-review-process/' },
      { label: 'Editorial Policy', href: '/editorial-policy/' },
      { label: 'About Dayfiles', href: '/about/' }
    ]
  },
  {
    slug: 'content-review-process',
    title: 'How Dayfiles Reviews and Updates Content',
    description:
      'Learn how Dayfiles selects workflow topics, reviews guides, handles updates, chooses sources, and decides when a page should be rewritten or unpublished.',
    shortTitle: 'Content Review Process',
    schemaType: 'WebPage',
    heroEyebrow: 'Editorial proof',
    h1: 'How Dayfiles Reviews and Updates Content',
    heroCopy:
      'This page explains how Dayfiles chooses workflow topics, reviews public guides, updates pages, and decides when an article needs a rewrite rather than a cosmetic refresh.',
    highlights: [
      { label: 'Owned by', value: `${founderName} / Dayfiles editorial` },
      { label: 'Review inputs', value: 'live routes, source checks, screenshots, and clarity of the workflow itself' },
      { label: 'Update triggers', value: 'product changes, weak guidance, corrections, and stale page evidence' }
    ],
    sections: [
      {
        title: 'How topics are selected',
        paragraphs: [
          'Dayfiles prioritizes topics that map to recurring file jobs, product-supported workflows, and high-friction tasks where people are likely to make avoidable mistakes.',
          'The site should not publish a page just because a keyword exists. A topic must justify itself as a useful workflow explanation or decision-support page.'
        ]
      },
      {
        title: 'How guides are reviewed',
        paragraphs: [
          'Guides are reviewed for task specificity, structure, screenshot support, link accuracy, and whether the explanation reflects the real job rather than a generic content template.',
          'Pages that feel too similar to neighboring content should be rewritten, consolidated, or deprioritized rather than left to create low-value-content signals.'
        ]
      },
      {
        title: 'How sources are chosen',
        paragraphs: [
          'Sources are chosen based on whether they help verify a workflow claim, a product route, a technical standard, or a policy-sensitive instruction.',
          'A source block should support the page. It should not exist only to make the article look more legitimate.'
        ]
      },
      {
        title: 'How corrections and updates are handled',
        paragraphs: [
          'When a correction request or stale-content issue is credible, Dayfiles updates the visible page content, not just metadata or hidden notes.',
          'If a guide becomes materially misleading, outdated, or too weak to justify its place in the public archive, it should be rewritten heavily or removed from active promotion.'
        ]
      },
      {
        title: 'What would cause a page to be rewritten or unpublished',
        list: [
          'the product route changed enough that the article no longer matches',
          'the screenshots no longer help a reader orient themselves',
          'the page is too repetitive compared with stronger neighboring content',
          'the article does not add meaningful value beyond routing readers elsewhere',
          'the page creates trust or monetization risk disproportionate to its usefulness'
        ]
      }
    ],
    supportingLinks: [
      { label: 'How Dayfiles tests workflows', href: '/how-dayfiles-tests-workflows/' },
      { label: 'Editorial Policy', href: '/editorial-policy/' },
      { label: 'Contact Dayfiles', href: '/contact/' }
    ]
  },
  {
    slug: 'pdf-workflows',
    title: 'PDF Workflows Hub | How Dayfiles Handles Common Document Jobs',
    description:
      'Use this Dayfiles editorial hub to understand common PDF jobs, choose the right workflow, avoid document-delivery mistakes, and find the best related guides and product routes.',
    shortTitle: 'PDF Workflows',
    schemaType: 'CollectionPage',
    heroEyebrow: 'Editorial hub',
    h1: 'PDF Workflows Hub',
    heroCopy:
      'This page helps readers choose the right PDF workflow before they start clicking tools. It focuses on common document jobs, the mistakes that cause avoidable rework, and the strongest Dayfiles guides for each route.',
    highlights: [
      { label: 'Best for', value: 'document assembly, conversion, signing, cleanup, and final delivery review' },
      { label: 'Start here when', value: 'you know the job but not the right PDF route' },
      { label: 'Related product hub', value: 'PDF Toolkit' }
    ],
    sections: [
      {
        title: 'Start here: what kind of PDF job do you actually have?',
        list: [
          'assembly work such as merge, split, reorder, or page numbering',
          'file-shape work such as compression, conversion, or DOCX round-trips',
          'approval work such as fill, sign, password protection, or controlled handoff',
          'delivery work such as final packet review, naming, and archive-safe export'
        ]
      },
      {
        title: 'Common PDF mistakes that cause avoidable rework',
        paragraphs: [
          'The most expensive mistakes are rarely dramatic. They are usually version confusion, poor packet order, wrong export assumptions, unreviewed signatures, or a final file name that tells the next person nothing useful.',
          'A strong PDF workflow page should stop those mistakes before the file reaches the recipient, not just describe a feature that changes the document.'
        ]
      },
      {
        title: 'Where to start in Dayfiles for PDF work',
        list: [
          'use the PDF Toolkit hub when you need the category overview before choosing a task route',
          'use guide pages when the risky part is the workflow decision, not the button click',
          'use checklists and packet pages when the file must survive review, submission, or handoff'
        ]
      },
      {
        title: 'Core Dayfiles guides for PDF workflows',
        list: [
          'How to Edit a PDF by Converting It to DOCX and Back',
          'PDF Toolkit Checklist for Reliable Document Delivery',
          'PDF Fill and Sign Workflow Guide for Private Teams',
          'Visa Packet PDF Checklist for Clean Final Submission',
          'Employee Onboarding PDF Workflow for Remote HR Teams'
        ]
      },
      {
        title: 'What makes this page useful even if you never open the tool',
        paragraphs: [
          'It gives a decision model: what kind of PDF job you have, what the common risks are, and which review step matters most before the file leaves your hands.',
          'That matters because many readers need workflow clarity before they decide whether Dayfiles is the right tool path at all.'
        ]
      }
    ],
    supportingLinks: [
      { label: 'Open PDF Toolkit', href: '/pdf-toolkit/' },
      { label: 'Read the PDF operations checklist', href: '/blog/pdf-operations-checklist/' },
      { label: 'Read the PDF-to-Word workflow', href: '/guides/how-to-convert-pdf-to-word-without-uploading/' },
      { label: 'Choose a document delivery format', href: '/document-delivery-formats/' },
      { label: 'Avoid packet rejection mistakes', href: '/application-packet-mistakes/' }
    ]
  },
  {
    slug: 'image-workflows',
    title: 'Image Workflows Hub | How Dayfiles Handles Cleanup, Conversion, and Submission Prep',
    description:
      'Use this Dayfiles editorial hub to understand common image jobs, choose the right workflow, avoid image-prep mistakes, and find the best related guides and product routes.',
    shortTitle: 'Image Workflows',
    schemaType: 'CollectionPage',
    heroEyebrow: 'Editorial hub',
    h1: 'Image Workflows Hub',
    heroCopy:
      'This page helps readers choose the right image workflow before they jump into a tool. It focuses on conversion, cleanup, compliance-sensitive prep, and the checks that matter before an image is uploaded, submitted, or shared.',
    highlights: [
      { label: 'Best for', value: 'image conversion, resizing, cleanup, blur, background removal, and submission prep' },
      { label: 'Start here when', value: 'you know the outcome you need but not the safest route' },
      { label: 'Related product hubs', value: 'Images and Everyday Image Studio' }
    ],
    sections: [
      {
        title: 'Start here: which kind of image job are you doing?',
        list: [
          'format work such as JPG conversion or delivery normalization',
          'size work such as resize or compression for uploads and listings',
          'cleanup work such as background removal or face blur before sharing',
          'compliance-sensitive prep such as passport, visa, or ID photo review'
        ]
      },
      {
        title: 'Common image-prep mistakes that create rejection or rework',
        paragraphs: [
          'Image work breaks when people edit before they confirm the destination rule, overwrite the source file, flatten the wrong asset, or assume a cleaner-looking export is automatically a compliant one.',
          'A useful image workflow page should make those decision errors visible before the export, not after the upload fails.'
        ]
      },
      {
        title: 'Where to start in Dayfiles for image work',
        list: [
          'use Images when you need broader image conversion, resizing, compression, or cleanup routes',
          'use Everyday Image Studio when the job is more workflow-sensitive and tied to repeated image preparation or review discipline',
          'use the guides when the risky part is the decision sequence rather than the edit itself'
        ]
      },
      {
        title: 'Core Dayfiles guides for image workflows',
        list: [
          'How to Convert Images to JPG for Consistent Delivery',
          'How to Resize Images in Bulk for Listings and Uploads',
          'How to Compress Images in Bulk Before Upload Deadlines',
          'How to Remove Backgrounds from Product Photos Fast',
          'How to Blur Faces Before Sharing Sensitive Photos Online'
        ]
      },
      {
        title: 'What makes this page useful even without the tools',
        paragraphs: [
          'It helps readers identify the real job, the likely failure mode, and the right review criteria before they commit to an edit route.',
          'That makes the page valuable as an editorial decision guide, not just a product index.'
        ]
      }
    ],
    supportingLinks: [
      { label: 'Open Images', href: '/images/' },
      { label: 'Open Everyday Image Studio', href: '/everyday-image-studio/' },
      { label: 'Read the image format delivery guide', href: '/blog/convert-heic-png-and-webp-for-easier-delivery/' },
      { label: 'Prepare compliance-sensitive images', href: '/compliance-sensitive-image-prep/' }
    ]
  },
  {
    slug: 'document-delivery-formats',
    title: 'Document Delivery Formats | Choosing the Right Output Before You Send',
    description:
      'Use this Dayfiles editorial page to choose the right delivery format before you send a document, archive a packet, or hand a file to a reviewer.',
    shortTitle: 'Document Delivery Formats',
    schemaType: 'WebPage',
    heroEyebrow: 'Editorial guide',
    h1: 'Choosing the Right Document Delivery Format',
    heroCopy:
      'This page helps readers decide whether a file should stay as PDF, move through DOCX, export to JPG, or be prepared another way before delivery, review, or archive handoff.',
    highlights: [
      { label: 'Best for', value: 'document delivery, archive planning, review handoffs, and format decisions before submission' },
      { label: 'Focus', value: 'matching the output format to the real destination rather than using whatever export is easiest' },
      { label: 'Use with', value: 'PDF workflows, image workflows, and submission-sensitive guides across Dayfiles' }
    ],
    sections: [
      {
        title: 'Start with the destination, not the tool',
        paragraphs: [
          'The right delivery format depends on what happens next. A portal upload, a client review, an archive handoff, and an internal editing round all want different things from the file.',
          'People create avoidable rework when they choose the export route first and only discover the destination rule after the file has already been shared.'
        ]
      },
      {
        title: 'When PDF is usually the right final format',
        list: [
          'the file needs layout stability across devices',
          'the recipient should not be editing the content directly',
          'the handoff involves signatures, formal review, or packet assembly',
          'the archive copy needs to preserve page order and presentation'
        ]
      },
      {
        title: 'When a DOCX round-trip is worth it',
        paragraphs: [
          'A DOCX route makes sense when the real job is content editing, not final delivery. It is useful when text still needs revision, comments need to be resolved, or the layout can be cleaned up before a final export.',
          'It stops making sense when teams leave the editable file loose in the handoff chain and forget to lock the final PDF version afterward.'
        ]
      },
      {
        title: 'When image exports help and when they hurt',
        paragraphs: [
          'JPG or image exports are useful when a portal or workflow needs image-based pages, lightweight previews, or visual fragments from a document.',
          'They are the wrong choice when the recipient needs searchable text, editable content, or a formal packet that must preserve multi-page structure.'
        ]
      },
      {
        title: 'Questions to answer before you export anything',
        list: [
          'Will the next person read this, edit this, archive this, or upload this?',
          'Does the destination have a format rule, size cap, or layout expectation?',
          'Will anyone need the editable source after the delivery copy is sent?',
          'Which version will count as the final record if several formats exist?'
        ]
      }
    ],
    supportingLinks: [
      { label: 'PDF Workflows Hub', href: '/pdf-workflows/' },
      { label: 'Image Workflows Hub', href: '/image-workflows/' },
      { label: 'Read the PDF-to-Word workflow', href: '/guides/how-to-convert-pdf-to-word-without-uploading/' }
    ]
  },
  {
    slug: 'application-packet-mistakes',
    title: 'Application Packet Mistakes | What Gets Packets Rejected or Sent Back',
    description:
      'Read this Dayfiles editorial guide to catch the packet mistakes that cause application files to be rejected, delayed, or sent back for corrections.',
    shortTitle: 'Application Packet Mistakes',
    schemaType: 'WebPage',
    heroEyebrow: 'Editorial guide',
    h1: 'Application Packet Mistakes That Cause Preventable Rework',
    heroCopy:
      'This page focuses on the mistakes that send application packets back for correction: wrong file order, wrong version control, unreadable exports, and missing review discipline before submission.',
    highlights: [
      { label: 'Best for', value: 'visa packets, scholarship files, onboarding bundles, and formal submission sets' },
      { label: 'Main risk', value: 'rejection caused by avoidable packaging and review mistakes rather than the underlying content itself' },
      { label: 'Use with', value: 'PDF checklist pages, form-filling guides, and final delivery reviews' }
    ],
    sections: [
      {
        title: 'Most packet failures are process failures',
        paragraphs: [
          'Many packet problems are not caused by missing effort. They are caused by rushing the final packaging sequence. The file opens, so it feels finished, even though the wrong version, wrong order, or wrong naming scheme is already baked in.',
          'That is why packet review has to look beyond whether a single page appears correct.'
        ]
      },
      {
        title: 'The most common packet mistakes',
        list: [
          'mixing draft and final files in the same working folder',
          'submitting pages in the wrong order or with missing supporting pages',
          'compressing the packet until text, seals, or signatures become hard to trust',
          'using vague file names that do not tell the next reviewer what is final',
          'filling or signing the wrong copy of a form before the packet is frozen'
        ]
      },
      {
        title: 'What to check before the packet leaves your hands',
        paragraphs: [
          'Confirm the source of truth, the final order, the destination constraints, and whether each page belongs in the delivery copy or only in the archive. Then read the output like a reviewer who has never seen your working folder.',
          'That shift matters because packet quality is judged from the outside. The recipient does not care that the draft folder was confusing. They only see the final result.'
        ]
      },
      {
        title: 'Where Dayfiles fits into packet work',
        paragraphs: [
          'Dayfiles is strongest when it helps you sequence the packet deliberately: fill the form, sign the approved version, merge the right pages, compress only if needed, and run one final review before upload or delivery.',
          'The tools matter, but the discipline between the tools matters more.'
        ]
      }
    ],
    supportingLinks: [
      { label: 'PDF Toolkit Checklist for Reliable Document Delivery', href: '/blog/pdf-operations-checklist/' },
      { label: 'PDF Workflows Hub', href: '/pdf-workflows/' },
      { label: 'PDF Workflows Hub', href: '/pdf-workflows/' }
    ]
  },
  {
    slug: 'compliance-sensitive-image-prep',
    title: 'Compliance-Sensitive Image Prep | What to Check Before Submission',
    description:
      'Use this Dayfiles editorial guide to prepare compliance-sensitive images more carefully before passport, visa, ID, or other submission-driven workflows.',
    shortTitle: 'Compliance-Sensitive Image Prep',
    schemaType: 'WebPage',
    heroEyebrow: 'Editorial guide',
    h1: 'Compliance-Sensitive Image Prep',
    heroCopy:
      'This page explains how to treat image work more carefully when a submission rule matters. The goal is not to over-edit the file. It is to avoid preventable rejection by reviewing the right things in the right order.',
    highlights: [
      { label: 'Best for', value: 'passport, visa, ID, onboarding, and other rule-bound image submissions' },
      { label: 'Main risk', value: 'visual cleanup that accidentally breaks the destination requirement' },
      { label: 'Use with', value: 'image conversion, resize, cleanup, and compliance-related review guides' }
    ],
    sections: [
      {
        title: 'Why compliance-sensitive image work needs a different mindset',
        paragraphs: [
          'When the image is headed toward a rule-bound destination, a cleaner-looking file is not automatically a safer file. The real question is whether the image still matches the destination standard after the edit.',
          'That means the best workflow is usually conservative. Confirm the requirement first, make the minimum necessary change, then review the output against the destination rule.'
        ]
      },
      {
        title: 'Mistakes that cause avoidable rejection',
        list: [
          'cropping before you verify the required framing',
          'compressing too early and losing detail that matters in review',
          'removing or flattening the background in a way the destination does not accept',
          'editing the only source file instead of keeping an untouched original',
          'assuming one portal or country standard applies everywhere'
        ]
      },
      {
        title: 'A safer review sequence',
        list: [
          'confirm the destination rule and required output format',
          'keep the original image untouched in a separate source folder',
          'make only the adjustment that solves the actual requirement gap',
          'review dimensions, framing, background, and visible clarity before export',
          'label the export so nobody mistakes it for the untouched source'
        ]
      },
      {
        title: 'What Dayfiles should help you do here',
        paragraphs: [
          'Dayfiles should help you slow down in the right place: before export, when it is still easy to catch an over-edit, a wrong crop, or an output mismatch that would cause rejection later.',
          'The right tool route only matters if the review criteria stay visible all the way to the handoff.'
        ]
      }
    ],
    supportingLinks: [
      { label: 'Image Workflows Hub', href: '/image-workflows/' },
      { label: 'Image Workflows Hub', href: '/image-workflows/' },
      { label: 'Passport photo and PDF packet workflow', href: '/blog/passport-photo-to-final-pdf-packet/' }
    ]
  }
];

export function getTrustPageBySlug(slug) {
  return trustPages.find((page) => page.slug === slug) || null;
}
