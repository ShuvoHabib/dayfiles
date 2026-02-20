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
