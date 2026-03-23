import { useEffect, useId, useState } from 'react';

const SUBSCRIBE_STORAGE_KEY = 'dayfiles_subscriber_client_id_v1';
const SUBSCRIBE_ENDPOINT = '/api/subscribe';
const DEFAULT_LIST_ID = 'site-wide-footer';

function getClientId() {
  try {
    const existing = window.localStorage.getItem(SUBSCRIBE_STORAGE_KEY);
    if (existing) {
      return existing;
    }
    const created = `df-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
    window.localStorage.setItem(SUBSCRIBE_STORAGE_KEY, created);
    return created;
  } catch {
    return '';
  }
}

export default function SubscribeSection() {
  const consentId = useId();
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [consentGranted, setConsentGranted] = useState(true);
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState({ tone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setClientId(getClientId());
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ tone: '', message: 'Saving your subscription...' });

    try {
      const response = await fetch(SUBSCRIBE_ENDPOINT, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json'
        },
        body: JSON.stringify({
          email,
          consent_granted: consentGranted,
          lead_magnet_id: DEFAULT_LIST_ID,
          source_path: `${window.location.pathname}${window.location.search}`,
          client_id: clientId,
          company_website: honeypot
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'We could not save your subscription right now.');
      }

      setEmail('');
      setConsentGranted(true);
      setStatus({ tone: 'success', message: data.message || 'You’re subscribed successfully.' });
    } catch (error) {
      setStatus({ tone: 'error', message: error.message || 'We could not save your subscription right now.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="subscribe-section" aria-label="Email subscription">
      <div className="subscribe-card">
        <div className="subscribe-copy">
          <span className="subscribe-kicker">Inbox updates</span>
          <h2>Get new Dayfiles workflows in your inbox</h2>
          <p>
            Subscribe for fresh PDF and image workflow guides, product updates, and practical file-handling tips sent
            when there is something worth opening.
          </p>
        </div>

        <form className="subscribe-form" onSubmit={onSubmit} noValidate>
          <div className="subscribe-form-row">
            <input
              className="subscribe-input"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="Enter your email address"
              aria-label="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button className="subscribe-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Subscribing...' : 'Subscribe free'}
            </button>
          </div>

          <label className="subscribe-consent" htmlFor={consentId}>
            <input
              id={consentId}
              type="checkbox"
              name="consent_granted"
              checked={consentGranted}
              onChange={(event) => setConsentGranted(event.target.checked)}
            />
            <span>Email me when Dayfiles publishes useful new workflow guides or product updates.</span>
          </label>

          <div className="subscribe-honeypot" aria-hidden="true">
            <label>
              Leave this field empty
              <input
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </label>
          </div>

          <p className={`subscribe-status${status.tone ? ` is-${status.tone}` : ''}`} aria-live="polite">
            {status.message}
          </p>
        </form>
      </div>
    </section>
  );
}
