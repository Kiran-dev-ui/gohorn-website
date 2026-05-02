"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoMark from "./LogoMark";

const links = [
  { href: "/services", label: "Services" },
  { href: "/#why",     label: "Why Us" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/quote",    label: "Get Quote" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{
          background: "rgba(250, 247, 240, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(31, 36, 51, 0.06)",
        }}
      >
        {/* ── Main bar ── */}
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-12 py-[18px]">
          <Link
            href="/"
            className="flex items-center gap-3 no-underline"
            onClick={() => setOpen(false)}
          >
            <LogoMark />
            <span className="font-fraunces font-extrabold text-[22px] text-navy">GoHorn</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-9">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`no-underline font-medium text-[15px] transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-green-dark"
                    : "text-navy hover:text-green"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/book" className="btn btn-green">Book Now →</Link>
          </div>

          {/* Hamburger button — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 -mr-1 rounded-lg"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className={`block w-5 h-[2px] bg-navy rounded-full transition-all duration-300 origin-center ${
                open ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-[2px] bg-navy rounded-full transition-all duration-300 mt-[5px] ${
                open ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-[2px] bg-navy rounded-full transition-all duration-300 origin-center mt-[5px] ${
                open ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-navy/[0.06] px-4 pb-4 pt-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center min-h-[48px] px-2 font-medium text-[16px] no-underline border-b border-navy/[0.06] last:border-0 transition-colors ${
                  pathname === link.href ? "text-green-dark" : "text-navy"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3">
              <Link
                href="/book"
                className="btn btn-green w-full justify-center"
                onClick={() => setOpen(false)}
              >
                Book Now →
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop — closes drawer when tapping outside */}
      {open && (
        <div
          className="fixed inset-0 z-[99] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
