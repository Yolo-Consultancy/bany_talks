import React, { useEffect, useState } from 'react';
import { HOST_DETAILS, TIMELINE_MILESTONES } from '../data';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import propos1 from '../assets/images/propos1.jpg';
import propos2 from '../assets/images/propos2.jpg';
import propos3 from '../assets/images/propos3.jpg';
import {
  fetchSiteContent,
  type SiteStatistic,
} from '../services/siteContentService';

interface StatsProps {
  onContactClick?: () => void;
}

const ABOUT_PHOTOS = [propos1, propos2, propos3];
const PHOTO_MS = 5500;
const PHOTO_FADE_S = 0.9;

function AboutPhotoCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      setIndex((current) => (current + 1) % ABOUT_PHOTOS.length);
    }, PHOTO_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const goTo = (next: number) => {
    setIndex((next + ABOUT_PHOTOS.length) % ABOUT_PHOTOS.length);
  };

  return (
    <div
      className="lg:col-span-6 relative aspect-[4/5] overflow-hidden order-2 group bg-stone-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.img
          key={ABOUT_PHOTOS[index]}
          src={ABOUT_PHOTOS[index]}
          alt="Bany en session studio"
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1.1 }}
          exit={{ opacity: 0, scale: 1.12 }}
          transition={{
            opacity: { duration: PHOTO_FADE_S, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: PHOTO_MS / 1000, ease: 'linear' },
          }}
        />
      </AnimatePresence>

      <button
        type="button"
        aria-label="Photo précédente"
        onClick={() => goTo(index - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-stone-950/60 border border-white/10 text-stone-100 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        aria-label="Photo suivante"
        onClick={() => goTo(index + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-stone-950/60 border border-white/10 text-stone-100 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {ABOUT_PHOTOS.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Photo ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-[3px] rounded-full transition-all duration-500 cursor-pointer ${
              i === index ? 'w-7 bg-rose-500' : 'w-2 bg-white/35 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      <motion.div
        key={index}
        className="absolute bottom-0 left-0 z-10 h-[2px] bg-rose-500/80"
        initial={{ width: '0%' }}
        animate={{ width: paused ? '0%' : '100%' }}
        transition={{ duration: paused ? 0 : PHOTO_MS / 1000, ease: 'linear' }}
        aria-hidden
      />
    </div>
  );
}

export default function Stats({ onContactClick }: StatsProps) {
  const [statistics, setStatistics] = useState<SiteStatistic[]>(HOST_DETAILS.statistics);
  const timeline = TIMELINE_MILESTONES;

  useEffect(() => {
    let cancelled = false;
    fetchSiteContent()
      .then((data) => {
        if (cancelled) return;
        if (data.statistics?.length) setStatistics(data.statistics);
      })
      .catch(() => {
        /* keep static fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="about-bany" className="bg-stone-950 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Intro — editorial split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-24 lg:mb-32">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <p className="section-label mb-6">À PROPOS</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-stone-100 leading-[1.1] font-medium">
              Qui est<br />Bany ?
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-5 sm:space-y-6">
              {HOST_DETAILS.longBio.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    index === 0
                      ? 'text-xl sm:text-2xl text-stone-300 font-body font-light leading-relaxed'
                      : 'text-base sm:text-lg text-stone-500 font-body leading-relaxed'
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
            {onContactClick && (
              <motion.button
                type="button"
                onClick={onContactClick}
                className="btn-primary text-xs sm:text-sm"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Entrer en contact
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        <hr className="editorial-rule mb-24 lg:mb-32" />

        {/* Stats + photo row — text first, image after */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 lg:mb-32">
          <div className="lg:col-span-6 space-y-10 order-1">
            <div>
              <p className="section-label mb-4">Chiffres clés</p>
              <div className="grid grid-cols-2 gap-8">
                {statistics.map((stat, idx) => (
                  <div key={`${stat.label}-${idx}`} className="space-y-1">
                    <span className="block font-display text-4xl sm:text-5xl text-rose-400 font-medium">
                      {stat.value}
                    </span>
                    <span className="block text-xs text-stone-500 font-body tracking-wide">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <blockquote className="border-l-2 border-rose-500/50 pl-6">
              <p className="font-display text-xl text-stone-300 italic leading-relaxed">
                « {HOST_DETAILS.quote} »
              </p>
              <cite className="block mt-3 text-sm text-stone-500 not-italic font-body">
                — {HOST_DETAILS.fullName}
              </cite>
            </blockquote>
          </div>

          <AboutPhotoCarousel />
        </div>

        {/* Timeline — parcours */}
        <div className="border-t border-white/5 pt-20 lg:pt-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-14 sm:mb-16 lg:mb-20">
            <div className="lg:col-span-5">
              <p className="section-label mb-4">Le parcours</p>
              <h3 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-stone-100 font-medium leading-[1.15]">
                Un parcours entre conseil, entrepreneuriat et médias
              </h3>
            </div>
            <div className="lg:col-span-7 flex lg:items-end">
              <p className="text-stone-500 font-body leading-relaxed text-sm sm:text-base max-w-xl lg:pb-1">
                Des premières expériences professionnelles à la création d’entreprises et au développement de BTX, un même fil conducteur : apprendre, construire et transmettre.
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Ligne verticale desktop */}
            <div
              className="hidden md:block absolute left-[calc(25%-0.5px)] top-3 bottom-3 w-px bg-gradient-to-b from-rose-500/70 via-white/10 to-white/5"
              aria-hidden
            />

            <ol className="space-y-0">
              {timeline.map((milestone, idx) => {
                const isCurrent = idx === 0;
                const isLast = idx === timeline.length - 1;

                return (
                  <motion.li
                    key={`${milestone.year}-${milestone.title}-${idx}`}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.55, delay: Math.min(idx * 0.06, 0.3), ease: [0.16, 1, 0.3, 1] }}
                    className={`group relative grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 ${
                      isLast ? 'pb-0' : 'pb-10 sm:pb-12 md:pb-14'
                    }`}
                  >
                    {/* Mobile rail */}
                    <div className="md:hidden absolute left-0 top-2 bottom-0 w-px bg-white/10" aria-hidden>
                      {!isLast && <span className="absolute inset-0 bg-gradient-to-b from-rose-500/40 to-transparent" />}
                    </div>

                    {/* Phase + node */}
                    <div className="md:col-span-3 relative pl-6 md:pl-0 md:pr-8">
                      <span
                        className={`absolute left-0 md:left-[calc(100%-0.5rem)] top-1.5 md:top-2 z-10 block h-2.5 w-2.5 -translate-x-1/2 rounded-full border transition-colors duration-300 ${
                          isCurrent
                            ? 'border-rose-400 bg-rose-500 shadow-[0_0_16px_rgba(239,59,59,0.55)]'
                            : 'border-white/25 bg-stone-950 group-hover:border-rose-500/60'
                        }`}
                        aria-hidden
                      />
                      <p
                        className={`font-display text-[0.65rem] sm:text-[0.7rem] tracking-[0.16em] uppercase font-semibold leading-snug ${
                          isCurrent ? 'text-rose-400' : 'text-rose-500/70'
                        }`}
                      >
                        {milestone.year}
                      </p>
                      {isCurrent && (
                        <span className="mt-2 inline-block text-[10px] tracking-[0.14em] uppercase text-stone-500 font-body">
                          En cours
                        </span>
                      )}
                    </div>

                    {/* Contenu */}
                    <div
                      className={`md:col-span-9 pl-6 md:pl-4 rounded-none transition-colors duration-300 ${
                        isCurrent
                          ? 'md:border md:border-rose-500/20 md:bg-rose-500/[0.04] md:px-6 md:py-5 lg:px-8 lg:py-6'
                          : 'md:hover:bg-white/[0.02] md:px-6 md:py-2 lg:px-8 lg:py-3'
                      }`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-8">
                        <h4
                          className={`lg:col-span-5 font-display font-medium leading-snug ${
                            isCurrent
                              ? 'text-xl sm:text-2xl text-stone-100'
                              : 'text-lg sm:text-xl text-stone-100 group-hover:text-white transition-colors'
                          }`}
                        >
                          {milestone.title}
                        </h4>
                        <p className="lg:col-span-7 text-sm sm:text-[0.95rem] text-stone-500 font-body leading-relaxed group-hover:text-stone-400 transition-colors">
                          {milestone.desc}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
