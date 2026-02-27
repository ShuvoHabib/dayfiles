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

# Queue-based publish (one prewritten post from content/blog-queue)
npm run blog:queue -- --mode publish --ignore-schedule

# Queue dry-run (no file moves, no publish)
npm run blog:queue -- --mode dry-run --ignore-schedule
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

Workflow (manual generator): `.github/workflows/blog-auto-publish.yml`

- Manual trigger only (`workflow_dispatch`) for ad-hoc generation.
- Manual trigger supports:
  - `mode`: `dry-run|publish`
  - `force_product`: `auto|eis|pdf`
  - `force_slug`: optional
  - `publish_date`: optional `YYYY-MM-DD` for backfill

Workflow (queued publishing): `.github/workflows/blog-queue-publish.yml`

- Schedule: hourly (`0 * * * *`) with ET gate at `09:00` and 2-day cadence.
- Publishes exactly one markdown file from `content/blog-queue/` per eligible run.
- Tracks publish cadence in `.blog-queue-state.json`.
- Manual trigger supports:
  - `mode`: `dry-run|publish`
  - `publish_date`: optional `YYYY-MM-DD` backfill
  - `ignore_schedule`: bypass 09:00 ET gate for manual runs

Required repo secret:

- `OPENAI_API_KEY`

Optional repo variables:

- `BLOG_TEXT_MODEL` (default in script: `gpt-4.1-mini`)
- `BLOG_IMAGE_MODEL` (default in script: `gpt-image-1`)
- `BLOG_IMAGE_FALLBACK` (`abort` or `screenshot`, default `abort`)
