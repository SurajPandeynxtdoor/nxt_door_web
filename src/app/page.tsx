import { Metadata } from "next";
import Banner from "@/components/Banner";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/common/Footer";
import { fetchProducts } from "@/lib/api/products";
import CategoryNavBarWrapper from "@/components/CategoryNavBarWrapper";
import Script from "next/script";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title:
    "Only Truth No Secrets | Buy Best FMCG Products Online - Clean, Honest, Wholesome Foods",
  description:
    "Shop clean, honest, and wholesome foods at Only Truth No Secrets. Discover plant-based proteins, organic snacks, natural sweeteners, makhana, cashews, almonds, and more. Fast delivery, best prices, quality products.",
  keywords: [
    "Only Truth No Secrets",
    "online grocery shopping",
    "FMCG products online",
    "healthy snacks online",
    "organic food delivery",
    "plant-based proteins",
    "makhana online",
    "cashews price",
    "almonds online",
    "natural sweeteners",
    "wholesale grocery",
    "clean food",
    "honest food",
    "wholesome foods",
  ],
  alternates: { canonical: "https://www.onlytruthnosecrets.com/" },
  openGraph: {
    title: "Only Truth No Secrets | Buy Best FMCG Products Online",
    description:
      "Shop clean, honest, and wholesome foods at Only Truth No Secrets. Discover plant-based proteins, organic snacks, natural sweeteners, and more.",
    url: "https://www.onlytruthnosecrets.com/",
    siteName: "Only Truth No Secrets",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg",
        width: 1200,
        height: 630,
        alt: "Only Truth No Secrets - Clean, Honest, Wholesome Foods",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Only Truth No Secrets | Buy Best FMCG Products Online",
    description:
      "Shop clean, honest, and wholesome foods at Only Truth No Secrets.",
    images: ["https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const bannerData = [
  { id: 1, image: "/images/wholenacks.jpg", link: "/category/organic-snacks" },
  {
    id: 2,
    image: "/images/desikhand.jpg",
    link: "/category/natural-sweeteners",
  },
  { id: 3, image: "/images/cashews.jpg", link: "/category/premium-cashews" },
  {
    id: 4,
    image: "/images/roastedmakhanabanner.jpeg",
    link: "/category/flavored-snacks",
  },
  {
    id: 5,
    image: "/images/makhanachocolate.jpeg",
    link: "/category/guiltmakhana",
  },
  {
    id: 6,
    image: "/images/onlytruthbanner.jpeg",
    link: "/category/plant-based-protein",
  },
];

export default async function HomePage() {
  let productsData = null;
  try {
    productsData = await fetchProducts({
      page: 1,
      limit: 50,
      sort: "createdAt",
    });
  } catch {
    productsData = null;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Only Truth No Secrets",
    url: "https://www.onlytruthnosecrets.com",
    logo: "https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg",
    description: "Clean, honest, and wholesome foods retailer",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
    },
    sameAs: [
      // Add your social media URLs here
    ],
  };

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Clean & Natural Product Range",
    description:
      "Plant-based proteins, organic snacks, natural sweeteners, and wholesome foods",
    itemListElement:
      productsData?.allProducts?.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          description: product.description,
          brand: {
            "@type": "Brand",
            name: product._brand?.name || "Only Truth No Secrets",
          },
          image: product.images?.[0] || "",
          offers: {
            "@type": "Offer",
            price: product.caseSizes?.[0]?.offeredPrice || 0,
            priceCurrency: "INR",
            availability:
              product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        },
      })) || [],
  };

  return (
    <main className="min-h-screen">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Only Truth No Secrets",
            url: "https://www.onlytruthnosecrets.com",
            potentialAction: {
              "@type": "SearchAction",
              target:
                "https://www.onlytruthnosecrets.com/?search={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <CategoryNavBarWrapper />
      <Banner bannerData={bannerData} />
      {productsData && (
        <ProductSection
          title="Our Clean & Natural Product Range"
          description={
            <>
              Discover{" "}
              <span className="text-emerald-700 font-semibold">
                clean, honest, wholesome foods
              </span>{" "}
              — from
              <span className="text-cyan-700 font-semibold">
                {" "}
                plant‑based proteins
              </span>{" "}
              and
              <span className="text-amber-700 font-semibold">
                {" "}
                organic snacks
              </span>{" "}
              to
              <span className="text-pink-700 font-semibold">
                {" "}
                natural sweeteners
              </span>{" "}
              and premium dry fruits.
            </>
          }
          tags={[
            "Makhana & Sattu",
            "Cashews & Almonds",
            "Desi Khand",
            "No artificial additives",
            "Fast delivery",
            "Great prices",
          ]}
          bullets={[
            "Thoughtfully curated, clean ingredients",
            "Protein‑rich, gluten‑free options",
            "Premium nuts & natural sweeteners",
            "Crafted for taste and wellness",
            "Transparent sourcing and quality",
            "Trusted by conscious consumers",
          ]}
          products={productsData.allProducts}
        />
      )}
      <Footer />
    </main>
  );
}
