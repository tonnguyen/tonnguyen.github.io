export const dynamic = 'force-static'

// Base URL for your site - update this with your actual domain
const BASE_URL = 'https://tonnguyen.github.io';

export async function GET() {
  // Define your site's URLs
  const urls = [
    {
      loc: BASE_URL,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 1.0
    }
  ];

  // Generate the sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}