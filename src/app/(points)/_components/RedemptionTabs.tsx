"use client";

import { useState } from "react";
import { CreditCard, Layers, Plane, Target } from "lucide-react";
import PointsCalculator from "./PointsCalculator";
import MilesCalculator from "./MilesCalculator";
import CombinedCalculator from "./CombinedCalculator";
import BestHomeCalculator from "./BestHomeCalculator";

type Tab = "cards" | "miles" | "pool" | "best";

const TABS: { key: Tab; label: string; icon: typeof CreditCard }[] = [
  { key: "cards", label: "Credit card points", icon: CreditCard },
  { key: "miles", label: "Airline & hotel miles", icon: Plane },
  { key: "pool", label: "Pool & redeem", icon: Layers },
  { key: "best", label: "Best home", icon: Target },
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

      {tab === "cards" && <PointsCalculator />}
      {tab === "miles" && <MilesCalculator />}
      {tab === "pool" && <CombinedCalculator />}
      {tab === "best" && <BestHomeCalculator />}
    </div>
  );
}
