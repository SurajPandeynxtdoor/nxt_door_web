import type { LoyaltyProgram, LoyaltyRedemption, Portal } from "./types";
import { getLoyaltyProgram } from "../_data/loyalty";
import { MODE_MULTIPLIER, type RedemptionMode } from "./engine";

/** Premium-cabin uplift only applies to flight and airline-transfer redemptions. */
function multiplierApplies(category: LoyaltyRedemption["category"]): boolean {
  return category === "flight" || category === "transfer";
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export interface LoyaltyOptionValuation {
  option: LoyaltyRedemption;
  valuePerUnit: number;
  value: number;
  portal?: Portal;
}

export interface LoyaltyValuation {
  program: LoyaltyProgram;
  points: number;
  options: LoyaltyOptionValuation[];
  best: LoyaltyOptionValuation;
  bestValue: number;
}

export function valuateLoyalty(
  program: LoyaltyProgram,
  points: number,
  mode: RedemptionMode = "economy"
): LoyaltyValuation | null {
  if (program.options.length === 0) return null;

  const multiplier = MODE_MULTIPLIER[mode];
  const safePoints = Number.isFinite(points) && points > 0 ? points : 0;

  const options: LoyaltyOptionValuation[] = program.options
    .map((option) => {
      const valuePerUnit = multiplierApplies(option.category)
        ? round2(option.valuePerUnit * multiplier)
        : option.valuePerUnit;
      return {
        option,
        valuePerUnit,
        value: round2(safePoints * valuePerUnit),
        portal: option.portal ?? program.portal,
      };
    })
    .sort((a, b) => b.value - a.value);

  const best = options[0];

  return {
    program,
    points: safePoints,
    options,
    best,
    bestValue: best.value,
  };
}

export function compareLoyalty(
  selections: { programId: string; points: number }[],
  mode: RedemptionMode = "economy"
): LoyaltyValuation[] {
  return selections
    .map((s) => {
      const program = getLoyaltyProgram(s.programId);
      return program ? valuateLoyalty(program, s.points, mode) : null;
    })
    .filter((v): v is LoyaltyValuation => v !== null)
    .sort((a, b) => b.bestValue - a.bestValue);
}
