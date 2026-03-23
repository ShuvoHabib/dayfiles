import { D1_BINDING, ensureLeadSubscribersTable, getLeadSubscribersDb, saveLeadSubscriber } from '../_lib/lead-subscribers.js';

const DEFAULT_LIST_ID = 'site-wide-footer';
const HONEYPOT_FIELD = 'company_website';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data, status, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders
    }
  });
}

function buildDiagnostics(dbPresent) {
  return {
    'x-dayfiles-has-d1': dbPresent ? 'true' : 'false',
    'x-dayfiles-schema-mode': 'prepare-run',
    'x-dayfiles-d1-binding': D1_BINDING
  };
}

function isSameOriginRequest(request) {
  const url = new URL(request.url);
  const expectedOrigin = url.origin;
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  if (origin) {
    return origin === expectedOrigin;
  }

  if (referer) {
    try {
      return new URL(referer).origin === expectedOrigin;
    } catch {
      return false;
    }
  }

  return false;
}

async function readPayload(request) {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = await request.json();
    return {
      email: body.email,
      honeypot: body[HONEYPOT_FIELD],
      leadMagnetId: body.lead_magnet_id,
      sourcePath: body.source_path,
      clientId: body.client_id,
      consentGranted: body.consent_granted
    };
  }

  const formData = await request.formData();
  return {
    email: formData.get('email'),
    honeypot: formData.get(HONEYPOT_FIELD),
    leadMagnetId: formData.get('lead_magnet_id'),
    sourcePath: formData.get('source_path'),
    clientId: formData.get('client_id'),
    consentGranted: formData.get('consent_granted')
  };
}

function normalizeConsent(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value || '').trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

function normalizeSourcePath(value) {
  const fallback = '/';
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith('/')) {
    return fallback;
  }

  return trimmed.slice(0, 320) || fallback;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = getLeadSubscribersDb(env);
  const diagnostics = buildDiagnostics(Boolean(db));

  if (!db) {
    return json({ ok: false, error: 'Subscription storage is unavailable right now.' }, 500, diagnostics);
  }

  if (!isSameOriginRequest(request)) {
    return json({ ok: false, error: 'Invalid request origin.' }, 403, diagnostics);
  }

  try {
    await ensureLeadSubscribersTable(db);

    const payload = await readPayload(request);
    const honeypot = String(payload.honeypot || '').trim();
    if (honeypot) {
      return json({ ok: true, message: 'You’re subscribed successfully.' }, 200, diagnostics);
    }

    const email = String(payload.email || '').trim().toLowerCase();
    if (!email) {
      return json({ ok: false, error: 'Enter your email address.' }, 400, diagnostics);
    }

    if (!EMAIL_PATTERN.test(email)) {
      return json({ ok: false, error: 'Enter a valid email address.' }, 400, diagnostics);
    }

    await saveLeadSubscriber(db, {
      email,
      leadMagnetId: String(payload.leadMagnetId || DEFAULT_LIST_ID).trim() || DEFAULT_LIST_ID,
      sourcePath: normalizeSourcePath(payload.sourcePath),
      clientId: String(payload.clientId || '').trim().slice(0, 120) || null,
      consentGranted: normalizeConsent(payload.consentGranted),
      deliveryStatus: 'subscribed'
    });

    return json({ ok: true, message: 'You’re subscribed successfully.' }, 200, diagnostics);
  } catch (error) {
    console.error('Subscribe route failed', error);
    return json({ ok: false, error: 'We could not save your subscription right now. Please try again.' }, 500, diagnostics);
  }
}
