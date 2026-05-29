import React from 'react';
import { Play, Calendar, Video, ArrowRight, Radio } from 'lucide-react';
import { HOST_DETAILS } from '../data';

interface HeroProps {
  onExploreEpisodes: () => void;
  onInviteBany: () => void;
}

export default function Hero({ onExploreEpisodes, onInviteBany }: HeroProps) {
  return (
    <section 
      id="hero-section"
      className="relative overflow-hidden bg-linear-to-b from-stone-950 via-stone-900 to-stone-950 py-16 lg:py-24 border-b border-stone-800/60"
    >
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-96 bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Slogans and CTAs / Left-side */}
          <div className="lg:col-span-7 text-left space-y-6 lg:pr-6">
            
            {/* Live indicator / badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-rose-500 uppercase">
                PODCAST & MÉDIA PREMIUM • DISPONIBLE
              </span>
            </div>

            {/* Powerful display title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-stone-100 uppercase leading-[1.05]">
              Conversations <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-400 via-rose-500 to-rose-600">
                vraies.
              </span> <br />
              Des histoires qui marquent.
            </h1>

            {/* Slogan details */}
            <p className="text-lg text-stone-300 font-sans max-w-xl leading-relaxed">
              {HOST_DETAILS.tagline}
            </p>
            
            {/* Bio brief */}
            <p className="text-sm text-stone-400 max-w-lg leading-relaxed font-mono">
              Rejoignez plus de 450,000 auditeurs mensuels et découvrez des entretiens exclusifs avec les créateurs, fondateurs et leaders d’opinion de notre époque.
            </p>

            {/* Interactive CTAs */}
            <div className="flex flex-row gap-2 sm:gap-3 pt-4">
              
              <button
                onClick={onInviteBany}
                className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-2.5 sm:py-3.5 bg-rose-500 hover:bg-rose-400 text-stone-950 font-bold font-mono rounded-lg sm:rounded-xl transition cursor-pointer transform hover:scale-102 shadow-lg shadow-rose-500/10 animate-pulse text-xs sm:text-sm whitespace-nowrap"
              >
                <span className="flex items-center gap-1.5 animate-pulse font-mono text-xs sm:text-sm uppercase font-bold text-stone-950">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <Calendar className="w-4 h-4" />
                  INVITER BANY
                </span>
              </button>

              <button 
                onClick={onExploreEpisodes}
                className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-2.5 sm:py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-100 border border-stone-800 hover:border-stone-700 font-bold font-mono rounded-lg sm:rounded-xl transition cursor-pointer transform active:scale-95 text-xs sm:text-sm whitespace-nowrap"
              >
                <Video className="w-4 h-4 text-stone-400" />
                EXPLORER LES ÉPISODES
              </button>
            </div>

            {/* Quick streaming channels preview */}
            <div className="pt-6 flex flex-wrap items-center gap-5 text-stone-500">
              <span className="text-xs uppercase font-mono tracking-widest">Disponible sur :</span>
              <div className="flex items-center gap-4 text-xs font-mono font-medium text-stone-400">
                <span className="flex items-center gap-1.5 hover:text-rose-500 transition">
                  <Radio className="w-3.5 h-3.5 text-stone-500" /> Spotify
                </span>
                <span className="flex items-center gap-1.5 hover:text-rose-500 transition">
                  <Radio className="w-3.5 h-3.5 text-stone-500" /> Youtube
                </span>
                <span className="flex items-center gap-1.5 hover:text-rose-500 transition">
                  <Radio className="w-3.5 h-3.5 text-stone-500" /> Apple Podcasts
                </span>
              </div>
            </div>

          </div>

          {/* Portrait of Host Bany / Right-side */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none group">
              
              {/* Outer light aura */}
              <div className="absolute -inset-1.5 bg-linear-to-r from-rose-500 via-rose-400 to-rose-500 rounded-3xl blur-md opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              
              <div className="relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 aspect-4/5 md:aspect-square lg:aspect-3/4">
                <img 
                  src={HOST_DETAILS.avatar} 
                  alt="Bany Talks Host Portrait" 
                  className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating caption overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-stone-950 via-stone-950/70 to-transparent p-6 text-left">
                  <p className="text-xs font-mono text-rose-500 uppercase tracking-widest mb-1">
                    {HOST_DETAILS.title}
                  </p>
                  <h3 className="text-xl font-bold text-stone-100 tracking-tight">
                    {HOST_DETAILS.fullName}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 italic line-clamp-2">
                    "{HOST_DETAILS.quote}"
                  </p>
                </div>
              </div>

              {/* Graphic badges */}
              <div className="absolute -top-4 -right-4 bg-stone-900 border border-stone-800 text-stone-100 px-4 py-2.5 rounded-xl shadow-lg font-mono text-xs flex flex-col items-center">
                <span className="text-rose-500 font-bold text-lg leading-none">124</span>
                <span className="text-[9px] uppercase font-bold text-stone-500 mt-1">Émissions actives</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
