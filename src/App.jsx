import { useEffect, useState } from 'react';
import SubscribeSection from './components/SubscribeSection';

const liveProducts = [
  {
    title: 'Everyday Image Studio',
    subtitle: 'Smart image workflows for teams and creators',
    href: '/everyday-image-studio/',
    state: 'Live'
  },
  {
    title: 'Images',
    subtitle: 'Broader image editing, conversion, and cleanup in one toolbox',
    href: '/images/',
    state: 'Live'
  },
  {
    title: 'PDF Toolkit',
    subtitle: 'Merge, compress, convert, and ship clean docs',
    href: '/pdf-toolkit/',
    state: 'Live'
  }
];

const credibilityFacts = [
  {
    name: 'Founder-led publishing',
    description: 'Dayfiles is run by Shuvo Habib, who owns the editorial direction, product framing, and final publishing decisions.'
  },
  {
    name: 'Live-route review',
    description: 'Guides are checked against current product hubs, route logic, screenshots, and the handoff risks readers need to catch.'
  },
  {
    name: 'Workflow-first editorial model',
    description: 'The site publishes decision guides, checklists, and tool-backed workflow explanations rather than keyword filler or anonymous support content.'
  }
];

const flagshipWorkflows = [
  {
    title: 'PDF delivery and packet workflows',
    description:
      'Use editorial guidance first when the job is document assembly, conversion, form completion, signing, or final handoff review.',
    href: '/pdf-workflows/',
    cta: 'Start with PDF workflows'
  },
  {
    title: 'Image cleanup and submission prep',
    description:
      'Use image workflows when the job is format conversion, resizing, compression, background cleanup, face blur, or compliance-sensitive prep.',
    href: '/image-workflows/',
    cta: 'Start with image workflows'
  },
  {
    title: 'Review-heavy file work',
    description:
      'Use the blog when you need task-specific guidance, review checklists, and public explanations that make risky file work easier to trust.',
    href: '/blog/',
    cta: 'Browse workflow guides'
  }
];

const authorityPages = [
  {
    title: 'Shuvo Habib',
    description: 'See the named founder and editor responsible for Dayfiles publishing, workflow reviews, and public accountability.',
    href: '/shuvo-habib/'
  },
  {
    title: 'About Dayfiles',
    description: 'See who runs the site, how it is published, and what Dayfiles is responsible for.',
    href: '/about/'
  },
  {
    title: 'How Dayfiles tests workflows',
    description: 'Review the live-route, screenshot, and review-ready checks used before public pages are published or refreshed.',
    href: '/how-dayfiles-tests-workflows/'
  },
  {
    title: 'How Dayfiles reviews content',
    description: 'See how topics are chosen, how guides are updated, and what would cause a page to be rewritten or removed.',
    href: '/content-review-process/'
  }
];

const editorialResourcePages = [
  {
    title: 'Choosing the right document delivery format',
    description: 'Use this page before you decide whether the file should stay as PDF, move through DOCX, or export another way.',
    href: '/document-delivery-formats/'
  },
  {
    title: 'Application packet mistakes that cause rework',
    description: 'Catch the packet failures that send files back for correction, delay, or outright rejection.',
    href: '/application-packet-mistakes/'
  },
  {
    title: 'Compliance-sensitive image prep',
    description: 'Slow down the risky part of image work when a passport, visa, ID, or onboarding rule matters.',
    href: '/compliance-sensitive-image-prep/'
  }
];

const trustLinks = [
  { label: 'About Dayfiles', href: '/about/', description: 'Founder, publisher identity, and how the site is run.' },
  { label: 'Shuvo Habib', href: '/shuvo-habib/', description: 'Named founder and editor responsible for Dayfiles publishing and review standards.' },
  { label: 'Contact', href: '/contact/', description: 'Direct contact for corrections, privacy requests, technical issues, and business questions.' },
  { label: 'Cookie Policy', href: '/cookies/', description: 'How Dayfiles uses analytics, advertising, and browser-based tracking technologies.' },
  { label: 'Editorial Policy', href: '/editorial-policy/', description: 'How workflow guides are written, updated, and kept separate from monetization.' },
  { label: 'Advertising Disclosure', href: '/advertising-disclosure/', description: 'How advertising supports the site and how ads are kept separate from editorial content.' },
  { label: 'Privacy Policy', href: '/privacy-policy/', description: 'What data may be collected on the public site and how public pages are operated.' },
  { label: 'Terms of Service', href: '/terms/', description: 'The usage rules, limitations, and responsibilities tied to the public site.' },
  { label: 'Document Delivery Formats', href: '/document-delivery-formats/', description: 'How to choose the right output before delivery, review, or archive handoff.' },
  { label: 'Application Packet Mistakes', href: '/application-packet-mistakes/', description: 'The common packet failures that cause avoidable rejection or delay.' },
  { label: 'Compliance-Sensitive Image Prep', href: '/compliance-sensitive-image-prep/', description: 'What to check before exporting images into rule-bound submission workflows.' }
];

const extensionLink =
  'https://chromewebstore.google.com/detail/everyday-image-studio/cpcfdmaihaccamacobbfnfngefmdphfp/reviews?utm_source=item-share-cp';
const extensionBannerStorageKey = 'dayfiles_extension_banner_dismissed_v1';
const themeStorageKey = 'dayfiles_theme';
const themeOptions = new Set(['system', 'light', 'dark']);
const navigationLinks = [
  { label: 'Blog', href: '/blog/' },
  { label: 'PDF Workflows', href: '/pdf-workflows/' },
  { label: 'Image Workflows', href: '/image-workflows/' },
  { label: 'Workflow Standards', href: '/content-review-process/' },
  { label: 'Chrome Extension', href: extensionLink, external: true }
];
const heroActions = [
  {
    label: 'Start with PDF Workflows',
    href: '/pdf-workflows/',
    note: 'Choose the right document route before you jump into a tool.'
  },
  {
    label: 'Start with Image Workflows',
    href: '/image-workflows/',
    note: 'Find the safest image path for cleanup, conversion, and submission prep.'
  },
  {
    label: 'Meet the Publisher',
    href: '/about/',
    note: 'See who runs Dayfiles and how workflow pages are reviewed.'
  }
];
const heroAnswerCards = [
  {
    title: 'Who Dayfiles is for',
    copy:
      'Dayfiles is for people doing real file work: applicants, HR teams, operations teams, creators, and anyone who needs cleaner PDF and image outputs without heavyweight setup.'
  },
  {
    title: 'What problems it solves',
    copy:
      'The site explains how to choose the right route for document assembly, signing, conversion, image cleanup, submission prep, and final review before a file gets shared or uploaded.'
  },
  {
    title: 'Why the guidance is trustworthy',
    copy:
      'Dayfiles ties public guides to live product paths, screenshot checks, and explicit review criteria so the content is useful even before a reader decides to use the tools.'
  }
];

const faqs = [
  {
    question: 'What is Dayfiles used for?',
    answer:
      'Dayfiles is used for browser-based image editing, image conversion, PDF cleanup, and file-handling workflows that need a clearer handoff.'
  },
  {
    question: 'Which Dayfiles tools are live today?',
    answer:
      'Everyday Image Studio, Images, and PDF Toolkit are live products. You can access them directly from dayfiles.com.'
  },
  {
    question: 'What makes the guides useful?',
    answer:
      'The strongest guides stay close to real tasks, show the relevant product route, and explain the checks that matter before a file is shared, submitted, or archived.'
  }
];

export default function App() {
  const [showExtensionBanner, setShowExtensionBanner] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.localStorage.getItem(extensionBannerStorageKey) !== 'true';
  });
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [themePreference, setThemePreference] = useState('system');
  const [resolvedTheme, setResolvedTheme] = useState('dark');
  const [blogPosts, setBlogPosts] = useState([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const getSystemTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const resolveTheme = (preference) => {
    if (preference === 'light' || preference === 'dark') {
      return preference;
    }
    return getSystemTheme();
  };

  const applyThemePreference = (preference, persist = false) => {
    const resolved = resolveTheme(preference);
    document.documentElement.setAttribute('data-theme', resolved);
    setThemePreference(preference);
    setResolvedTheme(resolved);
    if (persist) {
      window.localStorage.setItem(themeStorageKey, preference);
    }
  };

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    const attrTheme = document.documentElement.getAttribute('data-theme');

    let initialPreference = 'system';
    if (themeOptions.has(storedTheme)) {
      initialPreference = storedTheme;
    } else if (attrTheme === 'light' || attrTheme === 'dark') {
      initialPreference = attrTheme;
    }

    applyThemePreference(initialPreference, false);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onThemeChange = () => {
      if (themePreference === 'system') {
        applyThemePreference('system', false);
      }
    };

    media.addEventListener('change', onThemeChange);
    return () => media.removeEventListener('change', onThemeChange);
  }, [themePreference]);

  useEffect(() => {
    const onScroll = () => {
      setIsHeaderScrolled(window.scrollY > 10);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileNavOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    let mounted = true;
    fetch('/blog-index.json')
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setBlogPosts(data);
        }
      })
      .catch(() => {
        if (mounted) {
          setBlogPosts([]);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const dismissExtensionBanner = () => {
    window.localStorage.setItem(extensionBannerStorageKey, 'true');
    setShowExtensionBanner(false);
  };

  const onThemeToggle = () => {
    const nextPreference = resolvedTheme === 'dark' ? 'light' : 'dark';
    applyThemePreference(nextPreference, true);
  };

  const openMobileNav = () => {
    setMobileNavOpen(true);
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

      return (
    <div className="site-shell">
      <header className={`topbar${isHeaderScrolled ? ' topbar-scrolled' : ''}`}>
        <button type="button" className="hamburger-button" aria-label="Open navigation menu" onClick={openMobileNav}>
          <span />
          <span />
          <span />
        </button>
        <a className="brand" href="#home">
          <img src="/dayfiles-logo.svg" alt="Dayfiles logo" />
          <span>dayfiles.com</span>
        </a>
        <div className="header-links">
          <button
            type="button"
            className={`theme-toggle${resolvedTheme === 'dark' ? ' is-dark' : ' is-light'}`}
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
            aria-pressed={resolvedTheme === 'dark'}
            onClick={onThemeToggle}
          >
            <span className="theme-toggle-label">{resolvedTheme === 'dark' ? 'Dark' : 'Light'}</span>
            <span className="theme-toggle-switch" aria-hidden="true">
              <span className="theme-toggle-knob" />
            </span>
          </button>
          {navigationLinks.map((item, index) => (
            <a
              key={item.href}
              className={index === navigationLinks.length - 1 ? 'header-cta' : 'header-link'}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>
      </header>

      <div
        className={`mobile-nav-overlay${mobileNavOpen ? ' is-open' : ''}`}
        aria-hidden={mobileNavOpen ? 'false' : 'true'}
        onClick={closeMobileNav}
      >
        <aside
          className={`mobile-nav-drawer${mobileNavOpen ? ' is-open' : ''}`}
          aria-label="Mobile navigation"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mobile-nav-header">
            <span>Menu</span>
            <button type="button" className="mobile-nav-close" aria-label="Close navigation menu" onClick={closeMobileNav}>
              ×
            </button>
          </div>
          <button
            type="button"
            className={`theme-toggle mobile-theme-toggle${resolvedTheme === 'dark' ? ' is-dark' : ' is-light'}`}
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
            aria-pressed={resolvedTheme === 'dark'}
            onClick={onThemeToggle}
          >
            <span className="theme-toggle-label">{resolvedTheme === 'dark' ? 'Dark' : 'Light'}</span>
            <span className="theme-toggle-switch" aria-hidden="true">
              <span className="theme-toggle-knob" />
            </span>
          </button>
          <nav className="mobile-nav-links">
            {navigationLinks.map((item) => (
              <a
                key={item.href}
                className="mobile-nav-link"
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                onClick={closeMobileNav}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
      </div>

      <main id="home">
        <section className="hero">
          <p className="eyebrow">Founder-led workflow publisher</p>
          <h1>Dayfiles helps people finish risky PDF and image work with clearer guidance and lighter tools.</h1>
          <p className="hero-copy">
            Dayfiles publishes browser-first workflow guides for PDF delivery, image preparation, and review-heavy file
            jobs. The site combines editorial decision support with live product hubs so readers can understand the job
            before they choose a tool path.
          </p>
          <div className="hero-actions">
            {heroActions.map((action) => (
              <div key={action.label} className="hero-action-card">
                <a href={action.href}>{action.label}</a>
                <p className="hero-action-note">{action.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="credibility-strip" aria-label="Publisher credibility">
          {credibilityFacts.map((fact) => (
            <article key={fact.name} className="credibility-item">
              <h2>{fact.name}</h2>
              <p>{fact.description}</p>
            </article>
          ))}
        </section>

        <section className="hero-answer-grid" aria-label="Dayfiles overview">
          {heroAnswerCards.map((card) => (
            <article key={card.title} className="hero-answer-card">
              <h2>{card.title}</h2>
              <p>{card.copy}</p>
            </article>
          ))}
        </section>

        <section className="panel workflows" aria-label="Flagship workflow paths">
          <div className="section-heading">
            <h2>Start with the right workflow path</h2>
            <p>Dayfiles should help you choose the job path first, then the product route second.</p>
          </div>
          <div className="card-grid">
            {flagshipWorkflows.map((workflow) => (
              <article key={workflow.title} className="card">
                <div className="badge">Start here</div>
                <h3>{workflow.title}</h3>
                <p>{workflow.description}</p>
                <a href={workflow.href}>
                  {workflow.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="panel editorial-proof" aria-label="Editorial proof">
          <div className="section-heading">
            <h2>How Dayfiles earns trust</h2>
            <p>These pages explain who runs the site, how workflow pages are checked, and how public content gets reviewed and corrected.</p>
          </div>
          <div className="card-grid">
            {authorityPages.map((page) => (
              <article key={page.href} className="card">
                <div className="badge beta-badge">Editorial proof</div>
                <h3>{page.title}</h3>
                <p>{page.description}</p>
                <a href={page.href}>Open {page.title}</a>
              </article>
            ))}
          </div>
        </section>

        <section className="panel editorial-proof" aria-label="Editorial resources">
          <div className="section-heading">
            <h2>Cornerstone editorial resources</h2>
            <p>These are decision pages first. They should still help even if you never open a Dayfiles tool.</p>
          </div>
          <div className="card-grid">
            {editorialResourcePages.map((page) => (
              <article key={page.href} className="card">
                <div className="badge beta-badge">Guide</div>
                <h3>{page.title}</h3>
                <p>{page.description}</p>
                <a href={page.href}>Open {page.title}</a>
              </article>
            ))}
          </div>
        </section>

        {showExtensionBanner && (
          <aside className="extension-banner panel" aria-label="Chrome extension promotion">
            <p>
              Optional product add-on: install the <strong>Everyday Image Studio Chrome Extension</strong> if you already
              use the image workflow tools and want quicker access from the browser.
            </p>
            <div className="extension-banner-actions">
              <a href={extensionLink} target="_blank" rel="noreferrer">
                View extension
              </a>
              <button
                type="button"
                className="extension-banner-close"
                aria-label="Dismiss extension banner"
                onClick={dismissExtensionBanner}
              >
                ×
              </button>
            </div>
          </aside>
        )}

        <section className="panel products" aria-label="Live products">
          <div className="section-heading">
            <h2>Live product hubs</h2>
            <p>Once the workflow is clear, use these product hubs to move into the actual tool route.</p>
          </div>
          <div className="card-grid">
            {liveProducts.map((product) => (
              <article key={product.title} className="card">
                <div className="badge">{product.state}</div>
                <h3>{product.title}</h3>
                <p>{product.subtitle}</p>
                <a href={product.href} target={product.external ? '_blank' : undefined} rel={product.external ? 'noreferrer' : undefined}>
                  Visit {product.title}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="panel blog" aria-label="Latest blog posts">
          <div className="section-heading">
            <h2>Recent workflow guides</h2>
            <p>Task-first pages that explain what to check before delivery, submission, or archive handoff.</p>
          </div>
          <div className="card-grid">
            {blogPosts.slice(0, 3).map((post) => (
              <article key={post.slug} className="card">
                <div className="badge">{post.product === 'pdf' ? 'PDF' : post.product === 'images' ? 'Images' : 'Image'}</div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <a href={`/blog/${post.slug}/`}>Read post</a>
              </article>
            ))}
          </div>
          <p className="blog-cta">
            <a href="/blog/">View all blog posts</a>
          </p>
        </section>

        <section className="panel beta" aria-label="Publisher trust pages">
          <div className="section-heading">
            <h2>Publisher, policy, and accountability pages</h2>
            <p>These pages should make it obvious who is responsible for Dayfiles, how the site is operated, and how ads, privacy, and corrections are handled.</p>
          </div>
          <div className="card-grid">
            {trustLinks.map((link) => (
              <article key={link.href} className="card beta-card">
                <div className="badge beta-badge">Trust</div>
                <h3>{link.label}</h3>
                <p>{link.description}</p>
                <a href={link.href}>Open {link.label}</a>
              </article>
            ))}
          </div>
        </section>

        <section className="panel faq" aria-label="Frequently asked questions">
          <div className="section-heading">
            <h2>Frequently Asked Questions About Dayfiles</h2>
            <p>Answers about free usage, no-account access, and product availability.</p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq) => (
              <article key={faq.question} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

      </main>

      <SubscribeSection />

      <footer className="footer">
        <p>Dayfiles helps people move from raw files to cleaner, review-ready outputs without heavyweight setup.</p>
        <div>
          <a href="/everyday-image-studio/">
            Image Studio
          </a>
          <a href="/pdf-toolkit/">
            PDF Toolkit
          </a>
          <a href="/about/">
            About
          </a>
          <a href="/shuvo-habib/">
            Shuvo Habib
          </a>
          <a href="/contact/">
            Contact
          </a>
          <a href="/cookies/">
            Cookies
          </a>
          <a href="/how-dayfiles-tests-workflows/">
            Workflow Testing
          </a>
          <a href="/content-review-process/">
            Content Review
          </a>
          <a href="/pdf-workflows/">
            PDF Workflows
          </a>
          <a href="/image-workflows/">
            Image Workflows
          </a>
          <a href="/document-delivery-formats/">
            Document Delivery Formats
          </a>
          <a href="/application-packet-mistakes/">
            Application Packet Mistakes
          </a>
          <a href="/compliance-sensitive-image-prep/">
            Compliance-Sensitive Image Prep
          </a>
          <a href="/editorial-policy/">
            Editorial Policy
          </a>
          <a href="/advertising-disclosure/">
            Advertising Disclosure
          </a>
          <a href="/privacy-policy/">
            Privacy Policy
          </a>
          <a href="/terms/">
            Terms
          </a>
        </div>
      </footer>
    </div>
  );
}
