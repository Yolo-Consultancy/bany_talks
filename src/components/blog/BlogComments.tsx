import React, { useEffect, useMemo, useState } from 'react';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import type { BlogComment } from '../../types';
import {
  createComment,
  fetchComments,
  likeComment,
  unlikeComment,
} from '../../services/blogService';

interface BlogCommentsProps {
  articleId: string;
  articleSlug: string;
  compact?: boolean;
  autoFocus?: boolean;
  onCountChange?: (count: number) => void;
}

const LIKED_KEY = 'bany_liked_comments';
const PROFILE_KEY = 'bany_comment_profile';

function getLikedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(LIKED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveLikedSet(set: Set<string>) {
  localStorage.setItem(LIKED_KEY, JSON.stringify([...set]));
}

function getSavedProfile(): { author: string; email: string } {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : { author: '', email: '' };
  } catch {
    return { author: '', email: '' };
  }
}

function saveProfile(author: string, email: string) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ author, email }));
}

function avatarColor(name: string) {
  const colors = ['#ef3b3b', '#c43a3a', '#a33b3b', '#8b2e2e', '#6f1f1f', '#d94a4a'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "À l'instant";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} j`;
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0 select-none"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        background: avatarColor(name || '?'),
      }}
    >
      {initials(name || '?') || '?'}
    </div>
  );
}

interface CommentRowProps {
  comment: BlogComment;
  isReply?: boolean;
  replies: BlogComment[];
  liked: Set<string>;
  replyTo: string | null;
  replyContent: string;
  replySubmitting: boolean;
  authorName: string;
  onToggleLike: (comment: BlogComment) => void;
  onToggleReply: (id: string) => void;
  onReplyContentChange: (value: string) => void;
  onReplySubmit: (parentId: string) => void;
}

function CommentRow({
  comment,
  isReply = false,
  replies,
  liked,
  replyTo,
  replyContent,
  replySubmitting,
  authorName,
  onToggleLike,
  onToggleReply,
  onReplyContentChange,
  onReplySubmit,
}: CommentRowProps) {
  const isLiked = liked.has(comment.id);

  return (
    <div className={isReply ? 'ml-10 sm:ml-12' : ''}>
      <div className="flex gap-2.5">
        <Avatar name={comment.author} size={isReply ? 28 : 36} />
        <div className="flex-1 min-w-0">
          <div className="relative inline-block max-w-full">
            <div className="bg-[#1a1a1a] rounded-2xl px-3 py-2">
              <p className="text-[13px] font-semibold text-stone-100 leading-tight">{comment.author}</p>
              <p className="text-[14px] text-stone-300 font-body leading-snug mt-0.5 whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            </div>
            {comment.likes > 0 && (
              <span className="absolute -bottom-2 -right-1 inline-flex items-center gap-1 bg-stone-900 border border-white/10 rounded-full pl-0.5 pr-1.5 py-0.5 text-[11px] text-stone-400 shadow-sm">
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-rose-500">
                  <ThumbsUp className="w-2 h-2 text-white fill-white" />
                </span>
                {comment.likes}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 px-1 text-[12px] font-semibold">
            <span className="text-stone-600 font-normal">{relativeTime(comment.createdAt)}</span>
            <button
              type="button"
              onClick={() => onToggleLike(comment)}
              className={`cursor-pointer hover:underline ${isLiked ? 'text-rose-500' : 'text-stone-500 hover:text-stone-300'}`}
            >
              J’aime
            </button>
            {!isReply && (
              <button
                type="button"
                onClick={() => onToggleReply(comment.id)}
                className="text-stone-500 hover:text-stone-300 cursor-pointer hover:underline"
              >
                Répondre
              </button>
            )}
          </div>

          {replyTo === comment.id && (
            <div className="flex gap-2 mt-2">
              <Avatar name={authorName || '?'} size={28} />
              <div className="flex-1">
                <div className="bg-[#1a1a1a] rounded-2xl px-3 py-2 flex items-end gap-2">
                  <textarea
                    value={replyContent}
                    onChange={(e) => onReplyContentChange(e.target.value)}
                    rows={1}
                    placeholder={`Répondre à ${comment.author}…`}
                    className="flex-1 bg-transparent text-[14px] text-stone-200 placeholder:text-stone-600 focus:outline-none resize-none font-body min-h-[24px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        onReplySubmit(comment.id);
                      }
                    }}
                  />
                  <button
                    type="button"
                    disabled={replySubmitting || !replyContent.trim()}
                    onClick={() => onReplySubmit(comment.id)}
                    className="text-rose-500 text-[12px] font-semibold disabled:opacity-40 cursor-pointer shrink-0"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          )}

          {replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {replies.map((reply) => (
                <CommentRow
                  key={reply.id}
                  comment={reply}
                  isReply
                  replies={[]}
                  liked={liked}
                  replyTo={replyTo}
                  replyContent={replyContent}
                  replySubmitting={replySubmitting}
                  authorName={authorName}
                  onToggleLike={onToggleLike}
                  onToggleReply={onToggleReply}
                  onReplyContentChange={onReplyContentChange}
                  onReplySubmit={onReplySubmit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BlogComments({
  articleId,
  articleSlug,
  compact = false,
  autoFocus = false,
  onCountChange,
}: BlogCommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const saved = getSavedProfile();
  const [author, setAuthor] = useState(saved.author);
  const [email, setEmail] = useState(saved.email);
  const [editingProfile, setEditingProfile] = useState(!saved.author);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(() => getLikedSet());
  const [sort, setSort] = useState<'newest' | 'relevant'>('newest');
  const composerRef = React.useRef<HTMLTextAreaElement>(null);

  const ref = articleSlug || articleId;

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await fetchComments(ref);
      setComments(data.items);
      onCountChange?.(data.total ?? data.items.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les commentaires');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [articleId, articleSlug]);

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => composerRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  useEffect(() => {
    onCountChange?.(comments.length);
  }, [comments.length]);

  const roots = useMemo(() => {
    const top = comments.filter((c) => !c.parentId);
    if (sort === 'relevant') {
      return [...top].sort(
        (a, b) => (b.likes || 0) - (a.likes || 0) || +new Date(b.createdAt) - +new Date(a.createdAt)
      );
    }
    return [...top].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [comments, sort]);

  const visibleRoots = compact ? roots.slice(0, 4) : roots;

  const repliesOf = (parentId: string) =>
    comments
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));

  const postComment = async (text: string, parentId?: string | null) => {
    if (!author.trim()) {
      setError('Indiquez votre nom pour commenter');
      setEditingProfile(true);
      return null;
    }
    if (!text.trim()) return null;
    saveProfile(author.trim(), email.trim());
    setEditingProfile(false);
    const created = await createComment(ref, {
      author: author.trim(),
      email: email.trim() || undefined,
      content: text.trim(),
      parentId: parentId || null,
    });
    setComments((prev) => [...prev, created]);
    return created;
  };

  const handleMainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await postComment(content);
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Envoi impossible');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    setReplySubmitting(true);
    setError(null);
    try {
      await postComment(replyContent, parentId);
      setReplyContent('');
      setReplyTo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Réponse impossible');
    } finally {
      setReplySubmitting(false);
    }
  };

  const toggleLike = async (comment: BlogComment) => {
    const next = new Set(liked);
    const isLiked = next.has(comment.id);
    try {
      const updated = isLiked ? await unlikeComment(comment.id) : await likeComment(comment.id);
      if (isLiked) next.delete(comment.id);
      else next.add(comment.id);
      setLiked(next);
      saveLikedSet(next);
      setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, likes: updated.likes } : c)));
    } catch {
      /* ignore */
    }
  };

  return (
    <section className={compact ? 'space-y-4' : 'mt-16 pt-12 border-t border-white/5 space-y-5'}>
      {!compact && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-rose-500" />
            <h2 className="font-display text-xl text-stone-100 font-medium">
              Commentaires · {comments.length}
            </h2>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'newest' | 'relevant')}
            className="bg-transparent border-none text-[13px] text-stone-400 focus:outline-none cursor-pointer"
          >
            <option value="newest" className="bg-stone-900">
              Plus récents
            </option>
            <option value="relevant" className="bg-stone-900">
              Les plus pertinents
            </option>
          </select>
        </div>
      )}

      <div className="flex gap-2.5">
        <Avatar name={author || '?'} size={compact ? 32 : 40} />
        <form onSubmit={handleMainSubmit} className="flex-1 space-y-2">
          {editingProfile ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-1">
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Votre nom"
                className="bg-[#1a1a1a] rounded-full px-4 py-2 text-[13px] text-stone-200 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-rose-500/40"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optionnel)"
                className="bg-[#1a1a1a] rounded-full px-4 py-2 text-[13px] text-stone-200 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-rose-500/40"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditingProfile(true)}
              className="text-[11px] text-stone-600 hover:text-stone-400 cursor-pointer"
            >
              Commenter en tant que {author} · changer
            </button>
          )}
          <div className="bg-[#1a1a1a] rounded-2xl px-4 py-2.5 flex items-end gap-2">
            <textarea
              ref={composerRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={1}
              placeholder="Écrire un commentaire…"
              className="flex-1 bg-transparent text-[15px] text-stone-200 placeholder:text-stone-600 focus:outline-none resize-none font-body min-h-[28px] max-h-32"
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (content.trim()) handleMainSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="text-rose-500 text-[13px] font-semibold disabled:opacity-40 cursor-pointer shrink-0 pb-0.5"
            >
              Publier
            </button>
          </div>
          {error && <p className="text-xs text-red-400 px-1">{error}</p>}
        </form>
      </div>

      <div className={`space-y-4 ${compact ? 'pt-1 max-h-80 overflow-y-auto custom-scrollbar pr-1' : 'pt-2'}`}>
        {loading ? (
          <p className="text-sm text-stone-600">Chargement…</p>
        ) : visibleRoots.length === 0 ? (
          <p className="text-sm text-stone-600 py-2">Soyez le premier à commenter.</p>
        ) : (
          visibleRoots.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              replies={repliesOf(comment.id)}
              liked={liked}
              replyTo={replyTo}
              replyContent={replyContent}
              replySubmitting={replySubmitting}
              authorName={author}
              onToggleLike={toggleLike}
              onToggleReply={(id) => {
                setReplyTo(replyTo === id ? null : id);
                setReplyContent('');
              }}
              onReplyContentChange={setReplyContent}
              onReplySubmit={handleReplySubmit}
            />
          ))
        )}
      </div>

      {compact && roots.length > 4 && (
        <p className="text-[13px] text-stone-500 font-semibold px-1">
          + {roots.length - 4} autre{roots.length - 4 > 1 ? 's' : ''} commentaire
          {roots.length - 4 > 1 ? 's' : ''}
        </p>
      )}
    </section>
  );
}
