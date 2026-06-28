import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { DATA_AS_OF, DISCLAIMER } from "./_data/cards";

const title = "PointMax India — Redeem credit card points at maximum value";
const description =
  "Compare how much your Indian credit card reward points are worth across redemption options, and find the way to redeem them at maximum value.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  // Override the storefront's inherited social-share metadata.
  openGraph: {
    title,
    description,
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: [],
  },
};

export default function PointsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-900">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              PointMax<span className="text-amber-400"> India</span>
            </span>
          </Link>
          <span className="hidden text-sm text-slate-400 sm:block">
            Maximum value for your reward points
          </span>
        </div>
      </header>

      {children}

      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 py-8 text-xs leading-relaxed text-slate-500">
          <p className="mb-2 font-medium text-slate-400">
            Disclaimer · data as of {DATA_AS_OF}
          </p>
          <p>{DISCLAIMER}</p>
        </div>
      </footer>
    </div>
  );
}
