import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | NxtDoor Retail",
  description:
    "Get in touch with NxtDoor Retail. Contact us for support, feedback, partnership opportunities, or general inquiries.",
  keywords: [
    "contact",
    "support",
    "customer service",
    "help",
    "NxtDoor Retail",
    "email",
    "phone",
    "address",
  ],
  alternates: { canonical: "https://www.nxtdoorretail.com/contact-us" },
  openGraph: {
    title: "Contact Us | NxtDoor Retail",
    description:
      "Reach out to NxtDoor Retail for support, feedback, or business queries.",
    url: "https://www.nxtdoorretail.com/contact-us",
    siteName: "NxtDoor Retail",
    type: "website",
    images: [
      {
        url: "https://www.nxtdoorretail.com/images/NXTDoor.jpeg",
        width: 1200,
        height: 630,
        alt: "NxtDoor Retail - Contact Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | NxtDoor Retail",
    description:
      "Reach out to NxtDoor Retail for support, feedback, or business queries.",
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

export default function ContactPage() {
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
        name: "Contact Us",
        item: "https://www.nxtdoorretail.com/contact-us",
      },
    ],
  };

  const contactLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Us",
    url: "https://www.nxtdoorretail.com/contact-us",
    mainEntity: {
      "@type": "Organization",
      name: "NxtDoor Retail",
      url: "https://www.nxtdoorretail.com",
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "contactus@nxtdoormart.in",
          telephone: "+91 6261939031",
          areaServed: "IN",
          availableLanguage: ["en"],
        },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "FLAT NO-A-1003, GAGAN ARENA, KAD NAGAR CHOWK, UNDRI",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        postalCode: "411060",
        addressCountry: "IN",
      },
    },
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Script
        id="contact-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="contact-page-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }}
      />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[rgb(0,183,205)] to-[#0099AD] py-10 sm:py-16 flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          Contact Us
        </h1>
        <p className="max-w-xl mx-auto text-lg sm:text-xl text-white/90 font-medium">
          Have a question, feedback, or need support? We&apos;re here to help!
        </p>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-10 lg:py-12 flex flex-col md:flex-row gap-8 sm:gap-10 lg:gap-12">
        {/* Contact Form */}
        <div className="flex-1 bg-white rounded-lg shadow p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-6 text-[#00B7CD]">
            Send us a message
          </h2>
          <ContactForm />
        </div>

        {/* Contact Info */}
        <div className="flex-1 flex flex-col gap-8 justify-center">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-[#00B7CD] mb-3">
              Contact Information
            </h3>
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-5 w-5 text-[#00B7CD]" />
              <span>contactus@nxtdoormart.in</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Phone className="h-5 w-5 text-[#00B7CD]" />
              <span>+91 6261939031</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#00B7CD]" />
              <span>
                FLAT NO-A-1003, GAGAN ARENA, KAD NAGAR CHOWK, UNDRI, Pune,
                Maharashtra, 411060
              </span>
            </div>
          </div>

          {/* Map Embed */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-48">
            <iframe
              title="Nxt Door Retail Location"
              src="https://www.google.com/maps?q=FLAT+NO-A-1003,+GAGAN+ARENA,+KAD+NAGAR+CHOWK,+UNDRI,+Pune,+Maharashtra,+411060&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "0.5rem", minHeight: "160px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
