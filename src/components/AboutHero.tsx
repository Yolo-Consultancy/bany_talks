import React from 'react';
import { ArrowDown } from 'lucide-react';
import BanyTypewriterTitle from './BanyTypewriterTitle';

const ABOUT_HERO_BG = '/bany_about.jpg';

export default function AboutHero() {
  return (
    <section
      id="about-hero"
      className="relative -mt-16 min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-stone-950"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={ABOUT_HERO_BG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-[center_42%] md:object-center"
            aria-hidden
          />
        </div>
        <div className="hero-overlay absolute inset-0" aria-hidden />
        <div className="absolute inset-0 bg-stone-950/20" aria-hidden />
      </div>

      <div className="absolute z-10 inset-x-0 top-[14vh] flex justify-center px-4 md:inset-0 md:top-0 md:items-center md:justify-start md:pl-12 lg:pl-20 md:pr-4">
        <BanyTypewriterTitle
          align="left"
          className="scale-[0.78] sm:scale-[0.82] origin-center md:origin-left"
        />
      </div>

      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-stone-500">
        <span className="text-[10px] tracking-[0.2em] uppercase font-body">Scroll</span>
        <div className="w-px h-8 bg-stone-600 scroll-indicator" />
        <ArrowDown className="w-3.5 h-3.5 opacity-50" />
      </div>
    </section>
  );
}
