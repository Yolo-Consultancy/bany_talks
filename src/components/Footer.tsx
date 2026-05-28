import React from 'react';
import { HOST_DETAILS } from '../data';
import { Youtube, Instagram, Radio, Send, MessageCircle, Moon, Disc } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'about' | 'episodes' | 'booking' | 'hub' | 'books') => void;
  activeView: string;
}

export default function Footer({ onNavigate, activeView }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 border-t border-stone-900 pt-16 pb-24 text-left font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Upper Column Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Column Brand Story / 5 cols */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <Disc className="w-5 h-5 text-rose-500 animate-spin-slow" />
              <span className="text-lg font-black uppercase tracking-wider text-stone-100 font-mono">
                BANY TALKS
              </span>
            </div>
            
            <p className="text-xs text-stone-400 font-sans leading-relaxed max-w-sm">
              Des conversations vraies, des histoires inédites et des experts engagés à décoder l’excellence. Écoutez, apprenez et transformez votre vision du monde.
            </p>

            {/* Social channels icons */}
            <div className="flex items-center gap-3.5 pt-2">
              <a 
                href={HOST_DETAILS.socialLinks.youtube} 
                target="_blank" 
                rel="noreferrer"
                aria-label="YouTube Channel"
                className="p-2 bg-stone-900 hover:bg-stone-850 hover:text-rose-500 rounded-lg text-stone-400 transition border border-stone-850"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a 
                href={HOST_DETAILS.socialLinks.spotify} 
                target="_blank" 
                rel="noreferrer"
                aria-label="Spotify Podcast"
                className="p-2 bg-stone-900 hover:bg-stone-850 hover:text-rose-500 rounded-lg text-stone-400 transition border border-stone-850"
              >
                <Radio className="w-4 h-4" />
              </a>

              <a 
                href={HOST_DETAILS.socialLinks.instagram} 
                target="_blank" 
                rel="noreferrer"
                aria-label="Instagram Profile"
                className="p-2 bg-stone-900 hover:bg-stone-850 hover:text-rose-500 rounded-lg text-stone-400 transition border border-stone-850"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a 
                href={HOST_DETAILS.socialLinks.whatsapp} 
                target="_blank" 
                rel="noreferrer"
                aria-label="WhatsApp direct contact"
                className="p-2 bg-stone-900 hover:bg-stone-850 hover:text-rose-500 rounded-lg text-stone-400 transition border border-stone-850"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Navigation / Col 2 / 3 cols */}
          <div className="md:col-span-3 space-y-4 font-mono text-xs">
            <h4 className="text-[10px] text-stone-500 uppercase font-black tracking-widest">Navigation</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Accueil / Hero', value: 'home' },
                { label: 'À Propos de Bany', value: 'about' },
                { label: 'Émissions & Épisodes', value: 'episodes' },
                { label: 'Recommandations Livres', value: 'books' },
                { label: 'Inviter Bany', value: 'booking' },
                { label: 'Hub Audience', value: 'hub' },
              ].map((link) => {
                const isLinkActive = 
                  activeView === link.value || 
                  (activeView === 'invite' && link.value === 'booking') ||
                  (activeView === 'episode-detail' && link.value === 'episodes');

                return (
                  <button
                    key={link.value}
                    onClick={() => onNavigate(link.value as any)}
                    className={`text-left hover:text-rose-400 transition cursor-pointer font-bold ${
                      isLinkActive ? 'text-rose-500 font-extrabold' : 'text-stone-400'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editorial quote / 4 cols */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[10px] font-mono text-stone-500 uppercase font-black tracking-widest">Inspiration</h4>
            <div className="p-4 bg-stone-900/40 border border-stone-850 rounded-xl">
              <p className="text-xs text-stone-300 italic font-sans leading-relaxed">
                "{HOST_DETAILS.quote}"
              </p>
              <span className="text-[9px] font-mono text-rose-500 uppercase block mt-2 text-right font-bold">
                — {HOST_DETAILS.name}
              </span>
            </div>
          </div>

        </div>

        {/* Lower copyright bar */}
        <div className="pt-8 border-t border-stone-900/80 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-stone-500">
          <div>
            © {currentYear} Bany Talks Media Group. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-300 transition cursor-pointer">Conditions d'utilisation</span>
            <span>•</span>
            <span className="hover:text-stone-300 transition cursor-pointer">Politique de Confidentialité</span>
            <span>•</span>
            <span className="text-stone-600">Built in Cloud Studio Premium</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
