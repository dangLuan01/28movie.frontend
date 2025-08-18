import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const baseUrl = "https://www.xoailac.top";

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
      <loc>${baseUrl}/sitemap-movie.xml</loc>
    </sitemap>
    <sitemap>
      <loc>${baseUrl}/sitemap-tv-series.xml</loc>
    </sitemap>
  </sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: { "Content-Type": "application/xml" },
  });
};
