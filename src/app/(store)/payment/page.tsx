// src/app/payment/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";
import PaymentPageClient from "@/components/paymentPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Payment | Only Truth No Secrets",
  description: "Choose payment method and complete your order.",
  alternates: { canonical: "https://www.onlytruthnosecrets.com/payment" },
  openGraph: {
    title: "Payment | Only Truth No Secrets",
    description: "Choose payment method and complete your order.",
    url: "https://www.onlytruthnosecrets.com/payment",
    siteName: "Only Truth No Secrets",
    type: "website",
    images: [
      {
        url: "https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg",
        width: 1200,
        height: 630,
        alt: "Only Truth No Secrets - Payment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Payment | Only Truth No Secrets",
    description: "Choose payment method and complete your order.",
    images: ["https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg"],
  },
  robots: {
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

export default function PaymentPage() {
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
        name: "Cart",
        item: "https://www.onlytruthnosecrets.com/cart",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Select Address",
        item: "https://www.onlytruthnosecrets.com/select-address",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Payment",
        item: "https://www.onlytruthnosecrets.com/payment",
      },
    ],
  };

  return (
    <main className="min-h-screen">
      <Script
        id="payment-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <PaymentPageClient />
      <Footer />
    </main>
  );
}
