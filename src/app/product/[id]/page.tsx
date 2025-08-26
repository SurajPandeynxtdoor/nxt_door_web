import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductDetails } from "@/lib/api/products";
import CategoryNavBarWrapper from "@/components/CategoryNavBarWrapper";
import ProductDetailSection from "@/components/ProductDetailSection";
import Footer from "@/components/common/Footer";

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
        title: "Product Not Found | NxtDoor Retail",
        description: "The requested product could not be found.",
      };
    }

    const product = productData.product;
    const categoryName =
      typeof product._category === "object" && product._category?.name
        ? product._category.name
        : "Products";
    const brandName = product._brand?.name || "NxtDoor Retail";
    const image = product.images?.[0] || "/images/NXTDoor.jpeg";

    return {
      title: `${product.name} - ${brandName} | ${categoryName} | NxtDoor Retail`,
      description:
        product.description ||
        `Buy ${product.name} from ${brandName} at NxtDoor Retail. ${categoryName} - Clean, honest, and wholesome foods.`,
      keywords: [
        product.name.toLowerCase(),
        brandName.toLowerCase(),
        categoryName.toLowerCase(),
        "natural products",
        "organic food",
        "wholesome foods",
        "NxtDoor Retail",
        "online grocery",
        "clean food",
      ].join(", "),
      openGraph: {
        title: `${product.name} - ${brandName} | NxtDoor Retail`,
        description:
          product.description ||
          `Buy ${product.name} from ${brandName} at NxtDoor Retail. Clean, honest, and wholesome foods.`,
        type: "website",
        images: [
          {
            url: image.startsWith("http")
              ? image
              : `https://www.nxtdoorretail.com${image}`,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} - ${brandName} | NxtDoor Retail`,
        description:
          product.description ||
          `Buy ${product.name} from ${brandName} at NxtDoor Retail.`,
        images: [
          image.startsWith("http")
            ? image
            : `https://www.nxtdoorretail.com${image}`,
        ],
      },
      alternates: {
        canonical: `https://www.nxtdoorretail.com/product/${id}`,
      },
    };
  } catch (error) {
    console.error("Error loading product metadata:", error);
    return {
      title: "Product | NxtDoor Retail",
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
        name: product._brand?.name || "NxtDoor Retail",
        logo:
          product._brand?.logo ||
          "https://www.nxtdoorretail.com/images/NXTDoor.jpeg",
      },
      category: categoryName,
      image:
        product.images
          ?.filter((img) => img)
          .map((img) =>
            img.startsWith("http") ? img : `https://www.nxtdoorretail.com${img}`
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
          name: "NxtDoor Retail",
          url: "https://www.nxtdoorretail.com",
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.5",
        reviewCount: "100",
      },
    };

    return (
      <main className="min-h-screen bg-gray-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
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
