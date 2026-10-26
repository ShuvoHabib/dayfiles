# Dayfiles edge router

This Worker keeps the public site on one canonical origin:

- `dayfiles.com/blog/*` and the existing editorial/trust pages proxy to `dayfiles.pages.dev`.
- All known Private PDF routes proxy to `pdf-processor-4mc.pages.dev`.
- `pdf.dayfiles.com`, `blog.dayfiles.com`, and `www.dayfiles.com` redirect to their canonical apex equivalents.
- `robots.txt`, the sitemap index, child sitemaps, `llms.txt`, and `ads.txt` are assembled at the edge. `/sitemap.xml` is the PDF sitemap, `/sitemap-index.xml` indexes it together with the editorial sitemap, and the former `/sitemaps/pdf.xml` URL redirects to `/sitemap.xml`.
- `/sign-pdf` permanently redirects to `/e-sign-pdf/`, including from `www` and `pdf.dayfiles.com`, in one hop.
- `/pdf24-vs-ilovepdf/` permanently redirects to `/alternatives/ilovepdf/`, `/pdfgear-vs-ilovepdf/` to `/compare/private-pdf-vs-pdfgear/`, and `/smallpdf-vs-pdf24/` to `/alternatives/smallpdf/`. Each is a single 301 from `dayfiles.com`, `www.dayfiles.com`, and `pdf.dayfiles.com`. `/llms.txt` stays assembled at the edge from both origins and is not a PDF route entry.
- A path with a file extension is a 404 when the upstream Pages project answers with its HTML app shell. Real assets and `index.html` pretty-URL redirects are left alone. `/.well-known/apple-app-site-association` still comes from the PDF origin.
- `/.well-known/assetlinks.json` is a 404 until the Play App Signing SHA-256 for `com.dayfiles.pdfprocessor` is added here. Do not invent that fingerprint.
- Every response sends `Strict-Transport-Security: max-age=31536000; includeSubDomains` with no preload. An `http://dayfiles.com` request that reaches the Worker redirects to https. Cloudflare "Always Use HTTPS" already does this in front of the Worker and is not stored in the repo.
- `/sitemap.xml` keeps the PDF origin URL set, drops URLs that now redirect, and adds `<lastmod>` from the git commit that introduced each route in `pdf-routes.json` (`2026-08-20`, except the later route additions). The editorial sitemap's `<lastmod>` values come from `git log` of each page's source file at blog build time.

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

## Local PDF release routing (2026-10-26)

The four local tools (`/repair-pdf/`, `/create-pdf-forms/`, `/image-watermark-pdf/`, `/pdf-workflows/`) and their illustrated guides route to the PDF origin. `/pdf-workflows/` now serves the recipe tool rather than the former editorial landing page. The editorial child sitemap filters PDF-owned paths to prevent duplicate entries across the combined sitemap index. Release evidence: `docs/reports/local-pdf-production-release-2026-10-26.md`.

## Remember the Day iOS URLs

`/app/remember-the-day/ios/`, its `support/` page and its `privacy-policy/` page are served as bundled HTML so App Store links do not depend on another origin's fallback routing. Sources are in `public/app/remember-the-day/ios/`. After editing, run `node scripts/site/build-remember-day-ios-pages.mjs`, then `npm run router:test` and the router deployment checks. Commit the source pages and generated `remember-day-ios-pages.mjs` together.
