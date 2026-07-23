import React, { useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

const INVITE_HERO_BG = '/bany_about.jpg';
const TITLE_LINE = 'Inviter Bany';
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
      className="relative -mt-16 min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-stone-950"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={INVITE_HERO_BG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-[center_45%] sm:object-[center_40%] md:object-center"
            aria-hidden
          />
        </div>
        <div className="hero-overlay absolute inset-0" aria-hidden />
        <div className="absolute inset-0 bg-stone-950/35 md:bg-stone-950/40" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-stone-950/50"
          aria-hidden
        />
      </div>

      {/* Mobile: title en haut pour laisser le visage visible · Desktop: centré */}
      <div className="absolute z-10 inset-x-0 top-[12vh] flex justify-center px-5 sm:px-8 md:inset-0 md:top-0 md:items-center md:px-6">
        <h1
          className="font-display font-black tracking-tight text-rose-500 hero-title-glow leading-[0.9] uppercase text-center max-w-[95vw]"
          style={{ fontSize: 'clamp(2.4rem, 14vw, 7.5rem)' }}
          aria-label={TITLE_LINE}
        >
          <span className="flex flex-col items-center gap-1 sm:gap-2 md:flex-row md:flex-wrap md:justify-center md:gap-x-[0.28em]">
            {WORDS.map((word, index) => (
              <AnimatedWord key={`${word}-${index}`} word={word} index={index} />
            ))}
          </span>
        </h1>
      </div>

      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-stone-500">
        <span className="text-[10px] tracking-[0.2em] uppercase font-body">Scroll</span>
        <div className="w-px h-8 bg-stone-600 scroll-indicator" />
        <ArrowDown className="w-3.5 h-3.5 opacity-50" />
      </div>
    </section>
  );
}
