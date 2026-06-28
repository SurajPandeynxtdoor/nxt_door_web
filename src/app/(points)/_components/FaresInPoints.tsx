"use client";

import { useState } from "react";
import { Check, ChevronDown, Ticket } from "lucide-react";
import { getAwards } from "../_data/awards";
import { num } from "./shared";

/**
 * "Check fares in points" — shows representative award costs for a program and,
 * when an available balance is given, whether it covers each fare.
 */
export default function FaresInPoints({
  programId,
  available,
  unit,
}: {
  programId: string | undefined;
  available?: number;
  unit: string;
}) {
  const [open, setOpen] = useState(false);
  const samples = getAwards(programId);
  if (!samples || samples.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-200"
      >
        <Ticket className="h-3.5 w-3.5" />
        Check fares in points
        <ChevronDown
          className={["h-3.5 w-3.5 transition-transform", open ? "rotate-180" : ""].join(" ")}
        />
      </button>

      {open && (
        <ul className="mt-2 space-y-1.5 border-l border-white/10 pl-3 text-xs">
          {samples.map((s) => {
            const known = typeof available === "number" && available > 0;
            const covers = known ? Math.floor(available! / s.cost) : 0;
            const short = known ? Math.max(0, s.cost - available!) : 0;
            return (
              <li key={s.id} className="flex items-start justify-between gap-3">
                <span className="text-slate-400">
                  {s.label}{" "}
                  <span className="text-slate-600">({s.tag})</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="tabular-nums text-slate-300">
                    {num.format(s.cost)} {unit}
                  </span>
                  {known &&
                    (covers >= 1 ? (
                      <span className="ml-2 inline-flex items-center gap-0.5 text-emerald-300">
                        <Check className="h-3 w-3" />
                        {covers > 1 ? `covers ${covers}` : "covered"}
                      </span>
                    ) : (
                      <span className="ml-2 text-slate-500">
                        need {num.format(short)} more
                      </span>
                    ))}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
