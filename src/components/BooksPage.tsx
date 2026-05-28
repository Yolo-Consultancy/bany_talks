import React, { useState } from 'react';
import { BookOpen, Search, ShoppingBag, Bookmark, Star, Calendar, Layers, ShieldCheck, Mail, ArrowRight, HeartHandshake, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BOOKS } from '../data';
import { Book } from '../types';

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedBookId, setExpandedBookId] = useState<string | null>('book-attention');
  
  // Extraction request state
  const [excerptEmail, setExcerptEmail] = useState('');
  const [excerptBookId, setExcerptBookId] = useState<string | null>(null);
  const [excerptSuccess, setExcerptSuccess] = useState(false);

  // Community recommendation state
  const [recTitle, setRecTitle] = useState('');
  const [recAuthor, setRecAuthor] = useState('');
  const [recReason, setRecReason] = useState('');
  const [recSuccess, setRecSuccess] = useState(false);
  const [communityRecs, setCommunityRecs] = useState<any[]>(() => {
    const saved = localStorage.getItem('bany_book_recommendations');
    return saved ? JSON.parse(saved) : [];
  });

  // Unique categories
  const categories = ['All', ...Array.from(new Set(BOOKS.map(b => b.category)))];

  const filteredBooks = BOOKS.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRequestExcerpt = (e: React.FormEvent, bookId: string) => {
    e.preventDefault();
    if (!excerptEmail.trim()) return;
    setExcerptBookId(bookId);
    setExcerptSuccess(true);
    setTimeout(() => {
      setExcerptEmail('');
      setExcerptSuccess(false);
      setExcerptBookId(null);
    }, 4500);
  };

  const handleRecommendBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recTitle.trim() || !recAuthor.trim()) return;
    
    const newRec = {
      id: `rec-${Date.now()}`,
      title: recTitle,
      author: recAuthor,
      reason: recReason || 'Pas de motif renseigné',
      createdAt: new Date().toLocaleDateString('fr-FR')
    };

    const updated = [newRec, ...communityRecs];
    setCommunityRecs(updated);
    localStorage.setItem('bany_book_recommendations', JSON.stringify(updated));

    setRecTitle('');
    setRecAuthor('');
    setRecReason('');
    setRecSuccess(true);
    setTimeout(() => setRecSuccess(false), 4000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-left"
    >
      {/* Page Hero Header */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0f0f0f] p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-10 filter grayscale brightness-50" />
        
        <div className="relative z-20 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/25">
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-500">Bibliothèque</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Mes <span className="text-amber-500 italic">Livres</span>
          </h1>
          <p className="text-sm md:text-base text-stone-400 leading-relaxed font-sans">
            Je me limite pas seulement à des discussions. Retrouvez ici la collection exclusive de mes ouvrages phares sur le monde du business, de la négociation, du leadership et de l’indépendance de l’esprit.
          </p>
          
          {/* Quick numbers bar */}
          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/5 max-w-md">
            <div>
              <span className="block text-xl font-bold text-amber-500">2 Livres</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500">Écrits par Bany</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-amber-500">100%</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500">Auteur Unique</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-amber-500">4.9/5</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[10px] text-stone-500">Moyenne Critique</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interface and Grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar inputs & filter panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-stone-900 border border-stone-850 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-stone-400 border-b border-stone-850 pb-2">
              Filtres & Recherche
            </h3>
            
            {/* Search inputs */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un livre, auteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-950 border border-stone-800 focus:border-amber-500 text-xs rounded-xl text-stone-200 focus:outline-none placeholder-stone-600 font-sans"
              />
              <Search className="w-4 h-4 text-stone-600 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category tabs vertical list */}
            <div className="space-y-1.5 pt-2">
              <span className="block text-[9px] font-mono text-stone-550 font-bold uppercase tracking-widest">Catégories</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-stone-950 font-black'
                      : 'bg-stone-950 hover:bg-stone-850 text-stone-450 hover:text-stone-200 border border-stone-850'
                  }`}
                >
                  {cat === 'All' ? '📚 Tous les Livres' : cat}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Core Books display list */}
        <div className="lg:col-span-8 space-y-8">
          {filteredBooks.length === 0 ? (
            <div className="bg-stone-900 border border-stone-850 p-12 text-center rounded-2xl">
              <BookOpen className="w-12 h-12 text-stone-600 mx-auto mb-3" />
              <p className="text-stone-400 text-sm">Aucun livre ne correspond à vos filtres actuels.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-4 text-xs font-mono text-amber-500 hover:text-amber-400 underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBooks.map((book) => {
                const isExpanded = expandedBookId === book.id;
                
                return (
                  <div 
                    key={book.id}
                    className="bg-stone-900 border border-stone-850 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-black/80 hover:scale-[1.015] hover:-translate-y-0.5 hover:border-stone-750 transition-all duration-500 ease-out"
                  >
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
                      
                      {/* 3D Physical Mockup using master CSS styles */}
                      <div className="shrink-0 flex justify-center items-center">
                        <div className="relative group perspective">
                          {/* Book spine & 3D side layout */}
                          <div 
                            className={`w-44 h-60 rounded-r-lg relative transition-all duration-300 transform preserve-3d group-hover:rotate-y-[-10deg] shadow-2xl bg-gradient-to-br ${book.coverGradient} flex flex-col justify-between p-4 text-left border-l border-white/20`}
                          >
                            {/* Paper overlay textures */}
                            <div className="absolute inset-y-0 left-0 w-2.5 bg-black/10 shadow-[inset_-1px_0_0_rgba(255,255,255,0.1)] rounded-l" />
                            <div className="absolute inset-y-0 right-1 w-px bg-white/5" />
                            
                            {/* Typography of the cover */}
                            <div className="space-y-1.5 z-10">
                              <span className="block text-[8px] font-mono uppercase tracking-widest text-amber-400/95 font-black">
                                {book.category}
                              </span>
                              <h2 className="text-base font-black tracking-tight leading-snug text-white line-clamp-3">
                                {book.title}
                              </h2>
                              <p className="text-[9px] text-stone-300 font-sans italic line-clamp-2 leading-relaxed">
                                {book.subtitle}
                              </p>
                            </div>

                            <div className="mt-auto flex justify-between items-end z-10 border-t border-white/10 pt-2">
                              <div>
                                <span className="block text-[8px] font-mono uppercase text-stone-400">Auteur</span>
                                <span className="block text-[10px] font-black font-sans text-white">{book.author}</span>
                              </div>
                              <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-tighter">Bany Ed.</span>
                            </div>
                          </div>
                          
                          {/* 3D pages effect */}
                          <div className="absolute left-[173px] top-[4px] bottom-[4px] w-2 bg-stone-300 rounded-r border-y border-stone-400 select-none shadow-md transform rotate-y-[80deg] z-0" />
                        </div>
                      </div>

                      {/* Info side column */}
                      <div className="flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-stone-950 border border-stone-800 text-stone-400 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider">
                              {book.category}
                            </span>
                            <div className="flex items-center gap-1.5 text-amber-550 text-xs font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>{book.rating}/5</span>
                            </div>
                            <span className="text-[10px] text-stone-500 font-mono">
                              An : {book.publishedYear} • {book.pagesCount} Pages
                            </span>
                          </div>

                          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white hover:text-amber-500 transition duration-150">
                            {book.title}
                          </h2>
                          
                          <p className="text-xs text-stone-450 font-serif leading-relaxed italic border-l-2 border-stone-800 pl-3">
                            "{book.subtitle}"
                          </p>

                          <p className="text-xs text-stone-350 leading-relaxed font-sans mt-2">
                            {book.description}
                          </p>
                        </div>

                        {/* Interactive triggers and excerpt panel */}
                        <div className="pt-4 border-t border-white/5 flex flex-wrap gap-3">
                          <button
                            onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
                            className="px-4 py-2 bg-stone-950 hover:bg-stone-850 text-stone-300 border border-stone-800 text-[10px] font-black uppercase tracking-widest rounded-xl transition flex items-center gap-2 cursor-pointer"
                          >
                            <Layers className="w-3.5 h-3.5 text-amber-500" />
                            {isExpanded ? "Masquer les points clés" : "Voir les 3 points clés"}
                          </button>
                          
                          <a
                            href={book.buyUrl}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-widest rounded-xl transition flex items-center gap-2"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Acheter l'ouvrage
                          </a>
                        </div>
                      </div>

                    </div>

                    {/* Expandable Key Highlights Section */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-stone-950/70 border-t border-stone-850 text-left"
                        >
                          <div className="p-6 md:p-8 space-y-6">
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-mono font-black tracking-widest uppercase text-amber-500 flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                                Enseignements Stratégiques Clés
                              </span>
                              <p className="text-[11px] text-stone-400 font-sans">
                                Voici les apprentissages clés extraits et décryptés en profondeur dans l'émission de podcast dédiée :
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {book.highlights.map((hlt, i) => (
                                <div key={i} className="bg-stone-900 border border-stone-850 p-4 rounded-xl space-y-2">
                                  <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono text-xs font-black flex items-center justify-center">
                                    {i + 1}
                                  </div>
                                  <p className="text-[11px] text-stone-300 leading-relaxed font-sans">
                                    {hlt}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Live Free Excerpt simulator Form */}
                            <div className="bg-stone-900/40 border border-stone-850/60 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-stone-250 flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 text-amber-500" /> Recevoir un chapitre offert
                                </span>
                                <p className="text-[10px] text-stone-500">
                                  Laissez votre e-mail et recevez instantanément les 40 premières pages en PDF.
                                </p>
                              </div>

                              {excerptSuccess && excerptBookId === book.id ? (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-[11px] font-mono uppercase font-bold px-4 py-2 rounded-lg flex items-center gap-2 shrink-0"
                                >
                                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                                  <span>Le PDF a été envoyé avec succès !</span>
                                </motion.div>
                              ) : (
                                <form onSubmit={(e) => handleRequestExcerpt(e, book.id)} className="flex items-center w-full md:w-auto max-w-sm gap-2">
                                  <input
                                    type="email"
                                    required
                                    value={excerptEmail}
                                    onChange={(e) => setExcerptEmail(e.target.value)}
                                    placeholder="votre.email@domaine.com"
                                    className="px-3 py-1.5 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-lg text-xs text-stone-350 focus:outline-none w-full md:w-56"
                                  />
                                  <button
                                    type="submit"
                                    className="px-4 py-1.5 bg-amber-500 text-stone-950 hover:bg-amber-400 font-bold font-mono text-[9px] uppercase rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1"
                                  >
                                    Débloquer <ArrowRight className="w-3 h-3" />
                                  </button>
                                </form>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </motion.div>
  );
}
