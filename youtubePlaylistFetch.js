const INNERTUBE_CLIENT = {
  clientName: 'WEB',
  clientVersion: '2.20240801.00.00',
  hl: 'fr',
  gl: 'FR',
};

async function browseInnertube(payload) {
  const res = await fetch('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify({ context: { client: INNERTUBE_CLIENT }, ...payload }),
  });
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

export async function fetchYoutubePlaylistItems(playlistId) {
  const cleanId = String(playlistId || '').trim();
  if (!cleanId) throw new Error('Missing playlist_id');

  try {
    const seen = new Set();
    const items = [];
    let tokens = [];
    const first = await browseInnertube({ browseId: `VL${cleanId}` });
    collectPlaylistItems(first, items, tokens);

    let guard = 0;
    while (tokens.length && guard++ < 20) {
      const token = tokens.shift();
      const page = await browseInnertube({ continuation: token });
      const extra = [];
      const nextTokens = [];
      collectPlaylistItems(page, extra, nextTokens);
      items.push(...extra);
      tokens.push(...nextTokens);
    }

    const unique = items.filter((item) => {
      if (seen.has(item.videoId)) return false;
      seen.add(item.videoId);
      return true;
    });
    if (unique.length > 0) return unique;
  } catch (error) {
    console.warn('Innertube playlist failed, fallback Invidious', error);
  }

  const instances = [
    'https://inv.nadeko.net',
    'https://invidious.privacyredirect.com',
    'https://yewtu.be',
  ];
  let lastError;
  for (const instance of instances) {
    try {
      const res = await fetch(`${instance}/api/v1/playlists/${encodeURIComponent(cleanId)}`, {
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
