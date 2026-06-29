"use client";

import { createContext, useContext, useState } from "react";
import { ExternalLink, Plane } from "lucide-react";
import { googleFlightsUrl, hasRoute } from "../_lib/links";

export interface Trip {
  origin: string;
  destination: string;
  date: string;
}

interface TripContextValue extends Trip {
  setTrip: (patch: Partial<Trip>) => void;
}

const TripContext = createContext<TripContextValue | null>(null);

export function useTrip(): TripContextValue | null {
  return useContext(TripContext);
}

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trip, setTripState] = useState<Trip>({
    origin: "",
    destination: "",
    date: "",
  });
  const setTrip = (patch: Partial<Trip>) =>
    setTripState((prev) => ({ ...prev, ...patch }));

  return (
    <TripContext.Provider value={{ ...trip, setTrip }}>
      {children}
    </TripContext.Provider>
  );
}

/** Sanitise IATA input: letters only, upper-case, max 3 chars. */
function iata(value: string): string {
  return value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3);
}

export function TripBar() {
  const trip = useTrip();
  if (!trip) return null;

  return (
    <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-1.5 text-slate-400">
          <Plane className="h-4 w-4 text-amber-300" />
          Award flight search
          <span className="text-slate-600">(optional)</span>
        </span>
        <input
          value={trip.origin}
          onChange={(e) => trip.setTrip({ origin: iata(e.target.value) })}
          placeholder="From"
          aria-label="Origin airport code"
          className="w-20 rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 uppercase text-slate-100 outline-none placeholder:normal-case placeholder:text-slate-600 focus:border-amber-400"
        />
        <span className="text-slate-500">→</span>
        <input
          value={trip.destination}
          onChange={(e) => trip.setTrip({ destination: iata(e.target.value) })}
          placeholder="To"
          aria-label="Destination airport code"
          className="w-20 rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 uppercase text-slate-100 outline-none placeholder:normal-case placeholder:text-slate-600 focus:border-amber-400"
        />
        <input
          type="date"
          value={trip.date}
          onChange={(e) => trip.setTrip({ date: e.target.value })}
          aria-label="Travel date"
          className="rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-slate-100 outline-none focus:border-amber-400 [color-scheme:dark]"
        />
        {hasRoute(trip) ? (
          <a
            href={googleFlightsUrl(trip)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-amber-400 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-amber-300"
          >
            See {trip.origin}→{trip.destination} flights
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span className="text-xs text-slate-500">
            Use 3-letter airport codes (e.g. BOM, DEL, SIN).
          </span>
        )}
      </div>
      {hasRoute(trip) && (
        <p className="mt-2 text-xs text-slate-500">
          Showing live fares for {trip.origin}→{trip.destination}. Expand any
          result&apos;s “Check fares in points” to see what that route costs in
          miles and whether your balance covers it.
        </p>
      )}
    </div>
  );
}
