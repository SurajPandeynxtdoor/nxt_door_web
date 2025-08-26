// src/app/orders/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";
import MyOrdersClient from "@/components/MyOrdersClient";

export const metadata: Metadata = {
  title: "My Orders | NxtDoor Retail",
  description: "Track your orders and view your order history.",
  alternates: { canonical: "https://www.nxtdoorretail.com/orders" },
  openGraph: {
    title: "My Orders | NxtDoor Retail",
    description: "Track your orders and view your order history.",
    url: "https://www.nxtdoorretail.com/orders",
    siteName: "NxtDoor Retail",
    type: "website",
    images: [
      {
        url: "https://www.nxtdoorretail.com/images/NXTDoor.jpeg",
        width: 1200,
        height: 630,
        alt: "NxtDoor Retail - My Orders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Orders | NxtDoor Retail",
    description: "Track your orders and view your order history.",
    images: ["https://www.nxtdoorretail.com/images/NXTDoor.jpeg"],
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
        item: "https://www.nxtdoorretail.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "My Orders",
        item: "https://www.nxtdoorretail.com/orders",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50">
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
