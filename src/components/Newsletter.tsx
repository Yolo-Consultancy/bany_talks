import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Youtube, Library, Radio, AlertCircle } from 'lucide-react';
import { subscribeToNewsletter } from '../services/mailchimpService';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      await subscribeToNewsletter(email);
      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      console.error('Newsletter subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="newsletter-section"
      className="bg-stone-950 py-20 lg:py-28 border-t border-white/5 relative overflow-hidden text-left"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <p className="section-label">Newsletter</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-stone-100 font-medium leading-tight max-w-lg">
                Restez informé des prochains épisodes
              </h2>
              <p className="text-stone-500 font-body leading-relaxed max-w-lg">
                Synthèses d&apos;épisodes, ressources exclusives de nos invités et invitations aux
                enregistrements studio à Kinshasa. Vous serez notifié par email à chaque nouveauté.
              </p>
            </div>

            {isSubscribed ? (
              <div className="p-8 border border-white/8 space-y-4 animate-fade-in-up max-w-lg">
                <div className="flex items-center gap-2 text-emerald-500 text-sm font-body">
                  <CheckCircle2 className="w-5 h-5" /> Inscription confirmée
                </div>
                <p className="text-sm text-stone-400 font-body leading-relaxed">
                  Merci. Vous recevrez un email dès qu’un nouvel article est publié, et pour les
                  annonces (épisodes, studio, ressources).
                </p>
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
                        S&apos;abonner <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono animate-fade-in-up">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Erreur lors de l&apos;inscription</p>
                      <p className="text-red-300 mt-1">{error}</p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-stone-600 font-body">Pas de spam. Désabonnement en un clic.</p>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6 lg:pt-12">
            {[
              { icon: Radio, label: 'Spotify', stat: '235K auditeurs', sub: 'Top podcasts Afrique' },
              { icon: Youtube, label: 'YouTube', stat: '180K abonnés', sub: 'Émissions hebdomadaires' },
              { icon: Library, label: 'Apple Podcasts', stat: '4.8★', sub: '1.2K évaluations' },
            ].map(({ icon: Icon, label, stat, sub }) => (
              <div key={label} className="flex items-center gap-5 py-4 border-b border-white/5">
                <Icon className="w-5 h-5 text-stone-600 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-xs text-stone-600 font-body">{label}</p>
                  <p className="font-display text-xl text-stone-200">{stat}</p>
                  <p className="text-xs text-stone-600 font-body mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
