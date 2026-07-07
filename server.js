import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/youtube/playlist', async (req, res) => {
  const playlistId = req.query.playlist_id;
  if (!playlistId || typeof playlistId !== 'string') {
    return res.status(400).send('Missing playlist_id');
  }

  try {
    const rssRes = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`
    );
    if (!rssRes.ok) {
      return res.status(rssRes.status).send('Failed to fetch YouTube RSS');
    }
    const xml = await rssRes.text();
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (error) {
    console.error('YouTube RSS proxy error:', error);
    res.status(502).send('Failed to fetch YouTube RSS');
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bany Talks server running on http://localhost:${PORT}`);
});
