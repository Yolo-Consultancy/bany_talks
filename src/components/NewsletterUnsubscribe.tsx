import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

type Props = {
  token: string | null;
  onHome: () => void;
};

export default function NewsletterUnsubscribe({ token, onHome }: Props) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [message, setMessage] = useState('Désabonnement en cours…');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Lien de désabonnement invalide.');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`);
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        if (!res.ok) throw new Error(data.message || `Erreur (${res.status})`);
        if (cancelled) return;
        setStatus('ok');
        setMessage(data.message || 'Vous êtes désabonné de la newsletter.');
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Impossible de vous désabonner.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <section className="bg-stone-950 min-h-[70vh] py-20 lg:py-28 flex items-center">
      <div className="max-w-lg mx-auto px-4 text-center space-y-6">
        {status === 'loading' && (
          <p className="text-stone-500 font-body text-sm">{message}</p>
        )}
        {status === 'ok' && (
          <>
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h1 className="font-display text-2xl text-stone-100">Désabonnement confirmé</h1>
            <p className="text-stone-500 font-body text-sm leading-relaxed">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h1 className="font-display text-2xl text-stone-100">Échec</h1>
            <p className="text-stone-500 font-body text-sm leading-relaxed">{message}</p>
          </>
        )}
        <button type="button" onClick={onHome} className="btn-primary text-xs mx-auto">
          Retour à l’accueil
        </button>
      </div>
    </section>
  );
}
