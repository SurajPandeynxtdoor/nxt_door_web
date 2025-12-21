import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/common/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Only Truth No Secrets",
  description:
    "Learn about Only Truth No Secret by Only Truth No Secrets – our story, values, team, and commitment to clean, honest, and wholesome foods.",
  keywords: [
    "about",
    "Only Truth No Secret",
    "Only Truth No Secrets",
    "clean foods",
    "wholesome",
    "natural ingredients",
    "our story",
    "team",
    "sustainability",
  ],
  alternates: { canonical: "https://www.onlytruthnosecrets.com/about-us" },
  openGraph: {
    title: "About Us | Only Truth No Secrets",
    description:
      "Our story, values, and team behind Only Truth No Secret – clean, honest, and wholesome foods.",
    url: "https://www.onlytruthnosecrets.com/about-us",
    siteName: "Only Truth No Secrets",
    type: "website",
    images: [
      {
        url: "https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg",
        width: 1200,
        height: 630,
        alt: "Only Truth No Secrets - About Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Only Truth No Secrets",
    description:
      "Our story, values, and team behind Only Truth No Secret – clean, honest, and wholesome foods.",
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

export default function AboutUsPage() {
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
        name: "About Us",
        item: "https://www.onlytruthnosecrets.com/about-us",
      },
    ],
  };

  const aboutPageLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Only Truth No Secret",
    url: "https://www.onlytruthnosecrets.com/about-us",
    description:
      "Only Truth No Secret by Only Truth No Secrets – clean, honest, and wholesome foods for every home.",
    publisher: {
      "@type": "Organization",
      name: "Only Truth No Secrets",
      url: "https://www.onlytruthnosecrets.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.onlytruthnosecrets.com/images/NXTDoor.jpeg",
      },
    },
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Script
        id="about-breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="about-page-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageLd) }}
      />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#00B7CD] to-[#0099AD] py-10 sm:py-16 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          About Only Truth No Secret
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/90 font-medium mb-2">
          Clean, Honest, and Wholesome Foods for Every Home
        </p>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-10 lg:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Our Story
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
            At{" "}
            <span className="font-semibold text-[#00B7CD]">
              Only Truth No Secret
            </span>
            , we believe in the power of pure, natural ingredients and honest
            nutrition. Our journey began with a simple mission: to bring back
            the wisdom of traditional foods, free from chemicals and artificial
            additives, and make them accessible to every family.
          </p>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            We carefully curate and craft every product, ensuring it&apos;s not
            just healthy, but also delicious and rooted in authenticity. From
            plant-based proteins and wholesome snacks to natural sweeteners, our
            range is designed to support your well-being, every day.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-8 sm:py-10 lg:py-14">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
            What Makes Us Different?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center shadow-sm">
              <span className="text-3xl mb-3">🌱</span>
              <h3 className="font-semibold text-lg mb-2 text-[#00B7CD]">
                100% Natural
              </h3>
              <p className="text-gray-600 text-center text-sm">
                No chemicals, no secrets—just pure, honest ingredients in every
                product.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center shadow-sm">
              <span className="text-3xl mb-3">🧑‍🌾</span>
              <h3 className="font-semibold text-lg mb-2 text-[#00B7CD]">
                Rooted in Tradition
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Inspired by Indian wisdom, our foods celebrate heritage and
                health.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center shadow-sm">
              <span className="text-3xl mb-3">💚</span>
              <h3 className="font-semibold text-lg mb-2 text-[#00B7CD]">
                Clean & Wholesome
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Every bite is free from artificial additives, preservatives, and
                refined sugars.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center shadow-sm">
              <span className="text-3xl mb-3">🤝</span>
              <h3 className="font-semibold text-lg mb-2 text-[#00B7CD]">
                Community First
              </h3>
              <p className="text-gray-600 text-center text-sm">
                We support local farmers and empower communities through ethical
                sourcing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="bg-white py-8 sm:py-10 lg:py-14">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
            Meet the Team
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex flex-col items-center">
              <Image
                src="/images/abhimanyu.jpeg"
                alt="Founder"
                width={96}
                height={96}
                unoptimized
                className="w-24 h-24 rounded-full mb-3 object-cover border-4 border-[#00B7CD]"
              />
              <h4 className="font-semibold text-lg text-gray-800">
                Abhimanyu Jha
              </h4>
              <p className="text-sm text-gray-500">Founder & CEO</p>
            </div>
            {/* <div className="flex flex-col items-center">
              <Image
                src="/images/abhimanyu.jpeg"
                alt="Co-Founder"
                width={96}
                height={96}
                unoptimized
                className="w-24 h-24 rounded-full mb-3 object-cover border-4 border-[#00B7CD]"
              />
              <h4 className="font-semibold text-lg text-gray-800">
                Priya Sharma
              </h4>
              <p className="text-sm text-gray-500">Co-Founder & Nutritionist</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 sm:py-10 lg:py-14 bg-gradient-to-r from-[#00B7CD]/10 to-[#0099AD]/10">
        <div className="max-w-2xl mx-auto text-center px-3 sm:px-4 lg:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Join Our Journey
          </h2>
          <p className="text-gray-700 text-base sm:text-lg mb-6">
            We invite you to experience the difference of clean, honest food.
            Explore our range and be a part of our growing family!
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#00B7CD] hover:bg-[#0099AD] text-white font-semibold rounded-lg shadow transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Sustainability & Social Impact */}
      <section className="bg-white py-8 sm:py-10 lg:py-14">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6">
            Sustainability & Social Impact
          </h2>
          <p className="text-gray-700 text-base sm:text-lg text-center">
            We are committed to eco-friendly packaging, ethical sourcing, and
            supporting local farmers. Every purchase helps us give back to the
            community and protect our planet for future generations.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
