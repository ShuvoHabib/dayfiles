# Local PDF tools and guides production release

Private PDF Editor + Web is released from PDF repository PR #26 (merge `9405c532`, content `1435e812`). The tested build was uploaded to production Pages deployment `https://3c2b6b70.pdf-processor-4mc.pages.dev`.

The apex router required a companion update: three new guide paths and four tool paths were absent, and `/pdf-workflows/` still belonged to the editorial landing-page inventory. The tool now owns that path; its duplicate editorial sitemap entry is removed at the edge. Existing Android/iPhone app landing routes are preserved. No editorial Pages content was deployed.

Production router version: `0b7514f5-9cfe-499f-a89c-afce6c1aacf1`.

Validation:
- 32 router tests passed; Wrangler dry run passed.
- All 147 URLs across the production sitemap index were audited, without sampling; no findings or warnings. JSON evidence is in `local-pdf-sitemap-audit-2026-10-26.json`.
- Homepage, four guides and four tool pages return HTTP 200, self-canonicalize and byte-match the tested PDF build.
- All four guide screenshots return HTTP 200 with image/png content.
- PDF build, lint, 26 unit/SEO guardrails and 14 browser journeys passed before deployment. GitHub Actions could not start because of account billing; local tests are the validation evidence.

Google Search Console accepted both `https://dayfiles.com/sitemap-index.xml` and `https://dayfiles.com/sitemap.xml` resubmissions on October 26, 2026, showing “Sitemap submitted successfully” for each and Success in the table. The index last-read date refreshed to October 26. Discovered-page counts were still 139 for the index and 97 for the PDF child; these do not establish indexing of the new URLs.

Unrelated changes in both original repositories were preserved; router edits were made in an isolated checkout based on current origin/master.
