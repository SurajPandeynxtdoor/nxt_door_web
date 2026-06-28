import type { LoyaltyProgram } from "../_lib/types";

/**
 * Loyalty programs a user may already hold miles/points in, valued on their
 * own merits. Per-mile values are baseline economy estimates in INR; flight
 * (and transfer-out) values rise with the "Premium cabin" toggle. As always,
 * the real value of a mile depends on the exact redemption — see DISCLAIMER.
 */
export const LOYALTY_PROGRAMS: LoyaltyProgram[] = [
  {
    id: "etihad-guest",
    name: "Etihad Guest",
    kind: "airline",
    unit: "miles",
    portal: { name: "Etihad Guest", url: "https://www.etihad.com" },
    options: [
      {
        id: "flights",
        label: "Etihad flight awards",
        category: "flight",
        valuePerUnit: 0.45,
        notes: "Best value on premium cabins and long-haul; economy is lower.",
      },
      {
        id: "partner-flights",
        label: "Partner airline awards",
        category: "flight",
        valuePerUnit: 0.4,
      },
      {
        id: "upgrades",
        label: "Cabin upgrades",
        category: "flight",
        valuePerUnit: 0.5,
        notes: "Upgrades often give the highest value per mile.",
      },
      {
        id: "vouchers",
        label: "Etihad Guest reward shop / vouchers",
        category: "voucher",
        valuePerUnit: 0.25,
      },
    ],
  },
  {
    id: "krisflyer",
    name: "Singapore Airlines KrisFlyer",
    kind: "airline",
    unit: "miles",
    portal: { name: "KrisFlyer", url: "https://www.singaporeair.com" },
    options: [
      {
        id: "saver-flights",
        label: "Saver flight awards (SIA)",
        category: "flight",
        valuePerUnit: 0.55,
        notes: "Premium-cabin Saver awards are the KrisFlyer sweet spot.",
      },
      {
        id: "star-alliance",
        label: "Star Alliance partner awards",
        category: "flight",
        valuePerUnit: 0.5,
      },
      {
        id: "krisshop",
        label: "KrisShop merchandise",
        category: "voucher",
        valuePerUnit: 0.3,
      },
    ],
  },
  {
    id: "flying-returns",
    name: "Air India Flying Returns",
    kind: "airline",
    unit: "miles",
    portal: { name: "Flying Returns", url: "https://www.airindia.com" },
    options: [
      {
        id: "ai-flights",
        label: "Air India flight awards",
        category: "flight",
        valuePerUnit: 0.45,
      },
      {
        id: "star-alliance",
        label: "Star Alliance partner awards",
        category: "flight",
        valuePerUnit: 0.45,
      },
      {
        id: "upgrades",
        label: "Cabin upgrades",
        category: "flight",
        valuePerUnit: 0.5,
      },
    ],
  },
  {
    id: "flying-blue",
    name: "Air France-KLM Flying Blue",
    kind: "airline",
    unit: "miles",
    portal: { name: "Flying Blue", url: "https://www.flyingblue.com" },
    options: [
      {
        id: "promo",
        label: "Promo Rewards flights",
        category: "flight",
        valuePerUnit: 0.6,
        notes: "Monthly Promo Rewards (up to 50% off) give the best value.",
      },
      {
        id: "flights",
        label: "Standard flight awards",
        category: "flight",
        valuePerUnit: 0.45,
      },
    ],
  },
  {
    id: "qatar-privilege",
    name: "Qatar Airways Privilege Club (Avios)",
    kind: "airline",
    unit: "miles",
    portal: { name: "Privilege Club", url: "https://www.qatarairways.com" },
    options: [
      {
        id: "flights",
        label: "Qatar & oneworld flight awards",
        category: "flight",
        valuePerUnit: 0.5,
      },
      {
        id: "upgrades",
        label: "Cabin upgrades",
        category: "flight",
        valuePerUnit: 0.55,
      },
    ],
  },
  {
    id: "club-vistara",
    name: "Club Vistara",
    kind: "airline",
    unit: "points",
    portal: { name: "Air India (CV migrated)", url: "https://www.airindia.com" },
    options: [
      {
        id: "ai-migrate",
        label: "Move to Air India Flying Returns",
        category: "transfer",
        valuePerUnit: 0.5,
        notes: "Vistara merged into Air India — CV Points migrate to Flying Returns/Maharaja.",
      },
      {
        id: "flights",
        label: "Air India flight awards",
        category: "flight",
        valuePerUnit: 0.45,
      },
    ],
  },
  {
    id: "intermiles",
    name: "InterMiles",
    kind: "airline",
    unit: "miles",
    portal: { name: "InterMiles", url: "https://www.intermiles.com" },
    options: [
      {
        id: "flights",
        label: "Flight bookings (partner airlines)",
        category: "flight",
        valuePerUnit: 0.4,
      },
      {
        id: "hotels",
        label: "Hotel bookings",
        category: "hotel",
        valuePerUnit: 0.35,
      },
      {
        id: "vouchers",
        label: "Gift vouchers & shopping",
        category: "voucher",
        valuePerUnit: 0.3,
      },
    ],
  },
  {
    id: "ihg-one",
    name: "IHG One Rewards",
    kind: "hotel",
    unit: "points",
    portal: { name: "IHG One Rewards", url: "https://www.ihg.com" },
    options: [
      {
        id: "free-nights",
        label: "Free-night stays",
        category: "hotel",
        valuePerUnit: 0.4,
        notes: "4th-night-free on award stays for members boosts effective value.",
      },
      {
        id: "cash-points",
        label: "Cash + Points stays",
        category: "hotel",
        valuePerUnit: 0.3,
      },
    ],
  },
  {
    id: "hilton-honors",
    name: "Hilton Honors",
    kind: "hotel",
    unit: "points",
    portal: { name: "Hilton Honors", url: "https://www.hilton.com" },
    options: [
      {
        id: "free-nights",
        label: "Free-night stays",
        category: "hotel",
        valuePerUnit: 0.35,
        notes: "5th night free on award stays; Hilton points are lower-value but plentiful.",
      },
      {
        id: "premium-rooms",
        label: "Premium / resort redemptions",
        category: "hotel",
        valuePerUnit: 0.45,
      },
    ],
  },
  {
    id: "marriott-bonvoy",
    name: "Marriott Bonvoy",
    kind: "hotel",
    unit: "points",
    portal: { name: "Marriott Bonvoy", url: "https://www.marriott.com" },
    options: [
      {
        id: "free-nights",
        label: "Free-night stays",
        category: "hotel",
        valuePerUnit: 0.5,
        notes: "5th night free on 5-night award stays boosts effective value.",
      },
      {
        id: "transfer-air",
        label: "Transfer to airline (3:1 + bonus)",
        category: "transfer",
        valuePerUnit: 0.2,
        notes: "3 points : 1 mile, +5,000 miles per 60,000 transferred.",
      },
      {
        id: "cash-points",
        label: "Cash + Points stays",
        category: "hotel",
        valuePerUnit: 0.4,
      },
    ],
  },
  {
    id: "accor-all",
    name: "Accor Live Limitless (ALL)",
    kind: "hotel",
    unit: "points",
    portal: { name: "Accor ALL", url: "https://all.accor.com" },
    options: [
      {
        id: "stays",
        label: "Hotel stays (fixed value)",
        category: "hotel",
        valuePerUnit: 2.0,
        notes: "2,000 ALL points = €40 off — a fixed, high per-point value.",
      },
      {
        id: "transfer-air",
        label: "Transfer to airline partners",
        category: "transfer",
        valuePerUnit: 1.0,
        notes: "Usually 2:1 to airlines — typically worse than stays.",
      },
    ],
  },
];

const LOYALTY_BY_ID = new Map(LOYALTY_PROGRAMS.map((p) => [p.id, p]));

export function getLoyaltyProgram(id: string): LoyaltyProgram | undefined {
  return LOYALTY_BY_ID.get(id);
}
