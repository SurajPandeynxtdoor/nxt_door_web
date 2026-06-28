import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions | Only Truth No Secrets",
  description:
    "Read Only Truth No Secrets's Terms & Conditions. Understand acceptable use, orders & payments, intellectual property, limitations, and contact details.",
  keywords: [
    "terms and conditions",
    "terms of service",
    "acceptable use",
    "orders and payments",
    "Only Truth No Secrets",
  ],
  alternates: {
    canonical: "https://www.onlytruthnosecrets.com/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | Only Truth No Secrets",
    description:
      "Read Only Truth No Secrets's Terms & Conditions, including acceptable use, orders & payments, and limitations.",
    url: "https://www.onlytruthnosecrets.com/terms-and-conditions",
    siteName: "Only Truth No Secrets",
    type: "website",
    images: [
      {
        url: "https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg",
        width: 1200,
        height: 630,
        alt: "Only Truth No Secrets - Terms & Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | Only Truth No Secrets",
    description:
      "Read Only Truth No Secrets's Terms & Conditions, including acceptable use, orders & payments, and limitations.",
    images: ["https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg"],
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

export default function TermsAndConditionsPage() {
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
        name: "Terms & Conditions",
        item: "https://www.onlytruthnosecrets.com/terms-and-conditions",
      },
    ],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms & Conditions",
    url: "https://www.onlytruthnosecrets.com/terms-and-conditions",
    description:
      "Read Only Truth No Secrets's Terms & Conditions, including acceptable use, orders & payments, and limitations.",
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Script
        id="terms-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="terms-webpage-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#00B7CD] to-[#0099AD] py-10 sm:py-16 flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          Terms & Conditions
        </h1>
        <p className="max-w-xl mx-auto text-lg sm:text-xl text-white/90 font-medium">
          Please read these terms and conditions carefully before using our
          website or services.
        </p>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-10 lg:py-12 flex-1">
        <div className="bg-white rounded-lg shadow p-6 sm:p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            1. Acceptance of Terms
          </h2>
          <p className="mb-6 text-gray-700">
            By accessing or using our website, you agree to be bound by these
            Terms & Conditions and our Privacy Policy. If you do not agree,
            please do not use our services.
          </p>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            2. Use of the Website
          </h2>
          <ul className="list-disc ml-6 mb-6 text-gray-700 space-y-2">
            <li>
              You must be at least 18 years old or have parental consent to use
              this site.
            </li>
            <li>You agree not to misuse the website or its content.</li>
            <li>All content is for personal, non-commercial use only.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            3. Product Information
          </h2>
          <p className="mb-6 text-gray-700">
            We strive to ensure all product information is accurate. However, we
            do not warrant that product descriptions or other content are
            error-free. If a product is not as described, your sole remedy is to
            return it unused.
          </p>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            4. Orders & Payments
          </h2>
          <ul className="list-disc ml-6 mb-6 text-gray-700 space-y-2">
            <li>All orders are subject to acceptance and availability.</li>
            <li>
              We reserve the right to refuse or cancel any order at our
              discretion.
            </li>
            <li>
              Prices and availability are subject to change without notice.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            5. Intellectual Property
          </h2>
          <p className="mb-6 text-gray-700">
            All content, trademarks, and data on this website are the property
            of Only Truth No Secrets or its licensors. You may not use,
            reproduce, or distribute any content without permission.
          </p>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            6. Limitation of Liability
          </h2>
          <p className="mb-6 text-gray-700">
            We are not liable for any indirect, incidental, or consequential
            damages arising from your use of the website or products.
          </p>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            7. Changes to Terms
          </h2>
          <p className="mb-6 text-gray-700">
            We may update these Terms & Conditions at any time. Changes will be
            posted on this page. Continued use of the site means you accept the
            revised terms.
          </p>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            8. Contact Us
          </h2>
          <p className="text-gray-700">
            If you have any questions about these Terms & Conditions, please
            contact us at{" "}
            <a
              href="mailto:support@onlytruthnosecrets.com"
              className="text-[#00B7CD] underline"
            >
              support@onlytruthnosecrets.com
            </a>
            .
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
