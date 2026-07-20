import type {
  BlogArticle,
  BlogArticleDetailResponse,
  BlogCategory,
  BlogListResponse,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

function mediaUrl(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE}${path}`;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    let message = 'Une erreur est survenue';
    try {
      const err = await res.json();
      message = err.message || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export interface ArticleQuery {
  q?: string;
  category?: string;
  author?: string;
  tag?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

export async function fetchArticles(query: ArticleQuery = {}): Promise<BlogListResponse> {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.category) params.set('category', query.category);
  if (query.author) params.set('author', query.author);
  if (query.tag) params.set('tag', query.tag);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.featured) params.set('featured', 'true');

  const qs = params.toString();
  return request<BlogListResponse>(`/api/articles${qs ? `?${qs}` : ''}`);
}

export async function fetchArticleBySlug(slug: string): Promise<BlogArticleDetailResponse> {
  return request<BlogArticleDetailResponse>(`/api/articles/${encodeURIComponent(slug)}`);
}

export async function likeArticle(id: string): Promise<BlogArticle> {
  return request<BlogArticle>(`/api/articles/${id}/like`, { method: 'POST' });
}

export async function unlikeArticle(id: string): Promise<BlogArticle> {
  return request<BlogArticle>(`/api/articles/${id}/unlike`, { method: 'POST' });
}

export async function fetchCategories(): Promise<BlogCategory[]> {
  return request<BlogCategory[]>('/api/categories');
}

export async function fetchCategoryBySlug(
  slug: string
): Promise<{ category: BlogCategory; articles: BlogArticle[] }> {
  return request(`/api/categories/${encodeURIComponent(slug)}`);
}

export async function subscribeBlogNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  return request('/api/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email, source: 'blog' }),
  });
}

export async function adminLogin(email: string, password: string): Promise<{ token: string; email: string }> {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchAdminArticles(token: string): Promise<{ items: BlogArticle[] }> {
  return request('/api/articles/admin/all', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createArticle(
  token: string,
  payload: Partial<BlogArticle> & { publishNow?: boolean }
): Promise<BlogArticle> {
  return request('/api/articles', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateArticle(
  token: string,
  id: string,
  payload: Partial<BlogArticle> & { publishNow?: boolean }
): Promise<BlogArticle> {
  return request(`/api/articles/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteArticle(token: string, id: string): Promise<void> {
  await request(`/api/articles/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createCategory(
  token: string,
  payload: { name: string; slug?: string; description?: string }
): Promise<BlogCategory> {
  return request('/api/categories', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(
  token: string,
  id: string,
  payload: { name?: string; slug?: string; description?: string }
): Promise<BlogCategory> {
  return request(`/api/categories/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(token: string, id: string): Promise<void> {
  await request(`/api/categories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchComments(articleRef: string): Promise<{ items: import('../types').BlogComment[]; total: number }> {
  return request(`/api/comments/article/${encodeURIComponent(articleRef)}`);
}

export async function createComment(
  articleRef: string,
  payload: { author: string; email?: string; content: string; parentId?: string | null }
): Promise<import('../types').BlogComment> {
  return request(`/api/comments/article/${encodeURIComponent(articleRef)}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function likeComment(id: string): Promise<import('../types').BlogComment> {
  return request(`/api/comments/${id}/like`, { method: 'POST' });
}

export async function unlikeComment(id: string): Promise<import('../types').BlogComment> {
  return request(`/api/comments/${id}/unlike`, { method: 'POST' });
}

export async function fetchAdminComments(token: string): Promise<{ items: import('../types').BlogComment[] }> {
  return request('/api/comments/admin/all', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteComment(token: string, id: string): Promise<void> {
  await request(`/api/comments/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function uploadImage(token: string, file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Échec du téléversement');
  }
  const data = await res.json();
  return mediaUrl(data.url);
}

export { mediaUrl };

export function formatBlogDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function applyArticleSeo(article: BlogArticle) {
  const title = article.seo?.metaTitle || article.title;
  const description = article.seo?.metaDescription || article.excerpt;
  const image = article.seo?.ogImage || article.coverImage;
  const url = article.seo?.canonicalUrl || `${window.location.origin}/#/blog/${article.slug}`;

  document.title = title;

  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('name', 'description', description);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:type', 'article');
  setMeta('property', 'og:url', url);
  if (image) setMeta('property', 'og:image', image);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  if (image) setMeta('name', 'twitter:image', image);

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}
