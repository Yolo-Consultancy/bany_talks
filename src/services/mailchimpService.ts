/**
 * Mailchimp Newsletter Service
 * Prefers bany-backend /api/newsletter, falls back to Mailchimp proxy.
 */

const MAILCHIMP_API_KEY = import.meta.env.VITE_MAILCHIMP_API_KEY || '';
const MAILCHIMP_SERVER = import.meta.env.VITE_MAILCHIMP_SERVER || '';
const MAILCHIMP_AUDIENCE_ID = import.meta.env.VITE_MAILCHIMP_AUDIENCE_ID || '';

export async function subscribeToNewsletter(email: string) {
  // Primary: bany-backend newsletter store
  try {
    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'website-signup' }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch {
    /* try mailchimp fallback */
  }

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER || !MAILCHIMP_AUDIENCE_ID) {
    // Last resort: mailchimp alias on backend
    const response = await fetch('/api/mailchimp/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }
    return await response.json();
  }

  const response = await fetch('/api/mailchimp/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Erreur lors de l\'inscription');
  }

  return await response.json();
}
