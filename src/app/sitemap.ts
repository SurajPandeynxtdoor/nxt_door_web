// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { fetchCategories } from "@/lib/api/categories";
import { fetchProducts } from "@/lib/api/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.onlytruthnosecrets.com";
  const now = new Date();

  const urls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${baseUrl}/about-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.2,
    },
  ];

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
        urls.push({
          url: `${baseUrl}/category/${slug}/${c._id}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }

    for (const p of products?.allProducts || []) {
      if (p?._id) {
        urls.push({
          url: `${baseUrl}/product/${p._id}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // ignore; return base URLs only
  }

  return urls;
}
