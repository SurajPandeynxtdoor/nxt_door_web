// src/app/profile/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";
import ProfileClient from "@/components/ProfileClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "My Profile | Only Truth No Secrets",
  description: "View and manage your profile, orders, and addresses.",
  alternates: { canonical: "https://www.onlytruthnosecrets.com/profile" },
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
        item: "https://www.onlytruthnosecrets.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Profile",
        item: "https://www.onlytruthnosecrets.com/profile",
      },
    ],
  };

  return (
    <main className="min-h-screen">
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
