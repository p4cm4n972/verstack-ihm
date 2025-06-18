import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'home', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'version', renderMode: RenderMode.Prerender },
  { path: 'stat', renderMode: RenderMode.Prerender },
  { path: 'shop', renderMode: RenderMode.Prerender },
  { path: 'news', renderMode: RenderMode.Prerender },
  { path: 'signup', renderMode: RenderMode.Prerender },
  { path: 'mentions', renderMode: RenderMode.Prerender },
  { path: 'privacy-policy', renderMode: RenderMode.Prerender },
  { path: 'release', renderMode: RenderMode.Prerender },
  // Material components used on this page rely on browser APIs, so we avoid
  // prerendering to prevent SSR build failures.
  { path: 'mobile-not-allowed', renderMode: RenderMode.Server },
  { path: 'manifeste', renderMode: RenderMode.Prerender },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
