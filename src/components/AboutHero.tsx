import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import BanyTypewriterTitle from './BanyTypewriterTitle';

const ABOUT_SLIDES = [
  {
    src: encodeURI('/bannière1.png'),
    className: 'object-[right_48%] md:object-[right_center]',
  },
  {
    src: encodeURI('/bannière2.png'),
    className: 'object-[right_36%] md:object-[right_40%]',
  },
  {
    src: encodeURI('/bannière3.png'),
    className: 'object-[62%_58%] md:object-[58%_center]',
  },
  {
    src: encodeURI('/bannière4.png'),
    className: 'object-[right_48%] md:object-[right_center]',
  },
];
const SLIDE_MS = 6500;
const FADE_S = 1.35;

export default function AboutHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    ABOUT_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });

    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      setIndex((current) => (current + 1) % ABOUT_SLIDES.length);
    }, SLIDE_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="about-hero"
      className="relative -mt-16 min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-stone-950"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 overflow-hidden bg-stone-950">
          <AnimatePresence initial={false} mode="sync">
            <motion.img
              key={ABOUT_SLIDES[index].src}
              src={ABOUT_SLIDES[index].src}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover origin-right ${ABOUT_SLIDES[index].className}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: FADE_S, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden
            />
          </AnimatePresence>
        </div>
        <div className="hero-overlay absolute inset-0" aria-hidden />
        <div className="absolute inset-0 bg-stone-950/25" aria-hidden />
      </div>

      <div className="absolute z-10 inset-x-0 top-[14vh] flex justify-center px-4 md:inset-0 md:top-0 md:items-center md:justify-start md:pl-12 lg:pl-20 md:pr-4">
        <BanyTypewriterTitle
          align="left"
          className="scale-[0.78] sm:scale-[0.82] origin-center md:origin-left"
        />
      </div>

      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 text-stone-500">
        <div className="flex items-center gap-2" aria-hidden>
          {ABOUT_SLIDES.map((slide, i) => (
            <span
              key={slide.src}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                i === index ? 'w-7 bg-rose-500' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] tracking-[0.2em] uppercase font-body">Scroll</span>
        <div className="w-px h-8 bg-stone-600 scroll-indicator" />
        <ArrowDown className="w-3.5 h-3.5 opacity-50" />
      </div>

      <motion.div
        key={index}
        className="absolute bottom-0 left-0 z-20 h-[2px] bg-rose-500/80"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
        aria-hidden
      />
    </section>
  );
}
