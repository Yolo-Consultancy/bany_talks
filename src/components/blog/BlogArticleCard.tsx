import React from 'react';
import { ArrowRight, Clock, User } from 'lucide-react';
import { motion } from 'motion/react';
import type { BlogArticle } from '../../types';
import { formatBlogDate, mediaUrl } from '../../services/blogService';

interface BlogArticleCardProps {
  article: BlogArticle;
  onRead: (slug: string) => void;
  onCategory?: (slug: string) => void;
  featured?: boolean;
  index?: number;
}

export default function BlogArticleCard({
  article,
  onRead,
  onCategory,
  featured = false,
  index = 0,
}: BlogArticleCardProps) {
  const category = article.category;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex flex-col ${featured ? 'lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-8' : ''}`}
    >
      <button
        type="button"
        onClick={() => onRead(article.slug)}
        className="relative aspect-[16/10] overflow-hidden border border-white/5 bg-stone-900 cursor-pointer text-left"
      >
        {article.coverImage ? (
          <img
            src={mediaUrl(article.coverImage)}
            alt={article.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-stone-900 to-stone-850" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </button>

      <div className={`flex flex-col gap-3 pt-5 ${featured ? 'lg:pt-0 lg:justify-center' : ''}`}>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-body uppercase tracking-wider">
          {category && (
            <button
              type="button"
              onClick={() => onCategory?.(category.slug)}
              className="text-rose-500 hover:text-rose-400 transition cursor-pointer"
            >
              {category.name}
            </button>
          )}
          <span className="text-stone-600">•</span>
          <span className="text-stone-600">{formatBlogDate(article.publishedAt)}</span>
        </div>

        <button type="button" onClick={() => onRead(article.slug)} className="text-left cursor-pointer">
          <h3
            className={`font-display text-stone-100 font-medium leading-snug group-hover:text-rose-400 transition ${
              featured ? 'text-2xl lg:text-3xl' : 'text-xl'
            }`}
          >
            {article.title}
          </h3>
        </button>

        <p className="text-sm text-stone-500 font-body leading-relaxed line-clamp-3">{article.excerpt}</p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 font-body pt-1">
          <span className="inline-flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {article.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {article.readingTimeMinutes} min
          </span>
        </div>

        <button type="button" onClick={() => onRead(article.slug)} className="link-arrow text-xs mt-2 w-fit cursor-pointer">
          Lire l'article <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.article>
  );
}
