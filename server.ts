import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Audio cache for mantras to make repeat plays instantaneous and save API calls
const audioCache = new Map<string, string>();

// Sarvam AI Text-to-Speech endpoint for authentic Gujarati/Sanskrit Mantra recitation
app.post('/api/tts', async (req, res) => {
  try {
    const { text, speaker = 'shruti', language = 'gu-IN' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const cacheKey = `${speaker}_${language}_${text}`;
    if (audioCache.has(cacheKey)) {
      return res.json({ audioBase64: audioCache.get(cacheKey), cached: true });
    }

    const apiKey = process.env.SARVAM_API_KEY || 'sk_ipxvzcl6_QtMRT830KNpHLQKAdwFcTzs6';

    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: language,
        speaker: speaker,
        model: 'bulbul:v3',
        enable_preprocessing: true,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Sarvam API error:', response.status, errBody);
      return res.status(response.status).json({ error: 'Sarvam API error', details: errBody });
    }

    const data = await response.json();
    if (data.audios && data.audios.length > 0) {
      const audioBase64 = data.audios[0];
      audioCache.set(cacheKey, audioBase64);
      return res.json({ audioBase64, cached: false });
    }

    return res.status(500).json({ error: 'No audio returned' });
  } catch (error) {
    console.error('Error in /api/tts:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Configure development or production server
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite middleware for dev
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
