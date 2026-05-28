import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Youtube, Library, Radio, Send, FileText, Download, Sparkles, AlertCircle } from 'lucide-react';
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
      className="bg-stone-900 py-16 lg:py-24 border-b border-stone-800/60 relative overflow-hidden text-left"
    >
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-rose-500/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Email Signup Block / 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold tracking-widest text-rose-500 uppercase bg-rose-500/10 px-3 py-1 rounded">
                COMMUNAUTÉ PRIVÉE & VIP
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-100 uppercase max-w-xl leading-none">
                La Newsletter de Bany Talks
              </h2>
              <p className="text-sm text-stone-400 font-sans leading-relaxed max-w-xl">
                Rejoignez le club d'élite Bany Talks. Recevez des synthèses exclusives d’épisodes, des ressources PDF offertes par nos invités et des opportunités d’assister aux enregistrements de notre studio à Kinshasa.
              </p>
            </div>

            {isSubscribed ? (
              /* Success State with Gated Resource Download panel */
              <div className="p-6 bg-stone-950 border border-rose-500/20 rounded-2xl space-y-4 animate-fade-in-up">
                <div className="flex items-center gap-2.5 text-emerald-500 font-mono text-xs font-extrabold uppercase">
                  <CheckCircle2 className="w-5 h-5" /> Inscription validée avec succès !
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-stone-205 uppercase tracking-wide">Espace de téléchargement débloqué :</h4>
                  <p className="text-xs text-stone-400 font-sans leading-relaxed">
                    Félicitations pour votre engagement. Voici la synthèse premium débloquée par notre communauté.
                  </p>
                </div>

                {/* Download links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Téléchargement du plan d'action de l'épisode 124 démarré !");
                    }}
                    className="flex items-center justify-between p-3.5 bg-stone-900 border border-stone-800 rounded-xl hover:border-rose-500 hover:text-rose-400 transition text-stone-200"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                      <div className="text-left font-mono truncate w-36">
                        <span className="text-xs font-bold block">Plan_Action_Bloomflow.pdf</span>
                        <span className="text-[10px] text-stone-500">1.2 MB • PDF</span>
                      </div>
                    </div>
                    <Download className="w-4 h-4 shrink-0 text-stone-500" />
                  </a>

                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Téléchargement de la checklist de négociation d'Antoine Dupont démarré !");
                    }}
                    className="flex items-center justify-between p-3.5 bg-stone-900 border border-stone-800 rounded-xl hover:border-rose-500 hover:text-rose-400 transition text-stone-200"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                      <div className="text-left font-mono truncate w-36">
                        <span className="text-xs font-bold block">Checklist_Negociation.pdf</span>
                        <span className="text-[10px] text-stone-500">840 KB • PDF</span>
                      </div>
                    </div>
                    <Download className="w-4 h-4 shrink-0 text-stone-500" />
                  </a>
                </div>
              </div>
            ) : (
              /* Input Form */
              <form onSubmit={handleSubscribe} className="space-y-2 max-w-xl">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500"><Mail className="w-4 h-4" /></span>
                    <input
                      type="email"
                      required
                      placeholder="Saisissez votre adresse email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 focus:border-rose-500 text-stone-100 placeholder-stone-650 rounded-xl focus:outline-none transition duration-200 text-xs font-mono disabled:opacity-50"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-3 px-6 bg-rose-500 hover:bg-rose-400 disabled:bg-stone-800 text-stone-950 font-bold font-mono text-xs rounded-xl transition cursor-pointer transform active:scale-95 flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-rose-500/10"
                  >
                    {loading ? (
                      <span className="w-4 h-4 rounded-full border-2 border-stone-950 border-t-transparent animate-spin" />
                    ) : (
                      <>
                        S'ABONNER MAINTENANT
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
                
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono animate-fade-in-up">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Erreur lors de l'inscription</p>
                      <p className="text-red-300 mt-1">{error}</p>
                    </div>
                  </div>
                )}
                
                <p className="text-[10px] text-stone-500 font-mono mt-2">
                  🔒 Pas de spam. Vos informations sont cryptées et vous pouvez vous désabonner à tout moment.
                </p>
              </form>
            )}

          </div>

          {/* Social Proof metrics / 5 cols */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 font-mono">
            
            {/* Spotify item */}
            <div className="p-4 bg-stone-950 border border-stone-850 hover:border-stone-700 transition duration-300 rounded-xl flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Radio className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <span className="text-stone-500 text-[10px] block uppercase font-bold">SPOTIFY PODCASTS</span>
                <span className="text-lg font-bold text-stone-200 tracking-tight block leading-none">235K Auditeurs</span>
                <span className="text-[9px] text-stone-500 tracking-widest mt-1 block uppercase font-bold">Note 4.9 • Top 10 France</span>
              </div>
            </div>

            {/* Youtube Item */}
            <div className="p-4 bg-stone-950 border border-stone-850 hover:border-stone-700 transition duration-300 rounded-xl flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <Youtube className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-left">
                <span className="text-stone-500 text-[10px] block uppercase font-bold">CHAINE YOUTUBE</span>
                <span className="text-lg font-bold text-stone-200 tracking-tight block leading-none">180K Abonnés</span>
                <span className="text-[9px] text-stone-500 tracking-widest mt-1 block uppercase font-bold">Vidéo 4K hebdomadaire</span>
              </div>
            </div>

            {/* Apple Podcasts Item */}
            <div className="p-4 bg-stone-950 border border-stone-850 hover:border-stone-700 transition duration-300 rounded-xl flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                <Library className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <span className="text-stone-500 text-[10px] block uppercase font-bold">APPLE PODCASTS</span>
                <span className="text-lg font-bold text-stone-200 tracking-tight block leading-none">4.8★ Étoiles</span>
                <span className="text-[9px] text-stone-500 tracking-widest mt-1 block uppercase font-bold">1.2K Évaluations</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
