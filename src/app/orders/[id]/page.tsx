import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";
import OrderDetailsClient from "@/components/OrderDetailsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Order Details | Only Truth No Secrets",
  description: "View detailed information about your order.",
  alternates: { canonical: "https://www.onlytruthnosecrets.com/orders" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, "max-image-preview": "large" },
  },
};

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
      {
        "@type": "ListItem",
        position: 3,
        name: "Order Details",
        item: `https://www.onlytruthnosecrets.com/orders/${id}`,
      },
    ],
  };

  return (
    <main className="min-h-screen">
      <Script
        id="order-details-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <OrderDetailsClient orderId={id} />
      <Footer />
    </main>
  );
}
