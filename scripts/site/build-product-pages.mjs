import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_DIR, SITE_URL, ensureDir, readPosts } from '../blog/lib.mjs';
import { getProductPageBySlug, productPages } from './product-pages.mjs';

const __filename = fileURLToPath(import.meta.url);
const extensionLink =
  'https://chromewebstore.google.com/detail/everyday-image-studio/cpcfdmaihaccamacobbfnfngefmdphfp/reviews?utm_source=item-share-cp';
const navLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'Chrome Extension', href: extensionLink, external: true },
  { label: 'Everyday Image Studio', href: 'https://everydayimagestudio.dayfiles.com/', external: true },
  { label: 'Images', href: 'https://images.dayfiles.com/', external: true },
  { label: 'PDF Toolkit', href: 'https://pdf.dayfiles.com/', external: true }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function themeBootstrapScript() {
  return `
    <script>
      (function () {
        var key = 'dayfiles_theme';
        var saved = localStorage.getItem(key);
        var valid = saved === 'light' || saved === 'dark' || saved === 'system';
        var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        var theme = valid && saved !== 'system' ? saved : system;
        document.documentElement.setAttribute('data-theme', theme);
      })();
    </script>
  `;
}

function themeSelectScript() {
  return `
    <script>
      (function () {
        var key = 'dayfiles_theme';
        var toggle = document.getElementById('theme-toggle');
        var mobileToggle = document.getElementById('theme-toggle-mobile');
        var toggles = [toggle, mobileToggle].filter(Boolean);
        var openButton = document.getElementById('nav-open');
        var closeButton = document.getElementById('nav-close');
        var overlay = document.getElementById('mobile-nav-overlay');
        var drawer = document.getElementById('mobile-nav-drawer');
        var media = window.matchMedia('(prefers-color-scheme: dark)');
        if (!toggles.length) return;

        function getSystemTheme() {
          return media.matches ? 'dark' : 'light';
        }

        function setTheme(preference, persist) {
          var resolved = preference === 'light' || preference === 'dark' ? preference : getSystemTheme();
          document.documentElement.setAttribute('data-theme', resolved);
          toggles.forEach(function (currentToggle) {
            currentToggle.classList.toggle('is-dark', resolved === 'dark');
            currentToggle.classList.toggle('is-light', resolved !== 'dark');
            currentToggle.setAttribute('aria-pressed', String(resolved === 'dark'));
            currentToggle.setAttribute('aria-label', 'Switch to ' + (resolved === 'dark' ? 'light' : 'dark') + ' theme');
            var label = currentToggle.querySelector('.theme-toggle-label');
            if (label) {
              label.textContent = resolved === 'dark' ? 'Dark' : 'Light';
            }
          });
          if (persist) localStorage.setItem(key, preference);
        }

        function closeMenu() {
          if (!overlay || !drawer) return;
          overlay.classList.remove('is-open');
          drawer.classList.remove('is-open');
          document.body.style.overflow = '';
          if (openButton) {
            openButton.setAttribute('aria-expanded', 'false');
          }
        }

        function openMenu() {
          if (!overlay || !drawer) return;
          overlay.classList.add('is-open');
          drawer.classList.add('is-open');
          document.body.style.overflow = 'hidden';
          if (openButton) {
            openButton.setAttribute('aria-expanded', 'true');
          }
        }

        var saved = localStorage.getItem(key);
        var preference = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
        setTheme(preference, false);

        toggles.forEach(function (currentToggle) {
          currentToggle.addEventListener('click', function () {
            var currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            var next = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(next, true);
          });
        });

        media.addEventListener('change', function () {
          if (!localStorage.getItem(key) || localStorage.getItem(key) === 'system') {
            setTheme('system', false);
          }
        });

        if (openButton) {
          openButton.addEventListener('click', openMenu);
        }
        if (closeButton) {
          closeButton.addEventListener('click', closeMenu);
        }
        if (overlay) {
          overlay.addEventListener('click', function (event) {
            if (event.target === overlay) {
              closeMenu();
            }
          });
        }
        document.querySelectorAll('[data-mobile-nav-link]').forEach(function (link) {
          link.addEventListener('click', closeMenu);
        });
        window.addEventListener('keydown', function (event) {
          if (event.key === 'Escape') {
            closeMenu();
          }
        });
      })();
    </script>
  `;
}

function thirdPartyScripts() {
  return `
    <script>
      (function () {
        var host = window.location.hostname;
        var isProd = host === 'dayfiles.com' || host === 'www.dayfiles.com';
        if (!isProd) return;
        var loaded = false;

        function loadThirdParty() {
          if (loaded) return;
          loaded = true;

          window.dataLayer = window.dataLayer || [];
          window.gtag = function gtag() {
            window.dataLayer.push(arguments);
          };

          var gtagScript = document.createElement('script');
          gtagScript.async = true;
          gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-V6HJS96NK6';
          gtagScript.onload = function () {
            window.gtag('js', new Date());
            window.gtag('config', 'G-V6HJS96NK6');
          };
          document.head.appendChild(gtagScript);

          var adsScript = document.createElement('script');
          adsScript.async = true;
          adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1193261985740702';
          adsScript.crossOrigin = 'anonymous';
          document.head.appendChild(adsScript);
        }

        function triggerLoad() {
          loadThirdParty();
          window.removeEventListener('pointerdown', triggerLoad);
          window.removeEventListener('keydown', triggerLoad);
          window.removeEventListener('scroll', triggerLoad);
        }

        window.addEventListener('pointerdown', triggerLoad, { once: true, passive: true });
        window.addEventListener('keydown', triggerLoad, { once: true });
        window.addEventListener('scroll', triggerLoad, { once: true, passive: true });
        window.setTimeout(loadThirdParty, 60000);
      })();
    </script>
  `;
}

function sharedStyles() {
  return `
  :root {
    --bg-main: #0b1020;
    --text-main: #f6f7fb;
    --text-soft: #c0c8df;
    --line: rgba(255,255,255,0.15);
    --accent: #5de2b0;
    --accent-2: #63c7ff;
    --page-bg:
      radial-gradient(circle at 15% 20%, rgba(93, 226, 176, 0.24) 0, transparent 30%),
      radial-gradient(circle at 88% 15%, rgba(99, 199, 255, 0.24) 0, transparent 34%),
      linear-gradient(160deg, #0b1020, #060b16 65%, #0f1b36 100%);
    --top-bg: rgba(6,11,22,0.9);
    --top-border: rgba(99,199,255,0.2);
    --panel-bg: linear-gradient(160deg, rgba(17, 29, 59, 0.72), rgba(8, 15, 33, 0.6));
    --card-bg: rgba(8,14,30,.45);
    --card-border: rgba(255,255,255,0.16);
    --badge-text: #06131f;
    --prose: #d9deef;
    --prose-heading: #ffffff;
  }
  [data-theme='light'] {
    --bg-main: #f3f8ff;
    --text-main: #0f1d3a;
    --text-soft: #334668;
    --line: rgba(15, 29, 58, 0.18);
    --accent: #0f8b63;
    --accent-2: #145fb8;
    --page-bg:
      radial-gradient(circle at 8% 16%, rgba(23, 192, 136, 0.16) 0, transparent 33%),
      radial-gradient(circle at 92% 8%, rgba(45, 147, 255, 0.16) 0, transparent 34%),
      linear-gradient(160deg, #f3f8ff, #eaf2ff 60%, #f8fbff 100%);
    --top-bg: rgba(255,255,255,0.92);
    --top-border: rgba(45, 147, 255, 0.3);
    --panel-bg: linear-gradient(160deg, rgba(255,255,255,0.95), rgba(239,246,255,0.92));
    --card-bg: rgba(255,255,255,0.92);
    --card-border: rgba(15, 29, 58, 0.14);
    --badge-text: #f5fbff;
    --prose: #1c2a4b;
    --prose-heading: #0f1d3a;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    color: var(--text-main);
    background: var(--page-bg);
    line-height: 1.65;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
  a {
    color: var(--accent-2);
    text-underline-offset: 0.18em;
    text-decoration-thickness: .08em;
  }
  .wrap {
    width: min(1120px, calc(100% - 2rem));
    margin: 0 auto;
    padding: 1.2rem 0 2.8rem;
  }
  .top {
    position: sticky;
    top: 0;
    z-index: 120;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    border: 1px solid var(--top-border);
    border-radius: 14px;
    background: var(--top-bg);
    backdrop-filter: blur(6px);
    padding: 0.7rem 0.9rem;
  }
  .hamburger-button {
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.24rem;
    width: 44px;
    height: 44px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: transparent;
    color: var(--text-main);
    cursor: pointer;
  }
  .hamburger-button span {
    width: 18px;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
  }
  .brand {
    display: inline-flex;
    gap: .5rem;
    align-items: center;
    color: var(--text-main);
    text-decoration: none;
    font-weight: 700;
  }
  .brand img { width: 28px; height: 28px; }
  .top-links {
    display: flex;
    gap: .5rem;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .chip {
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: .45rem .7rem;
    color: var(--text-main);
    font-size: .92rem;
    background: transparent;
    text-decoration: none;
  }
  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: .55rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: .34rem .42rem .34rem .76rem;
    background: transparent;
    color: var(--text-main);
    cursor: pointer;
    font: inherit;
  }
  .theme-toggle:focus-visible {
    outline: none;
    border-color: var(--accent-2);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent-2) 24%, transparent);
  }
  .theme-toggle-label {
    font-size: .82rem;
    font-weight: 600;
    letter-spacing: .01em;
  }
  .theme-toggle-switch {
    position: relative;
    width: 44px;
    height: 24px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--text-soft) 24%, transparent);
    transition: background .2s ease;
  }
  .theme-toggle-knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(120deg, var(--accent), var(--accent-2));
    box-shadow: 0 4px 10px rgba(0,0,0,.2);
    transition: transform .22s ease;
  }
  .theme-toggle.is-dark .theme-toggle-switch {
    background: color-mix(in srgb, var(--accent-2) 30%, transparent);
  }
  .theme-toggle.is-dark .theme-toggle-knob {
    transform: translateX(20px);
  }
  .mobile-nav-overlay {
    position: fixed;
    inset: 0;
    background: rgba(3, 8, 20, 0.52);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.28s ease;
    z-index: 200;
  }
  .mobile-nav-overlay.is-open {
    opacity: 1;
    pointer-events: auto;
  }
  .mobile-nav-drawer {
    width: min(360px, calc(100vw - 2.4rem));
    height: 100%;
    padding: 1rem;
    background: var(--top-bg);
    border-right: 1px solid var(--top-border);
    box-shadow: 18px 0 40px rgba(0, 0, 0, 0.24);
    transform: translateX(-100%);
    transition: transform 0.32s ease;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    backdrop-filter: blur(12px);
  }
  .mobile-nav-drawer.is-open {
    transform: translateX(0);
  }
  .mobile-nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    font-weight: 700;
  }
  .mobile-nav-close {
    width: 40px;
    height: 40px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: transparent;
    color: var(--text-main);
    font-size: 1.4rem;
    line-height: 1;
    cursor: pointer;
  }
  .mobile-theme-toggle { width: 100%; }
  .mobile-nav-links {
    display: grid;
    gap: 0.6rem;
  }
  .mobile-nav-link {
    display: block;
    text-decoration: none;
    color: var(--text-main);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 0.92rem 1rem;
    background: var(--card-bg);
    font-weight: 600;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  .panel {
    margin-top: 1rem;
    border: 1px solid var(--line);
    border-radius: 18px;
    padding: 1.2rem;
    background: var(--panel-bg);
  }
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: .1em;
    font-size: .8rem;
    color: var(--text-soft);
    margin: 0 0 .5rem;
  }
  .hero-title {
    font-size: clamp(2rem, 4vw, 3rem);
    margin: 0 0 .7rem;
    line-height: 1.08;
  }
  .hero-copy, .muted {
    color: var(--text-soft);
    margin: 0;
  }
  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: .75rem;
    margin-top: 1rem;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: .8rem 1.1rem;
    text-decoration: none;
    font-weight: 700;
    border: 1px solid var(--line);
  }
  .btn-primary {
    background: linear-gradient(120deg, var(--accent), var(--accent-2));
    color: #06131f;
    border: 0;
  }
  .btn-secondary {
    color: var(--text-main);
    background: transparent;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: .9rem;
  }
  .card {
    border: 1px solid var(--card-border);
    border-radius: 14px;
    background: var(--card-bg);
    padding: 1rem;
  }
  .card h3 {
    margin: 0 0 .45rem;
    line-height: 1.2;
  }
  .badge {
    display: inline-block;
    font-size: .72rem;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--badge-text);
    background: linear-gradient(120deg, var(--accent), var(--accent-2));
    padding: 0.25rem 0.42rem;
    border-radius: 999px;
    margin-bottom: .6rem;
  }
  .prose {
    color: var(--prose);
    line-height: 1.75;
  }
  .prose h2, .prose h3 {
    color: var(--prose-heading);
    margin-top: 0;
  }
  .prose p:last-child { margin-bottom: 0; }
  .prose ul { margin: 0; padding-left: 1.2rem; }
  .prose li { margin-bottom: .35rem; }
  .faq-card {
    display: grid;
    gap: .45rem;
  }
  .crumbs {
    display: inline-flex;
    gap: .5rem;
    flex-wrap: wrap;
    color: var(--text-soft);
    font-size: .92rem;
    margin-bottom: .85rem;
  }
  .crumbs a {
    color: var(--text-soft);
    text-decoration: none;
  }
  .guide-link {
    display: block;
    color: inherit;
    text-decoration: none;
  }
  .guide-link:hover h3 {
    color: var(--accent-2);
  }
  @media (max-width: 720px) {
    .wrap { width: min(1120px, calc(100% - 1.2rem)); }
    .panel { padding: 1rem; }
    .top {
      position: sticky;
      min-height: 58px;
      justify-content: center;
      padding-inline: 0.75rem;
    }
    .hamburger-button {
      display: inline-flex;
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
    }
    .brand {
      width: auto;
      justify-content: center;
      margin: 0 auto;
    }
    .top-links {
      display: none;
    }
  }
`;
}

function renderDesktopNavLinks() {
  return navLinks
    .map(
      (item) => `
          <a class="chip" href="${item.href}"${item.external ? ' target="_blank" rel="noreferrer"' : ''}>${item.label}</a>`
    )
    .join('\n');
}

function renderMobileNavLinks() {
  return navLinks
    .map(
      (item) => `
            <a class="mobile-nav-link" data-mobile-nav-link href="${item.href}"${
              item.external ? ' target="_blank" rel="noreferrer"' : ''
            }>${item.label}</a>`
    )
    .join('\n');
}

function buildJsonLd(page) {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: page.shortTitle, item: page.canonicalUrl }
    ]
  };

  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: page.schema.name,
    applicationCategory: page.schema.applicationCategory,
    operatingSystem: page.schema.operatingSystem,
    url: page.appUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    description: page.schema.description
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  return JSON.stringify({ '@graph': [software, faq, breadcrumb] });
}

function renderPage(page, relatedPosts) {
  const companion = getProductPageBySlug(page.companionSlug);
  const relatedGuidesHtml = relatedPosts
    .map(
      (post) => `
        <article class="card">
          <a class="guide-link" href="/blog/${escapeHtml(post.slug)}">
            <span class="badge">${post.product === 'pdf' ? 'PDF Guide' : 'Image Guide'}</span>
            <h3>${escapeHtml(post.title)}</h3>
            <p class="muted">${escapeHtml(post.description)}</p>
          </a>
        </article>
      `
    )
    .join('\n');

  const faqHtml = page.faqs
    .map(
      (item) => `
        <article class="card faq-card">
          <h3>${escapeHtml(item.q)}</h3>
          <p class="muted">${escapeHtml(item.a)}</p>
        </article>
      `
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${themeBootstrapScript()}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <link rel="canonical" href="${escapeHtml(page.canonicalUrl)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${escapeHtml(page.canonicalUrl)}" />
    <meta property="og:image" content="${SITE_URL}/dayfiles-logo.svg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${SITE_URL}/dayfiles-logo.svg" />
    ${thirdPartyScripts()}
    <script type="application/ld+json">${buildJsonLd(page)}</script>
    <style>${sharedStyles()}</style>
  </head>
  <body>
    <main class="wrap">
      <nav class="top" aria-label="Primary">
        <button id="nav-open" class="hamburger-button" type="button" aria-label="Open navigation menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <a class="brand" href="/"><img src="/dayfiles-logo.svg" alt="Dayfiles" /> <span>dayfiles.com</span></a>
        <div class="top-links">
          <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Switch theme" aria-pressed="false">
            <span class="theme-toggle-label">Light</span>
            <span class="theme-toggle-switch" aria-hidden="true"><span class="theme-toggle-knob"></span></span>
          </button>
          ${renderDesktopNavLinks()}
        </div>
      </nav>

      <div id="mobile-nav-overlay" class="mobile-nav-overlay" aria-hidden="true">
        <aside id="mobile-nav-drawer" class="mobile-nav-drawer" aria-label="Mobile navigation">
          <div class="mobile-nav-header">
            <span>Menu</span>
            <button id="nav-close" class="mobile-nav-close" type="button" aria-label="Close navigation menu">×</button>
          </div>
          <button id="theme-toggle-mobile" class="theme-toggle mobile-theme-toggle" type="button" aria-label="Switch theme" aria-pressed="false">
            <span class="theme-toggle-label">Light</span>
            <span class="theme-toggle-switch" aria-hidden="true"><span class="theme-toggle-knob"></span></span>
          </button>
          <nav class="mobile-nav-links">
            ${renderMobileNavLinks()}
          </nav>
        </aside>
      </div>

      <section class="panel">
        <div class="crumbs">
          <a href="/">Home</a> <span>›</span> <span>${escapeHtml(page.shortTitle)}</span>
        </div>
        <p class="eyebrow">${escapeHtml(page.heroEyebrow)}</p>
        <h1 class="hero-title">${escapeHtml(page.h1)}</h1>
        <p class="hero-copy">${escapeHtml(page.heroCopy)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${escapeHtml(page.appUrl)}" target="_blank" rel="noreferrer">${escapeHtml(page.primaryCtaLabel)}</a>
          <a class="btn btn-secondary" href="${escapeHtml(page.secondaryCtaHref)}">${escapeHtml(page.secondaryCtaLabel)}</a>
        </div>
      </section>

      <section class="panel prose">
        <h2>What does this tool do?</h2>
        ${page.whatItDoes.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n')}
      </section>

      <section class="panel prose">
        <h2>Why use ${escapeHtml(page.shortTitle)} on Dayfiles?</h2>
        ${page.whyUse.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n')}
      </section>

      <section class="panel prose">
        <h2>Best for</h2>
        <ul>
          ${page.bestFor.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n')}
        </ul>
      </section>

      <section class="panel">
        <h2>Related guides</h2>
        <div class="grid">${relatedGuidesHtml}</div>
      </section>

      <section class="panel">
        <h2>FAQ</h2>
        <div class="grid">${faqHtml}</div>
      </section>

      <section class="panel prose">
        <h2>Companion workflow</h2>
        <p>${escapeHtml(page.companionCopy)}</p>
        <p><a href="/${escapeHtml(companion.slug)}">Explore ${escapeHtml(companion.shortTitle)}</a></p>
      </section>
    </main>
    ${themeSelectScript()}
  </body>
</html>`;
}

export async function buildProductPages() {
  const posts = await readPosts();

  for (const page of productPages) {
    const relatedPosts = page.relatedGuideSlugs
      .map((slug) => posts.find((post) => post.slug === slug))
      .filter(Boolean);

    const outDir = path.join(PUBLIC_DIR, page.slug);
    await ensureDir(outDir);
    await fs.writeFile(path.join(outDir, 'index.html'), renderPage(page, relatedPosts), 'utf8');
  }

  return { count: productPages.length };
}

async function main() {
  const result = await buildProductPages();
  console.log(`Generated static product pages for ${result.count} route(s).`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
