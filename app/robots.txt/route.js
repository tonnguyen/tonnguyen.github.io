export const dynamic = 'force-static'

export async function GET() {
  const robotsTxt = `# Allow all crawlers
User-agent: *
Allow: /

# Sitemap
Sitemap: https://tonnguyen.github.io/sitemap.xml

# Host
Host: https://tonnguyen.github.io
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}