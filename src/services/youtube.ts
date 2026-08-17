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

/** Durée minimale affichée sur BTX : Shorts et vidéos de moins de 10 min exclus. */
const MIN_EPISODE_SECONDS = 10 * 60;

function formatLengthSeconds(total: number): string {
  if (!Number.isFinite(total) || total <= 0) return 'Vidéo';
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}

function durationToSeconds(duration?: string): number | null {
  if (!duration) return null;
  const raw = duration.trim().toLowerCase();
  if (!raw || raw === 'vidéo' || raw === 'video') return null;

  const iso = raw.toUpperCase().match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (raw.toUpperCase().startsWith('PT') && iso) {
    const hours = parseInt(iso[1] || '0', 10);
    const minutes = parseInt(iso[2] || '0', 10);
    const seconds = parseInt(iso[3] || '0', 10);
    const total = hours * 3600 + minutes * 60 + seconds;
    return total > 0 ? total : null;
  }

  const hms = raw.match(/(?:(\d+)\s*h)?\s*(?:(\d+)\s*m(?:in)?)?\s*(?:(\d+)\s*s(?:ec)?)?/i);
  if (hms && /[hms]/.test(raw) && !raw.includes(':')) {
    const total =
      parseInt(hms[1] || '0', 10) * 3600 +
      parseInt(hms[2] || '0', 10) * 60 +
      parseInt(hms[3] || '0', 10);
    if (total > 0) return total;
  }

  const parts = raw.replace(/s$/, '').split(':').map((part) => parseInt(part, 10));
  if (parts.length === 0 || parts.some((n) => Number.isNaN(n))) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0];
}

function pickKnownDuration(...values: Array<string | undefined>): string {
  for (const value of values) {
    if (durationToSeconds(value)) return value as string;
  }
  return values.find(Boolean) || 'Vidéo';
}

export function isYoutubeShortEpisode(episode: Pick<Episode, 'duration'> & { lengthSeconds?: number }): boolean {
  const fromField = typeof episode.lengthSeconds === 'number' ? episode.lengthSeconds : null;
  const fromDuration = durationToSeconds(episode.duration);
  const seconds = fromField && fromField > 0 ? fromField : fromDuration;
  return seconds !== null && seconds > 0 && seconds < MIN_EPISODE_SECONDS;
}


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

function parseRelativePublishDate(label: string): string | undefined {
  const text = (label || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (!text) return undefined;
  const amount = parseInt(text.match(/(\d+)/)?.[1] || '1', 10);
  const ms =
    /an|year/.test(text) ? 365 * 86400000 :
    /mois|month/.test(text) ? 30 * 86400000 :
    /semaine|week/.test(text) ? 7 * 86400000 :
    /jour|day/.test(text) ? 86400000 :
    /heure|hour/.test(text) ? 3600000 :
    /minute/.test(text) ? 60000 :
    0;
  if (!ms) return undefined;
  return new Date(Date.now() - amount * ms).toISOString();
}

const YT_NS = 'http://www.youtube.com/xml/schemas/2015';
const MEDIA_NS = 'http://search.yahoo.com/mrss/';

function getEpisodeTimestamp(episode: Episode): number {
  if (episode.publishedAt) {
    const time = new Date(episode.publishedAt).getTime();
    if (!Number.isNaN(time)) return time;
  }

  const parsed = Date.parse(episode.publishDate);
  if (!Number.isNaN(parsed)) return parsed;

  return 0;
}

/** Trie les épisodes par date de publication (plus récent en premier par défaut). */
export function sortEpisodesByPublishDate(
  episodes: Episode[],
  order: 'desc' | 'asc' = 'desc'
): Episode[] {
  const sorted = [...episodes].sort((a, b) => {
    const diff = getEpisodeTimestamp(b) - getEpisodeTimestamp(a);
    return order === 'desc' ? diff : -diff;
  });

  return sorted.map((episode, index) => ({
    ...episode,
    number: order === 'desc' ? sorted.length - index : index + 1,
  }));
}

function mapApiItemsToEpisodes(
  items: any[],
  categoryName: Episode['category'],
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
      publishedAt: snippet.publishedAt || publishDateRaw.toISOString(),
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
  categoryName: Episode['category'],
  apiKey?: string
): Promise<Episode[]> {
  const actualApiKey = apiKey || import.meta.env.VITE_YOUTUBE_API_KEY || DEFAULT_YOUTUBE_API_KEY || '';
  if (!actualApiKey) {
    throw new Error("L'API Key YouTube est requise pour utiliser l'API officielle.");
  }

  const cleanId = playlistId.trim();
  const items: any[] = [];
  let pageToken = '';

  do {
    const pageParam = pageToken ? `&pageToken=${pageToken}` : '';
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${cleanId}&key=${actualApiKey}${pageParam}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || "Échec de la récupération des vidéos YouTube via l'API.");
    }
    const data = await response.json();
    items.push(...(data.items || []));
    pageToken = data.nextPageToken || '';
  } while (pageToken);

  const videoIds = items.map((item: any) => item.contentDetails?.videoId).filter(Boolean);
  const videoStatsMap: Record<string, { duration: string; viewCount: number }> = {};

  if (videoIds.length > 0) {
    try {
      for (let i = 0; i < videoIds.length; i += 50) {
        const batch = videoIds.slice(i, i + 50);
        const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${batch.join(',')}&key=${actualApiKey}`;
        const statsRes = await fetch(statsUrl);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          (statsData.items || []).forEach((v: any) => {
            const duration = parseISO8601Duration(v.contentDetails?.duration || 'PT0S');
            const viewCount = parseInt(v.statistics?.viewCount || '0', 10);
            videoStatsMap[v.id] = { duration, viewCount };
          });
        }
      }
    } catch (e) {
      console.warn("Impossible de récupérer les statistiques détaillées", e);
    }
  }

  return sortEpisodesByPublishDate(mapApiItemsToEpisodes(items, categoryName, videoStatsMap));
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
  categoryName: Episode['category'],
  index: number,
  options: { description?: string; thumbnail?: string; publishedAt?: string; duration?: string } = {}
): Episode {
  const publishDateRaw = options.publishedAt ? new Date(options.publishedAt) : null;
  const publishDateFormatted = publishDateRaw
    ? publishDateRaw.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';
  const description = options.description || title;

  return {
    id: `yt-${videoId}`,
    number: index + 1,
    title,
    description: description.length > 160 ? description.substring(0, 160) + '...' : description,
    richDescription: description,
    duration: options.duration || 'Vidéo',
    publishDate: publishDateFormatted,
    publishedAt: options.publishedAt || '',
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

function parseYouTubeRssXml(
  xml: string,
  categoryName: Episode['category']
): Episode[] {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  if (doc.querySelector('parsererror')) {
    throw new Error('Invalid RSS response');
  }

  const entries = Array.from(doc.getElementsByTagName('entry'));
  return sortEpisodesByPublishDate(
    entries
      .map((entry, index) => {
        const videoId =
          entry.getElementsByTagNameNS(YT_NS, 'videoId')[0]?.textContent?.trim() ||
          entry.querySelector('videoId')?.textContent?.trim() ||
          '';
        const title = entry.getElementsByTagName('title')[0]?.textContent?.trim() || 'Sans titre';
        const publishedAt = entry.getElementsByTagName('published')[0]?.textContent?.trim();
        const linkHref = Array.from(entry.getElementsByTagName('link'))
          .map((link) => link.getAttribute('href') || '')
          .join(' ');
        if (/\/shorts\//i.test(linkHref)) return null;
        const mediaGroup = entry.getElementsByTagNameNS(MEDIA_NS, 'group')[0];
        const thumbnail =
          mediaGroup?.getElementsByTagNameNS(MEDIA_NS, 'thumbnail')[0]?.getAttribute('url') ||
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        const description =
          mediaGroup?.getElementsByTagNameNS(MEDIA_NS, 'description')[0]?.textContent?.trim() ||
          title;
        const durationSeconds = parseInt(
          entry.getElementsByTagNameNS(YT_NS, 'duration')[0]?.getAttribute('seconds') ||
            mediaGroup?.getElementsByTagNameNS(YT_NS, 'duration')[0]?.getAttribute('seconds') ||
            mediaGroup?.getElementsByTagNameNS(MEDIA_NS, 'content')[0]?.getAttribute('duration') ||
            '0',
          10
        );

        return buildEpisodeFromVideoId(videoId, title, categoryName, index, {
          description,
          thumbnail,
          publishedAt,
          duration: formatLengthSeconds(durationSeconds),
        });
      })
      .filter((episode): episode is Episode => Boolean(episode) && episode.id !== 'yt-' && !isYoutubeShortEpisode(episode))
  );
}

async function fetchRssViaProxy(proxyPath: string): Promise<string> {
  const separator = proxyPath.includes('?') ? '&' : '?';
  const url = `${proxyPath}${separator}_t=${Date.now()}`;
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS: ${response.status}`);
  }
  return response.text();
}

/**
 * Method 2 (No API key): Fetches a playlist RSS feed via local proxy (/api/youtube/playlist)
 */
export async function fetchYouTubePlaylistRSS(
  playlistId: string,
  categoryName: Episode['category']
): Promise<Episode[]> {
  const cleanId = playlistId.trim();
  if (!cleanId) {
    throw new Error('Playlist ID is required');
  }

  const xml = await fetchRssViaProxy(
    `/api/youtube/playlist?playlist_id=${encodeURIComponent(cleanId)}`
  );
  return parseYouTubeRssXml(xml, categoryName);
}

type PlaylistProxyItem = {
  videoId: string;
  title: string;
  duration?: string;
  thumbnail?: string;
  publishedLabel?: string;
};

const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.privacyredirect.com',
  'https://yewtu.be',
];

type InvidiousPlaylistVideo = {
  videoId?: string;
  title?: string;
  lengthSeconds?: number;
  published?: number;
};

async function fetchJsonWithTimeout(url: string, timeoutMs = 12000): Promise<any> {
  const response = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/**
 * Playlist complète via Invidious (fonctionne depuis le navigateur, CORS ouvert).
 * Sert de secours quand /api/youtube/playlist-items n'est pas encore déployé.
 */
export async function fetchYouTubePlaylistInvidious(
  playlistId: string,
  categoryName: Episode['category']
): Promise<Episode[]> {
  const cleanId = playlistId.trim();
  if (!cleanId) throw new Error('Playlist ID is required');

  let videos: InvidiousPlaylistVideo[] = [];
  let usedInstance = '';
  let lastError: unknown;

  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const data = await fetchJsonWithTimeout(
        `${instance}/api/v1/playlists/${encodeURIComponent(cleanId)}`
      );
      const list = Array.isArray(data?.videos) ? data.videos : [];
      if (list.length > 0) {
        videos = list;
        usedInstance = instance;
        break;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (videos.length === 0) {
    throw lastError instanceof Error ? lastError : new Error('Invidious playlist empty');
  }

  const rssById = new Map<string, Episode>();
  try {
    const rss = await fetchYouTubePlaylistRSS(cleanId, categoryName);
    rss.forEach((episode) => rssById.set(episode.id, episode));
  } catch {
    /* dates RSS optionnelles */
  }

  const missingIds = videos
    .map((video) => video.videoId)
    .filter((id): id is string => Boolean(id) && !rssById.has(`yt-${id}`))
    .slice(0, 20);

  const publishedById = new Map<string, string>();
  await Promise.all(
    missingIds.map(async (videoId) => {
      try {
        const info = await fetchJsonWithTimeout(`${usedInstance}/api/v1/videos/${videoId}`, 8000);
        if (info?.published) {
          publishedById.set(videoId, new Date(info.published * 1000).toISOString());
        }
      } catch {
        /* ignore */
      }
    })
  );

  return sortEpisodesByPublishDate(
    videos
      .filter((video) => {
        if (!video.videoId || !video.title) return false;
        const length = Number(video.lengthSeconds) || 0;
        return !(length > 0 && length < MIN_EPISODE_SECONDS);
      })
      .map((video, index) => {
        const rss = rssById.get(`yt-${video.videoId}`);
        const publishedAt =
          rss?.publishedAt ||
          publishedById.get(video.videoId as string) ||
          (typeof video.published === 'number' && video.published > 0
            ? new Date(video.published * 1000).toISOString()
            : undefined);
        return buildEpisodeFromVideoId(video.videoId as string, video.title as string, categoryName, index, {
          thumbnail: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
          publishedAt,
          description: rss?.description || video.title,
          duration: formatLengthSeconds(video.lengthSeconds || 0),
        });
      })
  );
}

/**
 * Playlist complète via le proxy serveur (pas limitée aux 15 entrées du RSS).
 */
export async function fetchYouTubePlaylistFull(
  playlistId: string,
  categoryName: Episode['category']
): Promise<Episode[]> {
  const cleanId = playlistId.trim();
  if (!cleanId) {
    throw new Error('Playlist ID is required');
  }

  const response = await fetch(
    `/api/youtube/playlist-items?playlist_id=${encodeURIComponent(cleanId)}&_t=${Date.now()}`,
    {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch playlist items: ${response.status}`);
  }
  const items = (await response.json()) as PlaylistProxyItem[];
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Empty playlist');
  }

  return sortEpisodesByPublishDate(
    items
      .filter((item) => !isYoutubeShortEpisode({ duration: item.duration || 'Vidéo' }))
      .map((item, index) =>
        buildEpisodeFromVideoId(item.videoId, item.title, categoryName, index, {
          thumbnail: item.thumbnail,
          publishedAt: parseRelativePublishDate(item.publishedLabel || ''),
          description: item.title,
          duration: item.duration,
        })
      )
  );
}

/**
 * Playlist « Uploads » d’une chaîne : UC… → UU…
 * Plus fiable que le RSS channel_id (souvent 404 derrière nginx/prod).
 */
export function toUploadsPlaylistId(channelId: string): string {
  const id = channelId.trim();
  if (id.startsWith('UC') && id.length >= 2) {
    return `UU${id.slice(2)}`;
  }
  if (id.startsWith('UU')) return id;
  return id;
}

/**
 * Method 2b: Latest uploads via the channel uploads playlist (UU…)
 */
export async function fetchYouTubeChannelRSS(
  channelId: string,
  categoryName: Episode['category'] = 'Émissions'
): Promise<Episode[]> {
  const cleanId = channelId.trim();
  if (!cleanId) {
    throw new Error('Channel ID is required');
  }

  const uploadsPlaylistId = toUploadsPlaylistId(cleanId);

  // Prefer playlist proxy (already working in prod) over /channel
  try {
    const items = await fetchYouTubePlaylistRSS(uploadsPlaylistId, categoryName);
    if (items.length > 0) return items;
  } catch (e) {
    console.warn('RSS uploads playlist échoué, fallback channel_id', e);
  }

  const xml = await fetchRssViaProxy(
    `/api/youtube/channel?channel_id=${encodeURIComponent(cleanId)}`
  );
  return parseYouTubeRssXml(xml, categoryName);
}

/** Fusionne des listes d'épisodes en dédoublonnant par id vidéo. */
export function mergeEpisodesById(...lists: Episode[][]): Episode[] {
  const byId = new Map<string, Episode>();
  for (const list of lists) {
    for (const episode of list) {
      const existing = byId.get(episode.id);
      if (!existing) {
        byId.set(episode.id, episode);
        continue;
      }
      const existingTs = getEpisodeTimestamp(existing);
      const nextTs = getEpisodeTimestamp(episode);
      const newer = nextTs > existingTs ? episode : existing;
      byId.set(episode.id, {
        ...existing,
        ...episode,
        category: existing.category || episode.category,
        publishedAt: newer.publishedAt,
        publishDate: newer.publishDate || existing.publishDate,
        duration: pickKnownDuration(existing.duration, episode.duration),
      });
    }
  }
  return sortEpisodesByPublishDate(Array.from(byId.values()));
}

function formatPublishDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Retire les Shorts et les vidéos de moins de 10 minutes.
 */
export async function filterOutYoutubeShorts(episodes: Episode[]): Promise<Episode[]> {
  const keep = await Promise.all(
    episodes.map(async (episode) => {
      if (isYoutubeShortEpisode(episode)) return false;

      const seconds = durationToSeconds(episode.duration);
      if (seconds !== null && seconds >= MIN_EPISODE_SECONDS) return true;

      const videoId = episode.id.replace(/^yt-/, '');
      for (const instance of INVIDIOUS_INSTANCES) {
        try {
          const info = await fetchJsonWithTimeout(`${instance}/api/v1/videos/${videoId}`, 7000);
          const type = String(info?.type || '').toLowerCase();
          if (type.includes('short')) return false;
          const length = Number(info?.lengthSeconds) || 0;
          if (length > 0) return length >= MIN_EPISODE_SECONDS;
        } catch {
          /* next instance */
        }
      }
      return true;
    })
  );

  return sortEpisodesByPublishDate(episodes.filter((_, index) => keep[index]));
}

/**
 * Attache les vraies dates de publication YouTube (RSS chaîne + Invidious)
 * puis trie du plus récent au plus ancien. Ne change pas le contenu des playlists.
 */
export async function applyYoutubePublishDates(episodes: Episode[]): Promise<Episode[]> {
  if (episodes.length === 0) return episodes;

  const dates = new Map<string, string>();
  const remember = (id: string | undefined, publishedAt?: string) => {
    if (!id || !publishedAt) return;
    const time = new Date(publishedAt).getTime();
    if (Number.isNaN(time) || time <= 0) return;
    const prev = dates.get(id);
    if (prev && new Date(prev).getTime() >= time) return;
    dates.set(id, publishedAt);
  };

  episodes.forEach((episode) => remember(episode.id, episode.publishedAt));

  const channelId = (
    import.meta.env.VITE_YOUTUBE_CHANNEL_ID || DEFAULT_YOUTUBE_CHANNEL_ID
  ).replace(/^["']|["']$/g, '');

  try {
    const latest = await fetchYouTubeChannelRSS(channelId);
    latest.forEach((episode) => remember(episode.id, episode.publishedAt));
  } catch (error) {
    console.warn('Dates RSS chaîne indisponibles', error);
  }

  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const data = await fetchJsonWithTimeout(
        `${instance}/api/v1/channels/${encodeURIComponent(channelId)}/videos?sort_by=newest`,
        12000
      );
      const videos = Array.isArray(data?.videos)
        ? data.videos
        : Array.isArray(data?.latestVideos)
          ? data.latestVideos
          : [];
      videos.forEach((video: { videoId?: string; published?: number }) => {
        if (video.videoId && video.published) {
          remember(`yt-${video.videoId}`, new Date(video.published * 1000).toISOString());
        }
      });
      break;
    } catch {
      /* try next instance */
    }
  }

  const missing = episodes
    .map((episode) => episode.id.replace(/^yt-/, ''))
    .filter((videoId) => videoId && !dates.has(`yt-${videoId}`))
    .slice(0, 25);

  if (missing.length > 0) {
    await Promise.all(
      missing.map(async (videoId) => {
        for (const instance of INVIDIOUS_INSTANCES) {
          try {
            const info = await fetchJsonWithTimeout(`${instance}/api/v1/videos/${videoId}`, 8000);
            if (info?.published) {
              remember(`yt-${videoId}`, new Date(info.published * 1000).toISOString());
              return;
            }
          } catch {
            /* next instance */
          }
        }
      })
    );
  }

  return sortEpisodesByPublishDate(
    episodes.map((episode) => {
      const publishedAt = dates.get(episode.id) || episode.publishedAt;
      if (!publishedAt) return episode;
      return {
        ...episode,
        publishedAt,
        publishDate: formatPublishDate(publishedAt) || episode.publishDate,
      };
    })
  );
}

/**
 * Loads latest channel uploads (API → uploads playlist UU… → channel RSS)
 */
export async function loadChannelEpisodes(
  channelId?: string,
  categoryName: Episode['category'] = 'Émissions'
): Promise<Episode[]> {
  const actualChannelId =
    (channelId ||
      import.meta.env.VITE_YOUTUBE_CHANNEL_ID ||
      DEFAULT_YOUTUBE_CHANNEL_ID).replace(/^["']|["']$/g, '');
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || DEFAULT_YOUTUBE_API_KEY;

  if (apiKey) {
    try {
      const items = await fetchYouTubeVideos(actualChannelId, apiKey);
      if (items.length > 0) {
        return sortEpisodesByPublishDate(
          items.map((ep) => ({ ...ep, category: categoryName }))
        );
      }
    } catch (e) {
      console.warn('API YouTube chaîne échouée, fallback RSS', e);
    }
  }

  const uploadsPlaylistId = toUploadsPlaylistId(actualChannelId);
  const [rssItems, playlistItems] = await Promise.all([
    fetchYouTubeChannelRSS(actualChannelId, categoryName).catch(() => [] as Episode[]),
    loadPlaylistEpisodes(uploadsPlaylistId, categoryName).catch(() => [] as Episode[]),
  ]);
  return mergeEpisodesById(rssItems, playlistItems);
}

/**
 * Loads playlist episodes using the best available method (API → playlist complète → RSS → scraping)
 */
export async function loadPlaylistEpisodes(
  playlistId: string,
  categoryName: Episode['category']
): Promise<Episode[]> {
  const cleanId = String(playlistId || '')
    .replace(/^["']|["']$/g, '')
    .trim()
    .replace(/^.*[?&]list=/, '')
    .replace(/[&"].*$/, '');
  if (!cleanId) return [];

  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || DEFAULT_YOUTUBE_API_KEY;

  if (apiKey) {
    try {
      const items = await fetchYouTubePlaylistItems(cleanId, categoryName, apiKey);
      if (items.length > 0) return sortEpisodesByPublishDate(items);
    } catch (e) {
      console.warn(`API YouTube échouée pour ${categoryName}, fallback playlist complète`, e);
    }
  }

  try {
    const items = await fetchYouTubePlaylistFull(cleanId, categoryName);
    if (items.length > 0) return items;
  } catch (e) {
    console.warn(`Playlist complète échouée pour ${categoryName}, fallback Invidious`, e);
  }

  try {
    const items = await fetchYouTubePlaylistInvidious(cleanId, categoryName);
    if (items.length > 0) return items;
  } catch (e) {
    console.warn(`Invidious échoué pour ${categoryName}, fallback RSS`, e);
  }

  try {
    const items = await fetchYouTubePlaylistRSS(cleanId, categoryName);
    if (items.length > 0) return items;
  } catch (e) {
    console.warn(`RSS échoué pour ${categoryName}, fallback scraping`, e);
  }

  try {
    const items = await fetchYouTubePlaylistData(cleanId, categoryName);
    if (items.length > 0) return sortEpisodesByPublishDate(items);
  } catch (e) {
    console.warn(`Scraping regex échoué pour ${categoryName}`, e);
  }

  try {
    const items = await fetchYouTubePlaylistHTML(cleanId, categoryName);
    return sortEpisodesByPublishDate(items);
  } catch (e) {
    console.warn(`Scraping HTML échoué pour ${categoryName}`, e);
    return [];
  }
}

/**
 * Method 3 (Legacy): Fetches a YouTube playlist page via a CORS proxy and extracts video entries.
 * Returns an array of Episode objects with the given category.
 */
export async function fetchYouTubePlaylistHTML(playlistId: string, categoryName: Episode['category']): Promise<Episode[]> {
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
export async function fetchYouTubePlaylistData(playlistId: string, categoryName: Episode['category']): Promise<Episode[]> {
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
