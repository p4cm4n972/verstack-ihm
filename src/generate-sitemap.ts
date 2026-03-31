import { writeFileSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://version.itmade.fr';
const API_BASE_URL = process.env['API_BASE_URL'] || 'https://api.version.itmade.fr';

interface SiteRoute {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

interface Article {
  _id: string;
  date?: string;
  updatedAt?: string;
}

const currentDate = new Date().toISOString().split('T')[0];

const staticRoutes: SiteRoute[] = [
  { loc: `${BASE_URL}/`,              lastmod: currentDate, changefreq: 'daily',   priority: 1.0 },
  { loc: `${BASE_URL}/about`,         lastmod: currentDate, changefreq: 'monthly', priority: 0.8 },
  { loc: `${BASE_URL}/news`,          lastmod: currentDate, changefreq: 'weekly',  priority: 0.8 },
  { loc: `${BASE_URL}/stat`,          lastmod: currentDate, changefreq: 'weekly',  priority: 0.7 },
  { loc: `${BASE_URL}/version`,       lastmod: currentDate, changefreq: 'weekly',  priority: 0.7 },
  { loc: `${BASE_URL}/release`,       lastmod: currentDate, changefreq: 'weekly',  priority: 0.6 },
  { loc: `${BASE_URL}/shop`,          lastmod: currentDate, changefreq: 'monthly', priority: 0.5 },
  { loc: `${BASE_URL}/manifeste`,     lastmod: currentDate, changefreq: 'monthly', priority: 0.5 },
  { loc: `${BASE_URL}/privacy-policy`,lastmod: currentDate, changefreq: 'monthly', priority: 0.4 },
  { loc: `${BASE_URL}/mentions`,      lastmod: currentDate, changefreq: 'monthly', priority: 0.3 },
];

function buildXml(routes: SiteRoute[]): string {
  const entries = routes.map(r => `  <url>
    <loc>${r.loc}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${entries}
</urlset>`;
}

async function fetchArticleRoutes(): Promise<SiteRoute[]> {
  try {
    console.log(`[sitemap] Fetch articles depuis ${API_BASE_URL}/api/news/all`);
    const response = await fetch(`${API_BASE_URL}/api/news/all`);

    if (!response.ok) {
      console.warn(`[sitemap] API indisponible (${response.status}) — articles ignorés`);
      return [];
    }

    const articles: Article[] = await response.json();

    if (!Array.isArray(articles)) {
      console.warn('[sitemap] Réponse API inattendue — articles ignorés');
      return [];
    }

    console.log(`[sitemap] ${articles.length} articles trouvés`);

    return articles.map(article => ({
      loc: `${BASE_URL}/news/${article._id}`,
      lastmod: (article.updatedAt || article.date || currentDate).split('T')[0],
      changefreq: 'monthly' as const,
      priority: 0.7
    }));
  } catch (error: any) {
    console.warn(`[sitemap] Erreur fetch articles: ${error.message} — articles ignorés`);
    return [];
  }
}

async function main(): Promise<void> {
  const articleRoutes = await fetchArticleRoutes();
  const allRoutes = [...staticRoutes, ...articleRoutes];

  const xml = buildXml(allRoutes);
  const outputPath = join(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(outputPath, xml, 'utf-8');

  console.log(`[sitemap] Généré : ${outputPath} (${allRoutes.length} URLs dont ${articleRoutes.length} articles)`);
}

main().catch(err => {
  console.error('[sitemap] Erreur fatale:', err);
  process.exit(1);
});
