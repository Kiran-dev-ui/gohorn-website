"use client";
import { useState, useMemo } from "react";

export type Booking = {
  id: string;
  service: string;
  addons: string[];
  date: string;
  time: string;
  vehicle_year: number | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_size: string | null;
  location: string;
  address: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_notes: string | null;
  first_time_discount: boolean;
  status: string;
  created_at: string;
};

const SERVICE_LABELS: Record<string, string> = {
  express:  "Express Wash & Wax",
  interior: "Interior Refresh",
  full:     "Full Detail",
};

const ADDON_LABELS: Record<string, string> = {
  ceramic:   "Ceramic Coating",
  pet_hair:  "Pet Hair Deep Clean",
  headlight: "Headlight Restoration",
  engine:    "Engine Bay Cleaning",
  stains:    "Heavy Stain Removal",
  odor:      "Deep Odor Treatment",
  clay:      "Clay Bar Treatment",
  leather:   "Leather Conditioning",
};

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function vehicle(r: Booking) {
  const parts = [r.vehicle_year, r.vehicle_make, r.vehicle_model].filter(Boolean);
  if (parts.length) return parts.join(" ");
  if (r.vehicle_size) return r.vehicle_size.charAt(0).toUpperCase() + r.vehicle_size.slice(1) + " vehicle";
  return "—";
}

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${cls}`}>
      {status}
    </span>
  );
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-warm-500 mb-0.5">{label}</div>
      <div className="text-sm text-navy">{value}</div>
    </div>
  );
}

export default function BookingsTable({ initialData }: { initialData: Booking[] }) {
  const [rows, setRows]           = useState(initialData);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => {
      const matchSearch = !q ||
        r.customer_name.toLowerCase().includes(q) ||
        r.customer_phone.includes(q) ||
        r.customer_email.toLowerCase().includes(q);
      const matchStatus = filter === "all" || r.status === filter;
      return matchSearch && matchStatus;
    });
  }, [rows, search, filter]);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setRows((prev) => prev.map((r) => r.id === id ? { ...r, status: updated.status } : r));
      }
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search name, phone, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-navy/[0.12] bg-white text-sm text-navy placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-navy/[0.12] bg-white text-sm text-navy focus:outline-none focus:ring-2 focus:ring-green"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-navy/[0.08] py-16 text-center">
          <p className="text-warm-500 text-sm">
            {rows.length === 0 ? "No bookings yet." : "No results match your search."}
          </p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-navy/[0.08] overflow-hidden">

          {/* Desktop header */}
          <div
            className="hidden md:grid px-5 py-3 border-b border-navy/[0.08] bg-warm-100 text-[11px] font-bold uppercase tracking-wider text-warm-500"
            style={{ gridTemplateColumns: "2fr 1.3fr 1.3fr 1.5fr auto 28px" }}
          >
            <span>Customer</span>
            <span>Service</span>
            <span>Appointment</span>
            <span>Vehicle</span>
            <span>Status</span>
            <span />
          </div>

          {filtered.map((row, idx) => {
            const isExpanded = expandedId === row.id;
            const isLast = idx === filtered.length - 1;

            return (
              <div key={row.id} className={!isLast || isExpanded ? "border-b border-navy/[0.06]" : ""}>

                {/* Row */}
                <div
                  className="px-5 py-4 cursor-pointer hover:bg-warm-100/40 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : row.id)}
                >
                  {/* Desktop */}
                  <div
                    className="hidden md:grid items-center gap-4"
                    style={{ gridTemplateColumns: "2fr 1.3fr 1.3fr 1.5fr auto 28px" }}
                  >
                    <div>
                      <div className="font-semibold text-navy text-[14px] leading-tight">{row.customer_name}</div>
                      <div className="text-[12px] text-warm-500 mt-0.5">{row.customer_phone}</div>
                    </div>
                    <div className="text-sm text-navy">{SERVICE_LABELS[row.service] ?? row.service}</div>
                    <div>
                      <div className="text-sm text-navy">{row.date}</div>
                      <div className="text-[12px] text-warm-500">{row.time}</div>
                    </div>
                    <div className="text-sm text-navy">{vehicle(row)}</div>
                    <StatusBadge status={row.status} />
                    <svg
                      className={`text-warm-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>

                  {/* Mobile card */}
                  <div className="md:hidden">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div>
                        <div className="font-semibold text-navy text-[15px] leading-tight">{row.customer_name}</div>
                        <div className="text-[12px] text-warm-500">{row.customer_phone}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={row.status} />
                        <svg className={`text-warm-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-[13px] text-warm-700">
                      {SERVICE_LABELS[row.service] ?? row.service} · {row.date} at {row.time}
                    </div>
                    <div className="text-[12px] text-warm-500 mt-0.5">{vehicle(row)}</div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 bg-warm-100/50 border-t border-navy/[0.06]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-5">
                      <Field label="Email" value={row.customer_email} />
                      <Field label="Location"
                        value={row.location === "shop" ? "At our shop (304 Lake George Ave)" : `Mobile — ${row.address ?? "no address provided"}`} />
                      <Field label="Add-ons"
                        value={row.addons?.length ? row.addons.map((a) => ADDON_LABELS[a] ?? a).join(", ") : "None"} />
                      <Field label="First-time discount" value={row.first_time_discount ? "Yes — 20% off applied" : "No"} />
                      <Field label="Booked on" value={fmtDate(row.created_at)} />
                      {row.customer_notes && (
                        <Field label="Notes" value={row.customer_notes} wide />
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-warm-500">Update status</span>
                      <select
                        value={row.status}
                        disabled={updatingId === row.id}
                        onChange={(e) => updateStatus(row.id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-navy/[0.12] bg-white text-sm text-navy focus:outline-none focus:ring-2 focus:ring-green disabled:opacity-50 cursor-pointer"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                      {updatingId === row.id && (
                        <span className="text-xs text-warm-500 italic">Saving…</span>
                      )}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
