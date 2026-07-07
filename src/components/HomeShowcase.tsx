import React from 'react';
import { ArrowRight, Mic2, BookOpen, Users, Radio } from 'lucide-react';

interface HomeShowcaseProps {
  onExploreEpisodes: () => void;
  onAbout: () => void;
  onBooks: () => void;
  onHub: () => void;
}

const PLATFORMS = [
  {
    id: 'episodes',
    label: 'The Bany Talks',
    subtitle: 'Émissions & Podcasts',
    desc: 'Entretiens longs format avec fondateurs, investisseurs et décideurs africains.',
    icon: Mic2,
  },
  {
    id: 'about',
    label: 'L\'histoire de Bany',
    subtitle: 'À propos',
    desc: 'Du Congo au studio : le parcours d\'un entrepreneur média.',
    icon: Users,
  },
  {
    id: 'books',
    label: 'Bibliothèque',
    subtitle: 'Livres & Ressources',
    desc: 'Les lectures qui inspirent chaque épisode et chaque conversation.',
    icon: BookOpen,
  },
  {
    id: 'hub',
    label: 'Audience Hub',
    subtitle: 'Communauté',
    desc: 'Posez vos questions, partagez vos idées, rejoignez le dialogue.',
    icon: Radio,
  },
];

export default function HomeShowcase({ onExploreEpisodes, onAbout, onBooks, onHub }: HomeShowcaseProps) {
  const handlers: Record<string, () => void> = {
    episodes: onExploreEpisodes,
    about: onAbout,
    books: onBooks,
    hub: onHub,
  };

  return (
    <section className="bg-stone-950 py-20 lg:py-28 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-14">
          <div className="lg:col-span-5">
            <p className="section-label mb-4">Explorer</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-stone-100 leading-tight font-medium">
              Un écosystème média pensé pour inspirer et informer.
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <p className="text-stone-500 font-body text-base leading-relaxed max-w-lg">
              Comme un journal intime des builders africains — sans filtre, sans script. Chaque format ouvre une porte différente sur le même univers : celui de ceux qui osent.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            return (
              <button
                key={platform.id}
                onClick={handlers[platform.id]}
                className="platform-card text-left group"
              >
                <div className="relative z-10 space-y-3">
                  <Icon className="w-5 h-5 text-rose-500/70 group-hover:text-rose-500 transition" strokeWidth={1.5} />
                  <div>
                    <p className="section-label text-[0.6rem] mb-1 opacity-70">{platform.subtitle}</p>
                    <h3 className="font-display text-xl text-stone-100 font-medium leading-snug">
                      {platform.label}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 font-body leading-relaxed line-clamp-2">
                    {platform.desc}
                  </p>
                  <span className="link-arrow text-xs pt-1">
                    Découvrir <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
