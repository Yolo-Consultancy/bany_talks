import React from 'react';
import { NAV_ITEMS } from '../data/navItems';
import SocialLinks from './SocialLinks';
import InviteCta from './InviteCta';
import logoBany from '../assets/logos/logo_bany.png';

interface FooterProps {
  onNavigate: (view: 'home' | 'about' | 'episodes' | 'booking' | 'blog' | 'contact') => void;
  activeView: string;
  onInvite?: () => void;
}

const PRINCIPLES = [
  {
    title: 'Oser',
    desc: 'Voir des possibilités là où d’autres voient uniquement des contraintes.',
  },
  {
    title: 'Agir',
    desc: 'Transformer les idées, analyses et opportunités en initiatives concrètes.',
  },
  {
    title: 'Innover',
    desc: 'Questionner les modèles existants et expérimenter de nouvelles façons de construire.',
  },
] as const;

export default function Footer({ onNavigate, activeView, onInvite }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const showInvite = Boolean(onInvite) && activeView !== 'invite';

  return (
    <footer className="bg-stone-950 border-t border-white/5 pt-16 pb-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5 space-y-6">
            <img src={logoBany} alt="Bany Talks" className="h-10 w-auto" />
            <p className="text-sm text-stone-500 font-body leading-relaxed max-w-sm">
              Consultant, entrepreneur et media host. Des idées, des conversations et des projets pour mieux comprendre et construire l&apos;Afrique.
            </p>
            <SocialLinks size="sm" />
            {showInvite && (
              <InviteCta
                variant="button"
                onInvite={onInvite!}
                label="TRAVAILLER AVEC BANY"
              />
            )}
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
                    onClick={() => onNavigate(link.value as 'home' | 'about' | 'episodes' | 'booking' | 'blog' | 'contact')}
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

          <div className="md:col-span-4 space-y-5">
            <div>
              <p className="section-label text-[0.6rem] mb-3">Principes</p>
              <h3 className="font-display text-xl sm:text-2xl text-stone-100 font-medium leading-snug">
                Oser. Agir. Innover.
              </h3>
            </div>
            <div className="space-y-4">
              {PRINCIPLES.map((item) => (
                <div key={item.title} className="border-l border-rose-500/40 pl-4">
                  <p className="font-display text-xs tracking-[0.16em] uppercase text-rose-400/90 mb-1.5">
                    {item.title}
                  </p>
                  <p className="text-sm text-stone-500 font-body leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-stone-600 font-body">
          <span>© {currentYear} Bany Talks. Tous droits réservés.</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-400 transition cursor-pointer">Conditions d&apos;utilisation</span>
            <span className="hover:text-stone-400 transition cursor-pointer">Confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
