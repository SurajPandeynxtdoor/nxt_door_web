/**
 * Representative award costs ("fares in points") keyed by program id — the same
 * ids used by loyalty programs and card transfer partners' loyaltyId. Costs are
 * approximate one-way saver levels (or per-night for hotels) and move with
 * dynamic pricing and award charts; treat them as a ballpark. `searchUrl` deep
 * links to the program's award-search / booking page (usually login-gated).
 * See DISCLAIMER.
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

export interface AwardChart {
  /** Award-search / booking page for this program. */
  searchUrl?: string;
  samples: AwardSample[];
}

export const AWARD_CHARTS: Record<string, AwardChart> = {
  krisflyer: {
    searchUrl: "https://www.singaporeair.com/en_UK/in/ppsclub-krisflyer/use-miles/flights/",
    samples: [
      { id: "in-mle-y", label: "India → Maldives", tag: "Economy saver", cost: 17500 },
      { id: "in-sin-y", label: "India → Singapore / SE Asia", tag: "Economy saver", cost: 21000 },
      { id: "in-sin-j", label: "India → Singapore / SE Asia", tag: "Business saver", cost: 51000 },
      { id: "in-eur-j", label: "India → Europe (via SIN)", tag: "Business saver", cost: 99000 },
      { id: "in-us-j", label: "India → US (via SIN)", tag: "Business saver", cost: 120000 },
    ],
  },
  "flying-returns": {
    searchUrl: "https://www.airindia.com/in/en/flying-returns.html",
    samples: [
      { id: "dom-y", label: "Domestic short-haul", tag: "Economy", cost: 10000 },
      { id: "in-gulf-y", label: "India → Gulf", tag: "Economy", cost: 15000 },
      { id: "in-eur-y", label: "India → Europe", tag: "Economy", cost: 40000 },
      { id: "in-eur-j", label: "India → Europe", tag: "Business", cost: 80000 },
      { id: "in-us-j", label: "India → US", tag: "Business", cost: 150000 },
    ],
  },
  "etihad-guest": {
    searchUrl: "https://www.etihad.com/en/etihad-guest/use-miles/flights",
    samples: [
      { id: "in-auh-y", label: "India → Abu Dhabi", tag: "Economy", cost: 15000 },
      { id: "in-eur-y", label: "India → Europe (via AUH)", tag: "Economy", cost: 44000 },
      { id: "in-eur-j", label: "India → Europe (via AUH)", tag: "Business", cost: 88000 },
      { id: "in-us-j", label: "India → US (via AUH)", tag: "Business", cost: 110000 },
    ],
  },
  "qatar-privilege": {
    searchUrl: "https://www.qatarairways.com/en/privilegeclub/spend-avios.html",
    samples: [
      { id: "in-doh-y", label: "India → Doha", tag: "Economy", cost: 15000 },
      { id: "in-eur-y", label: "India → Europe (via DOH)", tag: "Economy", cost: 50000 },
      { id: "in-eur-j", label: "India → Europe (via DOH)", tag: "Business", cost: 100000 },
    ],
  },
  "flying-blue": {
    searchUrl: "https://www.flyingblue.com/en/spend/flights",
    samples: [
      { id: "in-eur-promo", label: "India → Europe (Promo Reward)", tag: "Economy", cost: 25000 },
      { id: "in-eur-y", label: "India → Europe", tag: "Economy", cost: 35000 },
      { id: "in-eur-j", label: "India → Europe", tag: "Business", cost: 90000 },
    ],
  },
  "club-vistara": {
    searchUrl: "https://www.airindia.com/in/en/flying-returns.html",
    samples: [
      { id: "dom-y", label: "Domestic short-haul (via Air India)", tag: "Economy", cost: 12000 },
      { id: "in-gulf-y", label: "India → Gulf (via Air India)", tag: "Economy", cost: 16000 },
    ],
  },
  "marriott-bonvoy": {
    searchUrl: "https://www.marriott.com/loyalty/redeem/free-night-awards.mi",
    samples: [
      { id: "cat3", label: "Category 1–3 hotel", tag: "Per night", cost: 12500 },
      { id: "cat4", label: "Category 4 hotel", tag: "Per night", cost: 25000 },
      { id: "cat6", label: "Category 6 hotel", tag: "Per night", cost: 50000 },
      { id: "cat8", label: "Category 8 hotel", tag: "Per night", cost: 85000 },
    ],
  },
  "ihg-one": {
    searchUrl: "https://www.ihg.com/onerewards/content/us/en/redeem",
    samples: [
      { id: "low", label: "Lower-tier hotel", tag: "Per night", cost: 17000 },
      { id: "std", label: "Standard hotel", tag: "Per night", cost: 30000 },
      { id: "premium", label: "Premium hotel", tag: "Per night", cost: 60000 },
    ],
  },
  "hilton-honors": {
    searchUrl: "https://www.hilton.com/en/hilton-honors/points/",
    samples: [
      { id: "low", label: "Lower-tier hotel", tag: "Per night", cost: 20000 },
      { id: "std", label: "Standard hotel", tag: "Per night", cost: 40000 },
      { id: "resort", label: "Premium / resort", tag: "Per night", cost: 80000 },
    ],
  },
};

export function getAwardChart(programId: string | undefined): AwardChart | undefined {
  if (!programId) return undefined;
  return AWARD_CHARTS[programId];
}
