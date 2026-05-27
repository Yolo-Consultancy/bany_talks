import React, { useState } from 'react';
import { ArrowLeft, Play, Clock, Share2, Linkedin, Twitter, MessageSquare, Copy, Check, Heart } from 'lucide-react';
import { Episode, Timestamp } from '../types';

interface EpisodeDetailProps {
  episode: Episode;
  onBackToList: () => void;
  onPlayClick: (episode: Episode) => void;
  onSeekTo: (seconds: number) => void;
}

export default function EpisodeDetail({
  episode,
  onBackToList,
  onPlayClick,
  onSeekTo,
}: EpisodeDetailProps) {
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(episode.likesCount);
  const [hasLiked, setHasLiked] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLikeClick = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  return (
    <section 
      id="episode-detail-section"
      className="bg-stone-950 py-12 lg:py-20 border-b border-stone-800/60 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToList}
            className="group flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 hover:text-stone-100 rounded-xl transition cursor-pointer font-mono text-xs font-bold uppercase"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour à la liste
          </button>

          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 bg-stone-900 px-3 py-1 rounded-full border border-stone-850">
            Épisode {episode.number} • Publié le {episode.publishDate}
          </span>
        </div>

        {/* Title Block */}
        <div className="text-left space-y-4 mb-10">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 px-3 py-1 rounded">
            {episode.category}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-100 uppercase max-w-4xl leading-snug">
            {episode.title}
          </h1>
        </div>

        {/* Media Block / Video Player + Glow effect */}
        <div className="relative mb-12 aspect-video w-full rounded-2xl overflow-hidden border border-stone-850 shadow-2xl bg-stone-900">
          {/* Backlight Glow ambient element */}
          <div className="absolute inset-0 bg-amber-500/5 blur-[80px] scale-90 pointer-events-none" />

          {/* Real responsive YouTube iframe or placeholder graphic */}
          <iframe
            src={episode.youtubeUrl}
            title={episode.title}
            className="w-full h-full relative z-20"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
          {/* Guest Details Container */}
          <div className="bg-stone-900/40 bo border border-stone-850 p-5 rounded-2xl mb-12 text-left">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => onPlayClick(episode)}
              className="flex items-center gap-2.5 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mono rounded-xl transition cursor-pointer transform active:scale-95 text-xs shadow-lg shadow-amber-500/10"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              ÉCOUTER L'AUDIO COMPLET ({episode.duration})
            </button>

            {/* Like count action */}
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-mono text-xs font-bold uppercase transition cursor-pointer ${
                hasLiked
                  ? 'bg-rose-500/10 border-rose-500 text-rose-500'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              {likes} J'aime
            </button>
          </div>

          {/* Social share widget */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-stone-500 uppercase">Partager l'épisode :</span>
            
            <button
              onClick={handleCopyLink}
              title="Copier le lien"
              className="p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-400 hover:text-stone-100 transition hover:border-stone-700 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-400 hover:text-stone-100 transition hover:border-stone-700 cursor-pointer"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-400 hover:text-stone-100 transition hover:border-stone-700 cursor-pointer"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Dynamic Details segment: Timestamps schedule & Guest bio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          
          {/* Timeline schedule / Left / 7 cols */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="border-b border-stone-850 pb-4">
              <h3 className="text-lg font-bold font-sans uppercase tracking-wide text-stone-100">
                L'essentiel de l'épisode
              </h3>
              <p className="text-xs text-stone-500 font-mono mt-1">
                Naviguez directement vers les moments clés de notre conversation.
              </p>
            </div>

            <p className="text-sm text-stone-300 font-sans leading-relaxed">
              {episode.richDescription}
            </p>

            {/* Clickable Timestamps list */}
            <div className="space-y-3 pt-4">
              <h4 className="text-xs font-mono font-bold uppercase text-stone-400 tracking-wider">
                Chapitres & Timestamps (Cliquez pour écouter)
              </h4>
              <div className="space-y-2">
                {episode.timestamps.map((ts: Timestamp, index) => (
                  <button
                    key={index}
                    onClick={() => onSeekTo(ts.seconds)}
                    className="w-full flex items-start gap-4 p-3.5 bg-stone-900/60 hover:bg-stone-900 border border-stone-850 rounded-xl transition duration-200 cursor-pointer group text-left"
                  >
                    <span className="text-amber-500 font-mono text-xs font-extrabold bg-amber-500/10 px-2 py-0.5 rounded tracking-wide group-hover:bg-amber-500 group-hover:text-stone-950 transition duration-200 shrink-0">
                      {ts.time}
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-stone-200 block group-hover:text-amber-400 transition">
                        {ts.topic}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Big quote widgets in episode */}
            <div className="space-y-4 pt-6">
              <h4 className="text-xs font-mono font-bold uppercase text-stone-500 tracking-wider">
                Citations d'Élite
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {episode.quotes.map((quote, idx) => (
                  <div key={idx} className="p-5 bg-gradient-to-r from-stone-900 to-stone-950 border border-stone-850 rounded-2xl relative overflow-hidden">
                    <span className="absolute top-1 right-4 text-7xl font-serif text-stone-800 pointer-events-none select-none select-none opacity-40">“</span>
                    <p className="text-sm text-stone-200 italic font-sans leading-relaxed relative z-10">
                      "{quote.text}"
                    </p>
                    <span className="text-[10px] font-mono text-amber-500 uppercase block mt-3 font-semibold">— {quote.author}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Guest Profile & External / Right / 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Guest Details Container */}
            <div className="bg-stone-900/40 border border-stone-850 rounded-2xl p-6 space-y-5">
              
              <div className="text-center space-y-3 pb-4 border-b border-stone-850">
                <img
                  src={episode.thumbnail}
                  alt={episode.guest.name}
                  className="w-20 h-20 object-cover rounded-full border border-stone-800 mx-auto bg-stone-950"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-base font-bold text-stone-100 tracking-tight">
                    {episode.guest.name}
                  </h4>
                  <p className="text-xs text-amber-500 font-mono uppercase font-bold tracking-wider mt-0.5">
                    {episode.guest.role} {episode.guest.company ? `• ${episode.guest.company}` : ''}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block font-bold">
                  À propos de l'invité
                </span>
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  {episode.guest.bio}
                </p>
              </div>

              {/* Guest links */}
              <div className="pt-3 flex gap-2.5 items-center">
                <span className="text-[10px] font-mono text-stone-500 uppercase font-bold">Suivre {episode.guest.name} :</span>
                {episode.guest.socials.linkedin && (
                  <a
                    href={episode.guest.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-stone-950 border border-stone-800 rounded hover:text-amber-500 transition text-stone-400"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                )}
                {episode.guest.socials.twitter && (
                  <a
                    href={episode.guest.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-stone-950 border border-stone-800 rounded hover:text-amber-500 transition text-stone-400"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

            </div>

            {/* Quick Gated checklist for listeners */}
            <div className="bg-gradient-to-br from-stone-900 to-ambient-950 border border-amber-500/20 rounded-2xl p-6 p-6 space-y-4">
              <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-1 rounded">
                BONUS AUDIO EXCLUSIF
              </span>
              <h4 className="text-sm font-bold text-stone-100 uppercase tracking-tight">
                Télécharger le Plan d'Action PDF
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                Abonnez-vous à notre newsletter VIP ci-dessous pour débloquer immédiatement la grille récapitative et les conseils secrets partagés par {episode.guest.name}.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
