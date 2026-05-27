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

export interface RatingQuestion {
  id: string;
  author: string;
  question: string;
  upvotes: number;
  isUpvoted?: boolean;
  replies?: string[];
  createdAt: string;
}

export interface VoiceAsk {
  id: string;
  author: string;
  duration: number;
  audioBlobUrl: string; // Simulated recording url
  createdAt: string;
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

