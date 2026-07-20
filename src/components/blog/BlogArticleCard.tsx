import React, { useEffect, useState } from 'react';
import { ThumbsUp, MessageCircle, Share2, Globe2, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { BlogArticle } from '../../types';
import { formatBlogDate, likeArticle, mediaUrl, unlikeArticle } from '../../services/blogService';
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

function authorInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}

function formatCount(n: number) {
  if (n >= 1000) {
    const v = n / 1000;
    return `${v.toFixed(v >= 10 ? 0 : 1).replace('.', ',')} K`;
  }
  return String(n);
}

interface BlogArticleCardProps {
  article: BlogArticle;
  onRead: (slug: string) => void;
  onCategory?: (slug: string) => void;
  onArticleUpdate?: (article: BlogArticle) => void;
  featured?: boolean;
  index?: number;
}

export default function BlogArticleCard({
  article,
  onRead,
  onCategory,
  onArticleUpdate,
  featured = false,
  index = 0,
}: BlogArticleCardProps) {
  const category = article.category;
  const [liked, setLiked] = useState(() => getLikedArticles().has(article.id));
  const [likes, setLikes] = useState(article.likes ?? 0);
  const [commentCount, setCommentCount] = useState(article.commentCount ?? 0);
  const [liking, setLiking] = useState(false);
  const [sharedHint, setSharedHint] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    setLikes(article.likes ?? 0);
    setCommentCount(article.commentCount ?? 0);
    setLiked(getLikedArticles().has(article.id));
  }, [article.id, article.likes, article.commentCount]);

  const handleLike = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (liking) return;
    setLiking(true);
    try {
      const updated = liked ? await unlikeArticle(article.id) : await likeArticle(article.id);
      const nextLiked = new Set(getLikedArticles());
      if (liked) nextLiked.delete(article.id);
      else nextLiked.add(article.id);
      saveLikedArticles(nextLiked);
      setLiked(!liked);
      setLikes(updated.likes);
      onArticleUpdate?.({ ...updated, commentCount });
    } catch {
      /* ignore */
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#/blog/${article.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, text: article.excerpt, url });
      } else {
        await navigator.clipboard.writeText(url);
        setSharedHint(true);
        setTimeout(() => setSharedHint(false), 1800);
      }
    } catch {
      /* cancelled */
    }
  };

  const handleCommentCountChange = (count: number) => {
    setCommentCount(count);
    onArticleUpdate?.({ ...article, likes, commentCount: count });
  };

  const toggleComments = () => setShowComments((v) => !v);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-stone-900 border border-white/5 overflow-hidden ${featured ? 'ring-1 ring-rose-500/20' : ''}`}
    >
      <div className="flex items-start gap-3 px-4 pt-3 pb-2">
        <button
          type="button"
          onClick={() => onRead(article.slug)}
          className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white text-sm font-semibold shrink-0 cursor-pointer"
          aria-label={article.author}
        >
          {authorInitials(article.author || 'B')}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onRead(article.slug)}
              className="text-[15px] font-semibold text-stone-100 hover:underline cursor-pointer truncate"
            >
              {article.author || 'Bany'}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1 text-[12px] text-stone-500 font-body">
            {category && (
              <>
                <button
                  type="button"
                  onClick={() => onCategory?.(category.slug)}
                  className="hover:underline cursor-pointer text-stone-400"
                >
                  {category.name}
                </button>
                <span>·</span>
              </>
            )}
            <span>{formatBlogDate(article.publishedAt)}</span>
            <span>·</span>
            <Globe2 className="w-3 h-3 inline" />
            <span>{article.readingTimeMinutes} min</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRead(article.slug)}
          className="p-2 text-stone-500 hover:bg-white/5 rounded-full cursor-pointer"
          aria-label="Plus"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {article.excerpt && (
        <button
          type="button"
          onClick={() => onRead(article.slug)}
          className="block w-full text-left px-4 pb-3 cursor-pointer"
        >
          <p className="text-[15px] text-stone-300 font-body leading-relaxed line-clamp-4">
            {article.excerpt}
          </p>
        </button>
      )}

      <button
        type="button"
        onClick={() => onRead(article.slug)}
        className="relative w-full aspect-[16/9] bg-stone-850 overflow-hidden cursor-pointer block"
      >
        {article.coverImage ? (
          <img
            src={mediaUrl(article.coverImage)}
            alt={article.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-stone-850 to-stone-900 flex items-center justify-center px-8">
            <p className="font-display text-xl text-stone-600 text-center line-clamp-3">{article.title}</p>
          </div>
        )}
      </button>

      <button
        type="button"
        onClick={() => onRead(article.slug)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[#161616] border-t border-white/5 text-left cursor-pointer hover:bg-[#1a1a1a] transition"
      >
        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="text-[11px] uppercase tracking-wide text-stone-600 font-body">Bany Talks</p>
          <p className="text-[15px] font-semibold text-stone-100 leading-snug line-clamp-2">{article.title}</p>
          {article.excerpt && (
            <p className="text-[13px] text-stone-500 font-body line-clamp-1">{article.excerpt}</p>
          )}
        </div>
        <span className="shrink-0 text-[13px] font-semibold text-stone-200 bg-white/10 hover:bg-white/15 px-3 py-2 rounded-md">
          Lire
        </span>
      </button>

      {(likes > 0 || commentCount > 0) && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-[13px] text-stone-500 font-body border-t border-white/5">
          <button
            type="button"
            onClick={() => handleLike()}
            className="inline-flex items-center gap-1.5 hover:underline cursor-pointer"
          >
            <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-rose-500">
              <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
            </span>
            <span>{formatCount(likes)}</span>
          </button>
          <button type="button" onClick={toggleComments} className="hover:underline cursor-pointer">
            {commentCount} commentaire{commentCount !== 1 ? 's' : ''}
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 border-t border-white/5 mx-1 sm:mx-2 mb-1">
        <button
          type="button"
          onClick={() => handleLike()}
          disabled={liking}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 text-[12px] sm:text-[14px] font-semibold rounded-md hover:bg-white/5 transition cursor-pointer disabled:opacity-50 ${
            liked ? 'text-rose-500' : 'text-stone-500'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${liked ? 'fill-rose-500' : ''}`} />
          J’aime
        </button>
        <button
          type="button"
          onClick={toggleComments}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 text-[12px] sm:text-[14px] font-semibold rounded-md hover:bg-white/5 transition cursor-pointer ${
            showComments ? 'text-rose-400' : 'text-stone-500'
          }`}
        >
          <MessageCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          Commenter
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 text-[12px] sm:text-[14px] font-semibold text-stone-500 rounded-md hover:bg-white/5 transition cursor-pointer"
        >
          <Share2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          {sharedHint ? 'Copié' : 'Partager'}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="px-3 sm:px-4 py-3">
              <BlogComments
                articleId={article.id}
                articleSlug={article.slug}
                compact
                autoFocus
                onCountChange={handleCommentCountChange}
              />
              <button
                type="button"
                onClick={() => onRead(article.slug)}
                className="mt-3 text-[13px] font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
              >
                Voir l’article complet
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
