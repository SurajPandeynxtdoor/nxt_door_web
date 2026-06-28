"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ExternalLink, Plane, Plus, Trophy, X } from "lucide-react";
import { CARDS, getCard } from "../_data/cards";
import {
  compareCards,
  MODE_LABEL,
  type CardValuation,
  type OptionValuation,
  type RedemptionMode,
} from "../_lib/engine";
import {
  CATEGORY_LABEL,
  type CreditCard,
  type RedemptionCategory,
} from "../_lib/types";

const DEFAULT_POINTS = 25000;

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const num = new Intl.NumberFormat("en-IN");

function formatInr(value: number): string {
  return inr.format(Math.round(value));
}

/** Render a transfer ratio (partner units per point) as "1:1", "2:1", "5:2". */
function formatRatio(ratio: number): string {
  for (let pts = 1; pts <= 10; pts++) {
    const units = pts * ratio;
    if (Math.abs(units - Math.round(units)) < 0.001 && Math.round(units) > 0) {
      return `${pts}:${Math.round(units)}`;
    }
  }
  return `1:${ratio.toFixed(2)}`;
}

const CATEGORY_FILTERS: { key: RedemptionCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "travel", label: CATEGORY_LABEL.travel },
  { key: "shopping", label: CATEGORY_LABEL.shopping },
  { key: "cashback", label: CATEGORY_LABEL.cashback },
];

/** Cards grouped by bank, preserving dataset order. */
const CARDS_BY_BANK: { bank: string; cards: CreditCard[] }[] = (() => {
  const map = new Map<string, CreditCard[]>();
  for (const card of CARDS) {
    const list = map.get(card.bank) ?? [];
    list.push(card);
    map.set(card.bank, list);
  }
  return Array.from(map, ([bank, cards]) => ({ bank, cards }));
})();

interface Selection {
  cardId: string;
  points: number;
}

export default function PointsCalculator() {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [category, setCategory] = useState<RedemptionCategory | "all">("all");
  const [mode, setMode] = useState<RedemptionMode>("economy");

  const selectedIds = useMemo(
    () => new Set(selections.map((s) => s.cardId)),
    [selections]
  );

  function toggleCard(cardId: string) {
    setSelections((prev) =>
      prev.some((s) => s.cardId === cardId)
        ? prev.filter((s) => s.cardId !== cardId)
        : [...prev, { cardId, points: DEFAULT_POINTS }]
    );
  }

  function setPoints(cardId: string, points: number) {
    setSelections((prev) =>
      prev.map((s) => (s.cardId === cardId ? { ...s, points } : s))
    );
  }

  function toggleExpanded(cardId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  }

  const results: CardValuation[] = useMemo(() => {
    const valid = selections
      .map((s) => {
        const card = getCard(s.cardId);
        return card ? { card, points: s.points } : null;
      })
      .filter((x): x is { card: CreditCard; points: number } => x !== null);
    return compareCards(valid, {
      category: category === "all" ? undefined : category,
      mode,
    });
  }, [selections, category, mode]);

  const winnerValue = results.length ? results[0].bestValue : 0;
  const showTravelHint =
    selections.length > 0 && (category === "all" || category === "travel");

  return (
    <div className="space-y-10">
      {/* Step 1 — pick cards */}
      <section>
        <StepHeading
          step={1}
          title="Pick the cards you hold"
          subtitle="Select one or more to compare."
        />
        <div className="space-y-4">
          {CARDS_BY_BANK.map(({ bank, cards }) => (
            <div key={bank}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                {bank}
              </p>
              <div className="flex flex-wrap gap-2">
                {cards.map((card) => {
                  const active = selectedIds.has(card.id);
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => toggleCard(card.id)}
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
                      {card.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Step 2 — enter balances */}
      {selections.length > 0 && (
        <section>
          <StepHeading
            step={2}
            title="Enter your point balance"
            subtitle="How many reward points / miles you currently hold on each card."
          />
          <div className="space-y-3">
            {selections.map((s) => {
              const card = getCard(s.cardId);
              if (!card) return null;
              return (
                <div
                  key={s.cardId}
                  className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-100">
                      {card.bank} {card.name}
                    </p>
                    {card.tier && (
                      <p className="text-xs text-slate-500">{card.tier}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1000}
                      value={s.points}
                      onChange={(e) =>
                        setPoints(s.cardId, Number(e.target.value))
                      }
                      className="w-36 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-right text-slate-100 outline-none focus:border-amber-400"
                    />
                    <span className="text-sm text-slate-400">points</span>
                    <button
                      type="button"
                      onClick={() => toggleCard(s.cardId)}
                      aria-label="Remove card"
                      className="rounded-md p-1.5 text-slate-500 hover:bg-white/10 hover:text-slate-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Step 3 — choose redemption category + cabin assumption */}
      {selections.length > 0 && (
        <section>
          <StepHeading
            step={3}
            title="How do you want to redeem?"
            subtitle="Filter by category, and pick the kind of flight redemption for transfers."
          />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Redemption category">
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setCategory(f.key)}
                  className={[
                    "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                    category === f.key
                      ? "border-amber-400 bg-amber-400/15 text-amber-200"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
                  ].join(" ")}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {(category === "all" || category === "travel") && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Mile value:</span>
                <div className="inline-flex overflow-hidden rounded-lg border border-white/10">
                  {(["economy", "premium"] as RedemptionMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      title={MODE_LABEL[m]}
                      className={[
                        "px-3 py-1.5 text-sm transition-colors",
                        mode === m
                          ? "bg-amber-400 text-slate-900"
                          : "bg-white/5 text-slate-300 hover:bg-white/10",
                      ].join(" ")}
                    >
                      {m === "economy" ? "Economy" : "Premium cabin"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Results */}
      {results.length > 0 && (
        <section>
          <StepHeading
            step={4}
            title="Best redemption value"
            subtitle={
              category === "all"
                ? "Ranked by the maximum INR value you can unlock from each card."
                : `Best ${CATEGORY_LABEL[category].toLowerCase()} value for each card.`
            }
          />
          <div className="space-y-3">
            {results.map((r, index) => {
              const isWinner = index === 0 && winnerValue > 0;
              const isExpanded = expanded.has(r.card.id);
              return (
                <div
                  key={r.card.id}
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
                          {r.card.bank} {r.card.name}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        {num.format(r.points)} {r.program.currency} →{" "}
                        <span className="text-slate-200">
                          {r.best.option.label}
                        </span>
                        {r.best.bestPartner && (
                          <span className="text-amber-300">
                            {" "}
                            · {r.best.bestPartner.partner.name}
                          </span>
                        )}{" "}
                        <span className="text-slate-500">
                          (₹{r.best.valuePerPoint.toFixed(2)}/pt)
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
                        onClick={() => toggleExpanded(r.card.id)}
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

                  {isExpanded && (
                    <div className="space-y-3 border-t border-white/10 bg-slate-950/40 px-4 py-3">
                      {r.options.map((o, i) => (
                        <OptionRow
                          key={o.option.id}
                          valuation={o}
                          isBest={i === 0}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {showTravelHint && (
            <p className="mt-4 flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
              <Plane className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
              Airline transfers shine for premium-cabin flights. Switch the mile
              value to “Premium cabin” to see how much more your points can be
              worth — and always check award availability before transferring,
              as transfers are usually irreversible.
            </p>
          )}
        </section>
      )}

      {selections.length > 0 && results.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-center text-sm text-slate-400">
          None of the selected cards have {CATEGORY_LABEL[category as RedemptionCategory]?.toLowerCase()}{" "}
          redemptions in this dataset. Try another category.
        </p>
      )}

      {selections.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-center text-sm text-slate-400">
          Select at least one card above to see how much your points are worth.
        </p>
      )}
    </div>
  );
}

function OptionRow({
  valuation,
  isBest,
}: {
  valuation: OptionValuation;
  isBest: boolean;
}) {
  const { option, valuePerPoint, value, partners, portal } = valuation;
  return (
    <div>
      <div className="flex items-start justify-between gap-4 text-sm">
        <div className="min-w-0">
          <p className={isBest ? "font-medium text-slate-100" : "text-slate-300"}>
            {option.label}{" "}
            <span className="text-slate-500">
              (₹{valuePerPoint.toFixed(2)}/pt)
            </span>
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
        <span className="shrink-0 tabular-nums text-slate-200">
          {formatInr(value)}
        </span>
      </div>

      {partners.length > 0 && (
        <ul className="mt-2 space-y-1.5 border-l border-white/10 pl-3">
          {partners.map((p, i) => (
            <li
              key={p.partner.id}
              className="flex items-center justify-between gap-3 text-xs"
            >
              <span
                className={
                  i === 0 ? "font-medium text-amber-200" : "text-slate-400"
                }
              >
                {i === 0 && "★ "}
                {p.partner.name}{" "}
                <span className="text-slate-600">
                  ({formatRatio(p.partner.ratio)} ·{" "}
                  {num.format(Math.round(p.units))} {p.partner.kind === "hotel" ? "pts" : "miles"})
                </span>
              </span>
              <span className="shrink-0 tabular-nums text-slate-300">
                {formatInr(p.value)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RedeemLink({
  portal,
  prominent = false,
}: {
  portal: { name: string; url: string };
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

function StepHeading({
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
