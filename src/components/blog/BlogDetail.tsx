import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  User,
  Share2,
  Linkedin,
  Twitter,
  Copy,
  Check,
  Facebook,
  Heart,
  MessageCircle,
} from 'lucide-react';
import type { BlogArticle } from '../../types';
import {
  applyArticleSeo,
  fetchArticleBySlug,
  formatBlogDate,
  likeArticle,
  mediaUrl,
  unlikeArticle,
} from '../../services/blogService';
import BlogArticleCard from './BlogArticleCard';
import { BlogCardSkeleton } from './BlogSkeleton';
import BlogComments from './BlogComments';

const LIKED_ARTICLES_KEY = 'bany_liked_articles';

function getLikedArticles(): Set<string> {
  try {
    const raw = localStorage.getItem(LIKED_ARTICLES_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveLikedArticles(set: Set<string>) {
  localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify([...set]));
}

interface BlogDetailProps {
  slug: string;
  onBack: () => void;
  onReadArticle: (slug: string) => void;
  onOpenCategory: (slug: string) => void;
}

export default function BlogDetail({ slug, onBack, onReadArticle, onOpenCategory }: BlogDetailProps) {
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [related, setRelated] = useState<BlogArticle[]>([]);
  const [prev, setPrev] = useState<BlogArticle | null>(null);
  const [next, setNext] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchArticleBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        setArticle(data.article);
        setRelated(data.related);
        setPrev(data.prev);
        setNext(data.next);
        setLiked(getLikedArticles().has(data.article.id));
        applyArticleSeo(data.article);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Article introuvable');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/#/blog/${slug}` : '';
  const shareText = article?.title || '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = async () => {
    if (!article || liking) return;
    setLiking(true);
    try {
      const updated = liked ? await unlikeArticle(article.id) : await likeArticle(article.id);
      const nextLiked = new Set(getLikedArticles());
      if (liked) nextLiked.delete(article.id);
      else nextLiked.add(article.id);
      saveLikedArticles(nextLiked);
      setLiked(!liked);
      setArticle(updated);
    } catch {
      /* ignore */
    } finally {
      setLiking(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-stone-950 py-20 lg:py-28 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="h-8 w-40 bg-stone-900 animate-pulse" />
          <div className="aspect-video bg-stone-900 animate-pulse" />
          <BlogCardSkeleton />
        </div>
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="bg-stone-950 py-20 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <p className="font-display text-2xl text-stone-400">{error || 'Article introuvable'}</p>
          <button type="button" onClick={onBack} className="btn-primary text-xs">
            Retour au blog
          </button>
        </div>
      </section>
    );
  }

  const category = article.category;

  return (
    <section className="bg-stone-950 py-12 lg:py-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="group flex items-center gap-2 text-stone-500 hover:text-stone-200 text-sm font-body mb-10 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour au blog
        </button>

        <div className="space-y-5 mb-8">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wider font-body">
            {category && (
              <button
                type="button"
                onClick={() => onOpenCategory(category.slug)}
                className="text-rose-500 hover:text-rose-400 cursor-pointer"
              >
                {category.name}
              </button>
            )}
            <span className="text-stone-600">•</span>
            <span className="text-stone-600">{formatBlogDate(article.publishedAt)}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-stone-100 font-medium leading-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-base sm:text-lg text-stone-400 font-body leading-relaxed max-w-3xl">
              {article.excerpt}
            </p>
          )}
        </div>

        {article.coverImage && (
          <div className="aspect-[16/9] overflow-hidden border border-white/5 mb-6 bg-stone-900">
            <img
              src={mediaUrl(article.coverImage)}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-5 text-sm text-stone-500 font-body mb-12">
          <span className="inline-flex items-center gap-2">
            <User className="w-4 h-4" />
            {article.author}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {article.readingTimeMinutes} min de lecture
          </span>
          <button
            type="button"
            onClick={handleLike}
            disabled={liking}
            className={`inline-flex items-center gap-2 transition cursor-pointer disabled:opacity-50 ${
              liked ? 'text-rose-500' : 'hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
            {article.likes ?? 0}
          </button>
          <a href="#comments" className="inline-flex items-center gap-2 hover:text-stone-300 transition">
            <MessageCircle className="w-4 h-4" />
            {article.commentCount ?? 0}
          </a>
        </div>

        <article
          className="prose-blog space-y-5 text-stone-400 font-body leading-relaxed text-base [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-stone-100 [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-2 [&_a]:text-rose-400"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.youtubeUrl && (
          <div className="mt-12 aspect-video border border-white/5 overflow-hidden bg-stone-900">
            <iframe
              src={article.youtubeUrl}
              title={article.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {article.gallery?.length > 0 && (
          <div className="mt-12 space-y-4">
            <p className="section-label">Galerie</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.gallery.map((src) => (
                <div key={src} className="aspect-[4/3] overflow-hidden border border-white/5 bg-stone-900">
                  <img src={mediaUrl(src)} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}

        {article.tags?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs text-stone-500 border border-white/10 px-3 py-1 font-body">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleLike}
            disabled={liking}
            className={`inline-flex items-center gap-2 text-sm font-body transition cursor-pointer disabled:opacity-50 ${
              liked ? 'text-rose-500' : 'text-stone-500 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
            {liked ? 'Aimé' : "J'aime"} · {article.likes ?? 0}
          </button>
          <span className="inline-flex items-center gap-2 text-sm text-stone-500 font-body">
            <Share2 className="w-4 h-4" /> Partager
          </span>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-stone-500 hover:text-stone-100 transition"
            aria-label="Partager sur X"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-stone-500 hover:text-stone-100 transition"
            aria-label="Partager sur LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-stone-500 hover:text-stone-100 transition"
            aria-label="Partager sur Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 text-stone-500 hover:text-stone-100 transition cursor-pointer"
            aria-label="Copier le lien"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div id="comments">
          <BlogComments articleId={article.id} articleSlug={article.slug} />
        </div>

        {/* Prev / Next */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-white/5 pt-10">
          {prev ? (
            <button
              type="button"
              onClick={() => onReadArticle(prev.slug)}
              className="text-left group space-y-2 cursor-pointer"
            >
              <span className="text-xs text-stone-600 font-body inline-flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Article précédent
              </span>
              <p className="font-display text-stone-200 group-hover:text-rose-400 transition leading-snug">
                {prev.title}
              </p>
            </button>
          ) : (
            <div />
          )}
          {next && (
            <button
              type="button"
              onClick={() => onReadArticle(next.slug)}
              className="text-left sm:text-right group space-y-2 cursor-pointer"
            >
              <span className="text-xs text-stone-600 font-body inline-flex items-center gap-1 sm:justify-end">
                Article suivant <ArrowRight className="w-3 h-3" />
              </span>
              <p className="font-display text-stone-200 group-hover:text-rose-400 transition leading-snug">
                {next.title}
              </p>
            </button>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-white/5 space-y-6">
            <div>
              <p className="section-label mb-2">Continuer la lecture</p>
              <h2 className="font-display text-2xl text-stone-100 font-medium">Articles similaires</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {related.map((item, i) => (
                <BlogArticleCard
                  key={item.id}
                  article={item}
                  index={i}
                  onRead={onReadArticle}
                  onCategory={onOpenCategory}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
