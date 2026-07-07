import React, { useState } from 'react';
import { Search, ShoppingBag, Star, ArrowRight, CheckCircle, Mail, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BOOKS } from '../data';

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedBookId, setExpandedBookId] = useState<string | null>('book-attention');

  const [excerptEmail, setExcerptEmail] = useState('');
  const [excerptBookId, setExcerptBookId] = useState<string | null>(null);
  const [excerptSuccess, setExcerptSuccess] = useState(false);

  const categories = ['All', ...Array.from(new Set(BOOKS.map((b) => b.category)))];

  const filteredBooks = BOOKS.filter((book) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.subtitle.toLowerCase().includes(q);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="bg-stone-950 min-h-screen"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 space-y-16 lg:space-y-20 text-left">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-5">
            <p className="section-label">Bibliothèque</p>
            <h1 className="font-display text-4xl sm:text-5xl text-stone-100 font-medium leading-tight">
              Les livres de Bany
            </h1>
            <p className="text-stone-500 font-body text-base leading-relaxed max-w-lg">
              Business, négociation, leadership et indépendance de l'esprit — les ouvrages qui prolongent les conversations du podcast.
            </p>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <div className="grid grid-cols-3 gap-6 w-full border-t border-white/5 pt-6">
              {[
                { value: '2', label: 'Ouvrages publiés' },
                { value: '4.9', label: 'Note moyenne' },
                { value: '584', label: 'Pages au total' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <span className="block font-display text-2xl text-rose-400">{value}</span>
                  <span className="block text-xs text-stone-600 font-body mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="editorial-rule" />

        {/* Search + filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex items-center gap-8 border-b border-white/5 pb-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm font-body pb-4 -mb-4 border-b-2 whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'text-stone-100 border-rose-500'
                    : 'text-stone-600 border-transparent hover:text-stone-400'
                }`}
              >
                {cat === 'All' ? 'Tous' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
            <input
              type="text"
              placeholder="Rechercher…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-4 py-3 bg-transparent border-b border-white/10 focus:border-rose-500/50 text-stone-200 placeholder-stone-600 focus:outline-none text-sm font-body transition"
            />
          </div>
        </div>

        {/* Books list */}
        {filteredBooks.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="font-display text-xl text-stone-500">Aucun livre trouvé</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="link-arrow text-sm mx-auto justify-center"
            >
              Réinitialiser <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-0 divide-y divide-white/5">
            {filteredBooks.map((book) => {
              const isExpanded = expandedBookId === book.id;

              return (
                <article key={book.id} className="py-12 lg:py-16 first:pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Cover */}
                    <div className="md:col-span-4 lg:col-span-3">
                      <div
                        className={`aspect-[3/4] max-w-[220px] mx-auto md:mx-0 bg-gradient-to-br ${book.coverGradient} p-6 flex flex-col justify-between relative overflow-hidden`}
                      >
                        <div className="absolute inset-y-0 left-0 w-1 bg-black/20" />
                        <div className="relative z-10 space-y-2">
                          <p className="text-[10px] text-rose-300/80 font-body tracking-widest uppercase">
                            {book.category}
                          </p>
                          <h2 className="font-display text-lg text-white leading-snug font-medium">
                            {book.title}
                          </h2>
                        </div>
                        <div className="relative z-10 border-t border-white/10 pt-3">
                          <p className="text-[10px] text-stone-400 font-body">{book.author}</p>
                          <p className="text-[10px] text-rose-400/80 font-body mt-0.5">Bany Editions</p>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="md:col-span-8 lg:col-span-9 space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 font-body">
                          <span className="text-rose-500/80">{book.category}</span>
                          <span>·</span>
                          <span>{book.publishedYear}</span>
                          <span>·</span>
                          <span>{book.pagesCount} pages</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-rose-500 text-rose-500" />
                            {book.rating}/5
                          </span>
                        </div>

                        <h2 className="font-display text-2xl sm:text-3xl text-stone-100 font-medium leading-snug">
                          {book.title}
                        </h2>

                        <p className="font-display text-base text-stone-500 italic leading-relaxed">
                          « {book.subtitle} »
                        </p>

                        <p className="text-stone-400 font-body leading-relaxed max-w-2xl">
                          {book.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
                          className="link-arrow text-sm cursor-pointer"
                        >
                          {isExpanded ? 'Masquer les enseignements' : 'Voir les enseignements clés'}
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <a href={book.buyUrl} className="btn-primary text-xs py-2.5 px-5">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Acheter
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Expandable highlights */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-10 mt-10 border-t border-white/5 space-y-8 md:ml-[calc(25%+3rem)]">

                          <div>
                            <p className="section-label text-[0.6rem] mb-4">Enseignements clés</p>
                            <ol className="space-y-4">
                              {book.highlights.map((hlt, i) => (
                                <li key={i} className="flex gap-4 text-sm text-stone-400 font-body leading-relaxed">
                                  <span className="font-display text-rose-500/60 text-lg shrink-0 w-6">
                                    {String(i + 1).padStart(2, '0')}
                                  </span>
                                  {hlt}
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Excerpt form */}
                          <div className="border border-white/8 p-6 lg:p-8 space-y-4">
                            <div className="flex items-start gap-3">
                              <Mail className="w-4 h-4 text-rose-500/70 shrink-0 mt-0.5" strokeWidth={1.5} />
                              <div>
                                <p className="text-sm text-stone-300 font-body font-medium">
                                  Recevoir un chapitre offert
                                </p>
                                <p className="text-xs text-stone-600 font-body mt-1">
                                  Les 40 premières pages en PDF, directement par email.
                                </p>
                              </div>
                            </div>

                            {excerptSuccess && excerptBookId === book.id ? (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2 text-emerald-500 text-sm font-body"
                              >
                                <CheckCircle className="w-4 h-4" />
                                PDF envoyé avec succès
                              </motion.div>
                            ) : (
                              <form
                                onSubmit={(e) => handleRequestExcerpt(e, book.id)}
                                className="flex flex-col sm:flex-row gap-0 border-b border-white/10 focus-within:border-rose-500/40 transition max-w-md"
                              >
                                <input
                                  type="email"
                                  required
                                  value={excerptEmail}
                                  onChange={(e) => setExcerptEmail(e.target.value)}
                                  placeholder="votre@email.com"
                                  className="flex-1 py-3 bg-transparent text-stone-300 placeholder-stone-600 focus:outline-none text-sm font-body"
                                />
                                <button
                                  type="submit"
                                  className="py-3 px-5 text-rose-400 hover:text-rose-300 text-xs font-body font-medium uppercase tracking-wider transition shrink-0 cursor-pointer flex items-center gap-1"
                                >
                                  Débloquer <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </form>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
