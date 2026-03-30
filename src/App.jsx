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

const guideStandards = [
  {
    name: 'Real workflow examples',
    description: 'Guides focus on concrete file jobs, common failure points, and the checks people actually need before they upload, share, or archive.'
  },
  {
    name: 'Visible tool context',
    description: 'Each guide points back to the relevant Dayfiles product hub so readers can move from the explanation to the live tool path without guessing.'
  },
  {
    name: 'Release-ready checklists',
    description: 'The best pages include practical review steps, screenshots, and handoff guidance so the output is easier to trust the first time.'
  }
];

const workflows = [
  'Start from the right product hub for the job',
  'Run the edit, conversion, or packaging step once',
  'Review the output before it reaches the next person'
];

const extensionLink =
  'https://chromewebstore.google.com/detail/everyday-image-studio/cpcfdmaihaccamacobbfnfngefmdphfp/reviews?utm_source=item-share-cp';
const extensionBannerStorageKey = 'dayfiles_extension_banner_dismissed_v1';
const themeStorageKey = 'dayfiles_theme';
const themeOptions = new Set(['system', 'light', 'dark']);
const navigationLinks = [
  { label: 'Blog', href: '/blog/' },
  { label: 'Chrome Extension', href: extensionLink, external: true },
  { label: 'Everyday Image Studio', href: '/everyday-image-studio/' },
  { label: 'Images', href: '/images/' },
  { label: 'PDF Toolkit', href: '/pdf-toolkit/' }
];
const heroActions = [
  {
    label: 'Explore Image Studio',
    href: '/everyday-image-studio/',
    note: 'See the workflow hub, current use cases, and the live app path.'
  },
  {
    label: 'Browse Workflow Guides',
    href: '/blog/',
    note: 'Read task-first guides that explain what to check before delivery.'
  },
  {
    label: 'Open PDF Toolkit',
    href: '/pdf-toolkit/',
    note: 'Start with the product hub before jumping into the live PDF tool.'
  }
];
const heroAnswerCards = [
  {
    title: 'What is Dayfiles?',
    copy:
      'Dayfiles is a browser-first file workflow site for image editing, image conversion, compression, and PDF operations. It combines live tools with practical guides for people who need clean outputs fast.'
  },
  {
    title: 'What can you do here?',
    copy:
      'You can open live apps for PDF work, workflow-focused image editing, and broader image processing. You can also follow guides that explain when to use each route and what to verify before delivery.'
  },
  {
    title: 'Why do the guides matter?',
    copy:
      'The guides are built to help users avoid rework. They show the job, the risky points, and the final review checks so a file is easier to trust when it leaves your hands.'
  }
];
const trustLinks = [
  { label: 'About Dayfiles', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Editorial Policy', href: '/editorial-policy/' },
  { label: 'Advertising Disclosure', href: '/advertising-disclosure/' },
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms of Service', href: '/terms/' }
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
      {showExtensionBanner && (
        <aside className="extension-banner" aria-label="Chrome extension promotion">
          <p>
            New: Install the <strong>Everyday Image Studio Chrome Extension</strong> for faster image workflows.
          </p>
          <div className="extension-banner-actions">
            <a href={extensionLink} target="_blank" rel="noreferrer">
              Download extension
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
          <p className="eyebrow">File stack for modern teams</p>
          <h1>Free Online Image and PDF Tools with No Account Required</h1>
          <p className="hero-copy">
            Dayfiles gives you free tools for workflow-focused image editing, broader image processing, and PDF work,
            with no account required and no setup before you start.
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

        <section className="hero-answer-grid" aria-label="Dayfiles overview">
          {heroAnswerCards.map((card) => (
            <article key={card.title} className="hero-answer-card">
              <h2>{card.title}</h2>
              <p>{card.copy}</p>
            </article>
          ))}
        </section>

        <section className="panel products" aria-label="Live products">
          <div className="section-heading">
            <h2>Free Tools Available Now</h2>
            <p>Production-ready image workflow, image toolbox, and PDF tools you can use immediately.</p>
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
            <h2>Image and PDF Workflow Guides</h2>
            <p>Practical guides for repeated file jobs, with real workflow checkpoints and product-specific next steps.</p>
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

        <section className="panel beta" aria-label="Editorial standards">
          <div className="section-heading">
            <h2>Why readers come back to Dayfiles</h2>
            <p>Helpful workflow pages need more than feature lists. They need clear examples, visible tool routes, and better release guidance.</p>
          </div>
          <div className="card-grid">
            {guideStandards.map((feature) => (
              <article key={feature.name} className="card beta-card">
                <div className="badge beta-badge">Editorial</div>
                <h3>{feature.name}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel flow" aria-label="Workflow">
          <div className="section-heading">
            <h2>How teams use Dayfiles</h2>
          </div>
          <ol>
            {workflows.map((workflow) => (
              <li key={workflow}>{workflow}</li>
            ))}
          </ol>
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

        <section className="panel trust" aria-label="Trust and policy pages">
          <div className="section-heading">
            <h2>Trust, Editorial, and Policy Pages</h2>
            <p>Use these pages to verify who runs the site, how content is reviewed, and how Dayfiles handles privacy, advertising, and contact requests.</p>
          </div>
          <div className="card-grid">
            {trustLinks.map((link) => (
              <article key={link.href} className="card">
                <h3>{link.label}</h3>
                <p>Open the page for Dayfiles publisher details, editorial standards, legal terms, or contact information.</p>
                <a href={link.href}>Open {link.label}</a>
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
          <a href="/contact/">
            Contact
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
