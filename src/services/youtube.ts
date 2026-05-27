import { Episode } from '../types';

/**
 * CONFIGURATION DE LA CHAÎNE YOUTUBE DE BANY
 * Renseignez ici les identifiants pour synchroniser automatiquement les émissions au chargement.
 * Vous pouvez également définir ces valeurs dans votre fichier d'environnement (.env.local) :
 * - VITE_YOUTUBE_CHANNEL_ID="..." (identifiant de la chaîne, ex: UC...)
 * - VITE_YOUTUBE_API_KEY="..." (Clé d'API optionnelle, sinon utilise le flux RSS gratuit)
 */
export const DEFAULT_YOUTUBE_CHANNEL_ID = 'UCVD4Xz1D5HsROhox55EwZ5A';
export const DEFAULT_YOUTUBE_API_KEY = '';    // Optionnel : Clé API Google Cloud YouTube


/**
 * Parses an ISO 8601 Duration (YouTube API format e.g. PT1H14M22S) to HH:MM:SS or MM:SS
 */
function parseISO8601Duration(isoDuration: string): string {
  const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return '00:00';
  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);

  const formatNum = (num: number) => String(num).padStart(2, '0');

  if (hours > 0) {
    return `${formatNum(hours)}:${formatNum(minutes)}:${formatNum(seconds)}`;
  }
  return `${formatNum(minutes)}:${formatNum(seconds)}`;
}

/**
 * Method 1 (Official API): Fetches latest videos using YouTube Data API v3
 */
export async function fetchYouTubeVideos(
  channelIdOrUploadsPlaylistId: string,
  apiKey?: string
): Promise<Episode[]> {
  const actualApiKey = apiKey || ((import.meta as any).env?.VITE_YOUTUBE_API_KEY) || DEFAULT_YOUTUBE_API_KEY || '';
  if (!actualApiKey) {
    throw new Error("L'API Key YouTube est requise pour utiliser l'API officielle.");
  }

  // Derive Uploads Playlist ID if it's a Channel ID (starts with UC)
  let playlistId = channelIdOrUploadsPlaylistId.trim();
  if (playlistId.startsWith('UC')) {
    playlistId = 'UU' + playlistId.substring(2);
  }

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=12&playlistId=${playlistId}&key=${actualApiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || "Échec de la récupération des vidéos YouTube via l'API.");
  }

  const data = await response.json();
  const items = data.items || [];

  // Fetch detailed statistics (views count & duration)
  const videoIds = items.map((item: any) => item.contentDetails?.videoId).filter(Boolean);
  const videoStatsMap: Record<string, { duration: string; viewCount: number }> = {};

  if (videoIds.length > 0) {
    try {
      const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds.join(',')}&key=${actualApiKey}`;
      const statsRes = await fetch(statsUrl);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        (statsData.items || []).forEach((v: any) => {
          const duration = parseISO8601Duration(v.contentDetails?.duration || 'PT0S');
          const viewCount = parseInt(v.statistics?.viewCount || '0', 10);
          videoStatsMap[v.id] = { duration, viewCount };
        });
      }
    } catch (e) {
      console.warn("Impossible de récupérer les statistiques détaillées", e);
    }
  }

  return items.map((item: any, index: number): Episode => {
    const snippet = item.snippet || {};
    const videoId = item.contentDetails?.videoId || snippet.resourceId?.videoId;
    const thumbnailObj = snippet.thumbnails?.maxres || snippet.thumbnails?.high || snippet.thumbnails?.medium || snippet.thumbnails?.default;
    const stats: any = videoStatsMap[videoId] || {};

    const publishDateRaw = new Date(snippet.publishedAt || Date.now());
    const publishDateFormatted = publishDateRaw.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return {
      id: `yt-${videoId}`,
      number: items.length - index,
      title: snippet.title || 'Mission YouTube',
      description: snippet.description ? (snippet.description.substring(0, 160) + '...') : '',
      richDescription: snippet.description || '',
      duration: stats.duration || 'Vidéo',
      publishDate: publishDateFormatted,
      category: 'Émissions',
      thumbnail: thumbnailObj?.url || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop',
      youtubeUrl: `https://www.youtube.com/embed/${videoId}`,
      audioUrl: '', // Pure video stream (cannot easily be played via standard Audio element)
      viewsCount: stats.viewCount || 0,
      likesCount: Math.round((stats.viewCount || 0) * 0.05),
      quotes: [],
      spotifyUrl: '',
      applePodcastsUrl: '',
      guest: {
        id: `guest-${videoId}`,
        name: 'Bany Talks & Invités',
        role: 'Émission Vidéo',
        bio: snippet.description || 'Retrouvez toutes les infos et notes de l’émission sur notre chaîne YouTube !',
        avatar: '/input_file_0.png',
        socials: {
          youtube: `https://youtube.com/watch?v=${videoId}`
        }
      },
      timestamps: []
    };
  });
}

/**
 * Method 2 (No API key needed!): Fetches a playlist RSS feed via a CORS-free JSON proxy
 */
/**
 * Fetches a YouTube playlist page via a CORS proxy and extracts video entries.
 * Returns an array of Episode objects with the given category.
 */
export async function fetchYouTubePlaylistHTML(playlistId: string, categoryName: 'Émissions' | 'Podcasts'): Promise<Episode[]> {
  const cleanId = playlistId.trim();
  if (!cleanId) {
    throw new Error('Playlist ID is required');
  }
  const playlistUrl = `https://www.youtube.com/playlist?list=${cleanId}`;
  const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(playlistUrl)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch playlist page: ${response.status}`);
  }
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const videoAnchors = Array.from(doc.querySelectorAll('a[href^="/watch?"]'));
  const seen = new Set<string>();
  const episodes: Episode[] = [];
  for (const a of videoAnchors) {
    const href = a.getAttribute('href') || '';
    const url = new URL('https://www.youtube.com' + href);
    const videoId = url.searchParams.get('v');
    if (!videoId || seen.has(videoId)) continue;
    seen.add(videoId);
    const title = a.textContent?.trim() || 'Untitled';
    const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const publishDateFormatted = new Date().toISOString().split('T')[0]; // placeholder
    episodes.push({
      id: `yt-${videoId}`,
      number: episodes.length + 1,
      title,
      description: title,
      richDescription: title,
      duration: 'Vidéo',
      publishDate: publishDateFormatted,
      category: categoryName,
      thumbnail,
      youtubeUrl: `https://www.youtube.com/embed/${videoId}`,
      audioUrl: '',
      viewsCount: 0,
      likesCount: 0,
      spotifyUrl: '',
      applePodcastsUrl: '',
      guest: {
        id: `guest-${videoId}`,
        name: 'YouTube Guest',
        role: categoryName,
        company: '',
        bio: '',
        avatar: '/input_file_0.png',
        socials: {}
      },
      timestamps: [],
      quotes: []
    });
  }
  return episodes;
}


/**
 * Fetches a YouTube playlist page via a CORS proxy and extracts video entries using regex.
 * Returns an array of Episode objects with the given category.
 */
export async function fetchYouTubePlaylistData(playlistId: string, categoryName: 'Émissions' | 'Podcasts'): Promise<Episode[]> {
  const cleanId = playlistId.trim();
  if (!cleanId) {
    throw new Error('Playlist ID is required');
  }
  const playlistUrl = `https://www.youtube.com/playlist?list=${cleanId}`;
  const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(playlistUrl)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch playlist page: ${response.status}`);
  }
  const html = await response.text();
  // Regex to capture videoId and title from the HTML JSON structures
  const videoRegex = /"videoId":"([a-zA-Z0-9_-]{11})"[^]*?"title":{"runs":\[\{"text":"([^"]+)"/g;
  const episodes: Episode[] = [];
  let match;
  const seen = new Set<string>();
  while ((match = videoRegex.exec(html)) !== null) {
    const videoId = match[1];
    const title = match[2];
    if (seen.has(videoId)) continue;
    seen.add(videoId);
    const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const publishDateFormatted = new Date().toISOString().split('T')[0]; // placeholder
    episodes.push({
      id: `yt-${videoId}`,
      number: episodes.length + 1,
      title,
      description: title,
      richDescription: title,
      duration: 'Vidéo',
      publishDate: publishDateFormatted,
      category: categoryName,
      thumbnail,
      youtubeUrl: `https://www.youtube.com/embed/${videoId}`,
      audioUrl: '',
      viewsCount: 0,
      likesCount: 0,
      spotifyUrl: '',
      applePodcastsUrl: '',
      guest: {
        id: `guest-${videoId}`,
        name: 'YouTube Guest',
        role: categoryName,
        company: '',
        bio: '',
        avatar: '/input_file_0.png',
        socials: {}
      },
      timestamps: [],
      quotes: []
    });
  }

  return episodes;
}
