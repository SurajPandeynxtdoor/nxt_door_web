import { fetchCategories } from "@/lib/api/categories";
import { fetchProducts } from "@/lib/api/products";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = "https://www.onlytruthnosecrets.com";
  const now = new Date().toISOString();

  const urls: string[] = [];

  const pushUrl = (
    loc: string,
    lastmod?: string,
    changefreq?: string,
    priority?: number
  ) => {
    urls.push(
      `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}${
        changefreq ? `<changefreq>${changefreq}</changefreq>` : ""
      }$${
        priority !== undefined ? `<priority>${priority}</priority>` : ""
      }</url>`
    );
  };

  // Base static pages
  pushUrl(`${baseUrl}/`, now, "daily", 1.0);
  pushUrl(`${baseUrl}/about-us`, now, "monthly", 0.6);
  pushUrl(`${baseUrl}/contact-us`, now, "monthly", 0.6);
  pushUrl(`${baseUrl}/privacy`, now, "yearly", 0.4);
  pushUrl(`${baseUrl}/returns`, now, "yearly", 0.4);
  pushUrl(`${baseUrl}/terms-and-conditions`, now, "yearly", 0.4);

  try {
    const [categories, products] = await Promise.all([
      fetchCategories().catch(() => []),
      fetchProducts({ page: 1, limit: 200, sort: "createdAt" }).catch(
        () => null
      ),
    ]);

    for (const c of categories || []) {
      const slug = (c.name || "").toLowerCase().replace(/\s+/g, "-");
      if (c._id && slug) {
        pushUrl(`${baseUrl}/category/${slug}/${c._id}`, now, "weekly", 0.8);
      }
    }

    for (const p of products?.allProducts || []) {
      if (p?._id) {
        pushUrl(`${baseUrl}/product/${p._id}`, now, "weekly", 0.7);
      }
    }
  } catch {}

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.join("") +
    `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
}
