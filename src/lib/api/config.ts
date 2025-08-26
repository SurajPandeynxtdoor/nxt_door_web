export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
if (!API_BASE && typeof window === "undefined")
  throw new Error("Set NEXT_PUBLIC_API_URL in .env.local");
