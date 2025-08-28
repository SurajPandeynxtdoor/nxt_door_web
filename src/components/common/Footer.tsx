import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  MessageCircle,
  ShieldCheck,
  Truck,
  IndianRupee,
} from "lucide-react";
import { fetchCategories } from "@/lib/api/categories";
import { Category } from "@/types/catalog";
import Image from "next/image";
import NewsletterForm from "./NewsletterForm";

const usefulLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Returns", href: "/returns" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "We're Safe", href: "#" },
  { name: "Contact Us", href: "/contact-us" },
  { name: "Sitemap", href: "/sitemap.xml" },
  { name: "About Us", href: "/about-us" },
];

const myAccountLinks = [
  { name: "Account", path: "/profile" },
  { name: "Orders", path: "/my-orders" },
  { name: "Addresses", path: "/manage-address" },
];

const socialLinks = [
  { icon: Facebook, href: "#", hoverColor: "hover:text-blue-600" },
  { icon: Twitter, href: "#", hoverColor: "hover:text-sky-500" },
  {
    icon: Instagram,
    href: "https://www.instagram.com/nxtdoorretailmart/",
    hoverColor: "hover:text-pink-500",
  },
  { icon: Youtube, href: "#", hoverColor: "hover:text-red-600" },
  { icon: Linkedin, href: "#", hoverColor: "hover:text-blue-700" },
  { icon: Mail, href: "#", hoverColor: "hover:text-gray-400" },
];

const paymentMethods = [
  "Visa",
  "Mastercard",
  "Amex",
  "UPI",
  "RuPay",
  "Net Banking",
];

const FooterHeader = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
    {children}
  </h3>
);

export default async function Footer() {
  let categories: Category[] = [];
  try {
    categories = await fetchCategories();
  } catch {
    categories = [];
  }

  return (
    <>
      <footer className="bg-slate-900 text-slate-400">
        {/* Top Info Bar */}
        <div className="border-b border-slate-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16">
              <div className="flex items-center gap-4">
                <Truck className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="font-semibold text-white">Free Shipping</p>
                  <p className="text-sm">On Orders Above ₹399</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <IndianRupee className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="font-semibold text-white">COD Available</p>
                  <p className="text-sm">@ ₹40 Per Order</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Useful Links */}
            <div>
              <FooterHeader>Useful Links</FooterHeader>
              <ul className="space-y-3">
                {usefulLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <FooterHeader>Categories</FooterHeader>
              <ul className="space-y-3">
                {categories.length === 0 ? (
                  <li>Loading...</li>
                ) : (
                  categories.map((category) => (
                    <li key={category._id}>
                      <Link
                        href={`/category/${category.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}/${category._id}`}
                        className="transition-colors hover:text-white"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* My Account & App Stores */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div>
                  <FooterHeader>My Account</FooterHeader>
                  <ul className="space-y-3">
                    {myAccountLinks.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.path}
                          className="transition-colors hover:text-white cursor-pointer"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <FooterHeader>Get our app</FooterHeader>
                  <div className="flex flex-col space-y-4">
                    <a href="#" className="block">
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                        alt="Get it on Google Play"
                        width={200} // or the actual width of the image
                        height={60} // or the actual height of the image
                        className="h-12 w-auto transition-opacity hover:opacity-80"
                      />
                    </a>
                    <a href="#" className="block">
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png"
                        alt="Download on the App Store"
                        className="h-12 w-auto transition-opacity hover:opacity-80"
                        width={200} // or the actual width of the image
                        height={60}
                      />
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Us */}
              <div className="mt-12">
                <FooterHeader>Have Queries or Concerns?</FooterHeader>
                <Link
                  href="/contact-us"
                  className="inline-block w-full text-center bg-slate-800 text-white font-bold py-3 px-6 rounded-md hover:bg-slate-700 transition-colors"
                >
                  CONTACT US
                </Link>
              </div>

              {/* Newsletter */}
              <div className="mt-12">
                <FooterHeader>Stay up to date</FooterHeader>
                <NewsletterForm />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-sm text-center md:text-left">
                © {new Date().getFullYear()} NxtDoor Retail. All rights
                reserved.
              </p>
              <div className="flex items-center gap-5">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`transition-colors ${social.hoverColor}`}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-8 text-center text-slate-500">
              <div className="inline-flex items-center gap-2 text-sm mb-4">
                <ShieldCheck className="h-5 w-5 text-green-400" />
                <span>100% Secure Payment</span>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 items-center text-xs">
                {paymentMethods.map((method) => (
                  <span key={method}>{method}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button className="bg-amber-500 text-white p-4 rounded-full shadow-lg hover:bg-amber-600 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-slate-900">
          <MessageCircle className="h-8 w-8" />
        </button>
      </div>
    </>
  );
}
