import type {
  CreditCard,
  RewardProgram,
  TransferPartner,
} from "../_lib/types";

/**
 * IMPORTANT: The figures below are approximate, illustrative values for the
 * publicly known reward programs as of 2024–25.
 *
 * Two kinds of numbers appear:
 *  - Transfer RATIOS (card points → partner miles) are concrete program rules.
 *    They still change, so confirm on your bank's portal before transferring.
 *  - Per-mile / per-point VALUES are estimates of what a mile is typically
 *    worth. A mile's real value depends entirely on the flight you book — it is
 *    far higher for business/first class than economy. Use the "redemption
 *    value" toggle to model this, and treat all values as a starting point.
 *
 * Nothing here is financial advice.
 */
export const DISCLAIMER =
  "Transfer ratios are program rules but change often — confirm on your bank's " +
  "portal before transferring. Per-mile values are estimates; a mile's real " +
  "worth depends on the exact flight you redeem for (much higher in premium " +
  "cabins). Use the redemption-value toggle to model this. Redemption links " +
  "open the official bank/program portal and may require login. Not financial advice.";

export const DATA_AS_OF = "2024–25";

// ---------------------------------------------------------------------------
// Transfer partners (reused across programs). valuePerUnit is a baseline
// economy estimate in INR per partner mile/point.
// ---------------------------------------------------------------------------

const airIndia = (ratio: number): TransferPartner => ({
  id: "air-india",
  name: "Air India Flying Returns",
  kind: "airline",
  ratio,
  valuePerUnit: 0.5,
});
const krisflyer = (ratio: number): TransferPartner => ({
  id: "krisflyer",
  name: "Singapore Airlines KrisFlyer",
  kind: "airline",
  ratio,
  valuePerUnit: 0.6,
});
const qatar = (ratio: number): TransferPartner => ({
  id: "qatar",
  name: "Qatar Airways Privilege Club (Avios)",
  kind: "airline",
  ratio,
  valuePerUnit: 0.55,
});
const etihad = (ratio: number): TransferPartner => ({
  id: "etihad",
  name: "Etihad Guest",
  kind: "airline",
  ratio,
  valuePerUnit: 0.45,
});
const flyingBlue = (ratio: number): TransferPartner => ({
  id: "flying-blue",
  name: "Air France-KLM Flying Blue",
  kind: "airline",
  ratio,
  valuePerUnit: 0.5,
});
const britishAirways = (ratio: number): TransferPartner => ({
  id: "ba-avios",
  name: "British Airways Executive Club (Avios)",
  kind: "airline",
  ratio,
  valuePerUnit: 0.5,
});
const marriott = (ratio: number): TransferPartner => ({
  id: "marriott",
  name: "Marriott Bonvoy",
  kind: "hotel",
  ratio,
  valuePerUnit: 0.45,
  notes: "Hotel free-night value. Bonvoy points can transfer onward to airlines.",
  // Onward: Bonvoy → airline at 3:1, with a 5,000-mile bonus per 60,000
  // transferred (~3:1.25 effective). Modelled as an effective ratio.
  onward: [
    {
      id: "kf",
      name: "Singapore Airlines KrisFlyer",
      kind: "airline",
      ratio: 1 / 3,
      valuePerUnit: 0.65,
      notes: "3 Bonvoy : 1 mile + 5,000-mile bonus per 60,000 transferred.",
    },
    {
      id: "ai",
      name: "Air India Flying Returns",
      kind: "airline",
      ratio: 1 / 3,
      valuePerUnit: 0.55,
      notes: "3 Bonvoy : 1 mile + 5,000-mile bonus per 60,000 transferred.",
    },
  ],
});

// ---------------------------------------------------------------------------
// Reward programs (the "currencies")
// ---------------------------------------------------------------------------

export const PROGRAMS: RewardProgram[] = [
  {
    id: "hdfc-premium-rp",
    currency: "Reward Points",
    portal: { name: "HDFC SmartBuy", url: "https://offers.smartbuy.hdfcbank.com/" },
    options: [
      {
        id: "smartbuy-flights",
        label: "SmartBuy flights & hotels",
        type: "travel_portal",
        valuePerPoint: 1.0,
        notes: "Best fixed value. Monthly redemption caps apply per card.",
      },
      {
        id: "airmiles",
        label: "Convert to airline / hotel miles",
        type: "transfer_airline",
        valuePerPoint: 0.6,
        notes: "Via SmartBuy. Monthly conversion caps apply; ratios change.",
        partners: [
          krisflyer(1),
          airIndia(1),
          britishAirways(1),
          flyingBlue(1),
          marriott(1),
        ],
      },
      {
        id: "tanishq",
        label: "Tanishq & brand vouchers",
        type: "gift_voucher",
        valuePerPoint: 0.5,
      },
      {
        id: "catalogue",
        label: "Product catalogue",
        type: "catalogue",
        valuePerPoint: 0.3,
      },
      {
        id: "cashback",
        label: "Statement credit / cashback",
        type: "statement_credit",
        valuePerPoint: 0.3,
      },
    ],
  },
  {
    id: "hdfc-regalia-rp",
    currency: "Reward Points",
    portal: { name: "HDFC SmartBuy", url: "https://offers.smartbuy.hdfcbank.com/" },
    options: [
      {
        id: "smartbuy-flights",
        label: "SmartBuy flights & hotels",
        type: "travel_portal",
        valuePerPoint: 0.65,
        notes: "Up to ₹0.65/pt on flights & hotels; caps apply.",
      },
      {
        id: "airmiles",
        label: "Convert to airline / hotel miles",
        type: "transfer_airline",
        valuePerPoint: 0.3,
        notes: "Regalia tier converts at ~2 RP : 1 partner mile.",
        partners: [
          krisflyer(0.5),
          airIndia(0.5),
          britishAirways(0.5),
        ],
      },
      {
        id: "vouchers",
        label: "Gift vouchers",
        type: "gift_voucher",
        valuePerPoint: 0.5,
      },
      {
        id: "catalogue",
        label: "Product catalogue",
        type: "catalogue",
        valuePerPoint: 0.35,
      },
      {
        id: "cashback",
        label: "Statement credit / cashback",
        type: "statement_credit",
        valuePerPoint: 0.3,
      },
    ],
  },
  {
    id: "hdfc-cashpoints",
    currency: "CashPoints",
    portal: { name: "HDFC SmartBuy", url: "https://offers.smartbuy.hdfcbank.com/" },
    options: [
      {
        id: "statement",
        label: "Adjust against statement",
        type: "statement_credit",
        valuePerPoint: 1.0,
        notes: "1 CashPoint = ₹1. Redemption caps apply per statement cycle.",
      },
      {
        id: "catalogue",
        label: "Product catalogue / vouchers",
        type: "catalogue",
        valuePerPoint: 0.3,
      },
    ],
  },
  {
    id: "axis-edge-rewards",
    currency: "EDGE Reward Points",
    portal: { name: "Axis EDGE Rewards", url: "https://www.axisbank.com/edge-rewards" },
    options: [
      {
        id: "transfer",
        label: "Transfer to travel partners",
        type: "transfer_airline",
        valuePerPoint: 0.24,
        notes: "EDGE Rewards transfer at ~5 points : 2 partner miles.",
        partners: [
          krisflyer(0.4),
          airIndia(0.4),
          marriott(0.4),
        ],
      },
      {
        id: "travel-portal",
        label: "EDGE travel portal",
        type: "travel_portal",
        valuePerPoint: 0.2,
      },
      {
        id: "vouchers",
        label: "Gift vouchers on EDGE",
        type: "gift_voucher",
        valuePerPoint: 0.2,
      },
    ],
  },
  {
    id: "axis-edge-miles",
    currency: "EDGE Miles",
    portal: { name: "Axis EDGE / Atlas", url: "https://www.axisbank.com/edge-rewards" },
    options: [
      {
        id: "transfer",
        label: "Transfer to airline / hotel partners",
        type: "transfer_airline",
        valuePerPoint: 0.6,
        notes:
          "Atlas transfers most partners at 1:1 — the sweet spot for premium-cabin flights.",
        partners: [
          krisflyer(1),
          airIndia(1),
          qatar(1),
          etihad(1),
          flyingBlue(1),
          marriott(1),
        ],
      },
      {
        id: "travel-portal",
        label: "Travel +EDGE portal",
        type: "travel_portal",
        valuePerPoint: 1.0,
        notes: "1 EDGE Mile = ₹1 towards bookings on the Atlas travel portal.",
      },
    ],
  },
  {
    id: "sbi-rp",
    currency: "Reward Points",
    portal: { name: "SBI Card Rewards", url: "https://www.sbicard.com/en/personal/rewards.page" },
    options: [
      {
        id: "vouchers",
        label: "Gift vouchers / catalogue",
        type: "gift_voucher",
        valuePerPoint: 0.25,
      },
      {
        id: "statement",
        label: "Statement credit",
        type: "statement_credit",
        valuePerPoint: 0.25,
        notes: "1 RP = ₹0.25 on most SBI cards.",
      },
    ],
  },
  {
    id: "icici-rp",
    currency: "Reward Points",
    portal: { name: "ICICI Rewards", url: "https://www.icicibank.com/personal-banking/cards/credit-card" },
    options: [
      {
        id: "statement",
        label: "Statement credit",
        type: "statement_credit",
        valuePerPoint: 0.25,
      },
      {
        id: "catalogue",
        label: "Catalogue / vouchers",
        type: "catalogue",
        valuePerPoint: 0.25,
      },
    ],
  },
  {
    id: "icici-amazonpay",
    currency: "Cashback",
    portal: { name: "Amazon Pay", url: "https://www.amazon.in/amazonpay/home" },
    options: [
      {
        id: "amazon",
        label: "Amazon Pay balance",
        type: "cashback",
        valuePerPoint: 1.0,
        notes: "Earned as cashback credited to Amazon Pay — effectively 1:1 cash.",
      },
    ],
  },
  {
    id: "amex-mr",
    currency: "Membership Rewards",
    portal: {
      name: "Amex Membership Rewards",
      url: "https://www.americanexpress.com/en-in/rewards/membership-rewards/",
    },
    options: [
      {
        id: "transfer",
        label: "Transfer to airline / hotel partners",
        type: "transfer_airline",
        valuePerPoint: 0.6,
        notes: "Transfer ratios vary by partner — confirm current ratios.",
        partners: [
          krisflyer(1),
          marriott(1),
          flyingBlue(1),
        ],
      },
      {
        id: "gold-collection",
        label: "Gold Collection vouchers",
        type: "gift_voucher",
        valuePerPoint: 0.5,
      },
      {
        id: "18pct",
        label: "Pay with Points (18% off)",
        type: "statement_credit",
        valuePerPoint: 0.45,
        notes: "Selected merchants; effective value via 18% statement reversal.",
      },
      {
        id: "statement",
        label: "Statement credit",
        type: "statement_credit",
        valuePerPoint: 0.2,
      },
    ],
  },
  {
    id: "amex-mrcc",
    currency: "Membership Rewards",
    portal: {
      name: "Amex Membership Rewards",
      url: "https://www.americanexpress.com/en-in/rewards/membership-rewards/",
    },
    options: [
      {
        id: "vouchers",
        label: "18,000-point milestone vouchers",
        type: "gift_voucher",
        valuePerPoint: 0.5,
        notes: "Best value comes from hitting the milestone voucher tiers.",
      },
      {
        id: "transfer",
        label: "Transfer to partners",
        type: "transfer_airline",
        valuePerPoint: 0.55,
        notes: "Transfer ratios vary by partner — confirm current ratios.",
        partners: [
          marriott(1),
          krisflyer(1),
        ],
      },
      {
        id: "statement",
        label: "Statement credit",
        type: "statement_credit",
        valuePerPoint: 0.2,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

export const CARDS: CreditCard[] = [
  {
    id: "hdfc-infinia",
    bank: "HDFC Bank",
    name: "Infinia",
    tier: "Super Premium",
    programId: "hdfc-premium-rp",
    earn: { points: 5, perRupees: 150, note: "5 RP / ₹150 on retail spends" },
  },
  {
    id: "hdfc-diners-black",
    bank: "HDFC Bank",
    name: "Diners Club Black",
    tier: "Super Premium",
    programId: "hdfc-premium-rp",
    earn: { points: 5, perRupees: 150 },
  },
  {
    id: "hdfc-regalia-gold",
    bank: "HDFC Bank",
    name: "Regalia Gold",
    tier: "Premium",
    programId: "hdfc-regalia-rp",
    earn: { points: 4, perRupees: 150 },
  },
  {
    id: "hdfc-millennia",
    bank: "HDFC Bank",
    name: "Millennia",
    tier: "Cashback",
    programId: "hdfc-cashpoints",
    earn: { points: 1, perRupees: 100, note: "1% as CashPoints; 5% on select partners" },
  },
  {
    id: "axis-magnus",
    bank: "Axis Bank",
    name: "Magnus",
    tier: "Premium",
    programId: "axis-edge-rewards",
    earn: { points: 12, perRupees: 200 },
  },
  {
    id: "axis-atlas",
    bank: "Axis Bank",
    name: "Atlas",
    tier: "Travel",
    programId: "axis-edge-miles",
    earn: { points: 2, perRupees: 100, note: "2 EDGE Miles / ₹100; more on travel" },
  },
  {
    id: "axis-reserve",
    bank: "Axis Bank",
    name: "Reserve",
    tier: "Super Premium",
    programId: "axis-edge-rewards",
    earn: { points: 15, perRupees: 200 },
  },
  {
    id: "sbi-elite",
    bank: "SBI Card",
    name: "ELITE",
    tier: "Premium",
    programId: "sbi-rp",
    earn: { points: 2, perRupees: 100 },
  },
  {
    id: "sbi-prime",
    bank: "SBI Card",
    name: "PRIME",
    tier: "Premium",
    programId: "sbi-rp",
    earn: { points: 2, perRupees: 100 },
  },
  {
    id: "icici-sapphiro",
    bank: "ICICI Bank",
    name: "Sapphiro",
    tier: "Premium",
    programId: "icici-rp",
    earn: { points: 2, perRupees: 100 },
  },
  {
    id: "icici-amazonpay",
    bank: "ICICI Bank",
    name: "Amazon Pay",
    tier: "Cashback",
    programId: "icici-amazonpay",
    earn: { points: 1, perRupees: 100, note: "1–5% cashback to Amazon Pay" },
  },
  {
    id: "amex-platinum-charge",
    bank: "American Express",
    name: "Platinum Charge",
    tier: "Super Premium",
    programId: "amex-mr",
    earn: { points: 1, perRupees: 40 },
  },
  {
    id: "amex-platinum-travel",
    bank: "American Express",
    name: "Platinum Travel",
    tier: "Travel",
    programId: "amex-mr",
    earn: { points: 1, perRupees: 50 },
  },
  {
    id: "amex-mrcc",
    bank: "American Express",
    name: "Membership Rewards Card",
    tier: "Entry",
    programId: "amex-mrcc",
    earn: { points: 1, perRupees: 50 },
  },
];

const PROGRAM_BY_ID = new Map(PROGRAMS.map((p) => [p.id, p]));

export function getProgram(programId: string): RewardProgram | undefined {
  return PROGRAM_BY_ID.get(programId);
}

const CARD_BY_ID = new Map(CARDS.map((c) => [c.id, c]));

export function getCard(cardId: string): CreditCard | undefined {
  return CARD_BY_ID.get(cardId);
}
