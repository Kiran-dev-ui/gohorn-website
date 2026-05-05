import { redirect } from "next/navigation";
import { createAdminServerClient } from "@/lib/supabase-server";
import BookingsTable, { type Booking } from "./BookingsTable";

export const metadata = { title: "Bookings — GoHorn Admin" };

function StatPill({ count, label, color }: {
  count: number; label: string;
  color: "amber" | "blue" | "green" | "red" | "gray";
}) {
  const styles = {
    amber: "bg-amber-50  text-amber-700  border-amber-200",
    blue:  "bg-blue-50   text-blue-700   border-blue-200",
    green: "bg-green/[0.08] text-green-dark border-green/20",
    red:   "bg-red-50    text-red-600    border-red-200",
    gray:  "bg-warm-100  text-warm-500   border-warm-300",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold border ${styles[color]}`}>
      <span className="font-bold tabular-nums">{count}</span>
      {label}
    </span>
  );
}

export default async function BookingsPage() {
  const supabase = createAdminServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  const bookings: Booking[] = data ?? [];

  const total     = bookings.length;
  const pending   = bookings.filter(b => b.status === "pending").length;
  const confirmed = bookings.filter(b => b.status === "confirmed").length;
  const completed = bookings.filter(b => b.status === "completed").length;
  const cancelled = bookings.filter(b => b.status === "cancelled").length;

  return (
    <div className="relative min-h-screen">

      {/* Decorative blob */}
      <div
        className="absolute pointer-events-none overflow-hidden"
        style={{ top: -60, right: -60, width: 340, height: 340,
          background: "#E8C77A", borderRadius: "40% 60% 65% 35% / 50% 45% 55% 50%", opacity: 0.13 }}
      />

      <div className="relative z-10 p-5 lg:p-8">

        {/* Page header */}
        <div className="mb-7">
          <span className="inline-block text-[11px] font-bold text-green uppercase mb-2" style={{ letterSpacing: "3px" }}>
            Dashboard
          </span>
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <h1 className="font-fraunces text-[32px] font-extrabold text-navy leading-tight">Bookings</h1>
            {total > 0 && (
              <span className="text-sm text-warm-500 font-medium">{total} total</span>
            )}
          </div>

          {/* Stat pills */}
          {total > 0 && (
            <div className="flex flex-wrap gap-2">
              {pending   > 0 && <StatPill count={pending}   label="pending"   color="amber" />}
              {confirmed > 0 && <StatPill count={confirmed} label="confirmed" color="blue"  />}
              {completed > 0 && <StatPill count={completed} label="completed" color="green" />}
              {cancelled > 0 && <StatPill count={cancelled} label="cancelled" color="red"   />}
            </div>
          )}
          {total === 0 && (
            <p className="text-warm-500 text-sm">No bookings yet.</p>
          )}
          {error && (
            <p className="mt-2 text-sm text-red-600">Failed to load: {error.message}</p>
          )}
        </div>

        <BookingsTable initialData={bookings} />
      </div>
    </div>
  );
}
