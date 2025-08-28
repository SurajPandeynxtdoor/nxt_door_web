// src/app/select-address/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";
import SelectAddressClient from "@/components/SelectAddressClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Select Address | NxtDoor Retail",
  description: "Choose your delivery address to proceed to payment.",
  alternates: { canonical: "https://www.nxtdoorretail.com/select-address" },
  openGraph: {
    title: "Select Address | NxtDoor Retail",
    description: "Choose your delivery address to proceed to payment.",
    url: "https://www.nxtdoorretail.com/select-address",
    siteName: "NxtDoor Retail",
    type: "website",
    images: [
      {
        url: "https://www.nxtdoorretail.com/images/NXTDoor.jpeg",
        width: 1200,
        height: 630,
        alt: "NxtDoor Retail - Select Address",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Select Address | NxtDoor Retail",
    description: "Choose your delivery address to proceed to payment.",
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

export default function SelectAddressPage() {
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
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Script
        id="select-address-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <SelectAddressClient />
      <Footer />
    </main>
  );
}
