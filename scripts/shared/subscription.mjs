export const SUBSCRIBE_ENDPOINT = '/api/subscribe';
export const SUBSCRIBE_LIST_ID = 'site-wide-footer';
export const SUBSCRIBE_HONEYPOT = 'company_website';

export function subscriptionStyles() {
  return `
  .subscribe-section {
    margin-top: 1rem;
  }
  .subscribe-card {
    border: 1px solid var(--card-border, var(--line));
    border-radius: 20px;
    padding: 1.1rem;
    background:
      radial-gradient(circle at top right, color-mix(in srgb, var(--accent-2) 18%, transparent), transparent 42%),
      linear-gradient(160deg, color-mix(in srgb, var(--card-bg) 86%, transparent), color-mix(in srgb, var(--panel-bg) 70%, transparent));
    display: grid;
    gap: 0.9rem;
  }
  .subscribe-copy {
    display: grid;
    gap: 0.35rem;
  }
  .subscribe-kicker {
    display: inline-flex;
    width: fit-content;
    padding: 0.28rem 0.7rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent) 18%, transparent);
    color: var(--text-main);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .subscribe-copy h2 {
    margin: 0;
  }
  .subscribe-copy p {
    margin: 0;
    color: var(--text-soft);
    max-width: 60ch;
  }
  .subscribe-form {
    display: grid;
    gap: 0.8rem;
  }
  .subscribe-form-row {
    display: grid;
    grid-template-columns: minmax(0, 1.8fr) auto;
    gap: 0.75rem;
    align-items: center;
  }
  .subscribe-input {
    width: 100%;
    min-height: 48px;
    border-radius: 14px;
    border: 1px solid var(--line);
    background: color-mix(in srgb, var(--card-bg) 82%, transparent);
    color: var(--text-main);
    padding: 0.85rem 1rem;
    font: inherit;
  }
  .subscribe-input::placeholder {
    color: var(--text-soft);
  }
  .subscribe-button {
    min-height: 48px;
    border: 0;
    border-radius: 14px;
    padding: 0.85rem 1.2rem;
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    color: var(--button-on-accent, #07131f);
    font: inherit;
    font-weight: 800;
    cursor: pointer;
    white-space: nowrap;
  }
  .subscribe-button[disabled] {
    opacity: 0.7;
    cursor: wait;
  }
  .subscribe-consent {
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    color: var(--text-soft);
    font-size: 0.94rem;
  }
  .subscribe-consent input {
    margin-top: 0.2rem;
  }
  .subscribe-status {
    min-height: 1.5rem;
    margin: 0;
    color: var(--text-soft);
    font-size: 0.95rem;
  }
  .subscribe-status.is-success {
    color: var(--accent);
  }
  .subscribe-status.is-error {
    color: #ff9c9c;
  }
  .subscribe-honeypot {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
  @media (max-width: 720px) {
    .subscribe-card {
      padding: 1rem;
    }
    .subscribe-form-row {
      grid-template-columns: 1fr;
    }
    .subscribe-button {
      width: 100%;
    }
  }
  `;
}

export function renderSubscribeSection(escapeHtml, options = {}) {
  const title = options.title || 'Get new Dayfiles workflows in your inbox';
  const description =
    options.description ||
    'Subscribe for fresh PDF and image workflow guides, product updates, and practical file-handling tips sent when there is something worth opening.';

  return `
    <section class="subscribe-section" aria-label="Email subscription">
      <div class="subscribe-card">
        <div class="subscribe-copy">
          <span class="subscribe-kicker">Inbox updates</span>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(description)}</p>
        </div>
        <form class="subscribe-form" data-subscribe-form method="post" action="${SUBSCRIBE_ENDPOINT}" novalidate>
          <div class="subscribe-form-row">
            <input class="subscribe-input" type="email" name="email" autocomplete="email" inputmode="email" placeholder="Enter your email address" aria-label="Email address" required />
            <button class="subscribe-button" type="submit">Subscribe free</button>
          </div>
          <label class="subscribe-consent">
            <input type="checkbox" name="consent_granted" value="true" checked />
            <span>Email me when Dayfiles publishes useful new workflow guides or product updates.</span>
          </label>
          <div class="subscribe-honeypot" aria-hidden="true">
            <label>Leave this field empty <input type="text" name="${SUBSCRIBE_HONEYPOT}" tabindex="-1" autocomplete="off" /></label>
          </div>
          <input type="hidden" name="lead_magnet_id" value="${SUBSCRIBE_LIST_ID}" />
          <input type="hidden" name="source_path" value="" />
          <input type="hidden" name="client_id" value="" />
          <p class="subscribe-status" data-subscribe-status aria-live="polite"></p>
        </form>
      </div>
    </section>
  `;
}

export function subscribeScriptTag() {
  return '<script defer src="/subscribe-form.js"></script>';
}
