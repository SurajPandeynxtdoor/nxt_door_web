"use client";

import { ExternalLink, Plus, X } from "lucide-react";
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

/** A title + numeric balance input row used across the calculators. */
export function BalanceRow({
  title,
  subtitle,
  unit,
  value,
  onChange,
  onRemove,
}: {
  title: string;
  subtitle?: string;
  unit: string;
  value: number;
  onChange: (v: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-slate-100">{title}</p>
        {subtitle && (
          <p className="text-xs capitalize text-slate-500">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={1000}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-36 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-right text-slate-100 outline-none focus:border-amber-400"
        />
        <span className="text-sm text-slate-400">{unit}</span>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="rounded-md p-1.5 text-slate-500 hover:bg-white/10 hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Grouped chip selector used by the card / program pickers. */
export function ChipPicker({
  groups,
  selected,
  onToggle,
}: {
  groups: { label: string; items: { id: string; name: string }[] }[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            {group.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => {
              const active = selected.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onToggle(item.id)}
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "border-amber-400 bg-amber-400/15 text-amber-200"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:bg-white/10",
                  ].join(" ")}
                >
                  {active ? (
                    <X className="h-3.5 w-3.5" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
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
