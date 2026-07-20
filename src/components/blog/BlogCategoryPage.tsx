import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import type { BlogArticle, BlogCategory } from '../../types';
import { fetchCategoryBySlug } from '../../services/blogService';
import BlogArticleCard from './BlogArticleCard';
import BlogNewsletter from './BlogNewsletter';
import { BlogGridSkeleton } from './BlogSkeleton';

const PAGE_SIZE = 9;

interface BlogCategoryPageProps {
  categorySlug: string;
  onBack: () => void;
  onReadArticle: (slug: string) => void;
  onOpenCategory: (slug: string) => void;
}

export default function BlogCategoryPage({
  categorySlug,
  onBack,
  onReadArticle,
  onOpenCategory,
}: BlogCategoryPageProps) {
  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPage(1);
    fetchCategoryBySlug(categorySlug)
      .then((data) => {
        if (cancelled) return;
        setCategory(data.category);
        setArticles(data.articles);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Catégorie introuvable');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const pageArticles = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return articles.slice(start, start + PAGE_SIZE);
  }, [articles, page]);

  const goToPage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="bg-stone-950 py-20 lg:py-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-stone-500 hover:text-stone-200 text-sm font-body transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Tout le blog
        </button>

        {loading ? (
          <BlogGridSkeleton />
        ) : error || !category ? (
          <div className="py-20 text-center space-y-4">
            <p className="font-display text-xl text-stone-500">{error || 'Catégorie introuvable'}</p>
            <button type="button" onClick={onBack} className="btn-primary text-xs">
              Retour
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 max-w-2xl">
              <p className="section-label">Catégorie</p>
              <h1 className="font-display text-4xl sm:text-5xl text-stone-100 font-medium">{category.name}</h1>
              <p className="text-stone-500 font-body">{category.description}</p>
              <p className="text-xs text-stone-600 font-body">
                {articles.length} article{articles.length !== 1 ? 's' : ''}
              </p>
            </div>

            <hr className="editorial-rule" />

            {articles.length === 0 ? (
              <p className="text-stone-500 font-body py-12">Aucun article publié dans cette catégorie.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {pageArticles.map((article, i) => (
                    <BlogArticleCard
                      key={article.id}
                      article={{ ...article, category }}
                      index={i}
                      onRead={onReadArticle}
                      onCategory={onOpenCategory}
                      onArticleUpdate={(updated) =>
                        setArticles((prev) => prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a)))
                      }
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => goToPage(Math.max(1, page - 1))}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-white/10 text-sm text-stone-400 hover:text-stone-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Préc.
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => goToPage(n)}
                        className={`min-w-10 h-10 px-2 text-sm border cursor-pointer transition ${
                          page === n
                            ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                            : 'border-white/10 text-stone-400 hover:text-stone-100'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => goToPage(Math.min(totalPages, page + 1))}
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
          </>
        )}
      </div>
    </section>
  );
}
