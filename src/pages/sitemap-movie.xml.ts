import type { APIRoute } from "astro";
const domainApi = import.meta.env.PUBLIC_API_GO_URL;
const apiKey 	= import.meta.env.PUBLIC_API_KEY;

export const GET: APIRoute = async () => {
  const baseUrl = "https://www.xoailac.top";
  
  const movies = await fetch(domainApi + "/api/v1/movie/sitemap?type=single",{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    }
  }).then(r => r.json());

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    movies.data.map((m:any) => 
      `<url><loc>${baseUrl}/movie/${m.slug}</loc><lastmod>${new Date(m.updated_at).toISOString().split("T")[0]}</lastmod></url>`
    )
    .join("") +
    `</urlset>`;
  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
};

