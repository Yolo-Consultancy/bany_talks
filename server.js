import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

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

// Proxy blog API + uploads to bany-backend
app.use(['/api', '/uploads'], async (req, res) => {
  if (req.path.startsWith('/youtube')) {
    return res.status(404).send('Not found');
  }
  try {
    const targetUrl = `${BACKEND_URL}${req.originalUrl}`;
    const headers = { ...req.headers, host: undefined };
    delete headers.host;

    const init = {
      method: req.method,
      headers: headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      init.body = Buffer.concat(chunks);
    }

    const upstream = await fetch(targetUrl, init);
    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'transfer-encoding') return;
      res.setHeader(key, value);
    });
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.send(buf);
  } catch (error) {
    console.error('Backend proxy error:', error);
    res.status(502).json({ message: 'Backend indisponible' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bany Talks server running on http://localhost:${PORT}`);
});
