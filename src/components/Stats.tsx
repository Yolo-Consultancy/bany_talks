import React from 'react';
import { HOST_DETAILS, TIMELINE_MILESTONES } from '../data';
import { Target, TrendingUp, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsProps {
  onInviteClick?: () => void;
}

export default function Stats({ onInviteClick }: StatsProps) {
  return (
    <section 
      id="about-bany"
      className="bg-stone-950 py-16 lg:py-24 border-b border-stone-800/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Info Header */}
        <div className="flex flex-col gap-16 mb-16">
          
          {/* Block 1: Intro Text (Left) + Photo 1 (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 text-left space-y-6 lg:pr-8">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold tracking-widest text-rose-500 uppercase bg-rose-500/10 px-3 py-1 rounded-full">
                  L’HÔTE DERRIÈRE LE MICRO
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight uppercase leading-none">
                  Qui est Bany ?
                </h2>
                <p className="text-sm font-mono text-stone-500">
                  Unyvoque, audacieux et engagé à libérer le potentiel d’expression d’une génération.
                </p>
                <p className="text-base sm:text-lg text-stone-300 font-sans leading-relaxed">
                  {HOST_DETAILS.longBio}
                </p>
              </div>

              {onInviteClick && (
                <button
                  onClick={onInviteClick}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-3.5 bg-rose-500 hover:bg-rose-400 text-stone-950 text-xs font-black uppercase tracking-wider rounded-xl transition duration-150 cursor-pointer shadow-lg shadow-rose-500/5 hover:translate-x-0.5 active:translate-x-0"
                >
                  Inviter Bany ↗
                </button>
              )}
            </div>

            <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-stone-800/80 aspect-4/5 bg-stone-950 shadow-2xl group w-full max-w-md mx-auto lg:mx-0">
              <img 
                src={HOST_DETAILS.aboutpicture} 
                alt="Banyabo Bigomokero Studio Session" 
                className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:scale-102 transition duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 bg-stone-900/90 border border-stone-800 px-3 py-1.5 rounded text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest">
                🎙️ En Session Live
              </div>
            </div>
            
          </div>

          {/* Block 2: Photo 2 (Left) + Mission/Impact (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 order-2 lg:order-1 relative overflow-hidden rounded-2xl border border-stone-800/80 aspect-video md:aspect-4/3 bg-stone-950 shadow-xl group w-full max-w-md mx-auto lg:mx-0">
              <img 
                src={HOST_DETAILS.avatar} 
                alt="Banyabo Bigomokero Host Portrait" 
                className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-103 transition duration-700 ease-in-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-950/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 bg-stone-900/90 border border-stone-800 px-3 py-1.5 rounded text-[10px] font-mono font-bold text-stone-200 uppercase tracking-widest">
                💡 Hôte Passionné
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 lg:pl-8 text-left">
              
              <div className="p-6 bg-stone-900/40 border border-stone-800/80 rounded-2xl flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-stone-100 uppercase tracking-tight">Notre Mission</h4>
                  <p className="text-sm text-stone-400 mt-2 leading-relaxed">
                    Livrer des conversations d'une transparence absolue pour inspirer l'esprit d'entreprise, l'autonomie et le dépassement de soi. Créer des déclics chez nos auditeurs.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-stone-900/40 border border-stone-800/80 rounded-2xl flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-stone-100 uppercase tracking-tight">Impact d'Audience</h4>
                  <p className="text-sm text-stone-400 mt-2 leading-relaxed">
                    Convertir l'attention volatile en connaissances tangibles, avec des outils de mise en action concrets par épisode. Construire une génération de bâtisseurs.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Polished Grid Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-stone-900/40 border border-stone-800/80 p-6 rounded-2xl mb-16 shadow-xl">
          {HOST_DETAILS.statistics.map((stat, idx) => (
            <div key={idx} className="text-center p-4 space-y-1">
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rose-400 tracking-tight font-mono">
                {stat.value}
              </span>
              <span className="block text-[11px] sm:text-xs font-mono uppercase tracking-widest text-stone-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Animated Centered Timeline */}
        <div className="space-y-12 mt-24 bg-stone-800/50 border border-stone-800/80 p-8 rounded-2xl">
          <div className="text-center space-y-3">
            <span className="inline-block text-xs font-mono font-bold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full">
              Le Parcours
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-stone-100">
              Timeline de l'Émission
            </h3>
          </div>

          <div className="relative max-w-5xl mx-auto py-10">
            {/* The Central Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-stone-700 md:-translate-x-1/2" />

            {TIMELINE_MILESTONES.map((milestone, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 50, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.1 }}
                  className={`relative flex items-center justify-between md:justify-normal w-full mb-12 last:mb-0 ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  
                  {/* Empty half for desktop alignment */}
                  <div className="hidden md:block w-1/2" />

                  {/* Node bullet */}
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full border-4 border-stone-950 bg-rose-500 transform -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(245,158,11,0.6)]" />

                  {/* Content card */}
                  <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                    <div className="bg-stone-900/40 hover:bg-stone-900/70 border border-stone-800/80 p-6 rounded-2xl transition duration-300 group shadow-lg">
                      <span className={`inline-block font-mono text-sm font-black text-rose-500 mb-3 bg-rose-500/10 px-3 py-1.5 rounded-lg group-hover:scale-105 transition-transform ${isEven ? 'md:origin-right' : 'md:origin-left'} origin-left`}>
                        {milestone.year}
                      </span>
                      <h4 className="text-lg font-bold text-stone-100 tracking-tight uppercase mb-2">
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-stone-400 leading-relaxed font-sans">
                        {milestone.desc}
                      </p>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
