import React, { useEffect, useMemo } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { Episode } from '../types';

const HERO_TITLE = 'LIVE';
const LETTER_STAGGER = 0.12;
const ENTRANCE_DELAY = 0.2;
const MIN_TILES = 36;

function AnimatedLetter({ char, index }: { char: string; index: number }) {
  const controls = useAnimation();
  const letterDelay = index * LETTER_STAGGER + ENTRANCE_DELAY;

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await new Promise((resolve) => window.setTimeout(resolve, letterDelay * 1000));
      if (cancelled) return;

      await controls.start({
        opacity: 1,
        y: 0,
        x: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
      });
      if (cancelled) return;

      controls.start({
        opacity: [1, 0.72, 1],
        y: [0, -6, 0],
        transition: {
          duration: 2.6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.22,
        },
      });
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [controls, letterDelay, index]);

  return (
    <motion.span
      className="inline-block hero-letter"
      initial={{
        opacity: 0,
        y: -40,
        x: 20,
        clipPath: 'inset(0 100% 0 0)',
      }}
      animate={controls}
    >
      {char}
    </motion.span>
  );
}

interface EpisodesHeroProps {
  episodes: Episode[];
}

export default function EpisodesHero({ episodes }: EpisodesHeroProps) {
  const tiles = useMemo(() => {
    const urls = episodes
      .map((ep) => ep.thumbnail)
      .filter((src): src is string => Boolean(src));

    if (urls.length === 0) return [];

    const filled: string[] = [];
    while (filled.length < MIN_TILES) {
      filled.push(...urls);
    }
    return filled.slice(0, MIN_TILES);
  }, [episodes]);

  return (
    <section
      id="episodes-hero"
      className="relative -mt-16 min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-stone-950"
    >
      <div className="absolute inset-0 z-0">
        {tiles.length > 0 ? (
          <div className="absolute inset-0 scale-[1.08] origin-center overflow-hidden" aria-hidden>
            <div className="grid h-full w-full grid-cols-3 gap-0.5 sm:grid-cols-4 md:grid-cols-6 [grid-auto-rows:minmax(0,1fr)]">
              {tiles.map((src, i) => (
                <div key={`${src}-${i}`} className="relative min-h-0 overflow-hidden bg-stone-900">
                  <img
                    src={src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={i < 12 ? 'eager' : 'lazy'}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-stone-900" aria-hidden />
        )}

        <div className="hero-overlay absolute inset-0" aria-hidden />
        <div className="absolute inset-0 bg-stone-950/45" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/50"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex items-center justify-center w-full px-2 sm:px-4">
        <h1 className="hero-title hero-title-glow font-display font-black tracking-tight text-rose-500 text-center w-full">
          <span className="inline-flex justify-center" aria-label={HERO_TITLE}>
            {HERO_TITLE.split('').map((char, index) => (
              <AnimatedLetter key={`${char}-${index}`} char={char} index={index} />
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
