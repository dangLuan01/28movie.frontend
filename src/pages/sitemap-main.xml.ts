import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://www.xoailac.top</loc>
            <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
        </url>
    </urlset>`;

  return new Response(sitemapIndex, {
    headers: { "Content-Type": "application/xml" },
  });
};