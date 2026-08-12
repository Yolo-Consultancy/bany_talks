import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { Plugin } from 'vite';
import {defineConfig} from 'vite';

async function proxyYoutubeRss(
  res: import('http').ServerResponse,
  youtubeUrl: string,
  errorLabel: string
) {
  try {
    const rssRes = await fetch(youtubeUrl, {
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      cache: 'no-store',
    });
    if (!rssRes.ok) {
      res.statusCode = rssRes.status;
      res.end(`Failed to fetch ${errorLabel}`);
      return;
    }
    const xml = await rssRes.text();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.end(xml);
  } catch (error) {
    console.error(`${errorLabel} proxy error:`, error);
    res.statusCode = 502;
    res.end(`Failed to fetch ${errorLabel}`);
  }
}

function youtubeRssProxy(): Plugin {
  return {
    name: 'youtube-rss-proxy',
    configureServer(server) {
      server.middlewares.use('/api/youtube/playlist', async (req, res) => {
        const url = new URL(req.url || '', 'http://localhost');
        const playlistId = url.searchParams.get('playlist_id');
        if (!playlistId) {
          res.statusCode = 400;
          res.end('Missing playlist_id');
          return;
        }
        await proxyYoutubeRss(
          res,
          `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`,
          'YouTube RSS'
        );
      });

      server.middlewares.use('/api/youtube/channel', async (req, res) => {
        const url = new URL(req.url || '', 'http://localhost');
        const channelId = url.searchParams.get('channel_id');
        if (!channelId) {
          res.statusCode = 400;
          res.end('Missing channel_id');
          return;
        }
        await proxyYoutubeRss(
          res,
          `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`,
          'YouTube channel RSS'
        );
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), youtubeRssProxy()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          bypass(req) {
            // Keep local YouTube RSS middleware
            if (req.url?.startsWith('/api/youtube')) return req.url;
          },
        },
        '/uploads': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
  };
});
