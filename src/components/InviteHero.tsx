import React, { useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

const INVITE_HERO_BG = '/bany_about.jpg';
const TITLE_LINE = 'TRAVAILLER AVEC BANY';
/** Mobile: 2 lignes lisibles · Desktop: 3 mots en ligne */
const TITLE_LINES_MOBILE = ['TRAVAILLER AVEC', 'BANY'] as const;
const WORDS = TITLE_LINE.split(' ');
const WORD_STAGGER = 0.22;
const ENTRANCE_DELAY = 0.15;

function AnimatedWord({ word, index }: { word: string; index: number }) {
  const controls = useAnimation();
  const delay = index * WORD_STAGGER + ENTRANCE_DELAY;

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await new Promise((resolve) => window.setTimeout(resolve, delay * 1000));
      if (cancelled) return;

      await controls.start({
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
      });
      if (cancelled) return;

      controls.start({
        opacity: [1, 0.82, 1],
        transition: {
          duration: 3.4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.35,
        },
      });
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [controls, delay, index]);

  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 36, filter: 'blur(10px)' }}
      animate={controls}
    >
      {word}
    </motion.span>
  );
}

export default function InviteHero() {
  return (
    <section
      id="invite-hero"
      className="relative -mt-16 min-h-[100svh] min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-stone-950"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={INVITE_HERO_BG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-[center_42%] sm:object-[center_40%] md:object-center"
            aria-hidden
          />
        </div>
        <div className="hero-overlay absolute inset-0" aria-hidden />
        <div className="absolute inset-0 bg-stone-950/40 sm:bg-stone-950/35 md:bg-stone-950/40" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-stone-950/55"
          aria-hidden
        />
      </div>

      {/* Mobile: titre en haut · Desktop: centré */}
      <div className="absolute z-10 inset-x-0 top-[max(5.5rem,11vh)] flex justify-center px-4 sm:px-6 md:inset-0 md:top-0 md:items-center md:px-8">
        <h1
          className="font-display font-black tracking-tight text-rose-500 hero-title-glow leading-[0.92] uppercase text-center w-full max-w-[min(100%,42rem)] md:max-w-[95vw]"
          aria-label={TITLE_LINE}
        >
          {/* Mobile / tablette portrait : 2 lignes */}
          <span
            className="flex flex-col items-center gap-1 sm:gap-1.5 md:hidden"
            style={{ fontSize: 'clamp(1.65rem, 8.5vw, 3.25rem)' }}
            aria-hidden
          >
            {TITLE_LINES_MOBILE.map((line, index) => (
              <AnimatedWord key={line} word={line} index={index} />
            ))}
          </span>

          {/* Desktop : 3 mots */}
          <span
            className="hidden md:flex md:flex-row md:flex-wrap md:justify-center md:gap-x-[0.28em] md:gap-y-1"
            style={{ fontSize: 'clamp(3rem, 7.5vw, 7rem)' }}
            aria-hidden
          >
            {WORDS.map((word, index) => (
              <AnimatedWord key={`${word}-${index}`} word={word} index={index} />
            ))}
          </span>
        </h1>
      </div>

      <div className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-stone-500 pb-2">
        <span className="text-[10px] tracking-[0.2em] uppercase font-body">Scroll</span>
        <div className="w-px h-8 bg-stone-600 scroll-indicator" />
        <ArrowDown className="w-3.5 h-3.5 opacity-50" />
      </div>
    </section>
  );
}
