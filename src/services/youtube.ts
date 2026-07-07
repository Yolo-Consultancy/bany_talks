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

const YT_NS = 'http://www.youtube.com/xml/schemas/2015';
const MEDIA_NS = 'http://search.yahoo.com/mrss/';

function mapApiItemsToEpisodes(
  items: any[],
  categoryName: 'Émissions' | 'Podcasts',
  videoStatsMap: Record<string, { duration: string; viewCount: number }>
): Episode[] {
  return items.map((item: any, index: number): Episode => {
    const snippet = item.snippet || {};
    const videoId = item.contentDetails?.videoId || snippet.resourceId?.videoId;
    const thumbnailObj = snippet.thumbnails?.maxres || snippet.thumbnails?.high || snippet.thumbnails?.medium || snippet.thumbnails?.default;
    const stats: { duration?: string; viewCount?: number } = videoStatsMap[videoId] || {};

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
      category: categoryName,
      thumbnail: thumbnailObj?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      youtubeUrl: `https://www.youtube.com/embed/${videoId}`,
      audioUrl: '',
      viewsCount: stats.viewCount || 0,
      likesCount: Math.round((stats.viewCount || 0) * 0.05),
      quotes: [],
      spotifyUrl: '',
      applePodcastsUrl: '',
      guest: {
        id: `guest-${videoId}`,
        name: 'Bany Talks & Invités',
        role: categoryName,
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
 * Method 1 (Official API): Fetches playlist items using YouTube Data API v3
 */
export async function fetchYouTubePlaylistItems(
  playlistId: string,
  categoryName: 'Émissions' | 'Podcasts',
  apiKey?: string
): Promise<Episode[]> {
  const actualApiKey = apiKey || import.meta.env.VITE_YOUTUBE_API_KEY || DEFAULT_YOUTUBE_API_KEY || '';
  if (!actualApiKey) {
    throw new Error("L'API Key YouTube est requise pour utiliser l'API officielle.");
  }

  const cleanId = playlistId.trim();
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${cleanId}&key=${actualApiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || "Échec de la récupération des vidéos YouTube via l'API.");
  }

  const data = await response.json();
  const items = data.items || [];

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

  return mapApiItemsToEpisodes(items, categoryName, videoStatsMap);
}

/**
 * Method 1b (Official API): Fetches latest videos from channel uploads playlist
 */
export async function fetchYouTubeVideos(
  channelIdOrUploadsPlaylistId: string,
  apiKey?: string
): Promise<Episode[]> {
  let playlistId = channelIdOrUploadsPlaylistId.trim();
  if (playlistId.startsWith('UC')) {
    playlistId = 'UU' + playlistId.substring(2);
  }

  return fetchYouTubePlaylistItems(playlistId, 'Émissions', apiKey);
}

function buildEpisodeFromVideoId(
  videoId: string,
  title: string,
  categoryName: 'Émissions' | 'Podcasts',
  index: number,
  options: { description?: string; thumbnail?: string; publishedAt?: string } = {}
): Episode {
  const publishDateRaw = options.publishedAt ? new Date(options.publishedAt) : new Date();
  const publishDateFormatted = publishDateRaw.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const description = options.description || title;

  return {
    id: `yt-${videoId}`,
    number: index + 1,
    title,
    description: description.length > 160 ? description.substring(0, 160) + '...' : description,
    richDescription: description,
    duration: 'Vidéo',
    publishDate: publishDateFormatted,
    category: categoryName,
    thumbnail: options.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    youtubeUrl: `https://www.youtube.com/embed/${videoId}`,
    audioUrl: '',
    viewsCount: 0,
    likesCount: 0,
    spotifyUrl: '',
    applePodcastsUrl: '',
    guest: {
      id: `guest-${videoId}`,
      name: 'Bany Talks & Invités',
      role: categoryName,
      bio: description,
      avatar: '/input_file_0.png',
      socials: {
        youtube: `https://youtube.com/watch?v=${videoId}`
      }
    },
    timestamps: [],
    quotes: []
  };
}

/**
 * Method 2 (No API key): Fetches a playlist RSS feed via local proxy (/api/youtube/playlist)
 */
export async function fetchYouTubePlaylistRSS(
  playlistId: string,
  categoryName: 'Émissions' | 'Podcasts'
): Promise<Episode[]> {
  const cleanId = playlistId.trim();
  if (!cleanId) {
    throw new Error('Playlist ID is required');
  }

  const rssUrl = `/api/youtube/playlist?playlist_id=${encodeURIComponent(cleanId)}`;
  const response = await fetch(rssUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch playlist RSS: ${response.status}`);
  }

  const xml = await response.text();
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  if (doc.querySelector('parsererror')) {
    throw new Error('Invalid RSS response');
  }

  const entries = Array.from(doc.getElementsByTagName('entry'));
  return entries.map((entry, index) => {
    const videoId =
      entry.getElementsByTagNameNS(YT_NS, 'videoId')[0]?.textContent?.trim() ||
      entry.querySelector('videoId')?.textContent?.trim() ||
      '';
    const title = entry.getElementsByTagName('title')[0]?.textContent?.trim() || 'Sans titre';
    const publishedAt = entry.getElementsByTagName('published')[0]?.textContent?.trim();
    const mediaGroup = entry.getElementsByTagNameNS(MEDIA_NS, 'group')[0];
    const thumbnail =
      mediaGroup?.getElementsByTagNameNS(MEDIA_NS, 'thumbnail')[0]?.getAttribute('url') ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const description =
      mediaGroup?.getElementsByTagNameNS(MEDIA_NS, 'description')[0]?.textContent?.trim() || title;

    return buildEpisodeFromVideoId(videoId, title, categoryName, index, {
      description,
      thumbnail,
      publishedAt
    });
  }).filter((episode) => episode.id !== 'yt-');
}

/**
 * Loads playlist episodes using the best available method (API → RSS → scraping)
 */
export async function loadPlaylistEpisodes(
  playlistId: string,
  categoryName: 'Émissions' | 'Podcasts'
): Promise<Episode[]> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || DEFAULT_YOUTUBE_API_KEY;

  if (apiKey) {
    try {
      const items = await fetchYouTubePlaylistItems(playlistId, categoryName, apiKey);
      if (items.length > 0) return items;
    } catch (e) {
      console.warn(`API YouTube échouée pour ${categoryName}, fallback RSS`, e);
    }
  }

  try {
    const items = await fetchYouTubePlaylistRSS(playlistId, categoryName);
    if (items.length > 0) return items;
  } catch (e) {
    console.warn(`RSS échoué pour ${categoryName}, fallback scraping`, e);
  }

  try {
    const items = await fetchYouTubePlaylistData(playlistId, categoryName);
    if (items.length > 0) return items;
  } catch (e) {
    console.warn(`Scraping regex échoué pour ${categoryName}`, e);
  }

  try {
    return await fetchYouTubePlaylistHTML(playlistId, categoryName);
  } catch (e) {
    console.warn(`Scraping HTML échoué pour ${categoryName}`, e);
    return [];
  }
}

/**
 * Method 3 (Legacy): Fetches a YouTube playlist page via a CORS proxy and extracts video entries.
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
