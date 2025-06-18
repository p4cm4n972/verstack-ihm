import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'shop/:id',
    renderMode: RenderMode.Server  // ou RenderMode.Default
  },
  {
    path: 'news/:id',
    renderMode: RenderMode.Server  // ou RenderMode.Default
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];


/*{
    path: 'shop/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Remplace par la vraie liste d'IDs de tes produits
      const productIds = ['1', '2', '3'];
      return productIds.map(id => ({ id }));
    }
  }*/