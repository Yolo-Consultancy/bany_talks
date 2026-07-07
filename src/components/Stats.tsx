import React from 'react';
import { HOST_DETAILS, TIMELINE_MILESTONES } from '../data';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsProps {
  onInviteClick?: () => void;
}

export default function Stats({ onInviteClick }: StatsProps) {
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
              <button onClick={onInviteClick} className="link-arrow text-base">
                Inviter Bany pour votre événement
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <hr className="editorial-rule mb-24 lg:mb-32" />

        {/* Photo + stats row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 lg:mb-32">
          <div className="lg:col-span-6 relative aspect-[4/5] overflow-hidden">
            <img
              src={HOST_DETAILS.aboutpicture}
              alt="Bany en session studio"
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition duration-700"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="lg:col-span-6 space-y-10">
            <div>
              <p className="section-label mb-4">Chiffres clés</p>
              <div className="grid grid-cols-2 gap-8">
                {HOST_DETAILS.statistics.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
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
            {TIMELINE_MILESTONES.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10 border-b border-white/5 group"
              >
                <div className="md:col-span-2">
                  <span className="font-display text-3xl sm:text-4xl text-rose-500/80 font-medium group-hover:text-rose-400 transition">
                    {milestone.year}
                  </span>
                </div>
                <div className="md:col-span-4">
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
