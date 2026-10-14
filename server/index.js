import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { scrapeWeatherData, searchCities, POPULAR_CITIES } from './scraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

// In-memory cache for weather symbol SVGs
const symbolCache = new Map();

// API Endpoints
app.get('/api/weather', async (req, res) => {
  const city = (req.query.city || 'berlin').toString().trim();
  try {
    const data = await scrapeWeatherData(city);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error.message);
    res.status(500).json({
      error: error.message || 'Wetterdaten konnten nicht geladen werden.'
    });
  }
});

app.get('/api/search', async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q) return res.json([]);
  try {
    const results = await searchCities(q);
    res.json(results);
  } catch (error) {
    console.error(`Search error for ${q}:`, error.message);
    res.json([]);
  }
});

app.get('/api/popular-cities', (req, res) => {
  res.json(POPULAR_CITIES);
});

// Proxy and cache WetterOnline SVG weather symbols
app.get('/api/weather-symbol/:symbol', async (req, res) => {
  const rawSymbol = req.params.symbol;
  const symbol = rawSymbol.replace(/[^a-zA-Z0-9_\-\.]/g, '');

  if (symbolCache.has(symbol)) {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(symbolCache.get(symbol));
  }

  const targetUrl = `https://www.wetteronline.de/www-m3-ng-assets/assets/weather-symbol/${symbol}`;
  try {
    const svgRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/svg+xml,*/*'
      }
    });
    if (svgRes.ok) {
      const svgText = await svgRes.text();
      symbolCache.set(symbol, svgText);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(svgText);
    }
  } catch (err) {
    console.warn(`Could not proxy symbol ${symbol}:`, err.message);
  }

  // Fallback minimalist sun/cloud SVG if icon is missing
  const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 35"><circle cx="20" cy="18" r="9" fill="#f59e0b"/><path d="M12 28a7 7 0 0 1 14 0h12a6 6 0 0 0 0-12 8 8 0 0 0-15-2 7 7 0 0 0-11 14z" fill="#94a3b8"/></svg>`;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(fallbackSvg);
});

// Serve Frontend (Vite in Dev, Dist in Prod)
async function setupFrontend() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: rootDir
    });
    app.use(vite.middlewares);
    console.log('⚡ Vite development middleware attached.');
  } else {
    const distPath = path.resolve(rootDir, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
      console.log('📦 Serving production static build from dist/');
    }
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`\n WetterOnline Apple-Design WebApp running at http://localhost:${PORT}\n`);
    });
  }
}

setupFrontend().catch(console.error);

export default app;
