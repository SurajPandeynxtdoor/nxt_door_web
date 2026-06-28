/**
 * Representative award costs ("fares in points") keyed by program id — the same
 * ids used by loyalty programs and card transfer partners' loyaltyId. Costs are
 * approximate one-way saver levels (or per-night for hotels) and move with
 * dynamic pricing and award charts; treat them as a ballpark. See DISCLAIMER.
 */
export interface AwardSample {
  id: string;
  /** Route or stay description. */
  label: string;
  /** Cabin / award type, e.g. "Economy", "Business", "Per night". */
  tag: string;
  /** Approximate cost in the program's miles/points. */
  cost: number;
}

export const AWARD_CHARTS: Record<string, AwardSample[]> = {
  krisflyer: [
    { id: "in-sin-y", label: "India → Singapore", tag: "Economy saver", cost: 21000 },
    { id: "in-sin-j", label: "India → Singapore", tag: "Business saver", cost: 51000 },
    { id: "in-eur-j", label: "India → Europe (via SIN)", tag: "Business saver", cost: 99000 },
  ],
  "flying-returns": [
    { id: "dom-y", label: "Domestic short-haul", tag: "Economy", cost: 10000 },
    { id: "in-eur-y", label: "India → Europe", tag: "Economy", cost: 40000 },
    { id: "in-us-j", label: "India → US", tag: "Business", cost: 150000 },
  ],
  "etihad-guest": [
    { id: "in-auh-y", label: "India → Abu Dhabi", tag: "Economy", cost: 15000 },
    { id: "in-eur-y", label: "India → Europe (via AUH)", tag: "Economy", cost: 44000 },
    { id: "in-eur-j", label: "India → Europe (via AUH)", tag: "Business", cost: 88000 },
  ],
  "qatar-privilege": [
    { id: "in-doh-y", label: "India → Doha", tag: "Economy", cost: 15000 },
    { id: "in-eur-j", label: "India → Europe (via DOH)", tag: "Business", cost: 100000 },
  ],
  "flying-blue": [
    { id: "in-eur-y", label: "India → Europe (Promo)", tag: "Economy", cost: 25000 },
    { id: "in-eur-j", label: "India → Europe", tag: "Business", cost: 90000 },
  ],
  "club-vistara": [
    { id: "dom-y", label: "Domestic short-haul (via Air India)", tag: "Economy", cost: 12000 },
  ],
  "marriott-bonvoy": [
    { id: "cat4", label: "Category 4 hotel", tag: "Per night", cost: 25000 },
    { id: "cat6", label: "Category 6 hotel", tag: "Per night", cost: 50000 },
  ],
  "ihg-one": [
    { id: "std", label: "Standard hotel", tag: "Per night", cost: 30000 },
  ],
  "hilton-honors": [
    { id: "std", label: "Standard hotel", tag: "Per night", cost: 30000 },
  ],
};

export function getAwards(programId: string | undefined): AwardSample[] | undefined {
  if (!programId) return undefined;
  return AWARD_CHARTS[programId];
}
