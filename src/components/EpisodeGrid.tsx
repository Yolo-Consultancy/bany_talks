import React, { useState, useMemo, useEffect } from 'react';
import { Search, Play, ArrowRight, FilterX, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { Episode } from '../types';
import { sortEpisodesByPublishDate } from '../services/youtube';

interface EpisodeGridProps {
  episodes: Episode[];
  onEpisodeClick: (episode: Episode) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const ITEMS_PER_PAGE_MOBILE = 3;
const ITEMS_PER_PAGE_DESKTOP = 6;

export default function EpisodeGrid({ episodes, onEpisodeClick }: EpisodeGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [currentPage, setCurrentPage] = useState(1);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setCurrentPage(1);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ITEMS_PER_PAGE = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP;
  const categories = ['Toutes', 'Émissions', 'Podcasts'];

  const filteredEpisodes = useMemo(() => {
    const filtered = episodes.filter((episode) => {
      const matchesSearch =
        episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        episode.guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        episode.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Toutes' ||
        episode.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });

    return sortEpisodesByPublishDate(filtered);
  }, [episodes, searchQuery, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredEpisodes.length / ITEMS_PER_PAGE);
  const paginatedEpisodes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEpisodes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEpisodes, currentPage]);

  return (
    <section id="episodes-section" className="bg-stone-950 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-end">
          <div className="lg:col-span-7 space-y-4">
            <p className="section-label">The Bany Talks</p>
            <h2 className="font-display text-4xl sm:text-5xl text-stone-100 font-medium leading-tight">
              Épisodes & conversations
            </h2>
            <p className="text-stone-500 font-body max-w-lg">
              Un voyage sans filtre au cœur des récits et des expertises de ceux qui façonnent demain.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
              <input
                type="text"
                placeholder="Rechercher un invité, un sujet…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-4 py-3 bg-transparent border-b border-white/10 focus:border-rose-500/50 text-stone-200 placeholder-stone-600 focus:outline-none transition text-sm font-body"
              />
            </div>
          </div>
        </div>

        {/* Category tabs — underline style */}
        <div className="flex items-center gap-8 mb-12 border-b border-white/5 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-sm font-body pb-4 -mb-4 border-b-2 transition cursor-pointer ${
                selectedCategory === cat
                  ? 'text-stone-100 border-rose-500'
                  : 'text-stone-500 border-transparent hover:text-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredEpisodes.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <FilterX className="w-10 h-10 text-stone-700 mx-auto" strokeWidth={1} />
            <h3 className="font-display text-xl text-stone-400">Aucun épisode trouvé</h3>
            <p className="text-sm text-stone-600 font-body max-w-sm mx-auto">
              Essayez d'ajuster votre recherche ou réinitialisez les filtres.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Toutes'); }}
              className="link-arrow text-sm mx-auto justify-center"
            >
              Réinitialiser <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            <motion.div
              key={`${currentPage}-${selectedCategory}-${searchQuery}`}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
            >
              {paginatedEpisodes.map((episode, i) => {
                const isHiddenOnMobile = i >= 3;
                const isVideoPlaying = playingVideoId === episode.id;

                return (
                  <motion.article
                    key={episode.id}
                    variants={cardVariants}
                    className={`group text-left ${isHiddenOnMobile ? 'hidden md:block' : ''}`}
                  >
                    <div className="relative aspect-video overflow-hidden bg-stone-900 mb-5">
                      {isVideoPlaying ? (
                        <>
                          <iframe
                            src={`${episode.youtubeUrl}${episode.youtubeUrl.includes('?') ? '&' : '?'}autoplay=1`}
                            title={episode.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                          <button
                            onClick={() => setPlayingVideoId(null)}
                            aria-label="Fermer la vidéo"
                            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-stone-950/90 text-stone-300 hover:text-white transition cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <img
                            src={episode.thumbnail}
                            alt={episode.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700 ease-out"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/30 transition duration-300 flex items-center justify-center">
                            <button
                              onClick={() => setPlayingVideoId(episode.id)}
                              aria-label="Regarder"
                              className="w-12 h-12 flex items-center justify-center rounded-full bg-rose-500 text-stone-950 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition duration-300 cursor-pointer"
                            >
                              <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs text-stone-600 font-body">
                        <span className="text-rose-500/80">{episode.category}</span>
                        <span>·</span>
                        <span>{episode.publishDate}</span>
                        {episode.duration !== 'Vidéo' && (
                          <>
                            <span>·</span>
                            <span>{episode.duration}</span>
                          </>
                        )}
                      </div>
                      <h4
                        onClick={() => onEpisodeClick(episode)}
                        className="font-display text-lg sm:text-xl text-stone-100 leading-snug cursor-pointer hover:text-rose-400 transition font-medium"
                      >
                        {episode.title}
                      </h4>
                      <button
                        onClick={() => onEpisodeClick(episode)}
                        className="link-arrow text-xs pt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Voir l'épisode <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>

            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-between pt-8 border-t border-white/5">
                <span className="text-xs text-stone-600 font-body">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(filteredEpisodes.length, currentPage * ITEMS_PER_PAGE)} sur {filteredEpisodes.length}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      document.getElementById('episodes-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 text-stone-500 hover:text-stone-200 disabled:opacity-30 transition cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Page précédente"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-stone-500 font-body tabular-nums">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      document.getElementById('episodes-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 text-stone-500 hover:text-stone-200 disabled:opacity-30 transition cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Page suivante"
                  >
                    <ChevronRight className="w-5 h-5" />
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
