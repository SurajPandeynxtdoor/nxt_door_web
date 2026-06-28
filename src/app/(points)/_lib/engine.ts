import type {
  CreditCard,
  OnwardTransfer,
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

export interface OnwardValuation {
  transfer: OnwardTransfer;
  /** Onward units received: partner units * onward ratio. */
  units: number;
  /** INR value of the onward units (mode multiplier applied for airlines). */
  value: number;
}

export interface PartnerValuation {
  partner: TransferPartner;
  /** Partner miles/points received: points * ratio. */
  units: number;
  /** INR value if you stop at this partner. */
  directValue: number;
  /** Onward transfers from this partner, best value first. */
  onward: OnwardValuation[];
  /** Best achievable value via this partner: max(direct, best onward). */
  value: number;
  /** Set when an onward transfer beats stopping here — the value-enhancing hop. */
  bestVia?: OnwardValuation;
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

/** The cabin/redemption multiplier only applies to airline redemptions. */
function valueFor(
  units: number,
  valuePerUnit: number,
  kind: "airline" | "hotel",
  multiplier: number
): number {
  return round2(units * valuePerUnit * (kind === "airline" ? multiplier : 1));
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
      const directValue = valueFor(
        units,
        partner.valuePerUnit,
        partner.kind,
        multiplier
      );

      const onward: OnwardValuation[] = (partner.onward ?? [])
        .map((transfer) => {
          const onwardUnits = round2(units * transfer.ratio);
          return {
            transfer,
            units: onwardUnits,
            value: valueFor(
              onwardUnits,
              transfer.valuePerUnit,
              transfer.kind,
              multiplier
            ),
          };
        })
        .sort((a, b) => b.value - a.value);

      const bestOnward = onward[0];
      const viaWins = bestOnward && bestOnward.value > directValue;

      return {
        partner,
        units,
        directValue,
        onward,
        value: viaWins ? bestOnward.value : directValue,
        bestVia: viaWins ? bestOnward : undefined,
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
