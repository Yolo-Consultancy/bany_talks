import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { HOST_DETAILS } from '../data';
import { motion, useAnimation } from 'framer-motion';

const HERO_TITLE = 'Bany';
const LETTER_STAGGER = 0.14;
const ENTRANCE_DELAY = 0.1;

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
        filter: 'blur(0px)',
        scale: 1,
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
      });
      if (cancelled) return;

      controls.start({
        y: [0, -14, 0, 8, 0],
        scale: [1, 1.07, 1, 0.97, 1],
        transition: {
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.25, 0.5, 0.75, 1],
        },
      });
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [controls, letterDelay]);

  return (
    <motion.span
      className="inline-block hero-letter"
      initial={{
        opacity: 0,
        y: 56,
        filter: 'blur(12px)',
        scale: 0.8,
      }}
      animate={controls}
    >
      {char}
    </motion.span>
  );
}

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    const play = () => {
      video.play().catch(() => setVideoFailed(true));
    };

    play();
    video.addEventListener('canplay', play);
    return () => video.removeEventListener('canplay', play);
  }, [videoFailed]);

  const showPoster = videoFailed || !HOST_DETAILS.heroVideo;

  return (
    <section
      id="hero-section"
      className="relative -mt-16 min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-stone-950"
    >
      {/* Background video or poster fallback */}
      <div className="absolute inset-0 z-0">
        {!showPoster && (
          <video
            ref={videoRef}
            className="hero-video-bg absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HOST_DETAILS.heroPoster}
            onError={() => setVideoFailed(true)}
          >
            <source src={HOST_DETAILS.heroVideo} type="video/mp4" />
          </video>
        )}

        {showPoster && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={HOST_DETAILS.heroPoster}
              alt=""
              className="hero-poster-zoom absolute inset-0 w-full h-full object-cover object-center"
              aria-hidden
            />
          </div>
        )}

        <div className="hero-overlay absolute inset-0" aria-hidden />
        <div className="absolute inset-0 bg-stone-950/20" aria-hidden />
      </div>

      {/* Title — Bany */}
      <div className="relative z-10 flex items-center justify-center w-full px-4 sm:px-6">
        <h1 className="hero-title hero-title-glow font-display font-black tracking-tight text-rose-500 text-center">
          <span className="inline-flex justify-center" aria-label={HERO_TITLE}>
            {HERO_TITLE.split('').map((char, index) => (
              <AnimatedLetter key={`${char}-${index}`} char={char} index={index} />
            ))}
          </span>
        </h1>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-stone-500">
        <span className="text-[10px] tracking-[0.2em] uppercase font-body">Scroll</span>
        <div className="w-px h-8 bg-stone-600 scroll-indicator" />
        <ArrowDown className="w-3.5 h-3.5 opacity-50" />
      </div>
    </section>
  );
}
