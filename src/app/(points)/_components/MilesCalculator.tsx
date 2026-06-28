"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Plus, Trophy, X } from "lucide-react";
import { LOYALTY_PROGRAMS, getLoyaltyProgram } from "../_data/loyalty";
import {
  compareLoyalty,
  type LoyaltyOptionValuation,
  type LoyaltyValuation,
} from "../_lib/loyalty";
import { type RedemptionMode } from "../_lib/engine";
import {
  LOYALTY_CATEGORY_LABEL,
  type LoyaltyProgram,
} from "../_lib/types";
import { formatInr, ModeToggle, num, RedeemLink, StepHeading } from "./shared";
import FaresInPoints from "./FaresInPoints";

const DEFAULT_MILES = 30000;

const KIND_LABEL: Record<LoyaltyProgram["kind"], string> = {
  airline: "Airlines",
  hotel: "Hotels",
};

/** Programs grouped by kind (airlines first, then hotels). */
const PROGRAMS_BY_KIND: { kind: LoyaltyProgram["kind"]; programs: LoyaltyProgram[] }[] =
  (["airline", "hotel"] as const).map((kind) => ({
    kind,
    programs: LOYALTY_PROGRAMS.filter((p) => p.kind === kind),
  }));

interface Selection {
  programId: string;
  points: number;
}

export default function MilesCalculator() {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<RedemptionMode>("economy");

  const selectedIds = useMemo(
    () => new Set(selections.map((s) => s.programId)),
    [selections]
  );

  function toggleProgram(programId: string) {
    setSelections((prev) =>
      prev.some((s) => s.programId === programId)
        ? prev.filter((s) => s.programId !== programId)
        : [...prev, { programId, points: DEFAULT_MILES }]
    );
  }

  function setPoints(programId: string, points: number) {
    setSelections((prev) =>
      prev.map((s) => (s.programId === programId ? { ...s, points } : s))
    );
  }

  function toggleExpanded(programId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(programId)) next.delete(programId);
      else next.add(programId);
      return next;
    });
  }

  const results: LoyaltyValuation[] = useMemo(
    () => compareLoyalty(selections, mode),
    [selections, mode]
  );

  const winnerValue = results.length ? results[0].bestValue : 0;

  return (
    <div className="space-y-10">
      {/* Step 1 — pick programs */}
      <section>
        <StepHeading
          step={1}
          title="Pick the programs you hold miles in"
          subtitle="Airline miles or hotel points you already have."
        />
        <div className="space-y-4">
          {PROGRAMS_BY_KIND.map(({ kind, programs }) => (
            <div key={kind}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                {KIND_LABEL[kind]}
              </p>
              <div className="flex flex-wrap gap-2">
                {programs.map((program) => {
                  const active = selectedIds.has(program.id);
                  return (
                    <button
                      key={program.id}
                      type="button"
                      onClick={() => toggleProgram(program.id)}
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
                      {program.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Step 2 — balances + mode */}
      {selections.length > 0 && (
        <section>
          <StepHeading
            step={2}
            title="Enter your balance"
            subtitle="How many miles / points you hold in each program."
          />
          <div className="space-y-3">
            {selections.map((s) => {
              const program = getLoyaltyProgram(s.programId);
              if (!program) return null;
              return (
                <div
                  key={s.programId}
                  className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-100">{program.name}</p>
                    <p className="text-xs text-slate-500 capitalize">
                      {program.kind}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1000}
                      value={s.points}
                      onChange={(e) =>
                        setPoints(s.programId, Number(e.target.value))
                      }
                      className="w-36 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-right text-slate-100 outline-none focus:border-amber-400"
                    />
                    <span className="text-sm text-slate-400">{program.unit}</span>
                    <button
                      type="button"
                      onClick={() => toggleProgram(s.programId)}
                      aria-label="Remove program"
                      className="rounded-md p-1.5 text-slate-500 hover:bg-white/10 hover:text-slate-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <ModeToggle
              mode={mode}
              setMode={setMode}
              options={[
                { value: "economy", label: "Economy", title: "Baseline economy redemptions" },
                { value: "premium", label: "Premium cabin", title: "Premium-cabin / sweet-spot redemptions" },
              ]}
            />
          </div>
        </section>
      )}

      {/* Results */}
      {results.length > 0 && (
        <section>
          <StepHeading
            step={3}
            title="Best redemption value"
            subtitle="The highest-value way to use each program's miles or points."
          />
          <div className="space-y-3">
            {results.map((r, index) => {
              const isWinner = index === 0 && winnerValue > 0;
              const isExpanded = expanded.has(r.program.id);
              return (
                <div
                  key={r.program.id}
                  className={[
                    "overflow-hidden rounded-xl border transition-colors",
                    isWinner
                      ? "border-amber-400/60 bg-amber-400/10"
                      : "border-white/10 bg-white/5",
                  ].join(" ")}
                >
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {isWinner && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-slate-900">
                            <Trophy className="h-3 w-3" /> Best value
                          </span>
                        )}
                        <p className="truncate font-semibold text-slate-100">
                          {r.program.name}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        {num.format(r.points)} {r.program.unit} →{" "}
                        <span className="text-slate-200">{r.best.option.label}</span>{" "}
                        <span className="text-slate-500">
                          (₹{r.best.valuePerUnit.toFixed(2)}/{r.program.unit === "miles" ? "mile" : "pt"})
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={[
                          "text-2xl font-bold",
                          isWinner ? "text-amber-300" : "text-slate-100",
                        ].join(" ")}
                      >
                        {formatInr(r.bestValue)}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleExpanded(r.program.id)}
                        className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                      >
                        {isExpanded ? "Hide" : "Show"} all options
                        <ChevronDown
                          className={[
                            "h-3.5 w-3.5 transition-transform",
                            isExpanded ? "rotate-180" : "",
                          ].join(" ")}
                        />
                      </button>
                      {r.best.portal && (
                        <div className="mt-2 sm:flex sm:justify-end">
                          <RedeemLink portal={r.best.portal} prominent />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-4 pb-3">
                    <FaresInPoints
                      programId={r.program.id}
                      available={r.points}
                      unit={r.program.unit}
                    />
                  </div>

                  {isExpanded && (
                    <div className="space-y-3 border-t border-white/10 bg-slate-950/40 px-4 py-3">
                      {r.options.map((o, i) => (
                        <LoyaltyOptionRow key={o.option.id} valuation={o} isBest={i === 0} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {selections.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-center text-sm text-slate-400">
          Already have airline miles or hotel points? Select a program above to
          see the best way to use them.
        </p>
      )}
    </div>
  );
}

function LoyaltyOptionRow({
  valuation,
  isBest,
}: {
  valuation: LoyaltyOptionValuation;
  isBest: boolean;
}) {
  const { option, valuePerUnit, value, portal } = valuation;
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <div className="min-w-0">
        <p className={isBest ? "font-medium text-slate-100" : "text-slate-300"}>
          {option.label}{" "}
          <span className="rounded bg-white/10 px-1 text-[10px] uppercase tracking-wide text-slate-400">
            {LOYALTY_CATEGORY_LABEL[option.category]}
          </span>{" "}
          <span className="text-slate-500">(₹{valuePerUnit.toFixed(2)})</span>
        </p>
        {option.notes && (
          <p className="mt-0.5 text-xs text-slate-500">{option.notes}</p>
        )}
        {portal && (
          <div className="mt-1">
            <RedeemLink portal={portal} />
          </div>
        )}
      </div>
      <span className="shrink-0 tabular-nums text-slate-200">{formatInr(value)}</span>
    </div>
  );
}
