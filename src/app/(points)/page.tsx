import RedemptionTabs from "./_components/RedemptionTabs";

export default function PointsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Redeem your points at{" "}
          <span className="text-amber-400">maximum value</span>
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Points are worth wildly different amounts depending on how you redeem
          them — a statement credit might be ₹0.25 a point while the same point
          is worth ₹1 through a travel portal, or far more transferred to the
          right airline. Whether you hold{" "}
          <span className="text-slate-200">credit card reward points</span> or{" "}
          <span className="text-slate-200">airline &amp; hotel miles</span>,
          PointMax shows the redemption path that gets you the most rupees back.
        </p>
      </section>

      <RedemptionTabs />
    </main>
  );
}
