import { readFileSync, writeFileSync } from 'node:fs';
const base = '/app/remember-the-day/ios/';
const pages = Object.fromEntries(['', 'privacy-policy/', 'support/'].map(suffix => {
  const path = base + suffix;
  return [path.replace(/\/$/, ''), readFileSync(new URL(`../../public${path}index.html`, import.meta.url), 'utf8')];
}));
writeFileSync(new URL('../../edge-router/src/remember-day-ios-pages.mjs', import.meta.url), '// Generated from public/app/remember-the-day/ios/ HTML. Refresh after policy edits.\nexport default ' + JSON.stringify(pages, null, 2) + ';\n');
