import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import bootstrap from './main.server';
import express from 'express';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Configuration de l'API backend pour les appels SSR
const API_BASE_URL = process.env['API_BASE_URL'] || 'http://127.0.0.1:3000';

/**
 * Explicitly expose the ads.txt file at the root
 */
app.get('/ads.txt', (_req, res) => {
  const file = join(browserDistFolder, 'ads.txt');
  res.sendFile(existsSync(file) ? file : join(import.meta.dirname, '../..', 'ads.txt'));
});

/**
 * Dynamic sitemap.xml generation with articles
 */
app.get('/sitemap.xml', async (_req, res) => {
  try {
    // Fetch articles from backend API
    const response = await fetch(`${API_BASE_URL}/api/news/all`);
    const articles = await response.json();

    // Generate sitemap XML
    const staticUrls = [
      { loc: 'https://verstack.io/', lastmod: '2025-10-02', changefreq: 'daily', priority: '1' },
      { loc: 'https://verstack.io/home', lastmod: '2025-10-02', changefreq: 'daily', priority: '0.9' },
      { loc: 'https://verstack.io/about', lastmod: '2025-10-02', changefreq: 'monthly', priority: '0.8' },
      { loc: 'https://verstack.io/news', lastmod: '2025-10-02', changefreq: 'weekly', priority: '0.8' },
      { loc: 'https://verstack.io/stat', lastmod: '2025-10-02', changefreq: 'weekly', priority: '0.7' },
      { loc: 'https://verstack.io/version', lastmod: '2025-10-02', changefreq: 'weekly', priority: '0.7' },
      { loc: 'https://verstack.io/release', lastmod: '2025-10-02', changefreq: 'weekly', priority: '0.6' },
      { loc: 'https://verstack.io/shop', lastmod: '2025-10-02', changefreq: 'monthly', priority: '0.5' },
      { loc: 'https://verstack.io/privacy-policy', lastmod: '2025-10-02', changefreq: 'monthly', priority: '0.4' },
      { loc: 'https://verstack.io/mentions', lastmod: '2025-10-02', changefreq: 'monthly', priority: '0.3' },
      { loc: 'https://verstack.io/manifeste', lastmod: '2025-10-02', changefreq: 'monthly', priority: '0.5' },
    ];

    // Add article URLs
    const articleUrls = Array.isArray(articles) ? articles.map((article: any) => ({
      loc: `https://verstack.io/news/${article._id}`,
      lastmod: article.updatedAt || article.date || '2025-10-02',
      changefreq: 'monthly',
      priority: '0.7'
    })) : [];

    const allUrls = [...staticUrls, ...articleUrls];

    // Build XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback to static sitemap
    const staticSitemap = join(browserDistFolder, 'sitemap.xml');
    if (existsSync(staticSitemap)) {
      res.sendFile(staticSitemap);
    } else {
      res.status(500).send('Error generating sitemap');
    }
  }
});

/**
 * Basic API endpoints used during server-side rendering.
 * These stubs prevent errors when the real backend is not
 * available during the build process.
 */
app.get('/api/news/all', (_req, res) => {
  res.json([]);
});

app.get('/api/news/:id', (_req, res) => {
  res.json({});
});

app.get('/api/langages/all', (_req, res) => {
  res.json([]);
});

// Basic /api/users stubs for SSR
app.get('/api/users', (_req, res) => {
  res.json([]);
});

app.get('/api/users/:id', (_req, res) => {
  res.json({});
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Verstack IHM SSR - Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
