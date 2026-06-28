// Domain types for the "PointMax India" credit-card points redemption tool.
// All monetary values are in INR. Redemption values are approximate and meant
// for comparison only — see DISCLAIMER in _data/cards.ts.

export type RedemptionType =
  | "transfer_airline"
  | "transfer_hotel"
  | "travel_portal"
  | "catalogue"
  | "gift_voucher"
  | "statement_credit"
  | "cashback"
  | "fuel";

export type RedemptionCategory = "travel" | "shopping" | "cashback";

/** Maps a redemption type to the high-level category shown in the filter. */
export const TYPE_CATEGORY: Record<RedemptionType, RedemptionCategory> = {
  transfer_airline: "travel",
  transfer_hotel: "travel",
  travel_portal: "travel",
  catalogue: "shopping",
  gift_voucher: "shopping",
  statement_credit: "cashback",
  cashback: "cashback",
  fuel: "cashback",
};

export const CATEGORY_LABEL: Record<RedemptionCategory, string> = {
  travel: "Travel",
  shopping: "Shopping & vouchers",
  cashback: "Cashback & statement",
};

/**
 * A loyalty program a card's points can be transferred into (airline or hotel).
 * `ratio` is the number of partner units received per 1 card point — the
 * concrete, factual lever. `valuePerUnit` is an approximate INR value of one
 * partner unit on a typical economy redemption and can be tuned in the UI.
 */
export interface TransferPartner {
  id: string;
  name: string;
  kind: "airline" | "hotel";
  /** Partner units credited per 1 card point (e.g. 1 = 1:1, 0.5 = 2:1). */
  ratio: number;
  /** Approximate INR value of one partner unit (baseline economy redemption). */
  valuePerUnit: number;
  notes?: string;
}

export interface RedemptionOption {
  /** Stable id, unique within a program. */
  id: string;
  /** Human-friendly label, e.g. "Transfer to airline partners". */
  label: string;
  type: RedemptionType;
  /**
   * Approximate INR value of a single card point when redeemed this way. For
   * transfer options this equals the best available partner (ratio * value).
   */
  valuePerPoint: number;
  /** Caveats: caps, blackout dates, transfer ratios, etc. */
  notes?: string;
  /** Transfer destinations, for transfer_airline / transfer_hotel options. */
  partners?: TransferPartner[];
}

export interface RewardProgram {
  /** Stable id, referenced by CreditCard.programId. */
  id: string;
  /** Name of the reward currency, e.g. "Reward Points", "EDGE Miles". */
  currency: string;
  options: RedemptionOption[];
}

export interface CreditCard {
  id: string;
  bank: string;
  /** Card name without the bank, e.g. "Infinia". */
  name: string;
  /** Marketing tier, used only for display. */
  tier?: string;
  programId: string;
  /** Optional earn rate, purely informational for the UI. */
  earn?: {
    /** Points earned per `perRupees` spent on general retail. */
    points: number;
    perRupees: number;
    note?: string;
  };
}
