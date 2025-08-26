import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/providers/ReduxProviders";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Header from "@/components/common/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NxtDoor Retail",
  description: "Your trusted FMCG retail partner",
  keywords: [
    // Brand and general terms
    "nxt door retail",
    "nxt door retail online",
    "only truth brands products",
    "online grocery shopping",
    "FMCG products online",
    "healthy snacks online",
    "organic food delivery",
    "wholesale grocery",

    // Makhana products
    "phool makhana",
    "phool makhana price",
    "phool makhana online",
    "phool makhana wholesale",
    "phool makhana recipe",
    "phool makhana brands in india",
    "flavoured makhana brands in india",
    "flavoured makhana",
    "flavoured makhana price",
    "flavoured makhana online",
    "flavoured makhana wholesale",
    "guiltfree snacks",
    "guiltfree makhana",
    "guiltfree makhana price",
    "guiltfree makhana online",
    "guiltfree makhana wholesale",
    "roasted makhana price",
    "roasted makhana benefits",
    "roasted makhana",
    "tangy tomato makhana",
    "roasted makhana tangy tomato",
    "makhana cheese and herbs",
    "makhana cheese and herbs price",
    "makhana cheese and herbs online",
    "makhana cheese and herbs wholesale",
    "makhana cheese and herbs recipe",
    "makhana cheese and herbs brands in india",
    "roasted makhana mint masti",
    "roasted makhana mint masti price",
    "roasted makhana mint masti online",
    "roasted makhana mint masti wholesale",
    "roasted makhana mint masti recipe",
    "roasted makhana mint masti brands in india",
    "roasted makhana magic masala",
    "roasted makhana magic masala price",
    "roasted makhana magic masala online",
    "roasted makhana magic masala wholesale",
    "roasted makhana magic masala recipe",
    "roasted makhana magic masala brands in india",
    "roasted makhana himalayan salt & black pepper",
    "roasted makhana himalayan salt & black pepper price",
    "roasted makhana himalayan salt & black pepper online",
    "roasted makhana himalayan salt & black pepper wholesale",
    "roasted makhana himalayan salt & black pepper recipe",
    "roasted makhana himalayan salt & black pepper brands in india",
    "salty makhana",
    "salty makhana price",
    "salty makhana online",
    "salty makhana wholesale",

    // Nuts and dry fruits
    "cashew price",
    "kaju",
    "kaju price",
    "1 kg kaju price in india",
    "kaju price in india",
    "1 kg cashew price in india",
    "cashew price in india",
    "almond price",
    "badam price",
    "1 kg badam price in india",
    "badam price in india",
    "1 kg almond price in india",
    "almond price in india",

    // Sattu products
    "sattu powder",
    "chana sattu",
    "chana sattu price",
    "chana sattu online",
    "chana sattu wholesale",
    "chana sattu recipe",
    "lemon jeera sattu powder",
    "lemon jeera sattu powder price",
    "lemon jeera sattu powder online",
    "lemon jeera sattu powder wholesale",
    "lemon jeera sattu powder recipe",
    "lemon jeera sattu powder brands in india",
  ],
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  authors: [{ name: "NxtDoor Retail" }],
  creator: "NxtDoor Retail",
  publisher: "NxtDoor Retail",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
