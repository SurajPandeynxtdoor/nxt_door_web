/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Children, isValidElement, cloneElement } from "react";

interface CategoryIntroProps {
  description?: React.ReactNode | string;
}

export default function CategoryIntro({ description }: CategoryIntroProps) {
  if (!description) return null;

  const isString = typeof description === "string";

  const styleRichText = (node: React.ReactNode) =>
    Children.map(node, (child) => {
      if (isValidElement(child)) {
        if (typeof child.type === "string" && child.type === "p") {
          const prev = (child.props as any).className || "";
          return cloneElement(child as any, {
            className:
              prev +
              " font-serif text-[1.05rem] sm:text-lg md:text-xl leading-8 md:leading-9 tracking-[0.005em] text-gray-800",
          });
        }
        if (typeof child.type === "string" && child.type === "strong") {
          const prev = (child.props as any).className || "";
          return cloneElement(child as any, {
            className: prev + " text-emerald-700 font-semibold",
          });
        }
        if (typeof child.type === "string" && child.type === "em") {
          const prev = (child.props as any).className || "";
          return cloneElement(child as any, {
            className: prev + " text-cyan-700 not-italic font-medium",
          });
        }
      }
      return child;
    });

  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-r from-cyan-300/60 via-emerald-300/60 to-rose-300/60 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]">
          <div className="relative rounded-3xl bg-white/95">
            <div className="absolute -top-10 -right-12 h-32 w-32 rounded-full bg-cyan-200/35 blur-2xl" />
            <div className="absolute -bottom-12 -left-14 h-36 w-36 rounded-full bg-rose-200/35 blur-2xl" />
            <div className="relative p-6 sm:p-7 md:p-8">
              <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-rose-400 mb-4" />
              {isString ? (
                <p className="font-serif text-[1.05rem] sm:text-lg md:text-xl leading-8 md:leading-9 tracking-[0.005em] text-gray-800 first-letter:text-4xl first-letter:font-extrabold first-letter:text-cyan-700 first-letter:mr-1 first-letter:float-left">
                  {description}
                </p>
              ) : (
                <div className="space-y-4">{styleRichText(description)}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
