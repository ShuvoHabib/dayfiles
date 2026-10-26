# Remember the Day iOS App Store URLs — 2026-10-26

The product URL returned a 404 because its prepared HTML was not part of the committed router bundle. The existing product, support and privacy-policy HTML is now committed and served directly at its canonical URLs. No app claims, purchase terms or privacy-policy text were rewritten.

Production router version: `d5977b83-3681-40ea-8c7a-1c4d6d0eaee4`.

Verified all three paths return HTTP 200 and byte-match the committed source, with self-canonicals and a static-page CSP:
- https://dayfiles.com/app/remember-the-day/ios/
- https://dayfiles.com/app/remember-the-day/ios/support/
- https://dayfiles.com/app/remember-the-day/ios/privacy-policy/

All 33 router tests passed, including GET, HEAD, slash redirects, unsupported methods, exact source matching and unknown-route rejection. Deployment dry run passed. Browser checks at 390px and 1440px passed for all three pages, with one H1 and no horizontal overflow. Local workerd was too old for the configured compatibility date, so layout verification used the exported router handler through a Node HTTP preview; live HTTP verification confirms the deployed runtime.

App Store Connect settings were not changed. Existing unrelated files in the original checkout remain untouched.
