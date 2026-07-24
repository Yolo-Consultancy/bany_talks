const API_BASE = import.meta.env.VITE_API_URL || '';

export type ContactMailPayload =
  | {
      type: 'contact';
      name: string;
      email: string;
      subject: string;
      message: string;
    }
  | {
      type: 'invite';
      name: string;
      email: string;
      company?: string;
      eventType?: string;
      date?: string;
      formule?: string;
      message?: string;
    };

export async function sendContactMail(payload: ContactMailPayload): Promise<void> {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as { message?: string };

  if (!res.ok) {
    throw new Error(data.message || `Échec d’envoi (${res.status})`);
  }
}
