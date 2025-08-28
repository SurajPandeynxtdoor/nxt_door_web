// src/app/payment/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";
import PaymentPageClient from "@/components/paymentPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Payment | NxtDoor Retail",
  description: "Choose payment method and complete your order.",
  alternates: { canonical: "https://www.nxtdoorretail.com/payment" },
  openGraph: {
    title: "Payment | NxtDoor Retail",
    description: "Choose payment method and complete your order.",
    url: "https://www.nxtdoorretail.com/payment",
    siteName: "NxtDoor Retail",
    type: "website",
    images: [
      {
        url: "https://www.nxtdoorretail.com/images/NXTDoor.jpeg",
        width: 1200,
        height: 630,
        alt: "NxtDoor Retail - Payment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Payment | NxtDoor Retail",
    description: "Choose payment method and complete your order.",
    images: ["https://www.nxtdoorretail.com/images/NXTDoor.jpeg"],
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
        item: "https://www.nxtdoorretail.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cart",
        item: "https://www.nxtdoorretail.com/cart",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Select Address",
        item: "https://www.nxtdoorretail.com/select-address",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Payment",
        item: "https://www.nxtdoorretail.com/payment",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50">
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
