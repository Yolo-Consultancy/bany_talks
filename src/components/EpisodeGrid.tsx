import React, { useState, useMemo, useEffect } from 'react';
import { Search, Play, Clock, ArrowUpRight, Flame, FilterX, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Episode } from '../types';

interface EpisodeGridProps {
  episodes: Episode[];
  onEpisodeClick: (episode: Episode) => void;
}

// Framer Motion Animation Variants
import { Variants } from 'framer-motion';

// Framer Motion Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 35, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 15,
    },
  },
};

const ITEMS_PER_PAGE_MOBILE = 3;
const ITEMS_PER_PAGE_DESKTOP = 6;

export default function EpisodeGrid({
  episodes,
  onEpisodeClick,
}: EpisodeGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [currentPage, setCurrentPage] = useState(1);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect window resize for responsive pagination
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setCurrentPage(1);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ITEMS_PER_PAGE = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP;

  const categories = useMemo(() => {
    return ['Toutes', 'Émissions', 'Podcasts'];
  }, []);

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((episode) => {
      const matchesSearch = 
        episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        episode.guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        episode.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'Toutes' || 
        episode.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Reset page when queries/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredEpisodes.length / ITEMS_PER_PAGE);

  const paginatedEpisodes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEpisodes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEpisodes, currentPage]);

  return (
    <section 
      id="episodes-section"
      className="bg-stone-900 py-16 lg:py-24 border-b border-stone-800/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          
          <div className="text-left space-y-2">
            <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full">
              PRODUCTION MULTIMÉDIA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight uppercase">
              Les Épisodes
            </h2>
            <p className="text-xs font-mono text-stone-400">
              Découvrez nos dernières épisodes immersives à écouter ou regarder en continu.
            </p>
          </div>

          {/* Real-time search engine */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un invité, sujet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-rose-500 text-stone-100 placeholder-stone-500 rounded-xl focus:outline-none transition duration-200 text-sm font-mono"
            />
          </div>

        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8 justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition cursor-pointer border ${
                (selectedCategory === cat)
                  ? 'bg-rose-500 text-stone-950 border-rose-500 shadow-lg shadow-rose-500/10'
                  : 'bg-stone-950 text-stone-400 border-stone-800/80 hover:text-stone-100 hover:border-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Episode Grid display */}
        {filteredEpisodes.length === 0 ? (
          <div className="py-16 text-center bg-stone-950/40 rounded-2xl border border-stone-800/80 max-w-lg mx-auto p-8 space-y-4">
            <FilterX className="w-12 h-12 text-stone-600 mx-auto" />
            <h3 className="text-sm font-bold text-stone-300 uppercase font-mono">Aucun épisode trouvé</h3>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              Votre recherche de "{searchQuery}" avec la catégorie "{selectedCategory}" ne correspond à aucun élément. Essayez d'ajuster vos critères ou réinitialisez le filtre.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Toutes');
              }}
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-rose-500 font-mono text-xs font-bold rounded-xl transition cursor-pointer"
            >
              RÉINITIALISER TOUT
            </button>
          </div>
        ) : (
          <>
            <motion.div 
              key={`${currentPage}-${selectedCategory}-${searchQuery}`}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {paginatedEpisodes.map((episode, i) => {
              const isHiddenOnMobile = i >= 3;
              const isVideoPlaying = playingVideoId === episode.id;

                return (
                  <motion.article
                    key={episode.id}
                    variants={cardVariants}
                    className={`group flex flex-col bg-stone-950 border border-stone-800/80 rounded-2xl overflow-hidden shadow-xl hover:border-stone-700 transition duration-300 relative text-left ${isHiddenOnMobile ? 'hidden md:block' : ''}`}
                  >
                    
                    {/* Thumbnail / Video Player */}
                    <div className="relative aspect-video overflow-hidden bg-stone-950">
                      {isVideoPlaying ? (
                        /* YouTube iframe inline player */
                        <>
                          <iframe
                            src={`${episode.youtubeUrl}${episode.youtubeUrl.includes('?') ? '&' : '?'}autoplay=1`}
                            title={episode.title}
                            className="w-full h-full relative z-10"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                          {/* Close video button */}
                          <button
                            onClick={() => setPlayingVideoId(null)}
                            aria-label="Fermer la vidéo"
                            className="absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-stone-950/80 text-stone-300 hover:text-white hover:bg-stone-950 transition cursor-pointer border border-stone-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        /* Thumbnail with play overlay */
                        <>
                          <img
                            src={episode.thumbnail}
                            alt={episode.title}
                            className="w-full h-full object-cover group-hover:scale-103 transition duration-500 grayscale group-hover:grayscale-0"
                            referrerPolicy="no-referrer"
                          />                        
                          

                          {/* Shadow overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

                          {/* Left overlay values */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className="text-[10px] font-mono font-bold tracking-wider text-rose-400 bg-stone-900/90 border border-stone-800 px-2.5 py-1 rounded shadow-lg uppercase">
                              {episode.category}
                            </span>
                          </div>

                          {/* Stats overlay / Right info */}
                          <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[10px] font-mono font-medium text-stone-300 bg-stone-900/80 px-2 py-1 rounded backdrop-blur">
                            <Clock className="w-3 h-3 text-rose-500" />
                            {episode.duration}
                          </div>

                          {/* Big Hover Play Button Overlay - click to play video inline */}
                          <div 
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-stone-950/40 transition duration-300 cursor-pointer"
                            onClick={() => setPlayingVideoId(episode.id)}
                          >
                            <button
                              aria-label="Regarder la vidéo"
                              className="w-14 h-14 flex items-center justify-center rounded-full bg-rose-500 text-stone-950 hover:scale-110 active:scale-95 transition cursor-pointer shadow-lg shadow-rose-500/35"
                            >
                              <Play className="w-6 h-6 fill-stone-950 ml-0.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Body Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block font-bold">
                          ÉPISODE {episode.number} • {episode.publishDate}
                        </span>
                        
                        {/* Clickable detail title */}
                        <h4 
                          onClick={() => onEpisodeClick(episode)}
                          className="text-base font-bold text-stone-100 leading-snug cursor-pointer hover:text-rose-400 transition"
                        >
                          {episode.title}
                        </h4>
                      </div>

                      {/* Speaker Credit & More actions */}
                      <div className="pt-4 border-t border-stone-900 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={episode.thumbnail}
                            alt={episode.guest.name}
                            className="w-7 h-7 object-cover rounded-full border border-stone-800"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-left leading-none">
                            <span className="text-xs font-bold text-stone-200 block truncate w-32">
                              Bany Talks
                            </span>
                            <span className="text-[9px] text-stone-500 block truncate w-32">
                              {episode.guest.role}
                            </span>
                          </div>
                        </div>

                        {/* Detail anchor action */}
                        <button
                          onClick={() => onEpisodeClick(episode)}
                          className="text-[10px] font-mono font-bold tracking-wider text-rose-500 group-hover:text-rose-400 flex items-center gap-1 hover:underline cursor-pointer uppercase"
                        >
                          Détails <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                  </motion.article>
                );
              })}
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-6 border-t border-stone-800/60 font-mono overflow-x-auto">
                <span className="text-[10px] sm:text-xs text-stone-500 whitespace-nowrap">
                  {Math.min(filteredEpisodes.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}-{Math.min(filteredEpisodes.length, currentPage * ITEMS_PER_PAGE)} / {filteredEpisodes.length}
                </span>
                
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      document.getElementById('episodes-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 sm:p-2.5 bg-stone-950 border border-stone-850 hover:bg-stone-850 disabled:opacity-40 disabled:hover:bg-stone-950 disabled:cursor-not-allowed text-stone-400 hover:text-stone-100 rounded-lg transition shrink-0 cursor-pointer"
                    aria-label="Page précédente"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Page numbers - hidden on mobile */}
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => {
                          setCurrentPage(pg);
                          document.getElementById('episodes-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`min-w-8 h-8 text-xs font-bold rounded-lg border transition cursor-pointer flex items-center justify-center ${
                          currentPage === pg
                            ? 'bg-rose-500 border-rose-500 text-stone-950 font-black shadow-lg shadow-rose-500/15'
                            : 'bg-stone-950 hover:bg-stone-850 text-stone-450 hover:text-stone-100 border-stone-850'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>

                  {/* Mobile page indicator */}
                  <div className="sm:hidden text-xs text-stone-400 font-mono px-2">
                    {currentPage} / {totalPages}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      document.getElementById('episodes-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 sm:p-2.5 bg-stone-950 border border-stone-850 hover:bg-stone-850 disabled:opacity-40 disabled:hover:bg-stone-950 disabled:cursor-not-allowed text-stone-400 hover:text-stone-100 rounded-lg transition shrink-0 cursor-pointer"
                    aria-label="Page suivante"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
