import type { Metadata } from "next";
import Script from "next/script";
import CartPageClient from "@/components/CartPageClient";
import Footer from "@/components/common/Footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Shopping Cart | NxtDoor Retail",
  description:
    "Review your selected clean and wholesome products from NxtDoor Retail. Secure checkout with fast delivery across India.",
  keywords: [
    "shopping cart",
    "nxtdoor retail cart",
    "checkout",
    "buy online",
    "FMCG cart",
  ],
  alternates: { canonical: "https://www.nxtdoorretail.com/cart" },
  openGraph: {
    title: "Shopping Cart | NxtDoor Retail",
    description:
      "Review your selected clean and wholesome products from NxtDoor Retail.",
    url: "https://www.nxtdoorretail.com/cart",
    siteName: "NxtDoor Retail",
    type: "website",
    images: [
      {
        url: "https://www.nxtdoorretail.com/images/NXTDoor.jpeg",
        width: 1200,
        height: 630,
        alt: "NxtDoor Retail - Shopping Cart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopping Cart | NxtDoor Retail",
    description:
      "Review your selected clean and wholesome products from NxtDoor Retail.",
    images: ["https://www.nxtdoorretail.com/images/NXTDoor.jpeg"],
  },
  robots: {
    // Best practice: prevent indexing of cart pages
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function CartPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.nxtdoorretail.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cart",
        item: "https://www.nxtdoorretail.com/cart",
      },
    ],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Shopping Cart",
    url: "https://www.nxtdoorretail.com/cart",
    description:
      "Review your selected clean and wholesome products from NxtDoor Retail.",
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Script
        id="cart-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="cart-webpage-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      <CartPageClient />
      <Footer />
    </main>
  );
}
