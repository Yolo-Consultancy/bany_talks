import React, { useState } from 'react';
import { Mail, ArrowRight, Send, Check, Youtube, Instagram, Radio, MessageCircle } from 'lucide-react';
import { HOST_DETAILS } from '../data';
import WhatsAppIcon from './WhatsAppIcon';
import { sendContactMail } from '../services/contactMailService';

const CONTACT_EMAIL = 'contact@banyofficial.com';
const WHATSAPP_URL = 'https://wa.me/813622975';

interface ContactPageProps {
  onInvite?: () => void;
}

export default function ContactPage({ onInvite }: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendContactMail({
        type: 'contact',
        name,
        email,
        subject,
        message,
      });
      setSent(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-section" className="bg-stone-950 py-14 sm:py-20 lg:py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 lg:space-y-16">
        <div className="max-w-2xl space-y-3">
          <p className="section-label">Bany Officiel</p>
          <h1 className="font-display text-4xl sm:text-5xl text-stone-100 font-medium leading-tight">
            Contact
          </h1>
          <p className="text-stone-500 font-body text-base leading-relaxed">
            Une question, une collaboration ou une invitation ? Écrivez-nous — l’équipe Bany Talks vous répond.
          </p>
        </div>

        <hr className="editorial-rule" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display text-xl text-stone-100 font-medium">Envoyer un message</h2>

            {sent ? (
              <div className="border border-white/10 p-8 space-y-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center">
                  <Check className="w-5 h-5 text-rose-500" />
                </div>
                <p className="font-display text-lg text-stone-100">Message envoyé</p>
                <p className="text-sm text-stone-500 font-body leading-relaxed">
                  Merci. Votre message a bien été transmis à{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-rose-400 hover:text-rose-300">
                    {CONTACT_EMAIL}
                  </a>
                  . L’équipe vous répond sous peu.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="text-xs text-stone-500 hover:text-stone-300 cursor-pointer"
                >
                  Écrire un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <label className="block space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-stone-600 font-body">Nom</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-stone-200 placeholder:text-stone-700 focus:outline-none focus:border-rose-500/50"
                      placeholder="Votre nom"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-stone-600 font-body">Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-stone-200 placeholder:text-stone-700 focus:outline-none focus:border-rose-500/50"
                      placeholder="vous@email.com"
                    />
                  </label>
                </div>
                <label className="block space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-stone-600 font-body">Sujet</span>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-stone-200 placeholder:text-stone-700 focus:outline-none focus:border-rose-500/50"
                    placeholder="Objet de votre message"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-stone-600 font-body">Message</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-stone-200 placeholder:text-stone-700 focus:outline-none focus:border-rose-500/50 resize-y min-h-[120px] font-body"
                    placeholder="Votre message…"
                  />
                </label>

                {error && <p className="text-sm text-rose-400 font-body">{error}</p>}

                <button type="submit" disabled={loading} className="btn-primary text-xs">
                  {loading ? (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-stone-950 border-t-transparent animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {loading ? 'Envoi…' : 'Envoyer'}
                </button>
              </form>
            )}
          </div>

          <aside className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <p className="section-label text-[0.6rem]">Coordonnées</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-4 p-4 border border-white/8 hover:border-rose-500/30 transition group"
              >
                <span className="flex items-center justify-center w-10 h-10 shrink-0 border border-white/10 text-rose-500/80 group-hover:border-rose-500/40 transition">
                  <Mail className="w-4 h-4" strokeWidth={1.5} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-wider text-stone-600 font-body mb-1">Email</span>
                  <span className="block text-sm text-stone-300 font-body break-all group-hover:text-rose-400 transition">
                    {CONTACT_EMAIL}
                  </span>
                </span>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 border border-white/8 hover:border-rose-500/30 transition group"
              >
                <span className="flex items-center justify-center w-10 h-10 shrink-0 border border-white/10 text-[#25D366] group-hover:border-[#25D366]/40 transition">
                  <WhatsAppIcon className="w-5 h-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] uppercase tracking-wider text-stone-600 font-body mb-1">WhatsApp</span>
                  <span className="block text-sm text-stone-300 font-body group-hover:text-rose-400 transition">
                    Écrire sur WhatsApp
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-rose-400 shrink-0 transition" />
              </a>
            </div>

            <div className="space-y-4">
              <p className="section-label text-[0.6rem]">Réseaux</p>
              <div className="flex items-center gap-4">
                {[
                  { href: HOST_DETAILS.socialLinks.youtube, icon: Youtube, label: 'YouTube' },
                  { href: HOST_DETAILS.socialLinks.spotify, icon: Radio, label: 'Spotify' },
                  { href: HOST_DETAILS.socialLinks.instagram, icon: Instagram, label: 'Instagram' },
                  { href: HOST_DETAILS.socialLinks.whatsapp, icon: MessageCircle, label: 'WhatsApp' },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href.startsWith('http') ? href : `https://${href}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="text-stone-600 hover:text-rose-400 transition"
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>

            {onInvite && (
              <div className="border border-white/8 p-5 space-y-3">
                <p className="font-display text-lg text-stone-100">Inviter Bany</p>
                <p className="text-sm text-stone-500 font-body leading-relaxed">
                  Pour une conférence, un événement ou un enregistrement, utilisez le formulaire d’invitation.
                </p>
                <button type="button" onClick={onInvite} className="link-arrow text-sm cursor-pointer">
                  Demander une invitation <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
