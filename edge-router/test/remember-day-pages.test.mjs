import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { handleRequest } from '../src/index.mjs';

test('Remember the Day iOS product/support/privacy pages serve exact canonical HTML with safe methods and headers', async () => {
  const env = { ROUTER_MODE: 'production' };
  const base = '/app/remember-the-day/ios/';
  for (const suffix of ['', 'privacy-policy/', 'support/']) {
    const path = base + suffix;
    const response = await handleRequest(new Request(`https://dayfiles.com${path}`), env);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), readFileSync(new URL(`../../public${path}index.html`, import.meta.url), 'utf8'));
    assert.match(response.headers.get('content-security-policy'), /default-src 'none'/);
    const head = await handleRequest(new Request(`https://dayfiles.com${path}`, { method: 'HEAD' }), env);
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
    const post = await handleRequest(new Request(`https://dayfiles.com${path}`, { method: 'POST' }), env);
    assert.equal(post.status, 405);
    const redirect = await handleRequest(new Request(`https://dayfiles.com${path.slice(0, -1)}`), env);
    assert.equal(redirect.status, 301);
    assert.equal(redirect.headers.get('location'), `https://dayfiles.com${path}`);
  }
  assert.equal((await handleRequest(new Request(`https://dayfiles.com${base}unknown/`), env)).status, 404);
});
