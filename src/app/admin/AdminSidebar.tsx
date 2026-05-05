"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import LogoMark from "@/components/LogoMark";
import { createAdminBrowserClient } from "@/lib/supabase-browser";

const NAV_ITEMS = [
  {
    href: "/admin/bookings",
    label: "Bookings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    href: "/admin/quotes",
    label: "Quotes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

function NavLinks({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createAdminBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.07]">
        <LogoMark />
        <div>
          <div className="font-fraunces font-extrabold text-cream text-[18px] leading-none">GoHorn</div>
          <div className="text-[9px] font-semibold text-cream/40 uppercase tracking-[2.5px] mt-[3px]">Detailing · Admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNav}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl mb-1 no-underline transition-all duration-200 overflow-hidden ${
                active
                  ? "bg-white/[0.08] text-cream"
                  : "text-cream/55 hover:bg-white/[0.05] hover:text-cream/90"
              }`}
            >
              {/* Active left-bar indicator */}
              <span
                className={`absolute left-0 inset-y-0 w-[3px] rounded-r-full transition-all duration-200 ${
                  active ? "bg-green opacity-100" : "opacity-0"
                }`}
              />
              <span className={`flex-shrink-0 transition-colors ${active ? "text-green" : ""}`}>
                {item.icon}
              </span>
              <span className="font-semibold text-[14px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-4 border-t border-white/[0.07]">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-cream/40 hover:bg-white/[0.05] hover:text-red-400 transition-all duration-200 text-[14px] font-semibold disabled:opacity-30"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {loggingOut ? "Signing out…" : "Logout"}
        </button>
      </div>

    </div>
  );
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-[240px] bg-navy z-50">
        <NavLinks />
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-navy border-b border-white/[0.07] h-[60px] flex items-center px-4">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-11 h-11 flex flex-col items-center justify-center gap-[5px] mr-3 -ml-1 flex-shrink-0"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className={`block w-5 h-[2px] bg-cream rounded-full transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block w-5 h-[2px] bg-cream rounded-full transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-5 h-[2px] bg-cream rounded-full transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
        <LogoMark />
        <span className="font-fraunces font-extrabold text-cream text-[18px] ml-2.5">GoHorn</span>
        <span className="text-green text-[9px] font-semibold ml-2 uppercase tracking-[2.5px] mt-0.5">Admin</span>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-[240px] bg-navy z-[60] flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavLinks onNav={() => setOpen(false)} />
      </div>

      {/* ── Mobile backdrop ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-[59] bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
