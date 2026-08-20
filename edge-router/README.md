# Dayfiles edge router

This Worker keeps the public site on one canonical origin:

- `dayfiles.com/blog/*` and the existing editorial/trust pages proxy to `dayfiles.pages.dev`.
- All known Private PDF routes proxy to `pdf-processor-4mc.pages.dev`.
- `pdf.dayfiles.com`, `blog.dayfiles.com`, and `www.dayfiles.com` redirect to their canonical apex equivalents.
- `robots.txt`, the sitemap index, child sitemaps, `llms.txt`, and `ads.txt` are assembled at the edge.

Both Pages projects expose `/api/contact` and `/api/subscribe`. The router uses the same-origin `Referer` path to keep editorial-page submissions on the editorial origin; direct calls and PDF-page submissions use the PDF origin.

## Verification and deployment

```sh
npm run router:test
npm run router:types
npm run router:deploy:staging
npm run router:deploy:production
```

Staging is intentionally served with `X-Robots-Tag: noindex, nofollow` and a disallow-all `robots.txt`.

## Production rollback point (2026-08-08 UTC)

- Previous PDF Pages deployment: `52f26d1e-8862-4bd2-98c5-76e99168e099`
- Current PDF Pages deployment: `7202f48d`
- Editorial Pages deployment: `a6a32a32-63ea-42ed-8272-36fe83122364`
- Production edge-router Worker version: `ff324822-ff81-4175-90ae-e4d11b5db5f4`
- Staging edge-router Worker version: `ee6b2ae4-dfab-47be-bb54-ca610bce0f5e`

The old Cloudflare single redirect named `Redirect /pdf-workflows/ to pdf.dayfiles.com` is disabled, not deleted.

To roll back, first disable the Worker routes/custom domain. Restore `dayfiles.com` and `www.dayfiles.com` as custom domains on the `dayfiles` Pages project and restore `pdf.dayfiles.com` on the `pdf-processor` Pages project. Then select the previous PDF deployment above if the PDF build also needs to be reverted. Re-enable the old `/pdf-workflows/` rule only after the old host layout is restored.

Keep the hostname migration redirects for at least 180 days and indefinitely where practical.
