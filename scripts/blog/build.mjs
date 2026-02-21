import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BLOG_INDEX_JSON,
  BLOG_PUBLIC_DIR,
  FEED_PATH,
  LLMS_PATH,
  REDIRECTS_PATH,
  SITEMAP_PATH,
  SITE_URL,
  escapeHtml,
  ensureDir,
  formatHumanDate,
  postRelativeUrl,
  postUrl,
  readingMinutes,
  removeDirIfExists,
  toAbsoluteUrl,
  writeJson
} from './lib.mjs';
import { validatePosts } from './validate.mjs';

const ADSENSE_CLIENT = 'ca-pub-1193261985740702';
const BLOG_AD_SLOT = process.env.BLOG_AD_SLOT || '3130169445';

function stripMarkdown(markdown) {
  return String(markdown)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[#>*_~\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderAdUnit(placementKey) {
  return `
    <section class="panel ad-panel" aria-label="Sponsored content ${escapeHtml(placementKey)}">
      <p class="ad-label">Sponsored</p>
      <ins
        class="adsbygoogle js-ad-slot"
        style="display:block"
        data-ad-client="${ADSENSE_CLIENT}"
        data-ad-slot="${BLOG_AD_SLOT}"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </section>
  `;
}

function collectJsonLd(post, relatedPosts = []) {
  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: post.canonicalUrl,
    image: [toAbsoluteUrl(post.featuredImage)],
    author: {
      '@type': 'Organization',
      name: 'Dayfiles'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dayfiles',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/dayfiles-logo.svg`
      }
    },
    keywords: (post.tags || []).join(', '),
    articleSection: post.product === 'pdf' ? 'PDF Workflows' : 'Image Workflows',
    isPartOf: `${SITE_URL}/blog`,
    citation: (post.sources || []).map((source) => source.url)
  };

  const graph = [blogPosting];

  if (Array.isArray(post.faq) && post.faq.length > 0) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a
        }
      }))
    });
  }

  if (relatedPosts.length > 0) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: relatedPosts.map((related, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: related.canonicalUrl,
        name: related.title
      }))
    });
  }

  return JSON.stringify({ '@graph': graph });
}

function sharedStyles() {
  return `
  @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

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
    --hero-cover-bg: rgba(10, 18, 36, 0.65);
    --hero-cover-border: rgba(255,255,255,.15);
    --badge-text: #06131f;
    --prose: #d9deef;
    --prose-heading: #ffffff;
    --button-on-accent: #06131f;
    --faq-card-bg: rgba(8, 14, 30, 0.55);
    --faq-card-border: rgba(255,255,255,0.2);
    --ad-panel-bg: linear-gradient(160deg, rgba(17, 29, 59, 0.65), rgba(8, 15, 33, 0.55));
    --ad-panel-border: rgba(99,199,255,0.26);
  }
  [data-theme='light'] {
    --bg-main: #f3f8ff;
    --text-main: #0f1d3a;
    --text-soft: #415273;
    --line: rgba(15, 29, 58, 0.18);
    --accent: #17c088;
    --accent-2: #2d93ff;
    --page-bg:
      radial-gradient(circle at 8% 16%, rgba(23, 192, 136, 0.16) 0, transparent 33%),
      radial-gradient(circle at 92% 8%, rgba(45, 147, 255, 0.16) 0, transparent 34%),
      linear-gradient(160deg, #f3f8ff, #eaf2ff 60%, #f8fbff 100%);
    --top-bg: rgba(255,255,255,0.92);
    --top-border: rgba(45, 147, 255, 0.3);
    --panel-bg: linear-gradient(160deg, rgba(255,255,255,0.95), rgba(239,246,255,0.92));
    --card-bg: rgba(255,255,255,0.92);
    --card-border: rgba(15, 29, 58, 0.14);
    --hero-cover-bg: rgba(233, 243, 255, 0.9);
    --hero-cover-border: rgba(15, 29, 58, 0.14);
    --badge-text: #ffffff;
    --prose: #1c2a4b;
    --prose-heading: #0f1d3a;
    --button-on-accent: #ffffff;
    --faq-card-bg: linear-gradient(160deg, rgba(245, 251, 255, 0.98), rgba(233, 245, 255, 0.95));
    --faq-card-border: rgba(45,147,255,0.24);
    --ad-panel-bg: linear-gradient(160deg, rgba(255,255,255,0.95), rgba(236,246,255,0.92));
    --ad-panel-border: rgba(45,147,255,0.34);
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: 'Manrope', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    color: var(--text-main);
    background: var(--page-bg);
    line-height: 1.65;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3 {
    font-family: 'Chakra Petch', sans-serif;
    line-height: 1.16;
    letter-spacing: .015em;
    margin: 0 0 .52rem;
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
    font-family: 'Chakra Petch', sans-serif;
    letter-spacing: .03em;
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
  .theme-select:focus-visible {
    outline: none;
  }
  .theme-select-wrap:focus-within {
    border-color: var(--accent-2);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent-2) 24%, transparent);
  }
  .panel {
    margin-top: 1rem;
    border: 1px solid var(--line);
    border-radius: 18px;
    padding: 1.2rem;
    background: var(--panel-bg);
  }
  .muted {
    color: var(--text-soft);
    line-height: 1.58;
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
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: .9rem;
  }
  .card {
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: .95rem;
    background: var(--card-bg);
  }
  .card h2, .card h3 {
    margin-bottom: .45rem;
    line-height: 1.22;
  }
  .card h2 { font-size: clamp(1.2rem, 1.9vw, 1.42rem); }
  .card h3 { font-size: clamp(1.06rem, 1.5vw, 1.2rem); }
  .title-link {
    color: var(--text-main);
    text-decoration: none;
  }
  .title-link:hover { color: var(--accent-2); }
  .card img {
    width: 100%;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    margin-bottom: 0.7rem;
  }
  .hero-cover {
    margin-top: 0.8rem;
    border-radius: 16px;
    border: 1px solid var(--hero-cover-border);
    overflow: hidden;
    width: 100%;
    height: clamp(200px, 24vw, 240px);
    background: var(--hero-cover-bg);
  }
  .hero-image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
  }
  .hero-title { font-size: clamp(1.8rem, 3.4vw, 2.7rem); margin: 0.2rem 0 0.6rem; }
  .meta {
    display: flex;
    gap: .6rem;
    flex-wrap: wrap;
    color: var(--text-soft);
    font-size: .93rem;
    line-height: 1.45;
  }
  .meta span { white-space: nowrap; }
  .prose {
    color: var(--prose);
    line-height: 1.75;
    font-size: 1.04rem;
  }
  .prose p { margin: 0 0 1rem; }
  .prose ul, .prose ol {
    margin: 0 0 1rem 1.2rem;
    padding: 0;
  }
  .prose li { margin-bottom: .35rem; }
  .prose a {
    font-weight: 600;
  }
  .prose strong { color: var(--prose-heading); }
  .prose code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace;
    font-size: .92em;
  }
  .prose h2, .prose h3 { color: var(--prose-heading); margin-top: 1.3rem; }
  .faq-list, .source-list { display: grid; gap: .7rem; }
  .faq-card {
    border: 1px solid var(--faq-card-border);
    background: var(--faq-card-bg);
  }
  .ad-panel {
    border-color: var(--ad-panel-border);
    background: var(--ad-panel-bg);
  }
  .ad-label {
    margin: 0 0 .7rem;
    font-size: .74rem;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: var(--text-soft);
  }
  .crumbs {
    display: inline-flex;
    gap: .5rem;
    flex-wrap: wrap;
    color: var(--text-soft);
    font-size: .92rem;
  }
  .crumbs a { color: var(--text-soft); text-decoration: none; }
  .crumbs span:last-child {
    color: var(--text-main);
    font-weight: 600;
  }
  @media (max-width: 720px) {
    .wrap { width: min(1120px, calc(100% - 1.2rem)); }
    .panel { padding: 1rem; }
    .hero-cover { height: 185px; }
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
    .chip,
    .theme-select-wrap {
      font-size: .86rem;
      padding: .4rem .58rem;
    }
    .theme-select { font-size: .78rem; }
  }
`;
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

function adInitScript() {
  return `
    <script>
      (function () {
        var adSlots = document.querySelectorAll('.js-ad-slot');
        if (!adSlots.length) return;
        adSlots.forEach(function () {
          try {
            (adsbygoogle = window.adsbygoogle || []).push({});
          } catch (error) {
            // Ignore runtime ad-fill errors to avoid breaking page rendering.
          }
        });
      })();
    </script>
  `;
}

function renderBlogIndexPage(posts) {
  const cards = posts
    .map((post, index) => {
      const excerpt = escapeHtml(post.description || stripMarkdown(post.body).slice(0, 170));
      const postHref = postRelativeUrl(post.slug);
      const adBlock = renderAdUnit(`index-card-${index + 1}`);
      return `
        <article class="card">
          <img src="${escapeHtml(post.featuredImage)}" alt="${escapeHtml(post.featuredImageAlt)}" loading="lazy" />
          <div class="meta"><span class="badge">${post.product === 'pdf' ? 'PDF Toolkit' : 'Image Studio'}</span><span>${formatHumanDate(post.date)}</span></div>
          <h2><a class="title-link" href="${postHref}">${escapeHtml(post.title)}</a></h2>
          <p class="muted">${excerpt}</p>
          <a href="${postHref}">Read article</a>
        </article>
        ${adBlock}
      `;
    })
    .join('\n');

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Dayfiles Blog',
    url: `${SITE_URL}/blog`,
    inLanguage: 'en',
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: post.canonicalUrl,
      datePublished: post.date,
      image: toAbsoluteUrl(post.featuredImage)
    }))
  };

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
    <title>Dayfiles Blog | Image and PDF Workflow Guides</title>
    <meta name="description" content="Daily workflow articles for Everyday Image Studio and PDF Toolkit, including practical guides, checklists, and operational playbooks." />
    <link rel="canonical" href="${SITE_URL}/blog" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Dayfiles Blog" />
    <meta property="og:description" content="Daily workflow guides for image and PDF operations." />
    <meta property="og:url" content="${SITE_URL}/blog" />
    <meta property="og:image" content="${SITE_URL}/dayfiles-logo.svg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Dayfiles Blog" />
    <meta name="twitter:description" content="Daily workflow guides for image and PDF operations." />
    <meta name="twitter:image" content="${SITE_URL}/dayfiles-logo.svg" />
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-V6HJS96NK6"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-V6HJS96NK6');
    </script>
    <!-- AdSense script is loaded, but no ad slots are rendered yet. -->
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1193261985740702"
      crossorigin="anonymous"
    ></script>
    <script type="application/ld+json">${JSON.stringify(itemList)}</script>
    <style>${sharedStyles()}</style>
  </head>
  <body>
    <div class="wrap">
      <nav class="top" aria-label="Primary">
        <a class="brand" href="/"><img src="/dayfiles-logo.svg" alt="Dayfiles"/> <span>dayfiles.com</span></a>
        <div class="top-links">
          <label class="theme-select-wrap" for="theme-select">
            <select id="theme-select" class="theme-select" aria-label="Theme">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <a class="chip" href="https://everydayimagestudio.dayfiles.com/">Image Studio</a>
          <a class="chip" href="https://pdf.dayfiles.com/">PDF Toolkit</a>
        </div>
      </nav>

      <section class="panel">
        <p class="badge">New every Mon/Wed/Fri</p>
        <h1 class="hero-title">Dayfiles Blog</h1>
        <p class="muted">Source-backed guides on file operations, image workflows, and PDF workflow automation.</p>
      </section>

      ${renderAdUnit('index-hero')}

      <section class="panel">
        <div class="grid">${cards || '<p class="muted">No posts yet.</p>'}</div>
      </section>
    </div>
    ${themeSelectScript()}
    ${adInitScript()}
  </body>
</html>`;
}

function renderPostPage(post, relatedPosts) {
  const faqHtml = (post.faq || [])
    .map(
      (item) => `
      <article class="card faq-card">
        <h3>${escapeHtml(item.q)}</h3>
        <p class="muted">${escapeHtml(item.a)}</p>
      </article>
    `
    )
    .join('\n');

  const sourceHtml = (post.sources || [])
    .map(
      (source) => `
      <li>
        <a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a>
      </li>
    `
    )
    .join('\n');

  const relatedHtml = relatedPosts
    .map(
      (related) => `
      <article class="card">
        <span class="badge">${related.product === 'pdf' ? 'PDF Toolkit' : 'Image Studio'}</span>
        <h3><a class="title-link" href="${postRelativeUrl(related.slug)}">${escapeHtml(related.title)}</a></h3>
        <p class="muted">${escapeHtml(related.description)}</p>
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
    <title>${escapeHtml(post.title)} | Dayfiles Blog</title>
    <meta name="description" content="${escapeHtml(post.description)}" />
    <link rel="canonical" href="${escapeHtml(post.canonicalUrl)}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(post.title)}" />
    <meta property="og:description" content="${escapeHtml(post.description)}" />
    <meta property="og:url" content="${escapeHtml(post.canonicalUrl)}" />
    <meta property="og:image" content="${escapeHtml(toAbsoluteUrl(post.featuredImage))}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(post.title)}" />
    <meta name="twitter:description" content="${escapeHtml(post.description)}" />
    <meta name="twitter:image" content="${escapeHtml(toAbsoluteUrl(post.featuredImage))}" />
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-V6HJS96NK6"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-V6HJS96NK6');
    </script>
    <!-- AdSense script is loaded, but no ad slots are rendered yet. -->
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1193261985740702"
      crossorigin="anonymous"
    ></script>
    <script type="application/ld+json">${collectJsonLd(post, relatedPosts)}</script>
    <style>${sharedStyles()}</style>
  </head>
  <body>
    <div class="wrap">
      <nav class="top" aria-label="Primary">
        <a class="brand" href="/"><img src="/dayfiles-logo.svg" alt="Dayfiles"/> <span>dayfiles.com</span></a>
        <div class="top-links">
          <label class="theme-select-wrap" for="theme-select">
            <select id="theme-select" class="theme-select" aria-label="Theme">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <a class="chip" href="/blog">Blog home</a>
          <a class="chip" href="https://everydayimagestudio.dayfiles.com/">Image Studio</a>
          <a class="chip" href="https://pdf.dayfiles.com/">PDF Toolkit</a>
        </div>
      </nav>

      <section class="panel">
        <div class="crumbs">
          <a href="/">Home</a> <span>›</span> <a href="/blog">Blog</a> <span>›</span> <span>${escapeHtml(post.title)}</span>
        </div>
        <p class="meta"><span class="badge">${post.product === 'pdf' ? 'PDF Toolkit' : 'Image Studio'}</span><span>${formatHumanDate(post.date)}</span><span>${readingMinutes(post.body)} min read</span></p>
        <h1 class="hero-title">${escapeHtml(post.title)}</h1>
        <p class="muted">${escapeHtml(post.description)}</p>
        <div class="hero-cover">
          <img class="hero-image" src="${escapeHtml(post.featuredImage)}" alt="${escapeHtml(post.featuredImageAlt)}" />
        </div>
      </section>

      <article class="panel prose">
        ${post.html}
      </article>

      ${renderAdUnit(`post-${post.slug}-body`)}

      <section class="panel">
        <h2>FAQ</h2>
        <div class="faq-list">${faqHtml}</div>
      </section>

      <section class="panel">
        <h2>Sources</h2>
        <ol class="source-list">${sourceHtml}</ol>
      </section>

      <section class="panel">
        <h2>Ad transparency</h2>
        <p class="muted">
          Dayfiles may place relevant Google Ads on selected pages to support free guides. Ads are kept separate from
          editorial recommendations.
        </p>
      </section>

      ${renderAdUnit(`post-${post.slug}-support`)}

      <section class="panel">
        <h2>Related posts</h2>
        <div class="grid">${relatedHtml || '<p class="muted">More posts coming soon.</p>'}</div>
      </section>
    </div>
    ${themeSelectScript()}
    ${adInitScript()}
  </body>
</html>`;
}

function buildBlogIndex(posts) {
  return posts.map((post) => ({
    title: post.title,
    slug: post.slug,
    date: post.date,
    product: post.product,
    description: post.description,
    tags: post.tags,
    canonicalUrl: post.canonicalUrl,
    featuredImage: post.featuredImage,
    featuredImageAlt: post.featuredImageAlt,
    readingMinutes: readingMinutes(post.body)
  }));
}

function buildFeed(posts) {
  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${post.canonicalUrl}</link>
      <guid>${post.canonicalUrl}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
    </item>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Dayfiles Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Daily workflow guides for Everyday Image Studio and PDF Toolkit.</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>\n`;
}

function buildSitemap(posts) {
  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${SITE_URL}/blog`, priority: '0.9', changefreq: 'daily' },
    ...posts.map((post) => ({
      loc: post.canonicalUrl,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: post.date
    }))
  ];

  const nodes = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod || new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${nodes}
</urlset>\n`;
}

function buildLlms(posts) {
  const lines = [
    '# Dayfiles',
    '',
    'Dayfiles is a file workflow platform focused on image and PDF operations for daily team work.',
    '',
    '## Canonical Site',
    '- https://dayfiles.com/',
    '- https://dayfiles.com/blog',
    '',
    '## Live Tools',
    '- https://everydayimagestudio.dayfiles.com/',
    '- https://pdf.dayfiles.com/',
    '',
    '## Blog Discovery',
    '- RSS: https://dayfiles.com/blog/feed.xml',
    '- Sitemap: https://dayfiles.com/sitemap.xml',
    '',
    '## Latest Blog Posts'
  ];

  posts.slice(0, 8).forEach((post) => {
    lines.push(`- ${post.title}: ${post.canonicalUrl}`);
  });

  lines.push('', '## Summary', '- Dayfiles helps users create, convert, organize, and share files.');
  lines.push('- Primary capabilities include image workflows and PDF workflows.');
  lines.push('- Blog posts are source-backed and updated three times weekly.');
  lines.push('');

  return lines.join('\n');
}

function buildRedirects(posts) {
  const lines = [
    '/blog /blog/index.html 200',
    ...posts.map((post) => `/blog/${post.slug} /blog/${post.slug}/index.html 200`),
    '/* /index.html 200'
  ];
  return `${lines.join('\n')}\n`;
}

async function cleanStalePostDirs(validSlugs) {
  await ensureDir(BLOG_PUBLIC_DIR);
  const entries = await fs.readdir(BLOG_PUBLIC_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (entry.name === 'images') {
      continue;
    }

    if (!validSlugs.has(entry.name)) {
      await removeDirIfExists(path.join(BLOG_PUBLIC_DIR, entry.name));
    }
  }
}

export async function buildBlogArtifacts() {
  const { posts, errors } = await validatePosts();

  if (errors.length > 0) {
    throw new Error(`Validation failed:\n${errors.map((err) => `- ${err}`).join('\n')}`);
  }

  await ensureDir(BLOG_PUBLIC_DIR);
  await ensureDir(path.dirname(BLOG_INDEX_JSON));

  const indexJson = buildBlogIndex(posts);
  await writeJson(BLOG_INDEX_JSON, indexJson);

  const slugSet = new Set(posts.map((post) => post.slug));
  await cleanStalePostDirs(slugSet);

  const blogIndexHtml = renderBlogIndexPage(posts);
  await fs.writeFile(path.join(BLOG_PUBLIC_DIR, 'index.html'), blogIndexHtml, 'utf8');

  for (const post of posts) {
    const relatedPosts = posts.filter((candidate) => candidate.slug !== post.slug).slice(0, 6);
    const sameProduct = relatedPosts.filter((candidate) => candidate.product === post.product);
    const chosenRelated = [...sameProduct, ...relatedPosts].slice(0, 3);

    const dir = path.join(BLOG_PUBLIC_DIR, post.slug);
    await ensureDir(dir);
    await fs.writeFile(path.join(dir, 'index.html'), renderPostPage(post, chosenRelated), 'utf8');
  }

  await fs.writeFile(FEED_PATH, buildFeed(posts), 'utf8');
  await fs.writeFile(SITEMAP_PATH, buildSitemap(posts), 'utf8');
  await fs.writeFile(LLMS_PATH, buildLlms(posts), 'utf8');
  await fs.writeFile(REDIRECTS_PATH, buildRedirects(posts), 'utf8');

  return { count: posts.length };
}

async function main() {
  const result = await buildBlogArtifacts();
  console.log(`Generated blog artifacts for ${result.count} post(s).`);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
