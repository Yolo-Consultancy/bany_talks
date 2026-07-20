export interface Guest {
  id: string;
  name: string;
  role: string;
  company?: string;
  bio: string;
  avatar: string;
  socials: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export interface Timestamp {
  time: string; // e.g., "02:15"
  seconds: number; // to allow syncing audio player to this point
  topic: string;
}

export interface Quote {
  text: string;
  author: string;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  richDescription: string;
  duration: string;
  publishDate: string;
  /** ISO 8601 — utilisé pour trier par date de publication */
  publishedAt?: string;
  category: 'Émissions' | 'Podcasts';
  thumbnail: string;
  youtubeUrl: string; // embed URL or placeholder ID
  audioUrl: string; // playable audio stream
  guest: Guest;
  timestamps: Timestamp[];
  quotes: Quote[];
  viewsCount: number;
  likesCount: number;
  spotifyUrl: string;
  applePodcastsUrl: string;
}

export interface SpeakerRequest {
  id: string;
  name: string;
  company: string;
  email: string;
  eventType: string;
  date: string;
  budgetRange: string;
  message: string;
  createdAt: string;
}

export interface NewsletterSubscription {
  email: string;
  joinedAt: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  description: string;
  coverGradient: string; // CSS style gradient for elegant representation
  category: string;
  publishedYear: string;
  pagesCount: number;
  rating: number; // e.g., 4.9
  buyUrl: string;
  highlights: string[];
}

export type BlogArticleStatus = 'draft' | 'scheduled' | 'published';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount?: number;
}

export interface BlogSeo {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  gallery: string[];
  youtubeUrl?: string;
  author: string;
  categoryId: string;
  category?: BlogCategory | null;
  tags: string[];
  status: BlogArticleStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  readingTimeMinutes: number;
  likes: number;
  commentCount: number;
  featured: boolean;
  seo: BlogSeo;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogListResponse {
  items: BlogArticle[];
  pagination: BlogPagination;
}

export interface BlogArticleDetailResponse {
  article: BlogArticle;
  related: BlogArticle[];
  prev: BlogArticle | null;
  next: BlogArticle | null;
}

export interface BlogComment {
  id: string;
  articleId: string;
  parentId?: string | null;
  author: string;
  email?: string;
  content: string;
  likes: number;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  articleTitle?: string;
  articleSlug?: string;
}

