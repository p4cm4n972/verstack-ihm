import { writeFileSync } from 'fs';
import { join } from 'path';

interface SiteRoute {
  url: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const routes: SiteRoute[] = [
  { url: '', changefreq: 'daily', priority: 1.0 },
  { url: 'home', changefreq: 'daily', priority: 0.9 },
  { url: 'about', changefreq: 'monthly', priority: 0.8 },
  { url: 'news', changefreq: 'weekly', priority: 0.8 },
  { url: 'stat', changefreq: 'weekly', priority: 0.7 },
  { url: 'version', changefreq: 'weekly', priority: 0.7 },
  { url: 'release', changefreq: 'weekly', priority: 0.6 },
  { url: 'shop', changefreq: 'monthly', priority: 0.5 },
  { url: 'privacy-policy', changefreq: 'monthly', priority: 0.4 },
  { url: 'mentions', changefreq: 'monthly', priority: 0.3 },
  { url: 'manifeste', changefreq: 'monthly', priority: 0.5 },
];

function generateSitemap(): void {
  const baseUrl = 'https://verstack.io';
  const currentDate = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${routes.map(route => `  <url>
    <loc>${baseUrl}/${route.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n\n')}

</urlset>`;

  const outputPath = join(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(outputPath, sitemap, 'utf-8');
  console.log(`Sitemap généré avec succès : ${outputPath}`);
}

// Exécuter le script si appelé directement
generateSitemap();

export { generateSitemap };