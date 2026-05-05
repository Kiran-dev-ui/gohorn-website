"use client";
import { useState, useMemo } from "react";

export type Customer = {
  email:         string;
  name:          string;
  phone:         string;
  source:        "booking" | "quote" | "both";
  totalBookings: number;
  totalQuotes:   number;
  firstSeen:     string;
  lastActivity:  string;
};

type SortKey = "name" | "lastActivity" | "firstSeen" | "totalBookings" | "totalQuotes";
type SortDir = "asc" | "desc";

const SOURCE_STYLES: Record<string, string> = {
  booking: "bg-blue-50    text-blue-700   border border-blue-200",
  quote:   "bg-amber-50   text-amber-700  border border-amber-200",
  both:    "bg-green/[0.08] text-green-dark border border-green/20",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function SourceBadge({ source }: { source: Customer["source"] }) {
  const label = source === "both" ? "Booked + Quoted" : source === "booking" ? "Booking" : "Quote";
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${SOURCE_STYLES[source]}`}>
      {label}
    </span>
  );
}

function SortIcon({ dir }: { dir: SortDir | null }) {
  if (!dir) return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-warm-300 ml-1 flex-shrink-0">
      <path d="M12 5v14M5 12l7-7 7 7" />
    </svg>
  );
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green ml-1 flex-shrink-0">
      <path d={dir === "asc" ? "M12 19V5M5 12l7-7 7 7" : "M12 5v14M5 12l7 7 7-7"} />
    </svg>
  );
}

function escapeCSV(val: string) {
  if (/[",\n\r]/.test(val)) return `"${val.replace(/"/g, '""')}"`;
  return val;
}

export default function CustomersTable({ initialData }: { initialData: Customer[] }) {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState<"all" | "booking" | "quote" | "both">("all");
  const [sortKey, setSortKey] = useState<SortKey>("lastActivity");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return initialData
      .filter((c) => {
        const matchSearch = !q ||
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q);
        const matchFilter = filter === "all" || c.source === filter;
        return matchSearch && matchFilter;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortKey === "name") {
          cmp = a.name.localeCompare(b.name);
        } else if (sortKey === "lastActivity") {
          cmp = new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime();
        } else if (sortKey === "firstSeen") {
          cmp = new Date(a.firstSeen).getTime() - new Date(b.firstSeen).getTime();
        } else if (sortKey === "totalBookings") {
          cmp = a.totalBookings - b.totalBookings;
        } else if (sortKey === "totalQuotes") {
          cmp = a.totalQuotes - b.totalQuotes;
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [initialData, search, filter, sortKey, sortDir]);

  function exportCSV() {
    const rows = [
      ["Name", "Email", "Phone", "Source", "Bookings", "Quotes", "First Seen", "Last Activity"],
      ...filtered.map(c => [
        c.name, c.email, c.phone, c.source,
        String(c.totalBookings), String(c.totalQuotes),
        fmtDate(c.firstSeen), fmtDate(c.lastActivity),
      ]),
    ];
    const csv = "﻿" + rows.map(r => r.map(escapeCSV).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `gohorn-customers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function colHeader(label: string, key: SortKey) {
    const active = sortKey === key;
    return (
      <button
        onClick={() => toggleSort(key)}
        className="flex items-center gap-0.5 hover:text-navy transition-colors"
      >
        {label}
        <SortIcon dir={active ? sortDir : null} />
      </button>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search name, email, or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-navy/[0.10] bg-white text-sm text-navy placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green transition shadow-sm"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-4 py-2.5 rounded-2xl border border-navy/[0.10] bg-white text-sm text-navy focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green transition shadow-sm"
        >
          <option value="all">All customers</option>
          <option value="booking">Bookings only</option>
          <option value="quote">Quotes only</option>
          <option value="both">Booked + Quoted</option>
        </select>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-navy/[0.10] bg-white text-sm text-navy hover:bg-warm-100 transition shadow-sm font-semibold"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-3xl border border-navy/[0.07] py-16 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-warm-100 flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-warm-500">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <p className="text-warm-500 text-sm font-medium">
            {initialData.length === 0 ? "No customers yet." : "No results match your search."}
          </p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="bg-white rounded-3xl border border-navy/[0.07] overflow-hidden shadow-sm">

          {/* Desktop header */}
          <div
            className="hidden md:grid px-5 py-3 bg-warm-100 text-[11px] font-bold uppercase tracking-wider text-warm-500 border-b border-navy/[0.07] border-t-[3px] border-t-green"
            style={{ gridTemplateColumns: "2fr 2fr 1.4fr 1fr 0.7fr 0.7fr 1.1fr" }}
          >
            <span>{colHeader("Customer", "name")}</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Source</span>
            <span>{colHeader("Bookings", "totalBookings")}</span>
            <span>{colHeader("Quotes", "totalQuotes")}</span>
            <span>{colHeader("Last activity", "lastActivity")}</span>
          </div>

          {filtered.map((row, idx) => {
            const isLast = idx === filtered.length - 1;
            return (
              <div
                key={row.email}
                className={`${!isLast ? "border-b border-navy/[0.05]" : ""} ${idx % 2 === 1 ? "bg-[#FDFCF9]" : ""}`}
              >
                {/* Desktop row */}
                <div
                  className="hidden md:grid items-center gap-4 px-5 py-4"
                  style={{ gridTemplateColumns: "2fr 2fr 1.4fr 1fr 0.7fr 0.7fr 1.1fr" }}
                >
                  <div>
                    <div className="font-semibold text-navy text-[14px] leading-tight">{row.name}</div>
                    <div className="text-[11px] text-warm-500 mt-0.5">since {fmtDate(row.firstSeen)}</div>
                  </div>
                  <div className="text-sm text-navy truncate">{row.email}</div>
                  <div className="text-sm text-warm-700">{row.phone}</div>
                  <div><SourceBadge source={row.source} /></div>
                  <div className="text-sm text-navy text-center">
                    {row.totalBookings > 0 ? (
                      <span className="font-semibold">{row.totalBookings}</span>
                    ) : (
                      <span className="text-warm-300">—</span>
                    )}
                  </div>
                  <div className="text-sm text-navy text-center">
                    {row.totalQuotes > 0 ? (
                      <span className="font-semibold">{row.totalQuotes}</span>
                    ) : (
                      <span className="text-warm-300">—</span>
                    )}
                  </div>
                  <div className="text-sm text-warm-500">{fmtDate(row.lastActivity)}</div>
                </div>

                {/* Mobile card */}
                <div className="md:hidden px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div>
                      <div className="font-semibold text-navy text-[15px] leading-tight">{row.name}</div>
                      <div className="text-[12px] text-warm-500">{row.phone}</div>
                    </div>
                    <SourceBadge source={row.source} />
                  </div>
                  <div className="text-[13px] text-warm-700 truncate">{row.email}</div>
                  <div className="text-[12px] text-warm-500 mt-0.5">
                    {[
                      row.totalBookings > 0 && `${row.totalBookings} booking${row.totalBookings !== 1 ? "s" : ""}`,
                      row.totalQuotes   > 0 && `${row.totalQuotes} quote${row.totalQuotes !== 1 ? "s" : ""}`,
                    ].filter(Boolean).join(" · ")}
                    {" · "}last active {fmtDate(row.lastActivity)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-[12px] text-warm-500 text-right mt-3 pr-1">
          Showing {filtered.length} of {initialData.length} customer{initialData.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
