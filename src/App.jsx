import { useEffect, useState } from 'react';

const liveProducts = [
  {
    title: 'Everyday Image Studio',
    subtitle: 'Smart image workflows for teams and creators',
    href: '/everyday-image-studio',
    state: 'Live'
  },
  {
    title: 'PDF Toolkit',
    subtitle: 'Merge, compress, convert, and ship clean docs',
    href: '/pdf-toolkit',
    state: 'Live'
  }
];

const betaFeatures = [
  {
    name: 'File Copilot',
    description: 'Ask for edits in plain language and generate ready-to-share files in seconds.'
  },
  {
    name: 'Shared Workspaces',
    description: 'Keep all versions, comments, and exports in one place for your whole team.'
  },
  {
    name: 'Smart File Tags',
    description: 'Auto-tag incoming files by content so search and sorting stay fast at scale.'
  }
];

const workflows = [
  'Collect and clean incoming files',
  'Turn drafts into polished deliverables',
  'Share final outputs with trackable links'
];

const extensionLink =
  'https://chromewebstore.google.com/detail/everyday-image-studio/cpcfdmaihaccamacobbfnfngefmdphfp/reviews?utm_source=item-share-cp';
const extensionBannerStorageKey = 'dayfiles_extension_banner_dismissed_v1';
const themeStorageKey = 'dayfiles_theme';
const themeOptions = new Set(['system', 'light', 'dark']);

const faqs = [
  {
    question: 'What is Dayfiles used for?',
    answer:
      'Dayfiles is a file operations platform for image editing, PDF conversion, document cleanup, and daily file sharing workflows.'
  },
  {
    question: 'Which Dayfiles tools are live today?',
    answer:
      'Everyday Image Studio and PDF Toolkit are live products. You can access them directly from dayfiles.com.'
  },
  {
    question: 'What features are currently in beta?',
    answer:
      'File Copilot, Shared Workspaces, and Smart File Tags are in active beta and being tested with early teams.'
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

  const onThemeSelect = (event) => {
    const nextPreference = event.target.value;
    if (!themeOptions.has(nextPreference)) {
      return;
    }
    applyThemePreference(nextPreference, true);
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

      <div className="producthunt-badge-wrap">
        <a
          href="https://www.producthunt.com/products/everyday-image-studio-chrome-extension?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-everyday-image-studio-chrome-extension"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt=" Everyday Image Studio- Chrome Extension - Privacy first photo editing in your browser, in minutes. | Product Hunt"
            width="250"
            height="54"
            loading="lazy"
            decoding="async"
            src="/producthunt-featured.svg"
          />
        </a>
      </div>

      <header className={`topbar${isHeaderScrolled ? ' topbar-scrolled' : ''}`}>
        <a className="brand" href="#home">
          <img src="/dayfiles-logo.svg" alt="Dayfiles logo" />
          <span>dayfiles.com</span>
        </a>
        <div className="header-links">
          <label className="theme-select-wrap" htmlFor="theme-select">
            <span className="sr-only">Theme</span>
            <select id="theme-select" className="theme-select" value={themePreference} onChange={onThemeSelect}>
              <option value="system">System ({resolvedTheme})</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <a className="header-link" href="/blog">
            Blog
          </a>
          <a className="header-cta" href="/pdf-toolkit">
            Open Tools
          </a>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <p className="eyebrow">File stack for modern teams</p>
          <h1>Free Online Image and PDF Tools with No Account Required</h1>
          <p className="hero-copy">
            Dayfiles gives you free tools for image and PDF workflows, with no account required and no setup before
            you start.
          </p>
          <div className="hero-actions">
            <a href="/everyday-image-studio">
              Explore Image Studio
            </a>
            <a href="/pdf-toolkit">
              Open PDF Toolkit
            </a>
          </div>
        </section>

        <section className="panel products" aria-label="Live products">
          <div className="section-heading">
            <h2>Free Tools Available Now</h2>
            <p>Production-ready image and PDF tools you can use immediately.</p>
          </div>
          <div className="card-grid">
            {liveProducts.map((product) => (
              <article key={product.title} className="card">
                <div className="badge">{product.state}</div>
                <h3>{product.title}</h3>
                <p>{product.subtitle}</p>
                <a href={product.href}>
                  Visit {product.title}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="panel blog" aria-label="Latest blog posts">
          <div className="section-heading">
            <h2>Image and PDF Workflow Guides</h2>
            <p>Source-backed SEO articles and practical tutorials published on a recurring schedule.</p>
          </div>
          <div className="card-grid">
            {blogPosts.slice(0, 3).map((post) => (
              <article key={post.slug} className="card">
                <div className="badge">{post.product === 'pdf' ? 'PDF' : 'Image'}</div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <a href={`/blog/${post.slug}`}>Read post</a>
              </article>
            ))}
          </div>
          <p className="blog-cta">
            <a href="/blog">View all blog posts</a>
          </p>
        </section>

        <section className="panel beta" aria-label="Beta features">
          <div className="section-heading">
            <h2>Upcoming Features Releasing Soon</h2>
            <p>Features currently in testing and planned for public release.</p>
          </div>
          <div className="card-grid">
            {betaFeatures.map((feature) => (
              <article key={feature.name} className="card beta-card">
                <div className="badge beta-badge">Beta</div>
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
      </main>

      <footer className="footer">
        <p>Dayfiles. Built for daily file work.</p>
        <div>
          <a href="/everyday-image-studio">
            Image Studio
          </a>
          <a href="/pdf-toolkit">
            PDF Toolkit
          </a>
        </div>
      </footer>
    </div>
  );
}
