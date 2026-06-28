"use client";

import { ExternalLink } from "lucide-react";
import type { Portal } from "../_lib/types";

export const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
export const num = new Intl.NumberFormat("en-IN");

export function formatInr(value: number): string {
  return inr.format(Math.round(value));
}

export function RedeemLink({
  portal,
  prominent = false,
}: {
  portal: Portal;
  prominent?: boolean;
}) {
  return (
    <a
      href={portal.url}
      target="_blank"
      rel="noopener noreferrer"
      className={
        prominent
          ? "inline-flex items-center gap-1 rounded-md bg-amber-400/15 px-2 py-1 text-xs font-medium text-amber-200 hover:bg-amber-400/25"
          : "inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-200"
      }
    >
      Redeem on {portal.name}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

export function StepHeading({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900">
          {step}
        </span>
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      </div>
      <p className="mt-1 pl-8 text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}

/** Economy / Premium-cabin mile-value toggle, shared by both calculators. */
export function ModeToggle<T extends string>({
  mode,
  setMode,
  options,
}: {
  mode: T;
  setMode: (m: T) => void;
  options: { value: T; label: string; title?: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500">Mile value:</span>
      <div className="inline-flex overflow-hidden rounded-lg border border-white/10">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setMode(o.value)}
            title={o.title}
            className={[
              "px-3 py-1.5 text-sm transition-colors",
              mode === o.value
                ? "bg-amber-400 text-slate-900"
                : "bg-white/5 text-slate-300 hover:bg-white/10",
            ].join(" ")}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
