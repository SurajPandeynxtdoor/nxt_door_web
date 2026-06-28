"use client";

import { useMemo, useState } from "react";
import { Trophy } from "lucide-react";
import { CARDS, getCard } from "../_data/cards";
import {
  compareCards,
  type CardValuation,
  type OptionValuation,
  type RedemptionMode,
} from "../_lib/engine";
import {
  BalanceRow,
  ChipPicker,
  formatInr,
  ModeToggle,
  num,
  RedeemLink,
  StepHeading,
} from "./shared";

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

interface Sel {
  id: string;
  points: number;
}

/** Full path text for an option, including transfer partner + onward hop. */
function pathLabel(o: OptionValuation): string {
  if (!o.bestPartner) return o.option.label;
  const via = o.bestPartner.bestVia
    ? ` → ${o.bestPartner.bestVia.transfer.name}`
    : "";
  return `${o.option.label} · ${o.bestPartner.partner.name}${via}`;
}

export default function BestHomeCalculator() {
  const [cards, setCards] = useState<Sel[]>([]);
  const [mode, setMode] = useState<RedemptionMode>("economy");

  const cardIds = useMemo(() => new Set(cards.map((s) => s.id)), [cards]);

  function toggleCard(id: string) {
    setCards((prev) =>
      prev.some((s) => s.id === id)
        ? prev.filter((s) => s.id !== id)
        : [...prev, { id, points: DEFAULT_POINTS }]
    );
  }
  function setPoints(id: string, points: number) {
    setCards((prev) => prev.map((s) => (s.id === id ? { ...s, points } : s)));
  }

  // No category filter — the optimizer always considers every redemption path.
  const results: CardValuation[] = useMemo(
    () =>
      compareCards(
        cards.map((c) => ({ card: getCard(c.id)!, points: c.points })).filter((x) => x.card),
        { mode }
      ),
    [cards, mode]
  );

  return (
    <div className="space-y-10">
      <section>
        <StepHeading
          step={1}
          title="Pick your cards"
          subtitle="We'll find the single best home for each card's points."
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
                  onChange={(v) => setPoints(s.id, v)}
                  onRemove={() => toggleCard(s.id)}
                />
              );
            })}
            <ModeToggle
              mode={mode}
              setMode={setMode}
              options={[
                { value: "economy", label: "Economy" },
                { value: "premium", label: "Premium cabin" },
              ]}
            />
          </div>
        )}
      </section>

      {results.length > 0 && (
        <section>
          <StepHeading
            step={2}
            title="Best home for each card"
            subtitle="The single highest-value destination, compared with the next best."
          />
          <div className="space-y-3">
            {results.map((r) => {
              const best = r.best;
              const runnerUp = r.options[1];
              const delta = runnerUp ? best.value - runnerUp.value : 0;
              return (
                <div
                  key={r.card.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-100">
                        {r.card.bank} {r.card.name}
                      </p>
                      <p className="mt-1 inline-flex flex-wrap items-center gap-1 text-sm">
                        <Trophy className="h-3.5 w-3.5 shrink-0 text-amber-300" />
                        <span className="text-amber-200">{pathLabel(best)}</span>
                        <span className="text-slate-500">
                          (₹{best.valuePerPoint.toFixed(2)}/pt)
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {num.format(r.points)} {r.program.currency}
                        {runnerUp && (
                          <>
                            {" · "}next best: {runnerUp.option.label} (
                            {formatInr(runnerUp.value)})
                            {delta > 0 && (
                              <span className="text-emerald-300">
                                {" "}
                                — {formatInr(delta)} more
                              </span>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-300">
                        {formatInr(best.value)}
                      </p>
                      {best.portal && (
                        <div className="mt-2 sm:flex sm:justify-end">
                          <RedeemLink portal={best.portal} prominent />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {cards.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-center text-sm text-slate-400">
          Select your cards to see the single best way to use the points on each.
        </p>
      )}
    </div>
  );
}
