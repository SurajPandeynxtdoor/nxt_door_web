"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Sparkles, Trophy } from "lucide-react";
import { CARDS, getCard } from "../_data/cards";
import { LOYALTY_PROGRAMS, getLoyaltyProgram } from "../_data/loyalty";
import { poolAndRedeem, type PooledValuation } from "../_lib/combined";
import { type RedemptionMode } from "../_lib/engine";
import {
  BalanceRow,
  ChipPicker,
  formatInr,
  ModeToggle,
  num,
  RedeemLink,
  StepHeading,
} from "./shared";

const DEFAULT_MILES = 30000;
const DEFAULT_POINTS = 25000;

const CARD_GROUPS = (() => {
  const map = new Map<string, { id: string; name: string }[]>();
  for (const c of CARDS) {
    const list = map.get(c.bank) ?? [];
    list.push({ id: c.id, name: c.name });
    map.set(c.bank, list);
  }
  return Array.from(map, ([label, items]) => ({ label, items }));
})();

const LOYALTY_GROUPS = (["airline", "hotel"] as const).map((kind) => ({
  label: kind === "airline" ? "Airlines" : "Hotels",
  items: LOYALTY_PROGRAMS.filter((p) => p.kind === kind).map((p) => ({
    id: p.id,
    name: p.name,
  })),
}));

interface Sel {
  id: string;
  points: number;
}

export default function CombinedCalculator() {
  const [loyalty, setLoyalty] = useState<Sel[]>([]);
  const [cards, setCards] = useState<Sel[]>([]);
  const [mode, setMode] = useState<RedemptionMode>("economy");

  const loyaltyIds = useMemo(() => new Set(loyalty.map((s) => s.id)), [loyalty]);
  const cardIds = useMemo(() => new Set(cards.map((s) => s.id)), [cards]);

  function toggle(
    setter: React.Dispatch<React.SetStateAction<Sel[]>>,
    fallback: number
  ) {
    return (id: string) =>
      setter((prev) =>
        prev.some((s) => s.id === id)
          ? prev.filter((s) => s.id !== id)
          : [...prev, { id, points: fallback }]
      );
  }

  function setPoints(
    setter: React.Dispatch<React.SetStateAction<Sel[]>>
  ) {
    return (id: string, points: number) =>
      setter((prev) => prev.map((s) => (s.id === id ? { ...s, points } : s)));
  }

  const toggleLoyalty = toggle(setLoyalty, DEFAULT_MILES);
  const toggleCard = toggle(setCards, DEFAULT_POINTS);

  const results: PooledValuation[] = useMemo(
    () =>
      poolAndRedeem(
        cards.map((c) => ({ cardId: c.id, points: c.points })),
        loyalty.map((l) => ({ programId: l.id, points: l.points })),
        mode
      ),
    [cards, loyalty, mode]
  );

  const winnerValue = results.length ? results[0].pooledValue : 0;
  const anyContribution = results.some((r) => r.contributions.length > 0);

  return (
    <div className="space-y-10">
      <section>
        <StepHeading
          step={1}
          title="Pick the loyalty programs you hold"
          subtitle="Airline miles or hotel points you already have a balance in."
        />
        <ChipPicker
          groups={LOYALTY_GROUPS}
          selected={loyaltyIds}
          onToggle={toggleLoyalty}
        />
        {loyalty.length > 0 && (
          <div className="mt-4 space-y-3">
            {loyalty.map((s) => {
              const p = getLoyaltyProgram(s.id);
              if (!p) return null;
              return (
                <BalanceRow
                  key={s.id}
                  title={p.name}
                  subtitle={p.kind}
                  unit={p.unit}
                  value={s.points}
                  onChange={(v) => setPoints(setLoyalty)(s.id, v)}
                  onRemove={() => toggleLoyalty(s.id)}
                />
              );
            })}
          </div>
        )}
      </section>

      <section>
        <StepHeading
          step={2}
          title="Add the cards that can top them up"
          subtitle="Cards whose points transfer into your programs will be pooled in."
        />
        <ChipPicker groups={CARD_GROUPS} selected={cardIds} onToggle={toggleCard} />
        {cards.length > 0 && (
          <div className="mt-4 space-y-3">
            {cards.map((s) => {
              const c = getCard(s.id);
              if (!c) return null;
              return (
                <BalanceRow
                  key={s.id}
                  title={`${c.bank} ${c.name}`}
                  subtitle={c.tier}
                  unit="points"
                  value={s.points}
                  onChange={(v) => setPoints(setCards)(s.id, v)}
                  onRemove={() => toggleCard(s.id)}
                />
              );
            })}
          </div>
        )}
        <div className="mt-4">
          <ModeToggle
            mode={mode}
            setMode={setMode}
            options={[
              { value: "economy", label: "Economy" },
              { value: "premium", label: "Premium cabin" },
            ]}
          />
        </div>
      </section>

      {results.length > 0 && (
        <section>
          <StepHeading
            step={3}
            title="Pool & redeem"
            subtitle="Your existing balance plus card transfers, valued at the best redemption."
          />
          <div className="space-y-3">
            {results.map((r, index) => (
              <PooledCard
                key={r.program.id}
                valuation={r}
                isWinner={index === 0 && winnerValue > 0}
              />
            ))}
          </div>

          {!anyContribution && (
            <p className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
              None of the selected cards transfer into these programs. Add a card
              like HDFC Infinia, Axis Atlas or an Amex to see pooled value.
            </p>
          )}
          <p className="mt-3 text-xs text-slate-500">
            Note: each card&apos;s points can only be sent to one program — if a
            card feeds several of your programs above, treat those as
            alternatives, not all at once.
          </p>
        </section>
      )}

      {loyalty.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-center text-sm text-slate-400">
          Hold miles in a program your card also transfers to? Select the program
          and the card to see the combined value.
        </p>
      )}
    </div>
  );
}

function PooledCard({
  valuation: r,
  isWinner,
}: {
  valuation: PooledValuation;
  isWinner: boolean;
}) {
  const hasContrib = r.contributions.length > 0;
  return (
    <div
      className={[
        "rounded-xl border p-4 transition-colors",
        isWinner
          ? "border-amber-400/60 bg-amber-400/10"
          : "border-white/10 bg-white/5",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
            Redeem for <span className="text-slate-200">{r.best.option.label}</span>{" "}
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
            {formatInr(r.pooledValue)}
          </p>
          {hasContrib && r.uplift > 0 && (
            <p className="text-xs text-emerald-300">
              +{formatInr(r.uplift)} vs miles alone
            </p>
          )}
        </div>
      </div>

      {/* Pool breakdown */}
      <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3 text-xs">
        <div className="flex items-center justify-between gap-3 text-slate-400">
          <span>
            Existing balance
            <span className="ml-1 text-slate-600">(you hold)</span>
          </span>
          <span className="tabular-nums text-slate-300">
            {num.format(Math.round(r.existing))} {r.program.unit}
          </span>
        </div>
        {r.contributions.map((c) => (
          <div
            key={c.card.id}
            className="flex items-center justify-between gap-3 text-slate-400"
          >
            <span className="inline-flex flex-wrap items-center gap-1">
              {c.card.bank} {c.card.name}
              <span className="text-slate-600">
                ({num.format(Math.round(c.cardPoints))} pts{" "}
                <ArrowRight className="inline h-3 w-3" /> {c.pathLabel})
              </span>
              {c.chained && (
                <span className="rounded bg-sky-400/15 px-1 text-[10px] font-medium text-sky-300">
                  via chain
                </span>
              )}
            </span>
            <span className="tabular-nums text-emerald-300">
              +{num.format(Math.round(c.units))} {r.program.unit}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-1.5 font-medium text-slate-200">
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-300" /> Pooled total
          </span>
          <span className="tabular-nums">
            {num.format(Math.round(r.pooled))} {r.program.unit}
          </span>
        </div>
      </div>

      {r.best.portal && (
        <div className="mt-3">
          <RedeemLink portal={r.best.portal} prominent />
        </div>
      )}
    </div>
  );
}
