/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUp } from 'lucide-react';
import { EPISODES } from './data';
import logoBany from './assets/logos/logo_bany.png';
import { NAV_ITEMS } from './data/navItems';
import { Episode } from './types';
import { loadPlaylistEpisodes, sortEpisodesByPublishDate } from './services/youtube';
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
import HomeShowcase from './components/HomeShowcase';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'episodes' | 'episode-detail' | 'about' | 'invite' | 'hub'>('home');
  const [episodes, setEpisodes] = useState<Episode[]>(EPISODES);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);


  useEffect(() => {
    async function loadEpisodes() {
      const emissionsPlaylistId = import.meta.env.VITE_PLAYLIST_EMISSIONS_ID ?? 'PLXxMao9EmHNDMU4n8XuVFdbGmWjXSH9LC';
      const podcastsPlaylistId = import.meta.env.VITE_PLAYLIST_PODCASTS_ID ?? 'PLXxMao9EmHNAf_hXS8lZkWyZJA8F_Sr17';

      try {
        const [emissions, podcasts] = await Promise.all([
          loadPlaylistEpisodes(emissionsPlaylistId, 'Émissions'),
          loadPlaylistEpisodes(podcastsPlaylistId, 'Podcasts'),
        ]);

        const combined = sortEpisodesByPublishDate([...emissions, ...podcasts]);
        if (combined.length > 0) {
          setEpisodes(combined);
        } else {
          console.warn('Aucun épisode YouTube récupéré, conservation des données locales.');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des vidéos YouTube', err);
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



  const navigateToView = (view: 'home' | 'episodes' | 'episode-detail' | 'about' | 'invite' | 'hub') => {
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
    <div id="brand-layout-root" className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-body antialiased selection:bg-rose-500 selection:text-stone-950">
      
      <nav
        id="main-navigation"
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 border-b ${
          scrolled
            ? 'bg-stone-950/95 backdrop-blur-md border-white/5 py-4'
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo brand */}
          <button 
            onClick={() => { setCurrentView('home'); jumpToTop(); }}
            className="flex items-center gap-2 text-stone-100 hover:opacity-80 transition cursor-pointer"
          >
            <img 
              src={logoBany}
              alt="BANY TALKS"
              className="h-12 w-auto"
            />
          </button>

          <div className="hidden md:flex items-center gap-8 text-sm font-body relative">
            {NAV_ITEMS.map((link) => {
              const isActive = currentView === link.value || (currentView === 'episode-detail' && link.value === 'episodes');
              const handleClick = () => {
                if (['home','about','episodes','hub','contact'].includes(link.value)) {
                  const sectionId = link.value === 'contact' ? 'contact-section' :
                    link.value === 'home' ? 'hero-section' :
                    link.value === 'about' ? 'about-bany' :
                    link.value === 'episodes' ? 'episodes-section' :
                    link.value === 'hub' ? 'audience-hub' :
                    link.value;
                  scrollToSection(sectionId);
                } else {
                  navigateToView(link.value as 'home' | 'about' | 'episodes' | 'invite' | 'hub');
                }
              };
              return (
                <button
                  key={link.value}
                  onClick={handleClick}
                  className={`relative py-1 transition-colors duration-200 cursor-pointer ${
                    isActive ? 'text-stone-100' : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeHeaderUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-rose-500"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center">
            <button
              onClick={() => scrollToSection('booking-section')}
              className="btn-primary text-xs py-2.5 px-5"
            >
              Inviter Bany
            </button>
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
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="md:hidden bg-stone-950 border-b border-stone-900 overflow-hidden shadow-2xl"
            >
              <div className="px-5 pt-3 pb-6 space-y-1 font-body text-sm">
                <button 
                  onClick={() => scrollToSection('hero-section')} 
                  className={`block w-full text-left py-3 border-b border-white/5 transition ${
                    currentView === 'home' ? 'text-stone-100' : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  Accueil
                </button>
                <button 
                  onClick={() => scrollToSection('about-bany')} 
                  className={`block w-full text-left py-3 border-b border-white/5 transition ${
                    currentView === 'about' ? 'text-stone-100' : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  À Propos
                </button>
                <button 
                  onClick={() => scrollToSection('episodes-section')} 
                  className={`block w-full text-left py-3 border-b border-white/5 transition ${
                    currentView === 'episodes' || currentView === 'episode-detail' ? 'text-stone-100' : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  Émissions
                </button>
                <button 
                  onClick={() => scrollToSection('audience-hub')} 
                  className={`block w-full text-left py-3 border-b border-white/5 transition ${
                    currentView === 'hub' ? 'text-stone-100' : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  Audience Hub
                </button>
                <div className="pt-4">
                  <button 
                    onClick={() => scrollToSection('booking-section')} 
                    className="w-full btn-primary justify-center text-xs"
                  >
                    Inviter Bany
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
              <Hero />
              <HomeShowcase
                onExploreEpisodes={() => navigateToView('episodes')}
                onAbout={() => navigateToView('about')}
                onHub={() => navigateToView('hub')}
              />
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
          className="fixed bottom-8 right-6 z-40 p-3 bg-stone-900 border border-white/10 hover:border-rose-500/40 text-stone-400 hover:text-stone-100 transition duration-200 cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}