/**
 * Script to generate routes.txt file dynamically
 * This fetches articles from the API and creates a complete routes list for prerendering
 */

const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:3000';

// Static routes
const staticRoutes = [
  '/',
  '/home',
  '/about',
  '/news',
  '/stat',
  '/version',
  '/release',
  '/shop',
  '/privacy-policy',
  '/mentions',
  '/manifeste'
];

async function generateRoutes() {
  try {
    console.log('Fetching articles from API...');
    const response = await fetch(`${API_BASE_URL}/api/news/all`);

    if (!response.ok) {
      console.warn('Failed to fetch articles, using static routes only');
      return staticRoutes;
    }

    const articles = await response.json();

    // Add article routes
    const articleRoutes = Array.isArray(articles)
      ? articles.map(article => `/news/${article._id}`)
      : [];

    console.log(`Found ${articleRoutes.length} articles`);

    return [...staticRoutes, ...articleRoutes];
  } catch (error) {
    console.error('Error fetching articles:', error.message);
    console.warn('Using static routes only');
    return staticRoutes;
  }
}

async function main() {
  const routes = await generateRoutes();
  const routesFilePath = path.join(__dirname, '..', 'routes.txt');

  // Write routes to file
  fs.writeFileSync(routesFilePath, routes.join('\n'), 'utf8');
  console.log(`Generated routes.txt with ${routes.length} routes`);
}

main().catch(err => {
  console.error('Error generating routes:', err);
  process.exit(1);
});
