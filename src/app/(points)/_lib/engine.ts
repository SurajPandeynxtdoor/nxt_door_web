import type {
  CreditCard,
  Portal,
  RedemptionCategory,
  RedemptionOption,
  RewardProgram,
  TransferPartner,
} from "./types";
import { TYPE_CATEGORY } from "./types";
import { getProgram } from "../_data/cards";

/** Multiplier applied to transfer (mile) values to model cabin/redemption quality. */
export type RedemptionMode = "economy" | "premium";

export const MODE_MULTIPLIER: Record<RedemptionMode, number> = {
  economy: 1,
  premium: 2.2,
};

export const MODE_LABEL: Record<RedemptionMode, string> = {
  economy: "Economy redemptions",
  premium: "Premium-cabin redemptions",
};

export interface PartnerValuation {
  partner: TransferPartner;
  /** Partner miles/points received: points * ratio. */
  units: number;
  /** INR value: units * valuePerUnit * mode multiplier. */
  value: number;
}

export interface OptionValuation {
  option: RedemptionOption;
  /** Effective INR value per card point used for this valuation. */
  valuePerPoint: number;
  /** Total INR value for the entered point balance. */
  value: number;
  /** For transfer options: partner conversions, best first. */
  partners: PartnerValuation[];
  /** The highest-value partner, if any. */
  bestPartner?: PartnerValuation;
  /** Where to redeem this option (option override, else program default). */
  portal?: Portal;
}

export interface CardValuation {
  card: CreditCard;
  program: RewardProgram;
  points: number;
  /** Redemption options (optionally filtered to a category), best value first. */
  options: OptionValuation[];
  /** The highest-value option. */
  best: OptionValuation;
  /** Total INR value at the best option. */
  bestValue: number;
}

/** Round to paise to avoid floating-point noise in the UI. */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function isTransfer(option: RedemptionOption): boolean {
  return (
    option.type === "transfer_airline" || option.type === "transfer_hotel"
  );
}

function valuatePartners(
  option: RedemptionOption,
  points: number,
  multiplier: number
): PartnerValuation[] {
  if (!option.partners?.length) return [];
  return option.partners
    .map((partner) => {
      const units = round2(points * partner.ratio);
      return {
        partner,
        units,
        value: round2(units * partner.valuePerUnit * multiplier),
      };
    })
    .sort((a, b) => b.value - a.value);
}

function valuateOption(
  option: RedemptionOption,
  points: number,
  multiplier: number,
  programPortal?: Portal
): OptionValuation {
  const partners = valuatePartners(option, points, multiplier);
  const portal = option.portal ?? programPortal;

  // For transfer options the value is driven by the best partner (with the
  // cabin multiplier applied). Other options use their fixed per-point value.
  if (isTransfer(option) && partners.length > 0) {
    const bestPartner = partners[0];
    const valuePerPoint = points > 0 ? round2(bestPartner.value / points) : 0;
    return {
      option,
      valuePerPoint,
      value: bestPartner.value,
      partners,
      bestPartner,
      portal,
    };
  }

  return {
    option,
    valuePerPoint: option.valuePerPoint,
    value: round2(points * option.valuePerPoint),
    partners,
    portal,
  };
}

/**
 * Valuate a single card's point balance across its redemption options,
 * optionally restricted to one category, returning options sorted best-first.
 */
export function valuateCard(
  card: CreditCard,
  points: number,
  opts: { category?: RedemptionCategory; mode?: RedemptionMode } = {}
): CardValuation | null {
  const program = getProgram(card.programId);
  if (!program) return null;

  const multiplier = MODE_MULTIPLIER[opts.mode ?? "economy"];
  const safePoints = Number.isFinite(points) && points > 0 ? points : 0;

  const relevant = opts.category
    ? program.options.filter((o) => TYPE_CATEGORY[o.type] === opts.category)
    : program.options;

  if (relevant.length === 0) return null;

  const options = relevant
    .map((option) => valuateOption(option, safePoints, multiplier, program.portal))
    .sort((a, b) => b.value - a.value);

  const best = options[0];

  return {
    card,
    program,
    points: safePoints,
    options,
    best,
    bestValue: best.value,
  };
}

/**
 * Valuate and rank several card+points selections, best total value first.
 */
export function compareCards(
  selections: { card: CreditCard; points: number }[],
  opts: { category?: RedemptionCategory; mode?: RedemptionMode } = {}
): CardValuation[] {
  return selections
    .map(({ card, points }) => valuateCard(card, points, opts))
    .filter((v): v is CardValuation => v !== null)
    .sort((a, b) => b.bestValue - a.bestValue);
}

export { round2 };
