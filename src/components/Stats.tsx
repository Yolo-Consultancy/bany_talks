import React, { useEffect, useState } from 'react';
import { HOST_DETAILS, TIMELINE_MILESTONES } from '../data';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import propos1 from '../assets/images/propos1.jpg';
import propos2 from '../assets/images/propos2.jpg';
import propos3 from '../assets/images/propos3.jpg';
import {
  fetchSiteContent,
  formatMilestoneDate,
  type SiteStatistic,
  type TimelineMilestone,
} from '../services/siteContentService';

interface StatsProps {
  onInviteClick?: () => void;
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

export default function Stats({ onInviteClick }: StatsProps) {
  const [statistics, setStatistics] = useState<SiteStatistic[]>(HOST_DETAILS.statistics);
  const [timeline, setTimeline] = useState<TimelineMilestone[]>(TIMELINE_MILESTONES);

  useEffect(() => {
    let cancelled = false;
    fetchSiteContent()
      .then((data) => {
        if (cancelled) return;
        if (data.statistics?.length) setStatistics(data.statistics);
        if (data.timeline?.length) setTimeline(data.timeline);
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
            <p className="section-label mb-6">L'hôte derrière le micro</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-stone-100 leading-[1.1] font-medium">
              Qui est<br />Bany ?
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <p className="text-xl sm:text-2xl text-stone-300 font-body font-light leading-relaxed">
              {HOST_DETAILS.longBio}
            </p>
            {onInviteClick && (
              <motion.button
                type="button"
                onClick={onInviteClick}
                className="btn-primary text-xs sm:text-sm"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Inviter Bany pour votre événement
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

        {/* Timeline — Steven Bartlett style */}
        <div className="border-t border-white/5 pt-20 lg:pt-28">
          <div className="mb-16 lg:mb-20">
            <p className="section-label mb-4">Le parcours</p>
            <h3 className="font-display text-3xl sm:text-4xl text-stone-100 font-medium">
              Des origines modestes
            </h3>
          </div>

          <div className="space-y-0">
            {timeline.map((milestone, idx) => (
              <motion.div
                key={`${milestone.year}-${milestone.month ?? 'y'}-${milestone.title}-${idx}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10 border-b border-white/5 group"
              >
                <div className="md:col-span-3">
                  <span className="font-display text-sm sm:text-base lg:text-lg text-rose-500/80 font-medium group-hover:text-rose-400 transition leading-snug">
                    {formatMilestoneDate(milestone)}
                  </span>
                </div>
                <div className="md:col-span-3">
                  <h4 className="font-display text-xl sm:text-2xl text-stone-100 font-medium">
                    {milestone.title}
                  </h4>
                </div>
                <div className="md:col-span-6">
                  <p className="text-stone-500 font-body leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
