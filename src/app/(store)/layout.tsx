import Header from "@/components/common/Header";

// Storefront shell: brand gradient + global header. The standalone /points
// tool lives outside this route group and provides its own layout.
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-cyan-50 to-amber-50">
      <Header />
      <main>{children}</main>
    </div>
  );
}
