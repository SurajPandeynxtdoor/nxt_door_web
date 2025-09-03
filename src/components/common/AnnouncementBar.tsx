"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  const offers = useMemo(
    () => [
      {
        text: "Free shipping on orders over ₹499",
        href: "/terms-and-conditions",
      },
      {
        text: "10% off your first order — use code WELCOME10",
        href: "/about-us",
      },
      { text: "Cash on Delivery available", href: "/returns" },
      { text: "Bulk deals for retailers — contact us", href: "/contact-us" },
    ],
    []
  );

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-slate-900">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center h-8">
          <div className="marquee w-full">
            <div className="marquee-group">
              {offers.map((o, i) => (
                <OfferItem key={`a-${i}`} text={o.text} href={o.href} />
              ))}
            </div>
            <div className="marquee-group" aria-hidden>
              {offers.map((o, i) => (
                <OfferItem key={`b-${i}`} text={o.text} href={o.href} />
              ))}
            </div>
          </div>
          <button
            type="button"
            aria-label="Close offer bar"
            onClick={() => setVisible(false)}
            className="absolute right-0 h-8 px-3 text-slate-900/70 hover:text-slate-950"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

function OfferItem({ text, href }: { text: string; href: string }) {
  return (
    <span className="inline-flex items-center text-xs sm:text-sm font-semibold tracking-wide text-slate-900">
      <Link href={href} className="opacity-90 hover:opacity-100">
        {text}
      </Link>
      <span className="mx-3 text-slate-900/50">•</span>
    </span>
  );
}
