import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { subscribeBlogNewsletter } from '../../services/blogService';
import { subscribeToNewsletter } from '../../services/mailchimpService';

export default function BlogNewsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      try {
        await subscribeBlogNewsletter(email.trim());
      } catch {
        await subscribeToNewsletter(email.trim());
      }
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inscription impossible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-t border-white/5 py-16 lg:py-20">
      <div className="max-w-3xl">
        <p className="section-label mb-4">Newsletter</p>
        <h2 className="font-display text-3xl sm:text-4xl text-stone-100 font-medium leading-tight mb-3">
          Recevez les nouveaux articles
        </h2>
        <p className="text-stone-500 font-body mb-8 max-w-lg">
          Leadership, business et coulisses de Bany Talks — directement dans votre boîte mail.
        </p>

        {success ? (
          <div className="flex items-center gap-2 text-emerald-500 text-sm font-body">
            <CheckCircle2 className="w-5 h-5" />
            Inscription confirmée. Merci !
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-4 max-w-lg">
            <div className="flex flex-col sm:flex-row gap-0 border-b border-white/15 focus-within:border-rose-500/50 transition">
              <div className="relative flex-1">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
                <input
                  type="email"
                  required
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-7 pr-4 py-4 bg-transparent text-stone-200 placeholder-stone-600 focus:outline-none text-sm font-body disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="py-4 px-6 bg-rose-500 hover:bg-rose-400 disabled:bg-stone-800 text-stone-950 font-body text-xs font-semibold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-stone-950 border-t-transparent animate-spin" />
                ) : (
                  <>
                    S'abonner <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="flex items-start gap-2 text-red-400 text-xs font-body">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}
            <p className="text-xs text-stone-600 font-body">Pas de spam. Désabonnement en un clic.</p>
          </form>
        )}
      </div>
    </section>
  );
}
