"use client";
import { useState, useMemo } from "react";
import Lightbox from "./Lightbox";

export type Quote = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  vehicle_year: number | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_size: string | null;
  service_interest: string | null;
  issues: string[];
  location: string | null;
  address: string | null;
  notes: string | null;
  photo_urls: string[] | null;
  status: string;
  created_at: string;
};

const SERVICE_LABELS: Record<string, string> = {
  express:  "Express Wash & Wax",
  interior: "Interior Refresh",
  full:     "Full Detail",
  custom:   "Custom / Not sure",
};

const ISSUE_LABELS: Record<string, string> = {
  pet_hair:   "Pet hair",
  stains:     "Heavy stains",
  odor:       "Bad odor",
  mold:       "Mold / mildew",
  paint:      "Paint correction",
  headlights: "Cloudy headlights",
  ceramic:    "Ceramic coating",
  engine:     "Engine bay",
};

const STATUS_STYLES: Record<string, string> = {
  new:       "bg-amber-50   text-amber-700   border border-amber-200",
  contacted: "bg-blue-50    text-blue-700    border border-blue-200",
  quoted:    "bg-purple-50  text-purple-700  border border-purple-200",
  converted: "bg-green/[0.08] text-green-dark border border-green/20",
  archived:  "bg-warm-100   text-warm-500    border border-warm-300",
};

const STATUSES = ["new", "contacted", "quoted", "converted", "archived"];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function vehicle(r: Quote) {
  const parts = [r.vehicle_year, r.vehicle_make, r.vehicle_model].filter(Boolean);
  if (parts.length) return parts.join(" ");
  if (r.vehicle_size) return r.vehicle_size.charAt(0).toUpperCase() + r.vehicle_size.slice(1) + " vehicle";
  return "—";
}

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? "bg-warm-100 text-warm-500 border border-warm-300";
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
      <div className="text-sm text-navy leading-snug">{value}</div>
    </div>
  );
}

export default function QuotesTable({ initialData }: { initialData: Quote[] }) {
  const [rows, setRows]             = useState(initialData);
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Lightbox state
  const [lightboxPhotos, setLightboxPhotos] = useState<string[] | null>(null);
  const [lightboxIdx, setLightboxIdx]       = useState(0);

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
      const res = await fetch("/api/admin/quotes", {
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
      {/* Lightbox */}
      {lightboxPhotos && (
        <Lightbox
          photos={lightboxPhotos}
          index={lightboxIdx}
          onClose={() => setLightboxPhotos(null)}
          onNav={(i) => setLightboxIdx(i)}
        />
      )}

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search name, phone, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-navy/[0.10] bg-white text-sm text-navy placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green transition shadow-sm"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl border border-navy/[0.10] bg-white text-sm text-navy focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green transition shadow-sm"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-3xl border border-navy/[0.07] py-16 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-warm-100 flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-warm-500">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
            </svg>
          </div>
          <p className="text-warm-500 text-sm font-medium">
            {rows.length === 0 ? "No quote requests yet." : "No results match your search."}
          </p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="bg-white rounded-3xl border border-navy/[0.07] overflow-hidden shadow-sm">

          {/* Desktop header — green top accent */}
          <div
            className="hidden md:grid px-5 py-3 bg-warm-100 text-[11px] font-bold uppercase tracking-wider text-warm-500 border-b border-navy/[0.07] border-t-[3px] border-t-green"
            style={{ gridTemplateColumns: "2fr 1.5fr 1.5fr 0.8fr 0.6fr auto 28px" }}
          >
            <span>Customer</span>
            <span>Service interest</span>
            <span>Vehicle</span>
            <span>Issues</span>
            <span>Photos</span>
            <span>Status</span>
            <span />
          </div>

          {filtered.map((row, idx) => {
            const isExpanded = expandedId === row.id;
            const isLast = idx === filtered.length - 1;
            const issueCount = row.issues?.length ?? 0;
            const photoCount = row.photo_urls?.length ?? 0;

            return (
              <div
                key={row.id}
                className={`${!isLast || isExpanded ? "border-b border-navy/[0.05]" : ""} ${idx % 2 === 1 ? "bg-[#FDFCF9]" : ""}`}
              >
                {/* Clickable row */}
                <div
                  className="px-5 py-4 cursor-pointer hover:bg-warm-100/60 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : row.id)}
                >
                  {/* Desktop */}
                  <div
                    className="hidden md:grid items-center gap-4"
                    style={{ gridTemplateColumns: "2fr 1.5fr 1.5fr 0.8fr 0.6fr auto 28px" }}
                  >
                    <div>
                      <div className="font-semibold text-navy text-[14px] leading-tight">{row.customer_name}</div>
                      <div className="text-[12px] text-warm-500 mt-0.5">{row.customer_phone}</div>
                    </div>
                    <div className="text-sm text-navy">
                      {row.service_interest ? (SERVICE_LABELS[row.service_interest] ?? row.service_interest) : "—"}
                    </div>
                    <div className="text-sm text-navy">{vehicle(row)}</div>
                    <div className="text-sm text-warm-500">
                      {issueCount > 0 ? `${issueCount} issue${issueCount !== 1 ? "s" : ""}` : "—"}
                    </div>
                    <div className="text-sm text-warm-500">
                      {photoCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-green-dark font-semibold">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21,15 16,10 5,21" />
                          </svg>
                          {photoCount}
                        </span>
                      ) : "—"}
                    </div>
                    <StatusBadge status={row.status} />
                    <svg
                      className={`text-warm-300 transition-transform duration-200 flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
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
                        <svg className={`text-warm-300 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-[13px] text-warm-700">
                      {row.service_interest ? (SERVICE_LABELS[row.service_interest] ?? row.service_interest) : "No service selected"}
                    </div>
                    <div className="text-[12px] text-warm-500 mt-0.5">
                      {vehicle(row)}
                      {issueCount > 0 ? ` · ${issueCount} issue${issueCount !== 1 ? "s" : ""}` : ""}
                      {photoCount > 0 ? ` · ${photoCount} photo${photoCount !== 1 ? "s" : ""}` : ""}
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-4 bg-cream border-t border-navy/[0.05] border-l-[3px] border-l-green/25">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-5">
                      <Field label="Email" value={row.customer_email} />
                      <Field label="Location"
                        value={row.location === "shop" ? "At our shop" : row.location === "mobile" ? "Mobile (come to them)" : row.location ?? "—"} />
                      {row.address && <Field label="Address" value={row.address} />}
                      <Field label="Submitted" value={fmtDate(row.created_at)} />
                      {issueCount > 0 && (
                        <Field
                          label="Specific issues"
                          value={row.issues.map((i) => ISSUE_LABELS[i] ?? i).join(", ")}
                          wide
                        />
                      )}
                      {row.notes && (
                        <Field label="Notes" value={row.notes} wide />
                      )}
                    </div>

                    {/* Photo thumbnails */}
                    {photoCount > 0 && (
                      <div className="mb-5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-warm-500 mb-2">
                          Photos ({photoCount})
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                          {row.photo_urls!.map((url, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightboxPhotos(row.photo_urls!);
                                setLightboxIdx(i);
                              }}
                              className="relative rounded-xl overflow-hidden bg-warm-100 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-green shadow-sm"
                              style={{ aspectRatio: "1" }}
                              aria-label={`View photo ${i + 1}`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-warm-500">Update status</span>
                      <select
                        value={row.status}
                        disabled={updatingId === row.id}
                        onChange={(e) => updateStatus(row.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-navy/[0.10] bg-white text-sm text-navy focus:outline-none focus:ring-2 focus:ring-green/40 disabled:opacity-50 cursor-pointer shadow-sm"
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
