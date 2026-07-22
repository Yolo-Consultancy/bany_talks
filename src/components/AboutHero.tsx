import React, { useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

const ABOUT_HERO_BG = '/bany_about.jpg';

const HERO_TITLE = 'BTX';
const LETTER_STAGGER = 0.18;
const ENTRANCE_DELAY = 0.15;

function AnimatedLetter({ char, index }: { char: string; index: number }) {
  const controls = useAnimation();
  const letterDelay = index * LETTER_STAGGER + ENTRANCE_DELAY;
  const swayDir = index % 2 === 0 ? 1 : -1;

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await new Promise((resolve) => window.setTimeout(resolve, letterDelay * 1000));
      if (cancelled) return;

      await controls.start({
        opacity: 1,
        scale: 1,
        rotateX: 0,
        rotateZ: 0,
        y: 0,
        transition: { type: 'spring', stiffness: 140, damping: 11, mass: 0.85 },
      });
      if (cancelled) return;

      controls.start({
        rotateZ: [0, 3.5 * swayDir, 0, -2.5 * swayDir, 0],
        scale: [1, 1.03, 1, 1.015, 1],
        transition: {
          duration: 4.8,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.28, 0.55, 0.78, 1],
        },
      });
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [controls, letterDelay, swayDir]);

  return (
    <motion.span
      className="inline-block hero-letter origin-bottom"
      style={{ transformStyle: 'preserve-3d' }}
      initial={{
        opacity: 0,
        scale: 0.15,
        rotateX: 75,
        rotateZ: -18 * swayDir,
        y: 24,
      }}
      animate={controls}
    >
      {char}
    </motion.span>
  );
}

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
        <h1 className="hero-title hero-title-glow font-display font-black tracking-tight text-rose-500 text-center md:text-left">
          <span
            className="inline-flex justify-center md:justify-start scale-100"
            style={{ perspective: 900 }}
            aria-label={HERO_TITLE}
          >
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
