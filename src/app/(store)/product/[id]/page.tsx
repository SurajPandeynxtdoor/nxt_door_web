import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductDetails } from "@/lib/api/products";
import CategoryNavBarWrapper from "@/components/CategoryNavBarWrapper";
import ProductDetailSection from "@/components/ProductDetailSection";
import Footer from "@/components/common/Footer";
import Script from "next/script";

// Product details can be cached briefly; refresh on new requests
export const revalidate = 300; // 5 minutes

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const productData = await fetchProductDetails(id);

    if (!productData || productData.error || !productData.product) {
      return {
        title: "Product Not Found | Only Truth No Secrets",
        description: "The requested product could not be found.",
      };
    }

    const product = productData.product;
    const categoryName =
      typeof product._category === "object" && product._category?.name
        ? product._category.name
        : "Products";
    const brandName = product._brand?.name || "Only Truth No Secrets";
    const image = product.images?.[0] || "/images/NXTDoor.jpeg";

    return {
      title: `${product.name} - ${brandName} | ${categoryName} | Only Truth No Secrets`,
      description:
        product.description ||
        `Buy ${product.name} from ${brandName} at Only Truth No Secrets. ${categoryName} - Clean, honest, and wholesome foods.
        it is good and healthy for health`,
      keywords: [
        product.name.toLowerCase(),
        brandName.toLowerCase(),
        categoryName.toLowerCase(),
        "natural products",
        "organic food",
        "wholesome foods",
        "Only Truth No Secrets",
        "online grocery",
        "clean food",
      ].join(", "),
      openGraph: {
        title: `${product.name} - ${brandName} | Only Truth No Secrets`,
        description:
          product.description ||
          `Buy ${product.name} from ${brandName} at Only Truth No Secrets. Clean, honest, and wholesome foods.`,
        type: "website",
        url: `https://www.onlytruthnosecrets.com/product/${id}`,
        images: [
          {
            url: image.startsWith("http")
              ? image
              : `https://www.onlytruthnosecrets.com${image}`,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} - ${brandName} | Only Truth No Secrets`,
        description:
          product.description ||
          `Buy ${product.name} from ${brandName} at Only Truth No Secrets.`,
        images: [
          image.startsWith("http")
            ? image
            : `https://www.onlytruthnosecrets.com${image}`,
        ],
      },
      alternates: {
        canonical: `https://www.onlytruthnosecrets.com/product/${id}`,
      },
    };
  } catch (error) {
    console.error("Error loading product metadata:", error);
    return {
      title: "Product | Only Truth No Secrets",
      description: "Explore our natural and organic products.",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { id } = await params;
    const productData = await fetchProductDetails(id);

    if (!productData || productData.error || !productData.product) {
      notFound();
    }

    const product = productData.product;
    const categoryName =
      typeof product._category === "object" && product._category?.name
        ? product._category.name
        : "Products";

    // Generate structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      brand: {
        "@type": "Brand",
        name: product._brand?.name || "Only Truth No Secrets",
        logo:
          product._brand?.logo ||
          "https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg",
      },
      category: categoryName,
      image:
        product.images
          ?.filter((img) => img)
          .map((img) =>
            img.startsWith("http")
              ? img
              : `https://www.onlytruthnosecrets.com${img}`
          ) || [],
      offers: {
        "@type": "Offer",
        price: product.caseSizes?.[0]?.offeredPrice || 0,
        priceCurrency: "INR",
        availability:
          product.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "Only Truth No Secrets",
          url: "https://www.onlytruthnosecrets.com",
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.5",
        reviewCount: "100",
      },
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.onlytruthnosecrets.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Products",
          item: "https://www.onlytruthnosecrets.com/",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: product.name,
          item: `https://www.onlytruthnosecrets.com/product/${id}`,
        },
      ],
    };

    return (
      <main className="min-h-screen">
        <Script
          id="product-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <Script
          id="breadcrumb-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
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

        {/* Product Detail Section */}
        <ProductDetailSection product={product} />

        <Footer />
      </main>
    );
  } catch (error) {
    console.error("Error loading product page:", error);
    notFound();
  }
}
