import type { CreditCard, LoyaltyProgram } from "./types";
import { getCard, getProgram } from "../_data/cards";
import { getLoyaltyProgram } from "../_data/loyalty";
import { valuateLoyalty, type LoyaltyOptionValuation } from "./loyalty";
import type { RedemptionMode } from "./engine";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Best transfer ratio from a card into a given loyalty program, if any. */
export function cardTransferToLoyalty(
  card: CreditCard,
  loyaltyId: string
): { ratio: number; partnerName: string } | null {
  const program = getProgram(card.programId);
  if (!program) return null;
  let best: { ratio: number; partnerName: string } | null = null;
  for (const option of program.options) {
    for (const partner of option.partners ?? []) {
      if (partner.loyaltyId === loyaltyId) {
        if (!best || partner.ratio > best.ratio) {
          best = { ratio: partner.ratio, partnerName: partner.name };
        }
      }
    }
  }
  return best;
}

export interface CardContribution {
  card: CreditCard;
  partnerName: string;
  ratio: number;
  cardPoints: number;
  /** Miles/points added after transfer: cardPoints * ratio. */
  units: number;
}

export interface PooledValuation {
  program: LoyaltyProgram;
  existing: number;
  contributions: CardContribution[];
  /** Total units gained from card transfers. */
  fromCards: number;
  /** existing + fromCards. */
  pooled: number;
  /** Best redemption of the pooled balance. */
  best: LoyaltyOptionValuation;
  pooledValue: number;
  /** Best value of the existing balance alone (for the uplift figure). */
  existingValue: number;
  /** pooledValue − existingValue: extra rupees unlocked by topping up. */
  uplift: number;
}

/**
 * For each loyalty program the user holds, pool the existing balance with what
 * the selected cards could transfer in, and value the combined balance.
 */
export function poolAndRedeem(
  cardSelections: { cardId: string; points: number }[],
  loyaltySelections: { programId: string; points: number }[],
  mode: RedemptionMode = "economy"
): PooledValuation[] {
  const result: PooledValuation[] = [];

  for (const ls of loyaltySelections) {
    const program = getLoyaltyProgram(ls.programId);
    if (!program) continue;

    const existing = Number.isFinite(ls.points) && ls.points > 0 ? ls.points : 0;

    const contributions: CardContribution[] = [];
    for (const cs of cardSelections) {
      const card = getCard(cs.cardId);
      if (!card) continue;
      const link = cardTransferToLoyalty(card, program.id);
      if (!link) continue;
      const cardPoints =
        Number.isFinite(cs.points) && cs.points > 0 ? cs.points : 0;
      contributions.push({
        card,
        partnerName: link.partnerName,
        ratio: link.ratio,
        cardPoints,
        units: round2(cardPoints * link.ratio),
      });
    }

    const fromCards = round2(
      contributions.reduce((sum, c) => sum + c.units, 0)
    );
    const pooled = round2(existing + fromCards);

    const pooledVal = valuateLoyalty(program, pooled, mode);
    if (!pooledVal) continue;
    const existingVal = valuateLoyalty(program, existing, mode);

    const existingValue = existingVal?.bestValue ?? 0;
    result.push({
      program,
      existing,
      contributions,
      fromCards,
      pooled,
      best: pooledVal.best,
      pooledValue: pooledVal.bestValue,
      existingValue,
      uplift: round2(pooledVal.bestValue - existingValue),
    });
  }

  return result.sort((a, b) => b.pooledValue - a.pooledValue);
}
