import * as Crypto from "expo-crypto";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";

/**
 * Normalize a raw phone string to canonical E.164. Returns null when it can't
 * be parsed. The default country is used for local-format numbers that lack a
 * country code (matches the server's DEFAULT_COUNTRY).
 */
export function normalizePhone(raw: string, defaultCountry: CountryCode): string | null {
  if (!raw) return null;
  const parsed = parsePhoneNumberFromString(raw.trim(), defaultCountry);
  if (!parsed || !parsed.isValid()) return null;
  return parsed.number;
}

/**
 * Hash a normalized E.164 number with the shared app pepper using SHA-256.
 * This runs entirely on-device, so raw numbers never leave the phone.
 */
export async function hashE164(e164: string, pepper: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${pepper}:${e164}`
  );
}
