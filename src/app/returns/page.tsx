import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "Returns & Refund Policy | NxtDoor Retail",
  description:
    "Read NxtDoor Retail's returns and refund policy. Learn return windows, non-returnable items, refunds timeline, and how to contact support.",
  keywords: [
    "returns policy",
    "refund policy",
    "return window",
    "replacement",
    "NxtDoor Retail",
  ],
  alternates: { canonical: "https://www.nxtdoorretail.com/returns" },
  openGraph: {
    title: "Returns & Refund Policy | NxtDoor Retail",
    description:
      "Find details about returns, non-returnable items, damage claims, and refund timelines.",
    url: "https://www.nxtdoorretail.com/returns",
    siteName: "NxtDoor Retail",
    type: "website",
    images: [
      {
        url: "https://www.nxtdoorretail.com/images/NXTDoor.jpeg",
        width: 1200,
        height: 630,
        alt: "NxtDoor Retail - Returns & Refund Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Returns & Refund Policy | NxtDoor Retail",
    description:
      "Find details about returns, non-returnable items, damage claims, and refund timelines.",
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

export default function ReturnsPage() {
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
        name: "Returns & Refund Policy",
        item: "https://www.nxtdoorretail.com/returns",
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the return window?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Returns are accepted within 7 days of delivery for unused, unopened items in original packaging.",
        },
      },
      {
        "@type": "Question",
        name: "How long do refunds take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Once approved, refunds are processed to your original payment method within 5-7 business days.",
        },
      },
      {
        "@type": "Question",
        name: "What if my product is damaged or incorrect?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Contact support within 48 hours of delivery with photos and order details. We will arrange a replacement or refund.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Script
        id="returns-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="returns-faq-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#00B7CD] to-[#0099AD] py-10 sm:py-16 flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          Returns & Refund Policy
        </h1>
        <p className="max-w-xl mx-auto text-lg sm:text-xl text-white/90 font-medium">
          We want you to be completely satisfied with your purchase. Please read
          our returns and refund policy below.
        </p>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-10 lg:py-12 flex-1">
        <div className="bg-white rounded-lg shadow p-6 sm:p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">1. Returns</h2>
          <ul className="list-disc ml-6 mb-6 text-gray-700 space-y-2">
            <li>Returns are accepted within 7 days of delivery.</li>
            <li>
              Products must be unused, unopened, and in their original
              packaging.
            </li>
            <li>
              To initiate a return, please contact our support team with your
              order details.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            2. Non-Returnable Items
          </h2>
          <ul className="list-disc ml-6 mb-6 text-gray-700 space-y-2">
            <li>Opened or used products</li>
            <li>Items without original packaging</li>
            <li>Perishable goods (unless damaged or defective)</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">3. Refunds</h2>
          <ul className="list-disc ml-6 mb-6 text-gray-700 space-y-2">
            <li>
              Once your return is received and inspected, we will notify you of
              the approval or rejection of your refund.
            </li>
            <li>
              If approved, your refund will be processed to your original
              payment method within 5-7 business days.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            4. Damaged or Incorrect Products
          </h2>
          <p className="mb-6 text-gray-700">
            If you receive a damaged or incorrect product, please contact us
            within 48 hours of delivery with photos and order details. We will
            arrange for a replacement or refund as soon as possible.
          </p>

          <h2 className="text-2xl font-bold text-[#00B7CD] mb-6">
            5. Contact Us
          </h2>
          <p className="text-gray-700">
            For any questions or to initiate a return, please contact us at{" "}
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
