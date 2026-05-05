import { redirect } from "next/navigation";
import { createAdminServerClient } from "@/lib/supabase-server";
import CustomersTable, { type Customer } from "./CustomersTable";

export const metadata = { title: "Customers — GoHorn Admin" };

export default async function CustomersPage() {
  const supabase = createAdminServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ data: bookingsData }, { data: quotesData }] = await Promise.all([
    supabase.from("bookings").select("customer_email,customer_name,customer_phone,created_at"),
    supabase.from("quotes").select("customer_email,customer_name,customer_phone,created_at"),
  ]);

  const bookings = bookingsData ?? [];
  const quotes   = quotesData ?? [];

  // Deduplicate by lowercase email — last write wins for name/phone
  const map = new Map<string, Customer>();

  for (const b of bookings) {
    const key = b.customer_email.toLowerCase().trim();
    const existing = map.get(key);
    if (existing) {
      existing.name          = b.customer_name;
      existing.phone         = b.customer_phone;
      existing.totalBookings += 1;
      existing.source        = existing.totalQuotes > 0 ? "both" : "booking";
      if (b.created_at < existing.firstSeen)   existing.firstSeen    = b.created_at;
      if (b.created_at > existing.lastActivity) existing.lastActivity = b.created_at;
    } else {
      map.set(key, {
        email:         b.customer_email,
        name:          b.customer_name,
        phone:         b.customer_phone,
        source:        "booking",
        totalBookings: 1,
        totalQuotes:   0,
        firstSeen:     b.created_at,
        lastActivity:  b.created_at,
      });
    }
  }

  for (const q of quotes) {
    const key = q.customer_email.toLowerCase().trim();
    const existing = map.get(key);
    if (existing) {
      existing.name        = q.customer_name;
      existing.phone       = q.customer_phone;
      existing.totalQuotes += 1;
      existing.source      = existing.totalBookings > 0 ? "both" : "quote";
      if (q.created_at < existing.firstSeen)   existing.firstSeen    = q.created_at;
      if (q.created_at > existing.lastActivity) existing.lastActivity = q.created_at;
    } else {
      map.set(key, {
        email:         q.customer_email,
        name:          q.customer_name,
        phone:         q.customer_phone,
        source:        "quote",
        totalBookings: 0,
        totalQuotes:   1,
        firstSeen:     q.created_at,
        lastActivity:  q.created_at,
      });
    }
  }

  const customers: Customer[] = Array.from(map.values()).sort(
    (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
  );

  const total        = customers.length;
  const fromBookings = customers.filter(c => c.source === "booking" || c.source === "both").length;
  const fromQuotes   = customers.filter(c => c.source === "quote"   || c.source === "both").length;
  const didBoth      = customers.filter(c => c.source === "both").length;

  return (
    <div className="relative min-h-screen">

      {/* Decorative blob */}
      <div
        className="absolute pointer-events-none overflow-hidden"
        style={{ top: -60, right: -60, width: 340, height: 340,
          background: "#C5D4B5", borderRadius: "40% 60% 65% 35% / 50% 45% 55% 50%", opacity: 0.18 }}
      />

      <div className="relative z-10 p-5 lg:p-8">

        {/* Page header */}
        <div className="mb-7">
          <span className="inline-block text-[11px] font-bold text-green uppercase mb-2" style={{ letterSpacing: "3px" }}>
            Dashboard
          </span>
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <h1 className="font-fraunces text-[32px] font-extrabold text-navy leading-tight">Customers</h1>
            {total > 0 && (
              <span className="text-sm text-warm-500 font-medium">{total} unique</span>
            )}
          </div>

          {total > 0 && (
            <div className="flex flex-wrap gap-2">
              <StatPill count={total}        label="total"    color="navy"    />
              {fromBookings > 0 && <StatPill count={fromBookings} label="booked"  color="blue"    />}
              {fromQuotes   > 0 && <StatPill count={fromQuotes}   label="quoted"  color="amber"   />}
              {didBoth      > 0 && <StatPill count={didBoth}      label="did both" color="green"  />}
            </div>
          )}
          {total === 0 && (
            <p className="text-warm-500 text-sm">No customers yet.</p>
          )}
        </div>

        <CustomersTable initialData={customers} />
      </div>
    </div>
  );
}

function StatPill({ count, label, color }: {
  count: number; label: string;
  color: "navy" | "blue" | "amber" | "green";
}) {
  const styles = {
    navy:  "bg-navy/[0.06]  text-navy        border-navy/20",
    blue:  "bg-blue-50      text-blue-700    border-blue-200",
    amber: "bg-amber-50     text-amber-700   border-amber-200",
    green: "bg-green/[0.08] text-green-dark  border-green/20",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold border ${styles[color]}`}>
      <span className="font-bold tabular-nums">{count}</span>
      {label}
    </span>
  );
}
