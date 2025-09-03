// src/app/orders/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";
import MyOrdersClient from "@/components/MyOrdersClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "My Orders | Only Truth No Secrets",
  description: "Track your orders and view your order history.",
  alternates: { canonical: "https://www.onlytruthnosecrets.com/orders" },
  openGraph: {
    title: "My Orders | Only Truth No Secrets",
    description: "Track your orders and view your order history.",
    url: "https://www.onlytruthnosecrets.com/orders",
    siteName: "Only Truth No Secrets",
    type: "website",
    images: [
      {
        url: "https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg",
        width: 1200,
        height: 630,
        alt: "Only Truth No Secrets - My Orders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Orders | Only Truth No Secrets",
    description: "Track your orders and view your order history.",
    images: ["https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg"],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, "max-image-preview": "large" },
  },
};

export default function OrdersPage() {
  const breadcrumbLd = {
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
        name: "My Orders",
        item: "https://www.onlytruthnosecrets.com/orders",
      },
    ],
  };

  return (
    <main className="min-h-screen">
      <Script
        id="orders-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <MyOrdersClient />
      <Footer />
    </main>
  );
}
