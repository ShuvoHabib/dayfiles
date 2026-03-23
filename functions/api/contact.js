import {
  D1_BINDING,
  countRecentContactSubmissions,
  ensureContactSubmissionsTable,
  getContactSubmissionsDb,
  saveContactSubmission
} from '../_lib/contact-submissions.js';

const HONEYPOT_FIELD = 'company_website';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SUBMISSIONS_PER_WINDOW = 3;
const THROTTLE_WINDOW_MINUTES = 10;

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
      name: body.name,
      email: body.email,
      topic: body.topic,
      message: body.message,
      honeypot: body[HONEYPOT_FIELD],
      sourcePath: body.source_path,
      clientId: body.client_id
    };
  }

  const formData = await request.formData();
  return {
    name: formData.get('name'),
    email: formData.get('email'),
    topic: formData.get('topic'),
    message: formData.get('message'),
    honeypot: formData.get(HONEYPOT_FIELD),
    sourcePath: formData.get('source_path'),
    clientId: formData.get('client_id')
  };
}

function normalizeText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeMessage(value) {
  return String(value || '').replace(/\r\n/g, '\n').trim().slice(0, 4000);
}

function normalizeSourcePath(value) {
  const fallback = '/contact/';
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith('/')) {
    return fallback;
  }

  return trimmed.slice(0, 320) || fallback;
}

function getThrottleClientId(request, payload) {
  const explicit = normalizeText(payload.clientId, 120);
  if (explicit) {
    return explicit;
  }

  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    '';

  return normalizeText(ip, 120) ? `ip:${normalizeText(ip, 120)}` : '';
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = getContactSubmissionsDb(env);
  const diagnostics = buildDiagnostics(Boolean(db));

  if (!db) {
    return json({ ok: false, error: 'Contact storage is unavailable right now.' }, 500, diagnostics);
  }

  if (!isSameOriginRequest(request)) {
    return json({ ok: false, error: 'Invalid request origin.' }, 403, diagnostics);
  }

  try {
    await ensureContactSubmissionsTable(db);

    const payload = await readPayload(request);
    const honeypot = normalizeText(payload.honeypot, 200);
    if (honeypot) {
      return json({ ok: true, message: 'Thanks. Your message has been received.' }, 200, diagnostics);
    }

    const name = normalizeText(payload.name, 160);
    const email = normalizeText(payload.email, 200).toLowerCase();
    const topic = normalizeText(payload.topic, 160);
    const message = normalizeMessage(payload.message);
    const sourcePath = normalizeSourcePath(payload.sourcePath);
    const clientId = getThrottleClientId(request, payload);

    if (!name) {
      return json({ ok: false, error: 'Enter your name.' }, 400, diagnostics);
    }

    if (!email) {
      return json({ ok: false, error: 'Enter your email address.' }, 400, diagnostics);
    }

    if (!EMAIL_PATTERN.test(email)) {
      return json({ ok: false, error: 'Enter a valid email address.' }, 400, diagnostics);
    }

    if (!message) {
      return json({ ok: false, error: 'Enter your message.' }, 400, diagnostics);
    }

    const recentSubmissionCount = await countRecentContactSubmissions(db, clientId, THROTTLE_WINDOW_MINUTES);
    if (recentSubmissionCount >= MAX_SUBMISSIONS_PER_WINDOW) {
      return json(
        { ok: false, error: 'Please wait a few minutes before sending another message.' },
        429,
        diagnostics
      );
    }

    await saveContactSubmission(db, {
      name,
      email,
      topic,
      message,
      sourcePath,
      clientId: clientId || null,
      deliveryStatus: 'skipped'
    });

    return json(
      {
        ok: true,
        message: 'Thanks. Your message has been received and we’ll review it soon.'
      },
      200,
      diagnostics
    );
  } catch (error) {
    console.error('Contact route failed', error);
    return json({ ok: false, error: 'We could not save your message right now. Please try again.' }, 500, diagnostics);
  }
}
