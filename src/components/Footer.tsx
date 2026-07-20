import React from 'react';
import { HOST_DETAILS } from '../data';
import { NAV_ITEMS } from '../data/navItems';
import { Youtube, Instagram, Radio, MessageCircle } from 'lucide-react';
import logoBany from '../assets/logos/logo_bany.png';

interface FooterProps {
  onNavigate: (view: 'home' | 'about' | 'episodes' | 'booking' | 'blog') => void;
  activeView: string;
}

export default function Footer({ onNavigate, activeView }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 border-t border-white/5 pt-16 pb-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5 space-y-6">
            <img src={logoBany} alt="Bany Talks" className="h-10 w-auto" />
            <p className="text-sm text-stone-500 font-body leading-relaxed max-w-sm">
              Des conversations vraies avec ceux qui construisent l'Afrique. Podcast, émissions et média indépendant.
            </p>
            <div className="flex items-center gap-4">
              {[
                { href: HOST_DETAILS.socialLinks.youtube, icon: Youtube, label: 'YouTube' },
                { href: HOST_DETAILS.socialLinks.spotify, icon: Radio, label: 'Spotify' },
                { href: HOST_DETAILS.socialLinks.instagram, icon: Instagram, label: 'Instagram' },
                { href: HOST_DETAILS.socialLinks.whatsapp, icon: MessageCircle, label: 'WhatsApp' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="text-stone-600 hover:text-rose-400 transition"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <p className="section-label text-[0.6rem]">Navigation</p>
            <div className="flex flex-col gap-3">
              {NAV_ITEMS.map((link) => {
                const isLinkActive =
                  activeView === link.value ||
                  (activeView === 'invite' && link.value === 'booking') ||
                  (activeView === 'episode-detail' && link.value === 'episodes') ||
                  (activeView.startsWith('blog') && link.value === 'blog');
                return (
                  <button
                    key={link.value}
                    onClick={() => onNavigate(link.value as 'home' | 'about' | 'episodes' | 'booking' | 'blog')}
                    className={`text-left text-sm font-body transition cursor-pointer ${
                      isLinkActive ? 'text-rose-400' : 'text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-4">
            <p className="section-label text-[0.6rem] mb-4">Citation</p>
            <blockquote className="font-display text-lg text-stone-400 italic leading-relaxed">
              « {HOST_DETAILS.quote} »
            </blockquote>
            <cite className="block mt-3 text-xs text-stone-600 not-italic font-body">
              — {HOST_DETAILS.fullName}
            </cite>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-stone-600 font-body">
          <span>© {currentYear} Bany Talks. Tous droits réservés.</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-400 transition cursor-pointer">Conditions d'utilisation</span>
            <span className="hover:text-stone-400 transition cursor-pointer">Confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
