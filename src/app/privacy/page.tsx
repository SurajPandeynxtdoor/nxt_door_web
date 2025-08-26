import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | NxtDoor Retail",
  description:
    "Learn how NxtDoor Retail collects, uses, and protects your personal information. Read our privacy practices, your rights, and how to contact us.",
  keywords: [
    "privacy policy",
    "data protection",
    "personal information",
    "cookies",
    "NxtDoor Retail",
    "user rights",
  ],
  alternates: {
    canonical: "https://www.nxtdoorretail.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | NxtDoor Retail",
    description:
      "How NxtDoor Retail collects, uses, and protects your data. Understand your privacy rights and our practices.",
    url: "https://www.nxtdoorretail.com/privacy",
    siteName: "NxtDoor Retail",
    type: "website",
    images: [
      {
        url: "https://www.nxtdoorretail.com/images/NXTDoor.jpeg",
        width: 1200,
        height: 630,
        alt: "NxtDoor Retail - Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | NxtDoor Retail",
    description:
      "How NxtDoor Retail collects, uses, and protects your data. Understand your privacy rights and our practices.",
    images: ["https://www.nxtdoorretail.com/images/NXTDoor.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function PrivacyPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    name: "Privacy Policy",
    description:
      "Learn how NxtDoor Retail collects, uses, and protects your personal information.",
    url: "https://www.nxtdoorretail.com/privacy",
    publisher: {
      "@type": "Organization",
      name: "NxtDoor Retail",
      url: "https://www.nxtdoorretail.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.nxtdoorretail.com/images/NXTDoor.jpeg",
      },
    },
  };

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
        name: "Privacy Policy",
        item: "https://www.nxtdoorretail.com/privacy",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Script
        id="privacy-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#00B7CD] to-[#0099AD] py-10 sm:py-16 flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          Privacy Policy
        </h1>
        <p className="max-w-xl mx-auto text-lg sm:text-xl text-white/90 font-medium">
          Your privacy is important to us. Please read how we collect, use, and
          protect your information.
        </p>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-10 lg:py-12 flex-1">
        <div className="bg-white rounded-lg shadow p-6 sm:p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            1. Information We Collect
          </h2>
          <ul className="list-disc ml-6 mb-6 text-gray-700 space-y-2">
            <li>
              Personal information you provide (name, email, address, etc.)
            </li>
            <li>Order and payment details</li>
            <li>Usage data (pages visited, time spent, etc.)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc ml-6 mb-6 text-gray-700 space-y-2">
            <li>To process orders and provide services</li>
            <li>To communicate with you about your account or orders</li>
            <li>To improve our website and services</li>
            <li>For marketing and promotional purposes (with your consent)</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            3. Sharing Your Information
          </h2>
          <p className="mb-6 text-gray-700">
            We do not sell your personal information. We may share your data
            with trusted partners (such as payment processors and delivery
            services) only as necessary to fulfill your orders and provide our
            services.
          </p>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            4. Data Security
          </h2>
          <p className="mb-6 text-gray-700">
            We use industry-standard security measures to protect your data.
            However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            5. Your Rights
          </h2>
          <ul className="list-disc ml-6 mb-6 text-gray-700 space-y-2">
            <li>
              You can access, update, or delete your personal information at any
              time.
            </li>
            <li>You can opt out of marketing communications.</li>
            <li>Contact us for any privacy-related requests.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            6. Changes to This Policy
          </h2>
          <p className="mb-6 text-gray-700">
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page.
          </p>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            7. Contact Us
          </h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <a
              href="mailto:support@nxtdoorretail.com"
              className="text-[#00B7CD] underline"
            >
              support@nxtdoorretail.com
            </a>
            .
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
