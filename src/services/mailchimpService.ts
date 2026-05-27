/**
 * Mailchimp Newsletter Service
 * Configuration et gestion des abonnements à la newsletter
 */

// Configuration - À récupérer depuis vos variables d'environnement
const MAILCHIMP_API_KEY = import.meta.env.VITE_MAILCHIMP_API_KEY || '';
const MAILCHIMP_SERVER = import.meta.env.VITE_MAILCHIMP_SERVER || ''; // ex: us1
const MAILCHIMP_AUDIENCE_ID = import.meta.env.VITE_MAILCHIMP_AUDIENCE_ID || '';

/**
 * Subscribe an email to the Mailchimp audience
 * @param email Email address to subscribe
 * @returns Success/error response
 */
export async function subscribeToNewsletter(email: string) {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER || !MAILCHIMP_AUDIENCE_ID) {
    throw new Error('Mailchimp configuration manquante. Vérifiez vos variables d\'environnement.');
  }

  try {
    // Use the backend proxy to avoid CORS issues
    const response = await fetch('/api/mailchimp/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Mailchimp subscription error:', error);
    throw error;
  }
}

/**
 * Alternative: Direct API call (if backend proxy not available)
 * Note: This may have CORS issues
 */
export async function subscribeToNewsletterDirect(
  email: string,
  firstName?: string,
  lastName?: string
) {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER || !MAILCHIMP_AUDIENCE_ID) {
    throw new Error('Mailchimp configuration manquante.');
  }

  const listId = MAILCHIMP_AUDIENCE_ID;
  const dataCenter = MAILCHIMP_SERVER;
  const url = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${listId}/members`;

  // Convert email to MD5 hash for subscriber ID
  const subscriberHash = await hashEmail(email);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'pending', // or 'subscribed' for auto-confirm
        merge_fields: {
          FNAME: firstName || '',
          LNAME: lastName || '',
        },
        tags: ['website-signup'],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur lors de l\'inscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Mailchimp API error:', error);
    throw error;
  }
}

/**
 * Hash email to MD5 for Mailchimp subscriber operations
 */
async function hashEmail(email: string): Promise<string> {
  const cleaned = email.toLowerCase().trim();
  const buffer = new TextEncoder().encode(cleaned);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
