# dayfiles.com

Marketing website for Dayfiles.

## Website

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Blog system

This repository includes an automated static blog at:

- `https://dayfiles.com/blog`
- `https://dayfiles.com/blog/<slug>`

Content source and generated artifacts:

- Markdown posts: `content/blog/*.md`
- Generated index data: `src/generated/blog-index.json`
- Generated static blog pages: `public/blog/`
- Generated RSS feed: `public/blog/feed.xml`

Useful commands:

```bash
# Validate frontmatter/content rules
npm run blog:validate

# Scrape product facts
npm run blog:scrape

# Build blog artifacts + run full site build
npm run build

# Run automation locally (publish mode)
npm run blog:auto -- --mode publish --ignore-schedule

# Dry-run generation to tmp/ only
npm run blog:auto -- --mode dry-run
```

## Cloudflare Pages deployment

Use these exact build settings in Cloudflare Pages:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`

If deploying from CLI:

```bash
npm run deploy:cf
```

This project includes:

- `wrangler.toml` with `pages_build_output_dir = "dist"`
- `public/_redirects` for SPA fallback (`/* /index.html 200`)

## GitHub Actions automation

Workflow: `.github/workflows/blog-auto-publish.yml`

- Schedule: hourly on Mon/Wed/Fri (`0 * * * 1,3,5`) with ET gate at `09:00`.
- Manual trigger supports:
  - `mode`: `dry-run|publish`
  - `force_product`: `auto|eis|pdf`
  - `force_slug`: optional
  - `publish_date`: optional `YYYY-MM-DD` for backfill

Required repo secret:

- `OPENAI_API_KEY`

Optional repo variables:

- `BLOG_TEXT_MODEL` (default in script: `gpt-4.1-mini`)
- `BLOG_IMAGE_MODEL` (default in script: `gpt-image-1`)
- `BLOG_IMAGE_FALLBACK` (`abort` or `screenshot`, default `abort`)
