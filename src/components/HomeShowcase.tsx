import React from 'react';
import { ArrowRight, Mic2, Users, BookOpen } from 'lucide-react';

import InviteCta from './InviteCta';

interface HomeShowcaseProps {
  onExploreEpisodes: () => void;
  onAbout: () => void;
  onBlog: () => void;
  onInvite: () => void;
}

const PLATFORMS = [
  {
    id: 'episodes',
    label: 'BTX',
    subtitle: 'ÉMISSIONS & PODCASTS',
    desc: 'Conversations, analyses et décryptages autour du business, de l’entrepreneuriat, de l’investissement et de l’économie africaine.',
    cta: 'Découvrir BTX',
    icon: Mic2,
  },
  {
    id: 'about',
    label: "Le parcours de Bany",
    subtitle: 'À propos',
    desc: "Consultant, entrepreneur et homme de média : découvrez mon parcours, mes projets et les convictions qui guident mon travail.",
    cta: 'Découvrir',
    icon: Users,
  },
  {
    id: 'blog',
    label: 'Idées & perspectives',
    subtitle: 'Articles & analyses',
    desc: 'Analyses et prises de recul sur le business, l’économie, l’investissement, l’entrepreneuriat et les transformations africaines.',
    cta: 'Lire les articles',
    icon: BookOpen,
  },
];

export default function HomeShowcase({ onExploreEpisodes, onAbout, onBlog, onInvite }: HomeShowcaseProps) {
  const handlers: Record<string, () => void> = {
    episodes: onExploreEpisodes,
    about: onAbout,
    blog: onBlog,
  };

  return (
    <section className="bg-stone-950 py-20 lg:py-28 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-14">
          <div className="lg:col-span-5">
            <p className="section-label mb-4">Explorer</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-stone-100 leading-tight font-medium">
            Comprendre. Entreprendre. Transmettre.
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <p className="text-stone-500 font-body text-base leading-relaxed max-w-lg">
            Mon travail se situe au croisement du business, de l’entrepreneuriat et des médias. Découvrez mes conversations, mon parcours et mes analyses sur les idées, les entreprises et les personnes qui construisent l’Afrique.            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
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
                    {platform.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <InviteCta
          className="mt-14 lg:mt-16"
          onInvite={onInvite}
          title="Conférences, panels & keynotes "
          subtitle="Invitez Bany pour une keynote, un panel, une modération ou une conversation autour du business, de l’entrepreneuriat, de l’investissement et des transformations africaines."
          label="Faire venir Bany"
        />
      </div>
    </section>
  );
}
