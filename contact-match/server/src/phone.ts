import crypto from "crypto";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";

/**
 * A server-side pepper mixed into every hash. This is NOT stored per-user; it is
 * a single application secret. Because the same pepper is applied on the client
 * (it is shipped to the app via /config) the hashes produced on-device and the
 * hashes produced here are comparable. Rotating it invalidates all stored hashes.
 *
 * The pepper does not make the hashes reversible-proof against a determined
 * server operator (phone numbers have low entropy), but it prevents trivial
 * rainbow-table lookups by anyone who only obtains the database.
 */
export const PHONE_PEPPER = process.env.CONTACT_MATCH_PEPPER || "dev-pepper-change-me";

export const DEFAULT_COUNTRY = (process.env.CONTACT_MATCH_DEFAULT_COUNTRY || "IN") as CountryCode;

/**
 * Normalize a raw phone string to canonical E.164 (e.g. "+919876543210").
 * Returns null when the input cannot be parsed into a valid number.
 */
export function normalizePhone(raw: string, country: CountryCode = DEFAULT_COUNTRY): string | null {
  if (!raw) return null;
  const parsed = parsePhoneNumberFromString(raw.trim(), country);
  if (!parsed || !parsed.isValid()) return null;
  return parsed.number; // E.164
}

/** Hash an already-normalized E.164 number with the app pepper. */
export function hashE164(e164: string): string {
  return crypto.createHash("sha256").update(`${PHONE_PEPPER}:${e164}`).digest("hex");
}

/** Convenience: normalize then hash. Returns null if the number is invalid. */
export function normalizeAndHash(raw: string, country: CountryCode = DEFAULT_COUNTRY): string | null {
  const e164 = normalizePhone(raw, country);
  return e164 ? hashE164(e164) : null;
}
