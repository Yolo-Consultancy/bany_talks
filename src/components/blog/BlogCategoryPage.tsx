import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { BlogArticle, BlogCategory } from '../../types';
import { fetchCategoryBySlug } from '../../services/blogService';
import BlogArticleCard from './BlogArticleCard';
import BlogNewsletter from './BlogNewsletter';
import { BlogGridSkeleton } from './BlogSkeleton';

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

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {articles.map((article, i) => (
                  <BlogArticleCard
                    key={article.id}
                    article={{ ...article, category }}
                    index={i}
                    onRead={onReadArticle}
                    onCategory={onOpenCategory}
                  />
                ))}
              </div>
            )}

            <BlogNewsletter />
          </>
        )}
      </div>
    </section>
  );
}
