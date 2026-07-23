import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_TITLE = 'BANY';
const TYPE_MS = 300;
const HOLD_MS = 1400;
const ERASE_MS = 200;
const GAP_MS = 450;

type BanyTypewriterTitleProps = {
  className?: string;
  align?: 'center' | 'left';
};

export default function BanyTypewriterTitle({
  className = '',
  align = 'center',
}: BanyTypewriterTitleProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

    const loop = async () => {
      while (!cancelled) {
        for (let i = 1; i <= HERO_TITLE.length; i++) {
          if (cancelled) return;
          setVisibleCount(i);
          await wait(TYPE_MS);
        }

        await wait(HOLD_MS);
        if (cancelled) return;

        for (let i = HERO_TITLE.length - 1; i >= 0; i--) {
          if (cancelled) return;
          setVisibleCount(i);
          await wait(ERASE_MS);
        }

        await wait(GAP_MS);
      }
    };

    loop();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = HERO_TITLE.slice(0, visibleCount);

  return (
    <h1
      className={`hero-title hero-title-glow font-display font-black tracking-tight text-rose-500 ${
        align === 'left' ? 'text-center md:text-left' : 'text-center w-full'
      } ${className}`}
      aria-label={HERO_TITLE}
    >
      <span
        className={`inline-flex min-h-[0.8em] items-end ${
          align === 'left' ? 'justify-center md:justify-start' : 'justify-center'
        }`}
      >
        <AnimatePresence mode="popLayout">
          {visible.split('').map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              className="inline-block hero-letter"
              initial={{ opacity: 0, y: 28, filter: 'blur(10px)', scale: 0.85 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, y: -16, filter: 'blur(8px)', scale: 0.9 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {char}
            </motion.span>
          ))}
        </AnimatePresence>
        <motion.span
          className="inline-block w-[0.08em] h-[0.7em] ml-[0.04em] mb-[0.06em] bg-rose-500/90 self-end"
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />
      </span>
    </h1>
  );
}
