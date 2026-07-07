import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { HOST_DETAILS } from '../data';

interface HeroProps {
  onExploreEpisodes: () => void;
  onInviteBany: () => void;
}

export default function Hero({ onExploreEpisodes, onInviteBany }: HeroProps) {
  return (
    <section
      id="hero-section"
      className="relative min-h-0 lg:min-h-[92vh] flex flex-col justify-start lg:justify-end overflow-hidden bg-stone-950"
    >
      {/* Subtle ambient glow */}
      <div className="absolute top-0 right-0 w-[55%] h-[70%] bg-rose-500/4 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pb-10 lg:pb-24 pt-24 sm:pt-28 lg:pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center lg:items-end justify-items-center lg:justify-items-stretch">

          {/* Editorial copy — first on mobile so buttons stay above the fold */}
          <div className="w-full max-w-lg lg:max-w-none lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8">
            <p className="section-label w-full text-center lg:text-left">
              Entrepreneur · Speaker · Podcast
            </p>

            <h1 className="w-full font-display text-[1.75rem] leading-tight sm:text-[2.75rem] lg:text-[3.75rem] xl:text-[4.25rem] sm:leading-[1.08] text-stone-100 font-medium tracking-tight text-center lg:text-left">
              Bany Talks — des conversations vraies avec ceux qui{' '}
              <em className="text-rose-400 not-italic font-normal">construisent l'Afrique.</em>
            </h1>

            <p className="w-full text-sm sm:text-lg lg:text-xl text-stone-400 font-body max-w-xl leading-relaxed font-light line-clamp-3 sm:line-clamp-none text-center lg:text-left">
              {HOST_DETAILS.tagline} Un voyage sans filtre au cœur des récits, des stratégies et des visions des leaders qui façonnent le continent.
            </p>

            <div className="w-full flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
              <button onClick={onExploreEpisodes} className="btn-primary text-xs sm:text-sm py-3 px-4 sm:px-7">
                Explorer les épisodes
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={onInviteBany} className="btn-ghost text-xs sm:text-sm py-3 px-4 sm:px-7">
                Inviter Bany
              </button>
            </div>

            <div className="hidden sm:flex pt-2 lg:pt-4 flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-2 text-sm text-stone-500 font-body">
              <span>Disponible sur</span>
              <a href={HOST_DETAILS.socialLinks.youtube} target="_blank" rel="noreferrer" className="hover:text-rose-400 transition">YouTube</a>
              <a href={HOST_DETAILS.socialLinks.spotify} target="_blank" rel="noreferrer" className="hover:text-rose-400 transition">Spotify</a>
              <a href={HOST_DETAILS.socialLinks.apple} target="_blank" rel="noreferrer" className="hover:text-rose-400 transition">Apple Podcasts</a>
            </div>
          </div>

          {/* Portrait — desktop only */}
          <div className="hidden lg:block lg:col-span-5 relative w-full lg:max-w-none">
            <div className="relative lg:ml-auto">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={HOST_DETAILS.avatar}
                  alt={HOST_DETAILS.fullName}
                  className="w-full h-full object-cover object-top grayscale-[30%] hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-center lg:text-left">
                <p className="section-label mb-2">{HOST_DETAILS.title}</p>
                <h2 className="font-display text-2xl lg:text-3xl text-stone-100 font-medium">
                  {HOST_DETAILS.fullName}
                </h2>
                <p className="mt-2 text-sm text-stone-500 italic font-body leading-relaxed max-w-xs mx-auto lg:mx-0">
                  « {HOST_DETAILS.quote.substring(0, 90)}… »
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue — desktop only */}
      <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-stone-600">
        <span className="text-[10px] tracking-[0.2em] uppercase font-body">Scroll</span>
        <div className="w-px h-8 bg-stone-700 scroll-indicator" />
        <ArrowDown className="w-3.5 h-3.5 opacity-40" />
      </div>
    </section>
  );
}
