// src/app/select-address/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";
import SelectAddressClient from "@/components/SelectAddressClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Select Address | Only Truth No Secrets",
  description: "Choose your delivery address to proceed to payment.",
  alternates: {
    canonical: "https://www.onlytruthnosecrets.com/select-address",
  },
  openGraph: {
    title: "Select Address | Only Truth No Secrets",
    description: "Choose your delivery address to proceed to payment.",
    url: "https://www.onlytruthnosecrets.com/select-address",
    siteName: "Only Truth No Secrets",
    type: "website",
    images: [
      {
        url: "https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg",
        width: 1200,
        height: 630,
        alt: "Only Truth No Secrets - Select Address",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Select Address | Only Truth No Secrets",
    description: "Choose your delivery address to proceed to payment.",
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

export default function SelectAddressPage() {
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
    ],
  };

  return (
    <main className="min-h-screen">
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
