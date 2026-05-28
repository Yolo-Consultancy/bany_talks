/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Disc, Menu, X, ArrowUp } from 'lucide-react';
import { EPISODES } from './data';
import { Episode } from './types';
import { fetchYouTubeVideos, fetchYouTubePlaylistData, fetchYouTubePlaylistHTML, DEFAULT_YOUTUBE_CHANNEL_ID, DEFAULT_YOUTUBE_API_KEY } from './services/youtube';
import { motion, AnimatePresence } from 'framer-motion';

// Importing custom brand units
import Hero from './components/Hero';
import Stats from './components/Stats';
import EpisodeGrid from './components/EpisodeGrid';
import EpisodeDetail from './components/EpisodeDetail';
import InviteBany from './components/InviteBany';
import Hub from './components/Hub';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
// AudioPlayer removed — audio not yet available
import BooksPage from './components/BooksPage';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'episodes' | 'episode-detail' | 'about' | 'invite' | 'books' | 'hub'>('home');
  const [episodes, setEpisodes] = useState<Episode[]>(EPISODES);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);


  useEffect(() => {
    async function loadEpisodes() {
      try {
        const emissionsPlaylistId = import.meta.env.VITE_PLAYLIST_EMISSIONS_ID ?? 'PLXxMao9EmHNDMU4n8XuVFdbGmWjXSH9LC';
        const podcastsPlaylistId = import.meta.env.VITE_PLAYLIST_PODCASTS_ID ?? 'PLXxMao9EmHNAf_hXS8lZkWyZJA8F_Sr17';
        
        const [rawEmissions, rawPodcasts] = await Promise.all([
          fetchYouTubePlaylistData(emissionsPlaylistId, 'Émissions').catch(() => []),
          fetchYouTubePlaylistData(podcastsPlaylistId, 'Podcasts').catch(() => [])
        ]);

        // Fallback to HTML parsing if emissions are empty
        const emissions = rawEmissions.length > 0 ? rawEmissions : await fetchYouTubePlaylistHTML(emissionsPlaylistId, 'Émissions').catch(() => []);
        const podcasts = rawPodcasts;

        // Combine emissions and podcasts into episodes list
        setEpisodes([...emissions, ...podcasts]);
      } catch (err) {
        console.error("Erreur lors du chargement des vidéos YouTube", err);
      }
    }
    loadEpisodes();
  }, []);

  // Layout navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll height to make navbar opaque & toggle scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 405);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const navigateToView = (view: 'home' | 'episodes' | 'episode-detail' | 'about' | 'invite' | 'books' | 'hub') => {
    setMobileMenuOpen(false);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll smoothly to layout element ID anchor
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'episodes-section') navigateToView('episodes');
    else if (id === 'booking-section') navigateToView('invite');
    else if (id === 'audience-hub') navigateToView('hub');
    else if (id === 'about-bany') navigateToView('about');
    else navigateToView('home');
  };

  const jumpToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function handlePlayEpisode(ep: Episode): void {
    throw new Error('Function not implemented.');
  }

  function handleTimestampSeek(sec: number): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div id="brand-layout-root" className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans select-none antialiased selection:bg-rose-500 selection:text-stone-950">
      
      {/* Premium Sticky Navigation Header */}
      <nav 
        id="main-navigation"
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 font-mono text-xs border-b ${
          scrolled 
            ? 'bg-stone-950/90 backdrop-blur-xl border-stone-900 py-3.5 shadow-lg' 
            : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo brand */}
          <button 
            onClick={() => { setCurrentView('home'); jumpToTop(); }}
            className="flex items-center gap-2 text-stone-100 hover:text-rose-500 transition cursor-pointer"
          >
            <Disc className="w-5 h-5 text-rose-500 animate-spin-slow" />
            <span className="text-xl font-display font-black tracking-wider uppercase">BANY TALKS</span>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-stone-400 font-bold uppercase font-mono relative">
            <button 
              onClick={() => scrollToSection('hero-section')} 
              className={`relative py-1 transition-colors duration-200 cursor-pointer ${
                currentView === 'home' ? 'text-rose-500 font-extrabold' : 'hover:text-rose-400'
              }`}
            >
              Accueil
              {currentView === 'home' && (
                <motion.span 
                  layoutId="activeHeaderUnderline" 
                  className="absolute bottom-[-16px] left-0 right-0 h-[2.5px] bg-rose-500 rounded-full" 
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
            </button>
            <button 
              onClick={() => scrollToSection('about-bany')} 
              className={`relative py-1 transition-colors duration-200 cursor-pointer ${
                currentView === 'about' ? 'text-rose-500 font-extrabold' : 'hover:text-rose-400'
              }`}
            >
              À Propos
              {currentView === 'about' && (
                <motion.span 
                  layoutId="activeHeaderUnderline" 
                  className="absolute bottom-[-16px] left-0 right-0 h-[2.5px] bg-rose-500 rounded-full" 
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
            </button>
            <button 
              onClick={() => scrollToSection('episodes-section')} 
              className={`relative py-1 transition-colors duration-200 cursor-pointer ${
                currentView === 'episodes' || currentView === 'episode-detail' ? 'text-rose-500 font-extrabold' : 'hover:text-rose-400'
              }`}
            >
              Émissions
              {(currentView === 'episodes' || currentView === 'episode-detail') && (
                <motion.span 
                  layoutId="activeHeaderUnderline" 
                  className="absolute bottom-[-16px] left-0 right-0 h-[2.5px] bg-rose-500 rounded-full" 
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
            </button>
            <button 
              onClick={() => navigateToView('books')} 
              className={`relative py-1 transition-colors duration-200 cursor-pointer ${
                currentView === 'books' ? 'text-rose-500 font-extrabold' : 'hover:text-rose-400'
              }`}
            >
              Livres
              {currentView === 'books' && (
                <motion.span 
                  layoutId="activeHeaderUnderline" 
                  className="absolute bottom-[-16px] left-0 right-0 h-[2.5px] bg-rose-500 rounded-full" 
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
            </button>
            <button 
              onClick={() => scrollToSection('audience-hub')} 
              className={`relative py-1 transition-colors duration-200 cursor-pointer ${
                currentView === 'hub' ? 'text-rose-500 font-extrabold' : 'hover:text-rose-400'
              }`}
            >
              Audience Hub
              {currentView === 'hub' && (
                <motion.span 
                  layoutId="activeHeaderUnderline" 
                  className="absolute bottom-[-16px] left-0 right-0 h-[2.5px] bg-rose-500 rounded-full" 
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
            </button>
          </div>

          {/* Right Action Trigger */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => scrollToSection('booking-section')}
              className={`px-5 py-2.5 rounded-xl transition font-mono uppercase text-[10px] tracking-wider cursor-pointer shadow-lg hover:scale-105 active:scale-95 ${
                currentView === 'invite' 
                  ? 'bg-rose-400 text-stone-950 font-black shadow-rose-500/20 ring-2 ring-rose-500/30' 
                  : 'bg-rose-500 hover:bg-rose-400 text-stone-950 font-black shadow-rose-500/10'
              }`}
            >
              Inviter Bany ↗
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 rounded-full border border-rose-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">LIVE CHAT</span>
            </div>
          </div>

          {/* Mobile Menu Action Icon */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 text-stone-400 hover:text-stone-100 transition cursor-pointer relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-stone-900/50"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 180 : 0, scale: mobileMenuOpen ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-rose-500" /> : <Menu className="w-5 h-5" />}
            </motion.div>
          </motion.button>

        </div>

        {/* Mobile Navigation Drawer Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden bg-stone-950 border-b border-stone-900 overflow-hidden shadow-2xl"
            >
              <div className="px-5 pt-3 pb-6 space-y-3 font-bold uppercase font-mono">
                <button 
                  onClick={() => scrollToSection('hero-section')} 
                  className={`block w-full text-left py-2.5 border-b border-stone-900/40 transition duration-150 ${
                    currentView === 'home' ? 'text-rose-500 font-extrabold' : 'text-stone-400 hover:text-rose-500'
                  }`}
                >
                  Accueil
                </button>
                <button 
                  onClick={() => scrollToSection('about-bany')} 
                  className={`block w-full text-left py-2.5 border-b border-stone-900/40 transition duration-150 ${
                    currentView === 'about' ? 'text-rose-500 font-extrabold' : 'text-stone-400 hover:text-rose-500'
                  }`}
                >
                  À Propos
                </button>
                <button 
                  onClick={() => scrollToSection('episodes-section')} 
                  className={`block w-full text-left py-2.5 border-b border-stone-900/40 transition duration-150 ${
                    currentView === 'episodes' || currentView === 'episode-detail' ? 'text-rose-500 font-extrabold' : 'text-stone-400 hover:text-rose-500'
                  }`}
                >
                  Émissions
                </button>
                <button 
                  onClick={() => navigateToView('books')} 
                  className={`block w-full text-left py-2.5 border-b border-stone-900/40 transition duration-150 ${
                    currentView === 'books' ? 'text-rose-500 font-extrabold' : 'text-stone-400 hover:text-rose-500'
                  }`}
                >
                  Livres
                </button>
                <button 
                  onClick={() => scrollToSection('audience-hub')} 
                  className={`block w-full text-left py-2.5 border-b border-stone-900/40 transition duration-150 ${
                    currentView === 'hub' ? 'text-rose-500 font-extrabold' : 'text-stone-400 hover:text-rose-500'
                  }`}
                >
                  Audience Hub
                </button>
                <div className="pt-2">
                  <button 
                    onClick={() => scrollToSection('booking-section')} 
                    className="w-full text-center py-3 bg-rose-500 hover:bg-rose-400 text-stone-950 rounded-xl font-black text-xs uppercase tracking-wider block transition shadow-lg shadow-rose-500/15"
                  >
                    Inviter Bany ↗
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Container Content */}
      <main id="main-content-flow" className="flex-1 pt-16">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <Hero 
                onExploreEpisodes={() => navigateToView('episodes')}
                onInviteBany={() => navigateToView('invite')}
              />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-stone-900 border border-stone-850 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-rose-500 uppercase tracking-widest font-black">Nouveau</span>
                    <h2 className="text-xl md:text-2xl font-black text-white">Prêt à explorer les émissions phares ?</h2>
                    <p className="text-xs text-stone-400 font-sans max-w-xl">
                      Découvrez sans filtre nos 120+ épisodes avec des leaders du CAC40, négociateurs de haut niveau et experts de hyper-croissance.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateToView('episodes')}
                    className="px-6 py-3 bg-rose-500 hover:bg-rose-400 text-stone-950 font-mono font-black text-xs uppercase tracking-wider rounded-xl transition shrink-0 cursor-pointer"
                  >
                    Découvrir les émissions ↗
                  </button>
                </div>
              </div>
              <Newsletter />
            </motion.div>
          )}

          {currentView === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <Stats onInviteClick={() => navigateToView('invite')} />
            </motion.div>
          )}

          {currentView === 'episodes' && (
            <motion.div
              key="episodes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <EpisodeGrid 
                episodes={episodes}
                onEpisodeClick={(ep) => {
                  setSelectedEpisode(ep);
                  setCurrentView('episode-detail');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
              <Newsletter />
            </motion.div>
          )}

          {currentView === 'episode-detail' && selectedEpisode && (
            <motion.div
              key="episode-detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <EpisodeDetail 
                episode={selectedEpisode}
                onBackToList={() => setCurrentView('episodes')}
                onPlayClick={(ep) => handlePlayEpisode(ep)}
                onSeekTo={(sec) => handleTimestampSeek(sec)}
              />
            </motion.div>
          )}

          {currentView === 'books' && (
            <motion.div
              key="books"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <BooksPage />
            </motion.div>
          )}

          {currentView === 'invite' && (
            <motion.div
              key="invite"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <InviteBany />
            </motion.div>
          )}

          {currentView === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <Hub />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer module */}
      <Footer 
        onNavigate={(view) => {
          if (view === 'booking') {
            navigateToView('invite');
          } else if (view === 'hub') {
            navigateToView('hub');
          } else {
            navigateToView(view as any);
          }
        }}
        activeView={currentView}
      />

      {/* Scroll to Top Hover Action */}
      {showScrollTop && (
        <button
          onClick={jumpToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-8 right-6 z-40 p-3 bg-rose-500 hover:bg-rose-400 active:scale-95 text-stone-950 rounded-full shadow-lg transition duration-200 cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}