import type { Trip } from "../_components/trip";

/** A universal, reliable route search (real-time revenue fares) on Google Flights. */
export function googleFlightsUrl(trip: Trip): string {
  const parts = [`Flights from ${trip.origin} to ${trip.destination}`];
  if (trip.date) parts.push(`on ${trip.date}`);
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(parts.join(" "))}`;
}

/**
 * Carrier deep links that accept origin/destination/date query params on a
 * VERIFIED, stable base path. Intentionally empty until each URL is confirmed —
 * we never ship guessed deep paths (they 404). Route-prefilled search is
 * delivered reliably via Google Flights; the carrier link falls back to the
 * program's root URL (award prices need login there anyway).
 */
const CARRIER_DEEP_LINKS: Record<string, (t: Trip) => string> = {};

/** True when both endpoints look like valid 3-letter IATA codes. */
export function hasRoute(trip: Trip | null): trip is Trip {
  return !!trip && /^[A-Z]{3}$/.test(trip.origin) && /^[A-Z]{3}$/.test(trip.destination);
}

/** Whether a carrier supports a route-prefilled deep link (vs root fallback). */
export function carrierHasDeepLink(programId: string): boolean {
  return programId in CARRIER_DEEP_LINKS;
}

/**
 * Best carrier link for a program given a trip: a prefilled deep link where
 * supported, otherwise the program's reliable root search URL.
 */
export function carrierSearchUrl(
  programId: string,
  trip: Trip,
  fallback: string | undefined
): string | undefined {
  const builder = CARRIER_DEEP_LINKS[programId];
  if (builder && hasRoute(trip)) return builder(trip);
  return fallback;
}
