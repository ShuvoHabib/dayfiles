import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_DIR, SITE_URL, ensureDir, readPosts } from '../blog/lib.mjs';
import { getProductPageBySlug, productPages } from './product-pages.mjs';

const __filename = fileURLToPath(import.meta.url);

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
        var select = document.getElementById('theme-select');
        var media = window.matchMedia('(prefers-color-scheme: dark)');
        if (!select) return;

        function getSystemTheme() {
          return media.matches ? 'dark' : 'light';
        }

        function setTheme(preference, persist) {
          var resolved = preference === 'light' || preference === 'dark' ? preference : getSystemTheme();
          document.documentElement.setAttribute('data-theme', resolved);
          var text = resolved.charAt(0).toUpperCase() + resolved.slice(1);
          var systemOption = select.querySelector('option[value="system"]');
          if (systemOption) {
            systemOption.textContent = 'System (' + text + ')';
          }
          select.value = preference;
          if (persist) localStorage.setItem(key, preference);
        }

        var saved = localStorage.getItem(key);
        var preference = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
        setTheme(preference, false);

        select.addEventListener('change', function () {
          var next = select.value;
          if (next !== 'light' && next !== 'dark' && next !== 'system') return;
          setTheme(next, true);
        });

        media.addEventListener('change', function () {
          if (select.value === 'system') {
            setTheme('system', false);
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
  .theme-select-wrap {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: .25rem .34rem;
  }
  .theme-select {
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--text-main);
    font: inherit;
    font-size: .82rem;
    padding: .27rem .58rem;
    cursor: pointer;
    outline: none;
  }
  .theme-select option { color: #0f1d3a; }
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
      position: static;
      flex-direction: column;
      align-items: center;
      gap: .55rem;
    }
    .brand {
      width: 100%;
      justify-content: center;
    }
    .top-links {
      width: 100%;
      justify-content: center;
      gap: .4rem;
    }
  }
`;
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
        <a class="brand" href="/"><img src="/dayfiles-logo.svg" alt="Dayfiles" /> <span>dayfiles.com</span></a>
        <div class="top-links">
          <label class="theme-select-wrap" for="theme-select">
            <span class="sr-only">Theme</span>
            <select id="theme-select" class="theme-select" aria-label="Theme">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <a class="chip" href="/blog">Blog</a>
          <a class="chip" href="/${escapeHtml(companion.slug)}">${escapeHtml(companion.navLabel)}</a>
        </div>
      </nav>

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
