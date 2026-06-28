// src/app/manage-address/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";
import ManageAddressClient from "@/components/ManageAddressClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Manage Addresses | Only Truth No Secrets",
  description: "Add, edit, and remove your delivery addresses.",
  alternates: {
    canonical: "https://www.onlytruthnosecrets.com/manage-address",
  },
  openGraph: {
    title: "Manage Addresses | Only Truth No Secrets",
    description: "Add, edit, and remove your delivery addresses.",
    url: "https://www.onlytruthnosecrets.com/manage-address",
    siteName: "Only Truth No Secrets",
    type: "website",
    images: [
      {
        url: "https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg",
        width: 1200,
        height: 630,
        alt: "Only Truth No Secrets - Manage Addresses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manage Addresses | Only Truth No Secrets",
    description: "Add, edit, and remove your delivery addresses.",
    images: ["https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg"],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, "max-image-preview": "large" },
  },
};

export default function ManageAddressPage() {
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
        name: "Manage Addresses",
        item: "https://www.onlytruthnosecrets.com/manage-address",
      },
    ],
  };

  return (
    <main className="min-h-screen">
      <Script
        id="manage-address-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ManageAddressClient />
      <Footer />
    </main>
  );
}
