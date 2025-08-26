// src/app/profile/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";
import ProfileClient from "@/components/ProfileClient";

export const metadata: Metadata = {
  title: "My Profile | NxtDoor Retail",
  description: "View and manage your profile, orders, and addresses.",
  alternates: { canonical: "https://www.nxtdoorretail.com/profile" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, "max-image-preview": "large" },
  },
};

export default function ProfilePage() {
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
        name: "Profile",
        item: "https://www.nxtdoorretail.com/profile",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Script
        id="profile-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProfileClient />
      <Footer />
    </main>
  );
}
