import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, FilterX } from 'lucide-react';
import type { BlogArticle, BlogCategory } from '../../types';
import { fetchArticles, fetchCategories } from '../../services/blogService';
import BlogArticleCard from './BlogArticleCard';
import BlogNewsletter from './BlogNewsletter';
import { BlogGridSkeleton } from './BlogSkeleton';

interface BlogPageProps {
  onReadArticle: (slug: string) => void;
  onOpenCategory: (slug: string) => void;
  initialCategory?: string;
}

export default function BlogPage({
  onReadArticle,
  onOpenCategory,
  initialCategory,
}: BlogPageProps) {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [featured, setFeatured] = useState<BlogArticle[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 280);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    setSelectedCategory(initialCategory || '');
  }, [initialCategory]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, featuredList] = await Promise.all([
        fetchArticles({
          q: debouncedQuery || undefined,
          category: selectedCategory || undefined,
          page,
          limit: 9,
        }),
        page === 1 && !debouncedQuery && !selectedCategory
          ? fetchArticles({ featured: true, limit: 3 })
          : Promise.resolve({ items: [], pagination: { page: 1, limit: 3, total: 0, totalPages: 1 } }),
      ]);
      setArticles(list.items);
      setTotalPages(list.pagination.totalPages);
      setFeatured(featuredList.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les articles');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, selectedCategory, page]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, selectedCategory]);

  const latest = useMemo(() => {
    if (featured.length === 0) return articles.slice(0, 3);
    const featuredIds = new Set(featured.map((a) => a.id));
    return articles.filter((a) => !featuredIds.has(a.id)).slice(0, 3);
  }, [articles, featured]);

  const gridArticles = useMemo(() => {
    if (page === 1 && !debouncedQuery && !selectedCategory && featured.length) {
      const exclude = new Set([...featured, ...latest].map((a) => a.id));
      const rest = articles.filter((a) => !exclude.has(a.id));
      return [...latest, ...rest];
    }
    return articles;
  }, [articles, featured, latest, page, debouncedQuery, selectedCategory]);

  const handleArticleUpdate = (updated: BlogArticle) => {
    setArticles((prev) => prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a)));
    setFeatured((prev) => prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a)));
  };

  return (
    <section id="blog-section" className="bg-stone-950 py-20 lg:py-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-20">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-5">
            <p className="section-label">Bany Officiel</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-stone-100 font-medium leading-tight">
              Blog
            </h1>
            <p className="text-stone-500 font-body text-base leading-relaxed max-w-xl">
              Analyses, interviews et coulisses — le prolongement écrit des conversations Bany Talks.
            </p>
          </div>
        </div>

        <hr className="editorial-rule" />

        {/* Search + categories */}
        <div className="space-y-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
            <input
              type="search"
              placeholder="Rechercher par titre, catégorie, auteur, mot-clé…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-4 py-3 bg-transparent border-b border-white/10 focus:border-rose-500/50 text-stone-200 placeholder-stone-600 focus:outline-none transition text-sm font-body"
            />
          </div>

          <div className="flex items-center gap-6 border-b border-white/5 pb-4 overflow-x-auto custom-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('')}
              className={`text-sm font-body pb-4 -mb-4 border-b-2 whitespace-nowrap transition cursor-pointer ${
                !selectedCategory
                  ? 'text-stone-100 border-rose-500'
                  : 'text-stone-600 border-transparent hover:text-stone-400'
              }`}
            >
              Toutes
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-sm font-body pb-4 -mb-4 border-b-2 whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'text-stone-100 border-rose-500'
                    : 'text-stone-600 border-transparent hover:text-stone-400'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="py-12 text-center space-y-4">
            <p className="text-stone-500 font-body">{error}</p>
            <p className="text-xs text-stone-600">
              Vérifiez que le backend tourne sur le port 4000 (`npm run dev` dans bany-backend).
            </p>
            <button type="button" onClick={loadArticles} className="link-arrow text-sm mx-auto">
              Réessayer
            </button>
          </div>
        )}

        {loading ? (
          <BlogGridSkeleton />
        ) : (
          <>
            {/* Featured */}
            {!debouncedQuery && !selectedCategory && featured.length > 0 && page === 1 && (
              <div className="space-y-6">
                <div>
                  <p className="section-label mb-1">À la une</p>
                  <h2 className="font-display text-xl sm:text-2xl text-stone-100 font-medium">Articles phares</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {featured.map((article, i) => (
                    <div key={article.id} className={i === 0 ? 'md:col-span-2 lg:col-span-2' : ''}>
                      <BlogArticleCard
                        article={article}
                        featured={i === 0}
                        index={i}
                        onRead={onReadArticle}
                        onCategory={onOpenCategory}
                        onArticleUpdate={handleArticleUpdate}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Latest / grid */}
            <div className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="section-label mb-1">
                    {debouncedQuery || selectedCategory ? 'Résultats' : 'Fil d’actualité'}
                  </p>
                  <h2 className="font-display text-xl sm:text-2xl text-stone-100 font-medium">
                    {selectedCategory
                      ? categories.find((c) => c.slug === selectedCategory)?.name || 'Catégorie'
                      : debouncedQuery
                        ? `« ${debouncedQuery} »`
                        : 'Publications'}
                  </h2>
                </div>
                {(debouncedQuery || selectedCategory) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('');
                    }}
                    className="text-xs text-stone-500 hover:text-stone-300 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <FilterX className="w-3.5 h-3.5" />
                    Réinitialiser
                  </button>
                )}
              </div>

              {gridArticles.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <p className="font-display text-xl text-stone-500">Aucun article trouvé</p>
                  <p className="text-sm text-stone-600 font-body">Essayez un autre mot-clé ou une autre catégorie.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {gridArticles.map((article, i) => (
                    <BlogArticleCard
                      key={article.id}
                      article={article}
                      index={i}
                      onRead={onReadArticle}
                      onCategory={onOpenCategory}
                      onArticleUpdate={handleArticleUpdate}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && gridArticles.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-white/10 text-sm text-stone-400 hover:text-stone-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Préc.
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .reduce<(number | '…')[]>((acc, n, idx, arr) => {
                    if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('…');
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === '…' ? (
                      <span key={`e-${idx}`} className="px-1 text-stone-600">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setPage(item);
                          document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`min-w-10 h-10 px-2 text-sm border cursor-pointer transition ${
                          page === item
                            ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                            : 'border-white/10 text-stone-400 hover:text-stone-100'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-white/10 text-sm text-stone-400 hover:text-stone-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                >
                  Suiv.
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        <BlogNewsletter />
      </div>
    </section>
  );
}
