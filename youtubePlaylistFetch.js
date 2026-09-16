const INNERTUBE_API_KEY = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';

const CLIENTS = [
  {
    label: 'WEB',
    client: {
      clientName: 'WEB',
      clientVersion: '2.20250320.01.00',
      hl: 'fr',
      gl: 'FR',
    },
    headers: {
      'Content-Type': 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      Origin: 'https://www.youtube.com',
      Referer: 'https://www.youtube.com/',
      'X-Youtube-Client-Name': '1',
      'X-Youtube-Client-Version': '2.20250320.01.00',
    },
    useKey: true,
  },
  {
    label: 'TVHTML5',
    client: {
      clientName: 'TVHTML5_SIMPLY_EMBEDDED_PLAYER',
      clientVersion: '2.0',
      hl: 'fr',
      gl: 'FR',
    },
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://www.youtube.com',
      Referer: 'https://www.youtube.com/',
    },
    useKey: true,
    key: 'AIzaSyDCU8hByM-4DrUqRUYnGn-3zao5Hmg3UAg',
  },
];

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function browseInnertube(payload, clientConfig, attempt = 1) {
  const key = clientConfig.useKey ? clientConfig.key || INNERTUBE_API_KEY : null;
  const url = key
    ? `https://www.youtube.com/youtubei/v1/browse?key=${key}&prettyPrint=false`
    : 'https://www.youtube.com/youtubei/v1/browse?prettyPrint=false';

  const res = await fetch(url, {
    method: 'POST',
    headers: clientConfig.headers,
    body: JSON.stringify({
      context: { client: clientConfig.client },
      ...payload,
    }),
  });

  if ((res.status === 500 || res.status === 503) && attempt < 3) {
    await sleep(250 * attempt);
    return browseInnertube(payload, clientConfig, attempt + 1);
  }

  if (!res.ok) {
    throw new Error(`YouTube innertube ${res.status}`);
  }
  return res.json();
}

function collectPlaylistItems(node, videos, tokens) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((item) => collectPlaylistItems(item, videos, tokens));
    return;
  }

  if (node.lockupViewModel) {
    const view = node.lockupViewModel;
    const videoId =
      view.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint?.videoId ||
      view.contentId;
    const title = view.metadata?.lockupMetadataViewModel?.title?.content || '';
    if (videoId && title && !/private video|deleted video/i.test(title)) {
      const metaParts =
        view.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows
          ?.flatMap((row) => row.metadataParts || [])
          ?.map((part) => part.text?.content)
          ?.filter(Boolean) || [];
      const duration =
        view.contentImage?.thumbnailViewModel?.overlays
          ?.flatMap((overlay) => overlay.thumbnailBottomOverlayViewModel?.badges || [])
          ?.map((badge) => badge.thumbnailBadgeViewModel?.text)
          ?.find(Boolean) || '';
      const thumbnail =
        view.contentImage?.thumbnailViewModel?.image?.sources?.[0]?.url ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      videos.push({
        videoId,
        title,
        duration,
        thumbnail,
        publishedLabel: metaParts.find((text) => /il y a|ago|stream/i.test(text)) || '',
      });
    }
  }

  if (node.playlistVideoRenderer) {
    const view = node.playlistVideoRenderer;
    const videoId = view.videoId;
    const title = view.title?.runs?.map((run) => run.text).join('') || view.title?.simpleText || '';
    if (videoId && title && !/private video|deleted video/i.test(title)) {
      videos.push({
        videoId,
        title,
        duration: view.lengthText?.simpleText || '',
        thumbnail:
          view.thumbnail?.thumbnails?.slice(-1)[0]?.url ||
          `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        publishedLabel: view.videoInfo?.runs?.map((run) => run.text).join(' ') || '',
      });
    }
  }

  const token =
    node.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token ||
    node.continuationItemRenderer?.continuationEndpoint?.command?.token;
  if (token) tokens.push(token);

  for (const key of Object.keys(node)) {
    if (key === 'lockupViewModel' || key === 'playlistVideoRenderer') continue;
    collectPlaylistItems(node[key], videos, tokens);
  }
}

async function fetchViaInnertube(playlistId, clientConfig) {
  const seen = new Set();
  const items = [];
  let tokens = [];
  const first = await browseInnertube({ browseId: `VL${playlistId}` }, clientConfig);
  collectPlaylistItems(first, items, tokens);

  let guard = 0;
  while (tokens.length && guard++ < 20) {
    const token = tokens.shift();
    try {
      const page = await browseInnertube({ continuation: token }, clientConfig);
      const extra = [];
      const nextTokens = [];
      collectPlaylistItems(page, extra, nextTokens);
      items.push(...extra);
      tokens.push(...nextTokens);
    } catch {
      // Keep items already collected if a later page fails.
      break;
    }
  }

  return items.filter((item) => {
    if (seen.has(item.videoId)) return false;
    seen.add(item.videoId);
    return true;
  });
}

async function fetchViaInvidious(playlistId) {
  const instances = [
    'https://inv.nadeko.net',
    'https://invidious.privacyredirect.com',
    'https://yewtu.be',
    'https://invidious.flokinet.to',
  ];
  let lastError;
  for (const instance of instances) {
    try {
      const res = await fetch(`${instance}/api/v1/playlists/${encodeURIComponent(playlistId)}`, {
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) throw new Error(`Invidious ${res.status}`);
      const data = await res.json();
      const videos = Array.isArray(data?.videos) ? data.videos : [];
      const mapped = videos
        .filter((video) => video?.videoId && video?.title)
        .map((video) => ({
          videoId: video.videoId,
          title: video.title,
          duration: '',
          thumbnail: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
          publishedLabel: '',
        }));
      if (mapped.length > 0) return mapped;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Invidious playlist empty');
}

export async function fetchYoutubePlaylistItems(playlistId) {
  const cleanId = String(playlistId || '').trim();
  if (!cleanId) throw new Error('Missing playlist_id');

  for (const clientConfig of CLIENTS) {
    try {
      const unique = await fetchViaInnertube(cleanId, clientConfig);
      if (unique.length > 0) return unique;
    } catch {
      // try next client
    }
  }

  return fetchViaInvidious(cleanId);
}
