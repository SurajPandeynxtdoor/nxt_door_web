import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/private/",
        "/cart",
        "/payment",
        "/profile",
        "/manage-address",
        "/select-address",
        "/orders",
      ],
    },
    sitemap: "https://www.onlytruthnosecrets.com/sitemap.xml",
    host: "https://www.onlytruthnosecrets.com",
  };
}
