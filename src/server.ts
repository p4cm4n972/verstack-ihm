import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Explicitly expose the ads.txt file at the root
 */
app.get('/ads.txt', (_req, res) => {
  const file = join(browserDistFolder, 'ads.txt');
  res.sendFile(existsSync(file) ? file : join(import.meta.dirname, '../..', 'ads.txt'));
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

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
