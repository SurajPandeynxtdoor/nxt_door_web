import { NextRequest, NextResponse } from "next/server";
import type { AwardResult } from "@/app/(points)/_lib/awardApi";

/**
 * Live award-search proxy (scaffold).
 *
 * Wire a third-party award-availability provider (e.g. Seats.aero) by setting:
 *   AWARD_API_URL  — the provider's search endpoint
 *   AWARD_API_KEY  — your API key (sent as a Bearer token)
 *
 * Without those env vars this returns { configured: false } so the UI can show
 * a graceful "not configured" message instead of failing. Map the provider's
 * response shape to AwardResult[] in `mapProviderResponse` once you wire one.
 */

interface SearchBody {
  programId?: string;
  origin?: string;
  destination?: string;
  date?: string;
}

function mapProviderResponse(raw: unknown): AwardResult[] {
  // TODO: shape this to your provider. Defensive default keeps the route safe.
  if (!raw || typeof raw !== "object") return [];
  const items = (raw as { data?: unknown }).data;
  if (!Array.isArray(items)) return [];
  return items
    .map((it): AwardResult | null => {
      if (!it || typeof it !== "object") return null;
      const o = it as Record<string, unknown>;
      const miles = Number(o.miles ?? o.mileageCost);
      if (!Number.isFinite(miles)) return null;
      return {
        cabin: String(o.cabin ?? o.cabinClass ?? "—"),
        miles,
        taxesInr: typeof o.taxesInr === "number" ? o.taxesInr : undefined,
        source: typeof o.source === "string" ? o.source : undefined,
      };
    })
    .filter((x): x is AwardResult => x !== null);
}

export async function POST(req: NextRequest) {
  const apiUrl = process.env.AWARD_API_URL;
  const apiKey = process.env.AWARD_API_KEY;

  if (!apiUrl || !apiKey) {
    return NextResponse.json({ configured: false });
  }

  let body: SearchBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { origin, destination, date, programId } = body;
  if (!origin || !destination) {
    return NextResponse.json(
      { error: "origin and destination are required" },
      { status: 400 }
    );
  }

  try {
    const url = new URL(apiUrl);
    url.searchParams.set("origin", origin);
    url.searchParams.set("destination", destination);
    if (date) url.searchParams.set("date", date);
    if (programId) url.searchParams.set("program", programId);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      // Avoid hanging the request indefinitely.
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { configured: true, error: `Provider returned ${res.status}` },
        { status: 502 }
      );
    }

    const raw = await res.json();
    return NextResponse.json({ configured: true, results: mapProviderResponse(raw) });
  } catch {
    return NextResponse.json(
      { configured: true, error: "Live award search failed" },
      { status: 502 }
    );
  }
}
