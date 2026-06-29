"use client";

import { useState } from "react";
import { Check, ChevronDown, ExternalLink, Radar, Ticket } from "lucide-react";
import { getAwardChart } from "../_data/awards";
import {
  carrierHasDeepLink,
  carrierSearchUrl,
  googleFlightsUrl,
  hasRoute,
} from "../_lib/links";
import type { AwardResult } from "../_lib/awardApi";
import { num } from "./shared";
import { useTrip } from "./trip";

/**
 * "Check fares in points" — shows representative award costs for a program,
 * whether an available balance covers them, route-aware deep links, and an
 * optional live availability check (when the award API is configured).
 */
export default function FaresInPoints({
  programId,
  available,
  unit,
  kind = "airline",
}: {
  programId: string | undefined;
  available?: number;
  unit: string;
  kind?: "airline" | "hotel";
}) {
  const [open, setOpen] = useState(false);
  const trip = useTrip();
  const chart = getAwardChart(programId);
  if (!chart || chart.samples.length === 0) return null;
  const { samples, searchUrl } = chart;

  const routeReady = kind === "airline" && hasRoute(trip);
  const carrierLink = trip
    ? carrierSearchUrl(programId!, trip, searchUrl)
    : searchUrl;

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-200"
      >
        <Ticket className="h-3.5 w-3.5" />
        Check fares in points
        <ChevronDown
          className={["h-3.5 w-3.5 transition-transform", open ? "rotate-180" : ""].join(" ")}
        />
      </button>

      {open && (
        <div className="mt-2 border-l border-white/10 pl-3">
          <ul className="space-y-1.5 text-xs">
            {samples.map((s) => {
              const known = typeof available === "number" && available > 0;
              const covers = known ? Math.floor(available! / s.cost) : 0;
              const short = known ? Math.max(0, s.cost - available!) : 0;
              return (
                <li key={s.id} className="flex items-start justify-between gap-3">
                  <span className="text-slate-400">
                    {s.label} <span className="text-slate-600">({s.tag})</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="tabular-nums text-slate-300">
                      {num.format(s.cost)} {unit}
                    </span>
                    {known &&
                      (covers >= 1 ? (
                        <span className="ml-2 inline-flex items-center gap-0.5 text-emerald-300">
                          <Check className="h-3 w-3" />
                          {covers > 1 ? `covers ${covers}` : "covered"}
                        </span>
                      ) : (
                        <span className="ml-2 text-slate-500">
                          need {num.format(short)} more
                        </span>
                      ))}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {carrierLink && (
              <a
                href={carrierLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-amber-300/90 hover:text-amber-200"
              >
                {routeReady && carrierHasDeepLink(programId!)
                  ? `Search ${trip!.origin}→${trip!.destination} award`
                  : "Search award seats"}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {routeReady && (
              <a
                href={googleFlightsUrl(trip!)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-sky-300/90 hover:text-sky-200"
              >
                Live fares {trip!.origin}→{trip!.destination}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {routeReady && (
            <LiveAvailability
              programId={programId!}
              origin={trip!.origin}
              destination={trip!.destination}
              date={trip!.date}
            />
          )}
        </div>
      )}
    </div>
  );
}

function LiveAvailability({
  programId,
  origin,
  destination,
  date,
}: {
  programId: string;
  origin: string;
  destination: string;
  date: string;
}) {
  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "unconfigured" }
    | { status: "error"; message: string }
    | { status: "ok"; results: AwardResult[] }
  >({ status: "idle" });

  async function check() {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/award-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId, origin, destination, date }),
      });
      const data = await res.json();
      if (data.configured === false) return setState({ status: "unconfigured" });
      if (!res.ok || data.error)
        return setState({ status: "error", message: data.error ?? "Search failed" });
      setState({ status: "ok", results: data.results ?? [] });
    } catch {
      setState({ status: "error", message: "Search failed" });
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={check}
        disabled={state.status === "loading"}
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-200 disabled:opacity-50"
      >
        <Radar className="h-3.5 w-3.5" />
        {state.status === "loading" ? "Checking…" : "Check live award availability"}
      </button>

      {state.status === "unconfigured" && (
        <p className="mt-1 text-xs text-slate-500">
          Live search isn&apos;t configured yet — set AWARD_API_KEY and
          AWARD_API_URL to enable real-time availability.
        </p>
      )}
      {state.status === "error" && (
        <p className="mt-1 text-xs text-rose-300/80">{state.message}</p>
      )}
      {state.status === "ok" &&
        (state.results.length === 0 ? (
          <p className="mt-1 text-xs text-slate-500">
            No award space found for this route/date.
          </p>
        ) : (
          <ul className="mt-1 space-y-1 text-xs">
            {state.results.map((r, i) => (
              <li key={i} className="flex justify-between gap-3 text-slate-300">
                <span>{r.cabin}</span>
                <span className="tabular-nums">
                  {num.format(r.miles)} miles
                  {r.taxesInr ? ` + ₹${num.format(r.taxesInr)}` : ""}
                </span>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}
