"use client";

import { useState } from "react";
import { CreditCard, Plane } from "lucide-react";
import PointsCalculator from "./PointsCalculator";
import MilesCalculator from "./MilesCalculator";

type Tab = "cards" | "miles";

const TABS: { key: Tab; label: string; icon: typeof CreditCard }[] = [
  { key: "cards", label: "Credit card points", icon: CreditCard },
  { key: "miles", label: "Airline & hotel miles", icon: Plane },
];

export default function RedemptionTabs() {
  const [tab, setTab] = useState<Tab>("cards");

  return (
    <div>
      <div className="mb-8 inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={[
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === key
                ? "bg-amber-400 text-slate-900"
                : "text-slate-300 hover:bg-white/10",
            ].join(" ")}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "cards" ? <PointsCalculator /> : <MilesCalculator />}
    </div>
  );
}
