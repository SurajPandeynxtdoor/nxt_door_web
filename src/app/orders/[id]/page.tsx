// src/app/orders/[id]/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";
import OrderDetailsClient from "@/components/OrderDetailsClient";

export const metadata: Metadata = {
  title: "Order Details | NxtDoor Retail",
  description: "View detailed information about your order.",
  alternates: { canonical: "https://www.nxtdoorretail.com/orders" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, "max-image-preview": "large" },
  },
};

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
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
      {
        "@type": "ListItem",
        position: 3,
        name: "Order Details",
        item: `https://www.nxtdoorretail.com/orders/${params.id}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Script
        id="order-details-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <OrderDetailsClient orderId={params.id} />
      <Footer />
    </main>
  );
}
