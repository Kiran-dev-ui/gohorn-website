import { redirect } from "next/navigation";
import { createAdminServerClient } from "@/lib/supabase-server";
import QuotesTable, { type Quote } from "./QuotesTable";

export const metadata = { title: "Quotes — GoHorn Admin" };

function StatPill({ count, label, color }: {
  count: number; label: string;
  color: "amber" | "blue" | "purple" | "green" | "gray";
}) {
  const styles = {
    amber:  "bg-amber-50   text-amber-700   border-amber-200",
    blue:   "bg-blue-50    text-blue-700    border-blue-200",
    purple: "bg-purple-50  text-purple-700  border-purple-200",
    green:  "bg-green/[0.08] text-green-dark border-green/20",
    gray:   "bg-warm-100   text-warm-500    border-warm-300",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold border ${styles[color]}`}>
      <span className="font-bold tabular-nums">{count}</span>
      {label}
    </span>
  );
}

export default async function QuotesPage() {
  const supabase = createAdminServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  const quotes: Quote[] = data ?? [];

  const total     = quotes.length;
  const newQ      = quotes.filter(q => q.status === "new").length;
  const contacted = quotes.filter(q => q.status === "contacted").length;
  const quoted    = quotes.filter(q => q.status === "quoted").length;
  const converted = quotes.filter(q => q.status === "converted").length;
  const archived  = quotes.filter(q => q.status === "archived").length;

  return (
    <div className="relative min-h-screen">

      {/* Decorative blob */}
      <div
        className="absolute pointer-events-none overflow-hidden"
        style={{ top: -60, right: -60, width: 340, height: 340,
          background: "#B5A8D4", borderRadius: "40% 60% 65% 35% / 50% 45% 55% 50%", opacity: 0.14 }}
      />

      <div className="relative z-10 p-5 lg:p-8">

        {/* Page header */}
        <div className="mb-7">
          <span className="inline-block text-[11px] font-bold text-green uppercase mb-2" style={{ letterSpacing: "3px" }}>
            Dashboard
          </span>
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <h1 className="font-fraunces text-[32px] font-extrabold text-navy leading-tight">Quotes</h1>
            {total > 0 && (
              <span className="text-sm text-warm-500 font-medium">{total} total</span>
            )}
          </div>

          {/* Stat pills */}
          {total > 0 && (
            <div className="flex flex-wrap gap-2">
              {newQ      > 0 && <StatPill count={newQ}      label="new"       color="amber"  />}
              {contacted > 0 && <StatPill count={contacted} label="contacted" color="blue"   />}
              {quoted    > 0 && <StatPill count={quoted}    label="quoted"    color="purple" />}
              {converted > 0 && <StatPill count={converted} label="converted" color="green"  />}
              {archived  > 0 && <StatPill count={archived}  label="archived"  color="gray"   />}
            </div>
          )}
          {total === 0 && (
            <p className="text-warm-500 text-sm">No quote requests yet.</p>
          )}
          {error && (
            <p className="mt-2 text-sm text-red-600">Failed to load: {error.message}</p>
          )}
        </div>

        <QuotesTable initialData={quotes} />
      </div>
    </div>
  );
}
